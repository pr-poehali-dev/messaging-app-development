"""
Завершение регистрации: сохраняет имя и email нового пользователя, создаёт сессию.
"""
import json
import os
import secrets
import re
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный формат запроса'})}

    phone = (body.get('phone') or '').strip()
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip()

    if not phone:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нет номера телефона'})}
    if not name or len(name) < 2:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Введите имя (минимум 2 символа)'})}
    if email and not re.match(r'^[\w.+-]+@[\w-]+\.[a-z]{2,}$', email, re.I):
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный формат email'})}

    phone = '+' + ''.join(c for c in phone if c.isdigit())

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Проверяем — вдруг уже есть
    cur.execute(f'SELECT id FROM {schema}.users WHERE phone = %s', (phone,))
    existing = cur.fetchone()
    if existing:
        cur.close(); conn.close()
        return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь уже зарегистрирован'})}

    # Проверяем уникальность email
    if email:
        cur.execute(f'SELECT id FROM {schema}.users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Email уже используется'})}

    # Создаём пользователя
    cur.execute(
        f'''INSERT INTO {schema}.users (phone, email, name)
            VALUES (%s, %s, %s) RETURNING id, name, email, avatar, status''',
        (phone, email or None, name)
    )
    user_id, u_name, u_email, avatar, status = cur.fetchone()

    # Создаём сессию
    token = secrets.token_hex(32)
    cur.execute(
        f'INSERT INTO {schema}.sessions (user_id, token) VALUES (%s, %s)',
        (user_id, token)
    )
    conn.commit(); cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'success': True,
            'token': token,
            'user': {'id': user_id, 'name': u_name, 'email': u_email, 'avatar': avatar, 'status': status, 'phone': phone}
        })
    }
