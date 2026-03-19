CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.user_stories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p32524338_messaging_app_develo.users(id),
  media_type VARCHAR(10) DEFAULT 'text',
  content TEXT,
  caption TEXT,
  bg_color VARCHAR(30) DEFAULT 'gradient-1',
  views INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.channels (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES t_p32524338_messaging_app_develo.users(id),
  name VARCHAR(100) NOT NULL,
  username VARCHAR(32) UNIQUE,
  description TEXT,
  avatar TEXT DEFAULT '📢',
  is_public BOOLEAN DEFAULT TRUE,
  subscribers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p32524338_messaging_app_develo.contacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p32524338_messaging_app_develo.users(id),
  contact_id INTEGER REFERENCES t_p32524338_messaging_app_develo.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_users_username ON t_p32524338_messaging_app_develo.users(username);
CREATE INDEX IF NOT EXISTS idx_stories_user ON t_p32524338_messaging_app_develo.user_stories(user_id);
