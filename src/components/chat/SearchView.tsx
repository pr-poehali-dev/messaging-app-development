import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { CHATS } from './data';
import { getToken } from '@/lib/api';
import func2url from '../../../backend/func2url.json';

const STORIES_URL = (func2url as Record<string, string>)['stories'];

interface FoundUser {
  id: number;
  name: string;
  username: string | null;
  avatar: string;
  bio: string | null;
  is_premium: boolean;
  online: boolean;
}

const RECENT_CONTACTS = [
  ...CHATS.slice(0, 5),
];

const SEARCH_TIPS = [
  { icon: 'AtSign', text: '@username — поиск по юзернейму' },
  { icon: 'Phone', text: '+7... — поиск по номеру телефона' },
  { icon: 'User', text: 'Имя — поиск по имени' },
];

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'users' | 'chats'>('users');
  const [results, setResults] = useState<FoundUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query.trim());
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const doSearch = async (q: string) => {
    setLoading(true);
    try {
      const token = getToken();
      const url = `${STORIES_URL}?action=search&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: token ? { 'X-Auth-Token': token } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.users || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const localFiltered = CHATS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold grad-text mb-4">Поиск</h1>

        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="@username, +7..., или имя"
            autoFocus
            className="w-full bg-muted/50 border border-border rounded-2xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {(['users', 'chats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${tab === t ? 'btn-grad text-white' : 'glass text-muted-foreground hover:text-foreground'}`}>
              {t === 'users' ? 'Пользователи' : 'Чаты'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* No query — tips + recent */}
        {!query && (
          <>
            <div className="glass rounded-2xl p-4 mb-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Как искать</p>
              {SEARCH_TIPS.map(tip => (
                <div key={tip.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Icon name={tip.icon} size={13} className="text-purple-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">{tip.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground px-1 mb-3 font-semibold uppercase tracking-wider">Недавние</p>
            <div className="flex gap-3 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
              {RECENT_CONTACTS.map(c => (
                <div key={c.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl border border-border">
                    {c.avatar}
                  </div>
                  <span className="text-xs text-muted-foreground w-14 text-center truncate">{c.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span className="text-sm">Ищем...</span>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && !loading && query.length >= 2 && (
          <>
            {results.length === 0 && searched && (
              <div className="flex flex-col items-center justify-center pt-12 gap-3">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl">🔍</div>
                <p className="text-muted-foreground text-sm">Пользователи не найдены</p>
                <p className="text-muted-foreground text-xs">Попробуйте @username или +7...</p>
              </div>
            )}
            {results.map((u, i) => (
              <button key={u.id}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted/40 transition-all text-left slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl border border-border">
                    {u.avatar}
                  </div>
                  {u.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate">{u.name}</span>
                    {u.is_premium && <span className="text-amber-400 text-xs">⭐</span>}
                  </div>
                  {u.username && <p className="text-xs text-purple-400">@{u.username}</p>}
                  {u.bio && <p className="text-xs text-muted-foreground truncate">{u.bio}</p>}
                </div>
                <button className="w-8 h-8 rounded-xl glass flex items-center justify-center">
                  <Icon name="MessageCircle" size={14} className="text-purple-400" />
                </button>
              </button>
            ))}
          </>
        )}

        {/* Chats tab */}
        {tab === 'chats' && !loading && (
          <>
            {query.length >= 1 && localFiltered.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-12 gap-3">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl">💬</div>
                <p className="text-muted-foreground text-sm">Чаты не найдены</p>
              </div>
            )}
            {(query.length >= 1 ? localFiltered : CHATS).map((c, i) => (
              <button key={c.id}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted/40 transition-all text-left"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl border border-border flex-shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
