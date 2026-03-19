"""
Проверка кода подтверждения. Если пользователь новый — возвращает needs_register=True.
Если уже зарегистрирован — создаёт сессию и возвращает токен.
"""
import json
import os
import secrets
import psycopg2
from datetime import datetime, timezone

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
    code = (body.get('code') or '').strip()

    if not phone or not code:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите номер и код'})}

    phone = '+' + ''.join(c for c in phone if c.isdigit())

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Проверяем код
    cur.execute(
        f'''SELECT id, expires_at, used FROM {schema}.auth_codes
            WHERE phone = %s AND code = %s
            ORDER BY created_at DESC LIMIT 1''',
        (phone, code)
    )
    row = cur.fetchone()

    if not row:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный код'})}

    code_id, expires_at, used = row
    if used:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Код уже использован'})}

    # expires_at может быть naive или aware
    now = datetime.now(timezone.utc)
    if expires_at.tzinfo is None:
        from datetime import timezone as tz
        expires_at = expires_at.replace(tzinfo=tz.utc)

    if now > expires_at:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Код истёк, запросите новый'})}

    # Помечаем код как использованный
    cur.execute(f'UPDATE {schema}.auth_codes SET used = TRUE WHERE id = %s', (code_id,))

    # Ищем пользователя
    cur.execute(f'SELECT id, name, email, avatar, status FROM {schema}.users WHERE phone = %s', (phone,))
    user = cur.fetchone()

    if not user:
        conn.commit(); cur.close(); conn.close()
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'success': True, 'needs_register': True, 'phone': phone})
        }

    user_id, name, email, avatar, status = user

    # Создаём сессию
    token = secrets.token_hex(32)
    cur.execute(
        f'INSERT INTO {schema}.sessions (user_id, token) VALUES (%s, %s)',
        (user_id, token)
    )
    cur.execute(f'UPDATE {schema}.users SET last_seen = NOW() WHERE id = %s', (user_id,))
    conn.commit(); cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'success': True,
            'needs_register': False,
            'token': token,
            'user': {'id': user_id, 'name': name, 'email': email, 'avatar': avatar, 'status': status, 'phone': phone}
        })
    }
