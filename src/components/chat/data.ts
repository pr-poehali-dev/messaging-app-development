export interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
  encrypted?: boolean;
  read?: boolean;
  reaction?: string;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  group?: boolean;
  pinned?: boolean;
  encrypted?: boolean;
}

export interface Notification {
  id: number;
  type: 'message' | 'mention' | 'call' | 'system';
  title: string;
  body: string;
  time: string;
  avatar: string;
  read: boolean;
}

export const CHATS: Chat[] = [
  { id: 1, name: 'Алиса Морозова', avatar: '👩‍🦰', lastMsg: 'Увидимся вечером! 🌙', time: '21:04', unread: 3, online: true, pinned: true, encrypted: true },
  { id: 2, name: 'Команда Pulse', avatar: '🚀', lastMsg: 'Юра: Деплоим завтра утром', time: '20:31', unread: 7, online: true, group: true, encrypted: true },
  { id: 3, name: 'Макс Волков', avatar: '🧑‍💻', lastMsg: 'Ок, понял, спасибо!', time: '18:55', unread: 0, online: false, encrypted: true },
  { id: 4, name: 'Дизайн-клуб', avatar: '🎨', lastMsg: 'Новые тренды 2026', time: '17:12', unread: 12, online: true, group: true },
  { id: 5, name: 'Катя Снегова', avatar: '👩‍🎤', lastMsg: 'Отправила файл 📎', time: '15:40', unread: 0, online: true, encrypted: true },
  { id: 6, name: 'Денис Краснов', avatar: '🧑‍🎸', lastMsg: 'Слышишь меня?', time: '14:22', unread: 2, online: false },
  { id: 7, name: 'Стартап Hub', avatar: '💡', lastMsg: 'Митап в пятницу!', time: 'Вчера', unread: 0, online: true, group: true },
  { id: 8, name: 'Вика Громова', avatar: '👩‍🔬', lastMsg: 'Отчёт готов ✅', time: 'Вчера', unread: 0, online: false, encrypted: true },
];

export const MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Привет! Как дела? 👋', time: '20:45', mine: false, encrypted: true },
    { id: 2, text: 'Всё отлично, спасибо! Работаю над новым проектом', time: '20:46', mine: true, encrypted: true, read: true },
    { id: 3, text: 'О, расскажи! Что за проект?', time: '20:47', mine: false, encrypted: true, reaction: '👀' },
    { id: 4, text: 'Мессенджер с e2e-шифрованием. Первая версия уже почти готова!', time: '20:48', mine: true, encrypted: true, read: true },
    { id: 5, text: 'Звучит круто! 🔥 Я буду первым тестировщиком?', time: '20:50', mine: false, encrypted: true },
    { id: 6, text: 'Конечно! Пришлю ссылку завтра 😊', time: '20:52', mine: true, encrypted: true, read: false },
    { id: 7, text: 'Увидимся вечером! 🌙', time: '21:04', mine: false, encrypted: true },
  ],
  2: [
    { id: 1, text: 'Привет команда! Что по деплою?', time: '19:00', mine: false, encrypted: true },
    { id: 2, text: 'Пушим в прод завтра в 9 утра', time: '19:05', mine: true, encrypted: true, read: true },
    { id: 3, text: 'ОК, я буду следить за логами', time: '20:00', mine: false, encrypted: true },
    { id: 4, text: 'Юра: Деплоим завтра утром', time: '20:31', mine: false, encrypted: true },
  ],
};

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'message', title: 'Алиса Морозова', body: 'Увидимся вечером! 🌙', time: '21:04', avatar: '👩‍🦰', read: false },
  { id: 2, type: 'mention', title: 'Команда Pulse', body: '@Юра, нужна твоя правка', time: '20:35', avatar: '🚀', read: false },
  { id: 3, type: 'call', title: 'Макс Волков', body: 'Пропущенный видеозвонок', time: '18:10', avatar: '🧑‍💻', read: false },
  { id: 4, type: 'message', title: 'Дизайн-клуб', body: 'Новые тренды 2026 🎨', time: '17:12', avatar: '🎨', read: true },
  { id: 5, type: 'system', title: 'Pulse', body: 'Ключи шифрования обновлены ✅', time: '14:00', avatar: '🔒', read: true },
  { id: 6, type: 'message', title: 'Денис Краснов', body: 'Слышишь меня?', time: '14:22', avatar: '🧑‍🎸', read: true },
];

export const GALLERY_ITEMS = [
  { id: 1, emoji: '🌅', label: 'Закат', from: 'Алиса', date: '19 марта' },
  { id: 2, emoji: '🏙️', label: 'Город', from: 'Макс', date: '18 марта' },
  { id: 3, emoji: '🎨', label: 'Арт', from: 'Дизайн-клуб', date: '17 марта' },
  { id: 4, emoji: '🌿', label: 'Природа', from: 'Катя', date: '17 марта' },
  { id: 5, emoji: '🎵', label: 'Концерт', from: 'Денис', date: '16 марта' },
  { id: 6, emoji: '🍕', label: 'Еда', from: 'Вика', date: '16 марта' },
  { id: 7, emoji: '🚀', label: 'Запуск', from: 'Команда', date: '15 марта' },
  { id: 8, emoji: '🌊', label: 'Море', from: 'Алиса', date: '14 марта' },
  { id: 9, emoji: '🦋', label: 'Природа', from: 'Катя', date: '13 марта' },
];
