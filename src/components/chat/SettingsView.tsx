import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { sms, send, notification, call, setSoundEnabled } from '@/lib/sounds';

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

interface Props {
  onLogout: () => void;
  onOpenPremium?: () => void;
}

type Section = 'main' | 'privacy' | 'notifications' | 'appearance' | 'sounds' | 'language' | 'storage' | 'about';

const RINGTONES = [
  { id: 'default', label: 'По умолчанию', icon: '🔔' },
  { id: 'pulse', label: 'Pulse', icon: '💜' },
  { id: 'chime', label: 'Колокольчик', icon: '🎵' },
  { id: 'minimal', label: 'Минимал', icon: '⚡' },
  { id: 'none', label: 'Без звука', icon: '🔇' },
];

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const FONT_SIZES = ['Маленький', 'Средний', 'Большой', 'Очень большой'];
const AUTO_DELETE_OPTIONS = [
  { value: 0, label: 'Выключено' },
  { value: 1, label: '1 день' },
  { value: 7, label: '7 дней' },
  { value: 30, label: '30 дней' },
  { value: 90, label: '3 месяца' },
];

export default function SettingsView({ onLogout, onOpenPremium }: Props) {
  const [section, setSection] = useState<Section>('main');
  const [settings, setSettings] = useState({
    e2e: true,
    hideStatus: false,
    twofa: false,
    hidePhone: false,
    hideLastSeen: false,
    push: true,
    msgSound: true,
    callSound: true,
    vibrate: true,
    previewInNotif: true,
    groupNotif: true,
    dark: true,
    animations: true,
    fontSize: 'Средний',
    language: 'ru',
    ringtone: 'default',
    msgRingtone: 'default',
    autoDelete: 0,
    saveMedia: true,
    dataUsage: 'wifi',
    readReceipts: true,
    faceId: false,
  });

  const toggle = (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    if (key === 'msgSound') setSoundEnabled(newVal as boolean);
  };
  const set = (key: keyof typeof settings, val: string | number | boolean) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const testSound = (type: string) => {
    if (type === 'msg') sms();
    else if (type === 'send') send();
    else if (type === 'notif') notification();
    else if (type === 'call') call();
  };

  // ── SUB-SECTIONS ──────────────────────────────────────────────────────────
  if (section === 'privacy') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Приватность</h2>
      </div>
      <div className="px-4 pb-6 space-y-3">
        {[
          { key: 'e2e' as const, icon: 'Lock', label: 'E2E шифрование', desc: 'Все переписки защищены', color: 'text-cyan-400' },
          { key: 'twofa' as const, icon: 'Shield', label: 'Двухфакторная авторизация', desc: 'Дополнительный пароль', color: 'text-purple-400' },
          { key: 'faceId' as const, icon: 'Fingerprint', label: 'Биометрический вход', desc: 'Face ID / Touch ID', color: 'text-emerald-400' },
          { key: 'hideStatus' as const, icon: 'EyeOff', label: 'Скрыть статус онлайн', desc: 'Никто не видит «онлайн»', color: 'text-orange-400' },
          { key: 'hideLastSeen' as const, icon: 'Clock', label: 'Скрыть время посещения', desc: 'Скрыть «был(а) в ...»', color: 'text-blue-400' },
          { key: 'hidePhone' as const, icon: 'Phone', label: 'Скрыть номер телефона', desc: 'Виден только вам', color: 'text-pink-400' },
          { key: 'readReceipts' as const, icon: 'CheckCheck', label: 'Уведомления о прочтении', desc: 'Галочки «прочитано»', color: 'text-cyan-400' },
        ].map(item => (
          <div key={item.key} className="glass rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Icon name={item.icon} size={16} className={item.color} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle value={!!settings[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}

        <div className="glass rounded-2xl px-4 py-3.5">
          <p className="text-sm font-semibold mb-2">Автоудаление сообщений</p>
          <div className="flex flex-wrap gap-2">
            {AUTO_DELETE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => set('autoDelete', opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                  ${settings.autoDelete === opt.value ? 'btn-grad text-white' : 'bg-muted text-muted-foreground'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (section === 'sounds') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Звуки</h2>
      </div>
      <div className="px-4 pb-6 space-y-4">
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { key: 'msgSound' as const, icon: 'MessageCircle', label: 'Звук сообщений', sound: 'msg' },
            { key: 'callSound' as const, icon: 'Phone', label: 'Звук звонков', sound: 'call' },
            { key: 'push' as const, icon: 'Bell', label: 'Звук уведомлений', sound: 'notif' },
            { key: 'vibrate' as const, icon: 'Vibrate', label: 'Вибрация', sound: '' },
          ].map((item, i, arr) => (
            <div key={item.key} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Icon name={item.icon} size={15} className="text-purple-400" />
              </div>
              <p className="flex-1 text-sm font-medium">{item.label}</p>
              {item.sound && (
                <button onClick={() => testSound(item.sound)}
                  className="w-8 h-8 rounded-xl glass flex items-center justify-center mr-1"
                  title="Тест">
                  <Icon name="Play" size={12} className="text-cyan-400" />
                </button>
              )}
              <Toggle value={!!settings[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">Рингтон звонка</p>
          <div className="glass rounded-2xl overflow-hidden">
            {RINGTONES.map((r, i) => (
              <button key={r.id} onClick={() => { set('ringtone', r.id); if (r.id !== 'none') call(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${i < RINGTONES.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/30 transition-colors`}>
                <span className="text-lg">{r.icon}</span>
                <span className="flex-1 text-sm">{r.label}</span>
                {settings.ringtone === r.id && <Icon name="Check" size={14} className="text-purple-400" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">Звук сообщений</p>
          <div className="glass rounded-2xl overflow-hidden">
            {RINGTONES.map((r, i) => (
              <button key={r.id} onClick={() => { set('msgRingtone', r.id); if (r.id !== 'none') sms(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${i < RINGTONES.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/30 transition-colors`}>
                <span className="text-lg">{r.icon}</span>
                <span className="flex-1 text-sm">{r.label}</span>
                {settings.msgRingtone === r.id && <Icon name="Check" size={14} className="text-purple-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (section === 'notifications') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Уведомления</h2>
      </div>
      <div className="px-4 pb-6 space-y-3">
        {[
          { key: 'push' as const, label: 'Push-уведомления', desc: 'Уведомления на экране блокировки' },
          { key: 'previewInNotif' as const, label: 'Предпросмотр сообщений', desc: 'Показывать текст в уведомлении' },
          { key: 'groupNotif' as const, label: 'Групповые чаты', desc: 'Уведомления из групп' },
          { key: 'msgSound' as const, label: 'Звук сообщений', desc: 'Звук при входящем сообщении' },
          { key: 'vibrate' as const, label: 'Вибрация', desc: 'Вибрировать при уведомлении' },
        ].map(item => (
          <div key={item.key} className="glass rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle value={!!settings[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );

  if (section === 'appearance') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Внешний вид</h2>
      </div>
      <div className="px-4 pb-6 space-y-4">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
            <Icon name="Moon" size={16} className="text-purple-400" />
            <p className="flex-1 text-sm font-medium">Тёмная тема</p>
            <Toggle value={settings.dark} onChange={() => toggle('dark')} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Icon name="Zap" size={16} className="text-cyan-400" />
            <p className="flex-1 text-sm font-medium">Анимации</p>
            <Toggle value={settings.animations} onChange={() => toggle('animations')} />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">Размер шрифта</p>
          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex gap-2">
              {FONT_SIZES.map(size => (
                <button key={size} onClick={() => set('fontSize', size)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all
                    ${settings.fontSize === size ? 'btn-grad text-white' : 'bg-muted text-muted-foreground'}`}>
                  {size.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-center text-muted-foreground" style={{
              fontSize: settings.fontSize === 'Маленький' ? '12px' : settings.fontSize === 'Средний' ? '14px' : settings.fontSize === 'Большой' ? '16px' : '18px'
            }}>
              Пример текста сообщения
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">Цветовая схема</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Pulse', class: 'from-purple-600 to-cyan-500' },
              { name: 'Закат', class: 'from-orange-500 to-rose-600' },
              { name: 'Лес', class: 'from-emerald-500 to-teal-600' },
              { name: 'Океан', class: 'from-blue-500 to-cyan-600' },
              { name: 'Золото', class: 'from-amber-400 to-orange-500' },
              { name: 'Сирень', class: 'from-violet-500 to-purple-600' },
            ].map(theme => (
              <button key={theme.name}
                className="h-16 rounded-2xl bg-gradient-to-br flex items-end p-2 overflow-hidden transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${theme.class} flex items-end p-2`}>
                  <span className="text-white text-xs font-medium">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (section === 'language') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Язык</h2>
      </div>
      <div className="px-4 pb-6">
        <div className="glass rounded-2xl overflow-hidden">
          {LANGUAGES.map((lang, i) => (
            <button key={lang.code} onClick={() => set('language', lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors ${i < LANGUAGES.length - 1 ? 'border-b border-border/50' : ''}`}>
              <span className="text-2xl">{lang.flag}</span>
              <span className="flex-1 text-sm font-medium">{lang.label}</span>
              {settings.language === lang.code && <Icon name="Check" size={14} className="text-purple-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === 'storage') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">Хранилище</h2>
      </div>
      <div className="px-4 pb-6 space-y-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Использовано</span>
            <span className="text-sm text-muted-foreground">2.4 ГБ / 5 ГБ</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[48%] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
          </div>
          <div className="flex items-center justify-center mt-3">
            <span className="text-xs text-purple-400">⭐ Premium даёт 100 ГБ</span>
          </div>
        </div>

        {[
          { label: 'Фото', size: '1.2 ГБ', icon: 'Image', color: 'text-purple-400' },
          { label: 'Видео', size: '800 МБ', icon: 'Film', color: 'text-cyan-400' },
          { label: 'Файлы', size: '320 МБ', icon: 'FileText', color: 'text-emerald-400' },
          { label: 'Голосовые', size: '80 МБ', icon: 'Mic', color: 'text-orange-400' },
        ].map(item => (
          <div key={item.label} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Icon name={item.icon} size={16} className={item.color} />
            <span className="flex-1 text-sm">{item.label}</span>
            <span className="text-sm text-muted-foreground">{item.size}</span>
            <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Очистить</button>
          </div>
        ))}

        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
            <span className="flex-1 text-sm font-medium">Авто-загрузка фото</span>
            <Toggle value={settings.saveMedia} onChange={() => toggle('saveMedia')} />
          </div>
          <div className="px-4 py-3.5">
            <p className="text-sm font-medium mb-2">Загрузка данных</p>
            <div className="flex gap-2">
              {[['wifi', 'Только Wi-Fi'], ['all', 'Мобильный + Wi-Fi'], ['manual', 'Вручную']].map(([v, l]) => (
                <button key={v} onClick={() => set('dataUsage', v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${settings.dataUsage === v ? 'btn-grad text-white' : 'bg-muted text-muted-foreground'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (section === 'about') return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => setSection('main')} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <h2 className="text-xl font-bold grad-text">О приложении</h2>
      </div>
      <div className="px-4 pb-6 space-y-4">
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-3xl btn-grad flex items-center justify-center text-4xl mb-3 neon-purple">💬</div>
          <h3 className="text-xl font-black grad-text">Pulse</h3>
          <p className="text-muted-foreground text-sm mt-1">Версия 1.0.0</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="Lock" size={11} className="text-cyan-400" />
            <span className="text-xs text-cyan-400">End-to-end шифрование</span>
          </div>
        </div>

        {[
          { icon: 'FileText', label: 'Политика конфиденциальности' },
          { icon: 'BookOpen', label: 'Условия использования' },
          { icon: 'HelpCircle', label: 'Помощь и поддержка' },
          { icon: 'Star', label: 'Оценить приложение' },
          { icon: 'Share2', label: 'Поделиться с друзьями' },
        ].map(item => (
          <button key={item.label} className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left">
            <Icon name={item.icon} size={15} className="text-purple-400" />
            <span className="flex-1 text-sm">{item.label}</span>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </button>
        ))}

        <p className="text-xs text-muted-foreground text-center py-2">
          © 2026 Pulse Messenger. Все данные зашифрованы 🔒
        </p>
      </div>
    </div>
  );

  // ── MAIN ─────────────────────────────────────────────────────────────────
  const MENU_ITEMS = [
    { key: 'privacy' as Section, icon: 'Shield', label: 'Приватность и безопасность', desc: 'E2E, 2FA, авто-удаление', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'notifications' as Section, icon: 'Bell', label: 'Уведомления', desc: 'Push, предпросмотр, группы', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'sounds' as Section, icon: 'Volume2', label: 'Звуки и вибрация', desc: 'Рингтоны, звуки сообщений', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'appearance' as Section, icon: 'Palette', label: 'Внешний вид', desc: 'Тема, шрифт, цвета', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { key: 'language' as Section, icon: 'Globe', label: 'Язык', desc: 'Русский', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'storage' as Section, icon: 'HardDrive', label: 'Хранилище и данные', desc: '2.4 ГБ использовано', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { key: 'about' as Section, icon: 'Info', label: 'О приложении', desc: 'Pulse v1.0.0', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold grad-text">Настройки</h1>
      </div>

      <div className="px-4 pb-6 space-y-3">
        {/* Premium banner */}
        <button onClick={onOpenPremium}
          className="w-full relative overflow-hidden rounded-2xl p-4 text-left"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #a855f7)' }}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div className="flex-1">
              <p className="font-bold text-white">Pulse Premium</p>
              <p className="text-white/80 text-xs">Анимации, 100 ГБ, AI, темы и многое другое</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-white" />
          </div>
        </button>

        {/* Menu */}
        <div className="glass rounded-2xl overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors text-left ${i < MENU_ITEMS.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={item.icon} size={16} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={onLogout}
          className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left border border-red-500/20">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Icon name="LogOut" size={16} className="text-red-400" />
          </div>
          <span className="text-sm font-semibold text-red-400">Выйти из аккаунта</span>
        </button>

        <p className="text-xs text-muted-foreground text-center py-1">
          Pulse v1.0.0 · Все данные защищены E2E 🔒
        </p>
      </div>
    </div>
  );
}
