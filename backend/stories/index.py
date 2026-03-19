"""
Универсальный эндпоинт: поиск пользователей + управление статусами (stories).

GET  /?action=search&q=...          — поиск пользователей
GET  /?action=stories               — получить активные статусы
POST /?action=create_story          — создать статус
POST /?action=view_story            — отметить просмотр
"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_user_id(cur, schema, token):
    if not token:
        return None
    cur.execute(f'SELECT user_id FROM {schema}.sessions WHERE token = %s', (token,))
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    user_id = get_user_id(cur, schema, token)

    # SEARCH
    if action == 'search':
        query = (params.get('q') or '').strip()
        if not query or len(query) < 2:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Запрос слишком короткий'})}

        if query.startswith('@'):
            uname = query[1:].lower()
            cur.execute(
                f'SELECT id, name, username, avatar, bio, is_premium, show_online FROM {schema}.users WHERE LOWER(username) LIKE %s LIMIT 20',
                (f'%{uname}%',)
            )
        elif query.startswith('+') or query.replace(' ', '').isdigit():
            phone_q = '+' + ''.join(c for c in query if c.isdigit())
            cur.execute(
                f'SELECT id, name, username, avatar, bio, is_premium, show_online FROM {schema}.users WHERE phone LIKE %s LIMIT 20',
                (f'%{phone_q}%',)
            )
        else:
            like = f'%{query.lower()}%'
            cur.execute(
                f'SELECT id, name, username, avatar, bio, is_premium, show_online FROM {schema}.users WHERE LOWER(name) LIKE %s OR LOWER(username) LIKE %s ORDER BY is_premium DESC, name LIMIT 20',
                (like, like)
            )

        rows = cur.fetchall()
        cur.close(); conn.close()
        users = [
            {'id': r[0], 'name': r[1], 'username': r[2], 'avatar': r[3] or '🧑‍🚀',
             'bio': r[4], 'is_premium': r[5], 'online': r[6]}
            for r in rows if r[0] != user_id
        ]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users})}

    # GET STORIES
    if action == 'stories' or (method == 'GET' and not action):
        cur.execute(
            f'''SELECT s.id, s.user_id, u.name, u.username, u.avatar, u.is_premium,
                       s.media_type, s.content, s.caption, s.bg_color, s.views, s.expires_at, s.created_at
                FROM {schema}.user_stories s
                JOIN {schema}.users u ON u.id = s.user_id
                WHERE s.expires_at > NOW()
                ORDER BY s.created_at DESC LIMIT 200'''
        )
        rows = cur.fetchall()
        cur.close(); conn.close()

        seen = {}
        for row in rows:
            sid, uid, name, username, avatar, premium, mtype, content, caption, bg, views, exp, created = row
            if uid not in seen:
                seen[uid] = {
                    'user_id': uid, 'name': name, 'username': username,
                    'avatar': avatar or '🧑‍🚀', 'is_premium': premium,
                    'is_own': uid == user_id, 'stories': []
                }
            seen[uid]['stories'].append({
                'id': sid, 'media_type': mtype, 'content': content,
                'caption': caption, 'bg_color': bg, 'views': views,
                'expires_at': exp.isoformat() if exp else None,
                'created_at': created.isoformat() if created else None,
            })
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'groups': list(seen.values())})}

    # CREATE STORY
    if action == 'create_story':
        if not user_id:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        try:
            body = json.loads(event.get('body') or '{}')
        except Exception:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный формат'})}

        content = (body.get('content') or '').strip()
        if not content:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нет содержимого'})}

        cur.execute(
            f'INSERT INTO {schema}.user_stories (user_id, media_type, content, caption, bg_color) VALUES (%s, %s, %s, %s, %s) RETURNING id, expires_at',
            (user_id, body.get('media_type', 'text'), content,
             body.get('caption') or None, body.get('bg_color', 'gradient-1'))
        )
        sid, exp = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS,
                'body': json.dumps({'success': True, 'id': sid, 'expires_at': exp.isoformat()})}

    # VIEW STORY
    if action == 'view_story':
        try:
            body = json.loads(event.get('body') or '{}')
            story_id = int(body.get('story_id', 0))
        except Exception:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный story_id'})}

        cur.execute(f'UPDATE {schema}.user_stories SET views = views + 1 WHERE id = %s', (story_id,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

    cur.close(); conn.close()
    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неизвестный action'})}
