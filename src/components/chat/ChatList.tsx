import React from 'react';
import Icon from '@/components/ui/icon';
import { CHATS, Chat } from './data';

interface Props {
  onOpen: (chat: Chat) => void;
  activeId: number | null;
}

export default function ChatList({ onOpen, activeId }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold grad-text">Чаты</h1>
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:neon-purple transition-all">
            <Icon name="PenSquare" size={16} className="text-purple-400" />
          </button>
        </div>

        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск чатов..."
            className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
        {CHATS.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onOpen(chat)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group text-left
              ${activeId === chat.id ? 'nav-active neon-purple' : 'hover:bg-muted/40'}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="relative flex-shrink-0">
              {chat.pinned ? (
                <div className="avatar-ring">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl">
                    {chat.avatar}
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl border border-border">
                  {chat.avatar}
                </div>
              )}
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground truncate">{chat.name}</span>
                  {chat.group && <Icon name="Users" size={12} className="text-muted-foreground flex-shrink-0" />}
                  {chat.encrypted && <Icon name="Lock" size={11} className="text-cyan-400 flex-shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground truncate pr-2">{chat.lastMsg}</span>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 min-w-5 h-5 px-1.5 btn-grad rounded-full text-xs font-bold text-white flex items-center justify-center">
                    {chat.unread > 9 ? '9+' : chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
