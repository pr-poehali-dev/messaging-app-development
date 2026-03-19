import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import SearchView from '@/components/chat/SearchView';
import NotificationsView from '@/components/chat/NotificationsView';
import GalleryView from '@/components/chat/GalleryView';
import ProfileView from '@/components/chat/ProfileView';
import SettingsView from '@/components/chat/SettingsView';
import { Chat, NOTIFICATIONS } from '@/components/chat/data';
import { User } from '@/lib/api';

type Tab = 'chats' | 'search' | 'gallery' | 'notifications' | 'profile' | 'settings';

const NAV_ITEMS: { key: Tab; icon: string; label: string }[] = [
  { key: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { key: 'search', icon: 'Search', label: 'Поиск' },
  { key: 'gallery', icon: 'Image', label: 'Галерея' },
  { key: 'notifications', icon: 'Bell', label: 'Уведомления' },
  { key: 'profile', icon: 'User', label: 'Профиль' },
  { key: 'settings', icon: 'Settings', label: 'Настройки' },
];

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Index({ user, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;

  const switchTab = (t: Tab) => {
    setTab(t);
    if (t !== 'chats') setActiveChat(null);
  };

  const renderMain = () => {
    switch (tab) {
      case 'chats': return <ChatList onOpen={setActiveChat} activeId={activeChat?.id ?? null} />;
      case 'search': return <SearchView />;
      case 'gallery': return <GalleryView />;
      case 'notifications': return <NotificationsView />;
      case 'profile': return <ProfileView user={user} />;
      case 'settings': return <SettingsView onLogout={onLogout} />;
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden relative">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-purple-600 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="orb w-80 h-80 bg-cyan-500 bottom-[-10%] right-[25%]" style={{ animationDelay: '3s' }} />
      <div className="orb w-64 h-64 bg-pink-600 top-[40%] right-[-5%]" style={{ animationDelay: '6s' }} />

      {/* Sidebar left nav (desktop) */}
      <div className="hidden md:flex flex-col w-16 glass-strong border-r border-border/50 py-6 items-center gap-2 relative z-10 flex-shrink-0">
        <div className="mb-4">
          <div className="w-8 h-8 rounded-xl btn-grad flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => switchTab(item.key)}
            title={item.label}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group
              ${tab === item.key ? 'nav-active neon-purple' : 'hover:bg-muted/40'}`}
          >
            <Icon
              name={item.icon}
              size={18}
              className={tab === item.key ? 'text-purple-400' : 'text-muted-foreground group-hover:text-foreground'}
            />
            {item.key === 'notifications' && unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 btn-grad rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Left panel */}
      <div className={`
        flex-shrink-0 relative z-10 border-r border-border/50 glass-strong
        w-full md:w-80 lg:w-[340px]
        ${activeChat ? 'hidden md:flex md:flex-col' : 'flex flex-col'}
        h-full overflow-hidden
      `}>
        <div className="flex-1 overflow-hidden h-full">
          {renderMain()}
        </div>
      </div>

      {/* Right: Chat or placeholder */}
      <div className={`
        flex-1 relative z-10 flex flex-col h-full overflow-hidden
        ${activeChat ? 'flex' : 'hidden md:flex'}
      `}>
        {activeChat ? (
          <div className="h-full animate-fade-in">
            <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-24 h-24 rounded-3xl btn-grad flex items-center justify-center text-4xl neon-purple">
              💬
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold grad-text mb-2">Выберите чат</h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Начните общение или выберите диалог из списка слева
              </p>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Icon name="Lock" size={12} className="text-cyan-400 lock-glow" />
              <span className="text-xs text-cyan-400">End-to-end шифрование активно</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50 z-20 px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => switchTab(item.key)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all
                ${tab === item.key ? 'nav-active' : ''}`}
            >
              <Icon
                name={item.icon}
                size={20}
                className={tab === item.key ? 'text-purple-400' : 'text-muted-foreground'}
              />
              <span className={`text-[9px] ${tab === item.key ? 'text-purple-400' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {item.key === 'notifications' && unreadNotifs > 0 && (
                <span className="absolute top-0 right-1 w-4 h-4 btn-grad rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}