import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/api';

interface Props {
  user: User;
}

export default function ProfileView({ user }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name || 'Пользователь');
  const [bio, setBio] = useState(user.bio || '');
  const [status, setStatus] = useState(user.status || 'Доступен');

  const statuses = ['Доступен', 'Занят', 'Не беспокоить', 'Нет на месте'];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold grad-text">Профиль</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${editing ? 'btn-grad text-white' : 'glass text-muted-foreground'}`}
        >
          {editing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>

      <div className="px-4 pb-6 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="avatar-ring mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-4xl border-2 border-background">
              🧑‍🚀
            </div>
          </div>
          {editing ? (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-center font-bold text-xl bg-transparent border-b border-purple-500/50 focus:outline-none text-foreground pb-1 w-full max-w-xs"
            />
          ) : (
            <h2 className="font-bold text-xl">{name}</h2>
          )}
          <p className="text-sm text-emerald-400 mt-1">● {status}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Чатов', value: '24' },
            { label: 'Контактов', value: '128' },
            { label: 'Медиа', value: '9' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center">
              <p className="font-bold text-lg grad-text">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">О себе</p>
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground focus:outline-none resize-none"
              rows={2}
            />
          ) : (
            <p className="text-sm text-foreground">{bio}</p>
          )}
        </div>

        {/* Status selector */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Статус</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                  ${status === s ? 'btn-grad text-white' : 'glass text-muted-foreground hover:text-foreground'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        {[
          { icon: 'Phone', label: 'Телефон', value: user.phone },
          { icon: 'Mail', label: 'Email', value: user.email || 'Не указан' },
          { icon: 'Calendar', label: 'ID', value: `#${user.id}` },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={15} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}

        {/* E2E key */}
        <div className="glass rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="KeyRound" size={14} className="text-cyan-400" />
            <p className="text-xs font-medium text-cyan-400">Ключ шифрования</p>
          </div>
          <p className="text-xs text-muted-foreground font-mono break-all">
            E2:A4:F7:9C:3B:12:88:D1:45:7E:2F:96:BC:01:54:A8
          </p>
          <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Обновить ключи →
          </button>
        </div>
      </div>
    </div>
  );
}