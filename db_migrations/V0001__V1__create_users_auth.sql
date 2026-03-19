CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100),
  avatar TEXT DEFAULT '🧑‍🚀',
  bio TEXT,
  status VARCHAR(50) DEFAULT 'Доступен',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.auth_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p32524338_messaging_app_develo.users(id),
  token VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_phone ON t_p32524338_messaging_app_develo.auth_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p32524338_messaging_app_develo.sessions(token);
