"""
Отправка кода подтверждения на номер телефона.
Генерирует 6-значный код и сохраняет его в БД (в демо-режиме возвращает код напрямую).
"""
import json
import os
import random
import string
import psycopg2
from datetime import datetime, timedelta, timezone

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
    if not phone or len(phone) < 10:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите корректный номер телефона'})}

    # Нормализуем: оставляем только цифры и +
    phone = '+' + ''.join(c for c in phone if c.isdigit())

    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Деактивируем старые коды для этого номера
    cur.execute(
        f'UPDATE {schema}.auth_codes SET used = TRUE WHERE phone = %s AND used = FALSE',
        (phone,)
    )

    # Создаём новый код
    cur.execute(
        f'INSERT INTO {schema}.auth_codes (phone, code, expires_at) VALUES (%s, %s, %s)',
        (phone, code, expires_at)
    )
    conn.commit()
    cur.close()
    conn.close()

    # В продакшне здесь будет интеграция с SMS-провайдером
    # Сейчас возвращаем код напрямую для демонстрации
    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'success': True,
            'message': f'Код отправлен на {phone}',
            'demo_code': code,  # убрать в продакшне
            'expires_in': 600
        })
    }
