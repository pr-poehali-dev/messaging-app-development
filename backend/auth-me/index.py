"""
Получение данных текущего пользователя по токену сессии.
"""
import json
import os
import psycopg2
from datetime import datetime, timezone

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

    if not token:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f'''SELECT u.id, u.name, u.email, u.avatar, u.status, u.phone, u.bio, s.expires_at
            FROM {schema}.sessions s
            JOIN {schema}.users u ON u.id = s.user_id
            WHERE s.token = %s''',
        (token,)
    )
    row = cur.fetchone()
    cur.close(); conn.close()

    if not row:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия не найдена'})}

    user_id, name, email, avatar, status, phone, bio, expires_at = row
    now = datetime.now(timezone.utc)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if now > expires_at:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'user': {
                'id': user_id,
                'name': name,
                'email': email,
                'avatar': avatar,
                'status': status,
                'phone': phone,
                'bio': bio,
            }
        })
    }
