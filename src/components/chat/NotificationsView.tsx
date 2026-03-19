import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { NOTIFICATIONS, Notification } from './data';

const TYPE_ICON: Record<Notification['type'], { icon: string; color: string; bg: string }> = {
  message: { icon: 'MessageCircle', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-500/5' },
  mention: { icon: 'AtSign', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-500/5' },
  call: { icon: 'PhoneMissed', color: 'text-rose-400', bg: 'from-rose-500/20 to-rose-500/5' },
  system: { icon: 'Shield', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5' },
};

export default function NotificationsView() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold grad-text">Уведомления</h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Прочитать все
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-xs text-muted-foreground">{unreadCount} непрочитанных</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">
        {notifs.map((n, i) => {
          const meta = TYPE_ICON[n.type];
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl transition-all text-left slide-up
                ${!n.read ? 'glass border border-purple-500/20' : 'hover:bg-muted/30'}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${meta.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                {n.avatar}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center`}>
                  <Icon name={meta.icon} size={10} className={meta.color} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{n.title}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full btn-grad flex-shrink-0 mt-1.5" />
              )}
            </button>
          );
        })}

        {notifs.every(n => n.read) && (
          <div className="flex flex-col items-center justify-center pt-12 gap-3">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl">✅</div>
            <p className="text-muted-foreground text-sm">Всё прочитано!</p>
          </div>
        )}
      </div>
    </div>
  );
}