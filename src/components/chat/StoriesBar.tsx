import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/api';

interface Story {
  id: number;
  media_type: string;
  content: string;
  caption: string | null;
  bg_color: string;
  views: number;
  expires_at: string;
  created_at: string;
}

interface StoryGroup {
  user_id: number;
  name: string;
  username: string | null;
  avatar: string;
  is_premium: boolean;
  is_own: boolean;
  stories: Story[];
}

const BG_GRADIENTS: Record<string, string> = {
  'gradient-1': 'from-purple-600 via-pink-600 to-orange-500',
  'gradient-2': 'from-cyan-500 via-blue-600 to-purple-700',
  'gradient-3': 'from-emerald-500 via-teal-600 to-cyan-700',
  'gradient-4': 'from-rose-500 via-pink-600 to-purple-600',
  'gradient-5': 'from-amber-500 via-orange-600 to-red-600',
  'gradient-6': 'from-indigo-500 via-purple-600 to-pink-600',
};

const DEMO_GROUPS: StoryGroup[] = [
  { user_id: 99, name: 'Алиса', username: 'alice', avatar: '👩‍🦰', is_premium: true, is_own: false,
    stories: [{ id: 1, media_type: 'text', content: '🌙 Вечер пятницы!', caption: 'Отдыхаю', bg_color: 'gradient-1', views: 42, expires_at: '', created_at: '' }] },
  { user_id: 98, name: 'Макс', username: 'max_dev', avatar: '🧑‍💻', is_premium: false, is_own: false,
    stories: [{ id: 2, media_type: 'text', content: '💻 Деплоим в прод', caption: null, bg_color: 'gradient-2', views: 17, expires_at: '', created_at: '' }] },
  { user_id: 97, name: 'Катя', username: null, avatar: '👩‍🎤', is_premium: true, is_own: false,
    stories: [{ id: 3, media_type: 'text', content: '🎵 Новый трек вышел!', caption: 'Слушайте', bg_color: 'gradient-3', views: 89, expires_at: '', created_at: '' }] },
  { user_id: 96, name: 'Денис', username: 'denis', avatar: '🧑‍🎸', is_premium: false, is_own: false,
    stories: [{ id: 4, media_type: 'text', content: '🔥 Зажигаем!', caption: null, bg_color: 'gradient-5', views: 23, expires_at: '', created_at: '' }] },
];

interface Props {
  user: User;
  onCreateStory: () => void;
}

export default function StoriesBar({ user, onCreateStory }: Props) {
  const [groups, setGroups] = useState<StoryGroup[]>(DEMO_GROUPS);
  const [viewing, setViewing] = useState<{ group: StoryGroup; idx: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const openStory = (group: StoryGroup) => {
    setViewing({ group, idx: 0 });
    setProgress(0);
  };

  useEffect(() => {
    if (!viewing) { if (timerRef.current) clearInterval(timerRef.current); return; }
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          // Следующая история или закрыть
          const { group, idx } = viewing;
          if (idx < group.stories.length - 1) {
            setViewing({ group, idx: idx + 1 });
          } else {
            // Следующий пользователь
            const gIdx = groups.findIndex(g => g.user_id === group.user_id);
            if (gIdx < groups.length - 1) {
              setViewing({ group: groups[gIdx + 1], idx: 0 });
            } else {
              setViewing(null);
            }
          }
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [viewing?.group.user_id, viewing?.idx]);

  const currentStory = viewing ? viewing.group.stories[viewing.idx] : null;
  const grad = currentStory ? (BG_GRADIENTS[currentStory.bg_color] || BG_GRADIENTS['gradient-1']) : '';

  return (
    <>
      {/* Stories strip */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {/* My story / Add */}
          <button onClick={onCreateStory} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl border-2 border-background">
                {user.avatar || '🧑‍🚀'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 btn-grad rounded-full flex items-center justify-center border-2 border-background">
                <Icon name="Plus" size={10} className="text-white" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground w-14 text-center truncate">Мой статус</span>
          </button>

          {/* Other users */}
          {groups.map(g => (
            <button key={g.user_id} onClick={() => openStory(g)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`p-0.5 rounded-2xl bg-gradient-to-br ${g.is_premium ? 'from-amber-400 via-orange-500 to-rose-500' : 'from-purple-500 to-cyan-500'}`}>
                <div className="w-13 h-13 w-[52px] h-[52px] rounded-[14px] bg-card flex items-center justify-center text-2xl border-2 border-background">
                  {g.avatar}
                </div>
              </div>
              <span className="text-[10px] text-foreground w-14 text-center truncate">{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {viewing && currentStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />

          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 p-3 flex gap-1 z-10">
            {viewing.group.stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-none"
                  style={{ width: i < viewing.idx ? '100%' : i === viewing.idx ? `${progress}%` : '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              {viewing.group.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm">{viewing.group.name}</span>
                {viewing.group.is_premium && <span className="text-amber-400 text-xs">⭐</span>}
              </div>
              <span className="text-white/60 text-xs">{currentStory.views} просмотров</span>
            </div>
            <button onClick={() => setViewing(null)} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="X" size={16} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-8">
            <p className="text-5xl mb-6 leading-tight">{currentStory.content}</p>
            {currentStory.caption && (
              <p className="text-white/90 text-lg font-medium">{currentStory.caption}</p>
            )}
          </div>

          {/* Tap zones */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/3 h-full" onClick={() => {
              if (viewing.idx > 0) setViewing({ ...viewing, idx: viewing.idx - 1 });
            }} />
            <div className="flex-1 h-full" />
            <div className="w-1/3 h-full" onClick={() => {
              if (viewing.idx < viewing.group.stories.length - 1) {
                setViewing({ ...viewing, idx: viewing.idx + 1 });
              } else {
                setViewing(null);
              }
            }} />
          </div>

          {/* Reply */}
          <div className="absolute bottom-8 left-4 right-4 z-10">
            <div className="flex items-center gap-2">
              <input
                placeholder={`Ответить ${viewing.group.name}...`}
                className="flex-1 bg-white/20 backdrop-blur border border-white/30 rounded-2xl px-4 py-2.5 text-white placeholder:text-white/50 text-sm focus:outline-none"
              />
              <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
