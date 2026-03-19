import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0
        ${value ? 'toggle-track' : 'bg-muted'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all duration-300
        ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

interface SettingRow {
  icon: string;
  label: string;
  desc?: string;
  type: 'toggle' | 'nav' | 'danger';
  key?: string;
  value?: string;
}

const SECTIONS: { title: string; items: SettingRow[] }[] = [
  {
    title: 'Приватность и безопасность',
    items: [
      { icon: 'Lock', label: 'E2E шифрование', desc: 'Защита всех переписок', type: 'toggle', key: 'e2e' },
      { icon: 'EyeOff', label: 'Скрывать статус', desc: 'Никто не видит "онлайн"', type: 'toggle', key: 'hideStatus' },
      { icon: 'Clock', label: 'Удаление сообщений', desc: 'Автоудаление через 7 дней', type: 'nav' },
      { icon: 'Shield', label: 'Двухфакторная аутентификация', type: 'toggle', key: '2fa' },
    ],
  },
  {
    title: 'Уведомления',
    items: [
      { icon: 'Bell', label: 'Пуш-уведомления', type: 'toggle', key: 'push' },
      { icon: 'Volume2', label: 'Звуки сообщений', type: 'toggle', key: 'sounds' },
      { icon: 'Vibrate', label: 'Вибрация', type: 'toggle', key: 'vibrate' },
    ],
  },
  {
    title: 'Внешний вид',
    items: [
      { icon: 'Moon', label: 'Тёмная тема', desc: 'Включена', type: 'toggle', key: 'dark' },
      { icon: 'Type', label: 'Размер шрифта', value: 'Средний', type: 'nav' },
      { icon: 'Zap', label: 'Анимации', type: 'toggle', key: 'anim' },
    ],
  },
  {
    title: 'Аккаунт',
    items: [
      { icon: 'HardDrive', label: 'Хранилище', value: '2.4 ГБ использовано', type: 'nav' },
      { icon: 'RefreshCw', label: 'Синхронизация', value: 'Только Wi-Fi', type: 'nav' },
      { icon: 'LogOut', label: 'Выйти из аккаунта', type: 'danger' },
    ],
  },
];

export default function SettingsView() {
  const [settings, setSettings] = useState({
    e2e: true,
    hideStatus: false,
    '2fa': true,
    push: true,
    sounds: true,
    vibrate: false,
    dark: true,
    anim: true,
  });

  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold grad-text">Настройки</h1>
      </div>

      <div className="px-4 pb-6 space-y-5">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all
                    ${i < section.items.length - 1 ? 'border-b border-border/50' : ''}
                    ${item.type === 'danger' ? 'hover:bg-red-500/10' : 'hover:bg-muted/30'}
                    ${item.type !== 'toggle' ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                    ${item.type === 'danger' ? 'bg-red-500/10' : 'bg-muted/60'}`}>
                    <Icon name={item.icon} size={15} className={item.type === 'danger' ? 'text-red-400' : 'text-purple-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.type === 'danger' ? 'text-red-400' : 'text-foreground'}`}>
                      {item.label}
                    </p>
                    {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                    {item.value && <p className="text-xs text-muted-foreground">{item.value}</p>}
                  </div>
                  {item.type === 'toggle' && item.key && (
                    <Toggle value={!!settings[item.key as keyof typeof settings]} onChange={() => toggle(item.key!)} />
                  )}
                  {item.type === 'nav' && (
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">Pulse v1.0.0</p>
          <p className="text-xs text-muted-foreground">Все данные защищены E2E шифрованием 🔒</p>
        </div>
      </div>
    </div>
  );
}
