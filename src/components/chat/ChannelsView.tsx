import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Channel {
  id: number;
  name: string;
  username: string;
  avatar: string;
  description: string;
  subscribers: number;
  verified: boolean;
  premium?: boolean;
  lastPost: string;
  unread: number;
}

const CHANNELS: Channel[] = [
  { id: 1, name: 'Технологии 2026', username: '@tech2026', avatar: '💻', description: 'Новости IT и цифровых технологий', subscribers: 128400, verified: true, lastPost: 'Apple выпустила новый чип M5', unread: 3 },
  { id: 2, name: 'Pulse Official', username: '@pulseapp', avatar: '💬', description: 'Официальный канал мессенджера Pulse', subscribers: 54200, verified: true, premium: true, lastPost: 'Обновление 1.1 уже доступно!', unread: 1 },
  { id: 3, name: 'Дизайн & UI', username: '@designhub', avatar: '🎨', description: 'Тренды дизайна и вдохновение', subscribers: 89700, verified: false, lastPost: '10 правил типографики', unread: 7 },
  { id: 4, name: 'Крипто Сигналы', username: '@cryptosig', avatar: '₿', description: 'Торговые сигналы и аналитика', subscribers: 210000, verified: true, premium: true, lastPost: 'BTC пробил $100K', unread: 12 },
  { id: 5, name: 'Кино & Сериалы', username: '@kinotime', avatar: '🎬', description: 'Рецензии и новинки кино', subscribers: 67300, verified: false, lastPost: 'Топ-10 фильмов марта', unread: 0 },
  { id: 6, name: 'Здоровье & Спорт', username: '@health_ru', avatar: '🏃', description: 'Советы по здоровью и фитнесу', subscribers: 43100, verified: false, lastPost: 'Утренняя зарядка за 7 минут', unread: 2 },
  { id: 7, name: 'Музыка Now', username: '@musicnow', avatar: '🎵', description: 'Новые треки и плейлисты', subscribers: 156000, verified: true, lastPost: 'Плейлист недели 🔥', unread: 0 },
];

const formatSubs = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'М';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'К';
  return String(n);
};

export default function ChannelsView() {
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState<Set<number>>(new Set([1, 2]));
  const [tab, setTab] = useState<'my' | 'explore'>('my');

  const filtered = CHANNELS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  ).filter(c => tab === 'my' ? subscribed.has(c.id) : true);

  const active = CHANNELS.find(c => c.id === activeId);

  // Светлая тема для каналов
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Каналы</h1>
          <button className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
            <Icon name="Plus" size={16} className="text-purple-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
          {([['my', 'Мои'], ['explore', 'Обзор']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all
                ${tab === key ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск каналов..."
            className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-gray-50 border border-transparent focus:border-purple-200 transition-colors"
          />
        </div>
      </div>

      {/* Channel list */}
      {!activeId ? (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">📢</div>
              <p className="text-gray-400 text-sm">Каналы не найдены</p>
            </div>
          )}
          {filtered.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveId(ch.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-2xl">
                  {ch.avatar}
                </div>
                {ch.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-gray-900 truncate">{ch.name}</span>
                    {ch.premium && <span className="text-amber-500 text-xs">⭐</span>}
                  </div>
                  <span className="text-xs text-gray-400">{formatSubs(ch.subscribers)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{ch.lastPost}</p>
              </div>
              {ch.unread > 0 && (
                <span className="flex-shrink-0 min-w-5 h-5 px-1.5 bg-purple-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                  {ch.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        /* Channel detail */
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <button onClick={() => setActiveId(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon name="ChevronLeft" size={16} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">{active?.name}</span>
                {active?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-500" />}
              </div>
              <p className="text-xs text-gray-400">{formatSubs(active?.subscribers || 0)} подписчиков</p>
            </div>
            <button
              onClick={() => setSubscribed(prev => {
                const s = new Set(prev);
                if (s.has(activeId)) s.delete(activeId); else s.add(activeId);
                return s;
              })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${subscribed.has(activeId)
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-purple-500 text-white'}`}
            >
              {subscribed.has(activeId) ? 'Отписаться' : 'Подписаться'}
            </button>
          </div>

          {/* Channel description */}
          <div className="px-4 py-3 bg-purple-50 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-3xl">
                {active?.avatar}
              </div>
              <div>
                <p className="text-xs text-gray-500 mt-0.5">{active?.description}</p>
                <p className="text-xs text-purple-500 mt-1">{active?.username}</p>
              </div>
            </div>
          </div>

          {/* Demo posts */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {[
              { text: active?.lastPost || '', time: '21:00', views: 1240 },
              { text: 'Подробный разбор в следующем посте 👇', time: '20:45', views: 890 },
              { text: 'Ставьте ❤️ если было полезно!', time: '19:30', views: 2100 },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">{post.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition-colors">
                      <Icon name="Heart" size={12} />
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                      <Icon name="Share2" size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Icon name="Eye" size={10} />
                    {post.views.toLocaleString()}
                    <span className="ml-2">{post.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
