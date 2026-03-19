import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { CHATS } from './data';

const ALL_CONTACTS = [
  ...CHATS,
  { id: 9, name: 'Игорь Петров', avatar: '🧑‍🚀', lastMsg: '', time: '', unread: 0, online: false },
  { id: 10, name: 'Соня Белова', avatar: '👩‍🎨', lastMsg: '', time: '', unread: 0, online: true },
];

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'chats' | 'contacts'>('all');

  const filtered = ALL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold grad-text mb-4">Поиск</h1>

        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Контакты, чаты, сообщения..."
            autoFocus
            className="w-full bg-muted/50 border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {(['all', 'chats', 'contacts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${tab === t ? 'btn-grad text-white' : 'glass text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'all' ? 'Все' : t === 'chats' ? 'Чаты' : 'Контакты'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {!query && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground px-3 mb-2 font-medium uppercase tracking-wider">Недавние</p>
            <div className="flex gap-3 px-3 overflow-x-auto pb-2">
              {ALL_CONTACTS.slice(0, 5).map(c => (
                <div key={c.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl border border-border hover:border-purple-500/50 transition-colors cursor-pointer">
                    {c.avatar}
                  </div>
                  <span className="text-xs text-muted-foreground w-14 text-center truncate">{c.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {query && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl">🔍</div>
            <p className="text-muted-foreground text-sm">Ничего не найдено</p>
          </div>
        )}

        {(query ? filtered : ALL_CONTACTS).map((c, i) => (
          <button
            key={c.id}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted/40 transition-all text-left slide-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl border border-border">
                {c.avatar}
              </div>
              {c.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.online ? 'онлайн' : 'не в сети'}</p>
            </div>
            <button className="w-8 h-8 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Icon name="MessageCircle" size={14} className="text-purple-400" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
