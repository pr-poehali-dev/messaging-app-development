import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/api';

interface Props {
  user: User;
  onClose: () => void;
}

const FEATURES = [
  { icon: '⭐', title: 'Значок Premium', desc: 'Золотая звезда у вашего имени везде в приложении' },
  { icon: '📸', title: 'Анимированный аватар', desc: 'Загружайте GIF-аватары и живые фото' },
  { icon: '🎨', title: 'Эксклюзивные темы', desc: '50+ уникальных тем оформления только для Premium' },
  { icon: '🔒', title: 'Расширенная приватность', desc: 'Кто видел вашу активность, сокрытие пересылки' },
  { icon: '📂', title: 'Хранилище 100 ГБ', desc: 'Вместо стандартных 5 ГБ для файлов и медиа' },
  { icon: '✉️', title: 'Длинные сообщения', desc: 'До 10 000 символов вместо 4 096' },
  { icon: '⚡', title: 'Быстрые реакции', desc: '8 слотов для реакций вместо 3 стандартных' },
  { icon: '🌐', title: 'Перевод сообщений', desc: 'Авто-перевод на любой язык в реальном времени' },
  { icon: '🎙️', title: 'Голосовые сообщения 2.0', desc: 'Транскрипция, ускорение, шумоподавление' },
  { icon: '📌', title: 'Больше папок', desc: '20 папок с чатами вместо 10' },
  { icon: '🤖', title: 'AI-ассистент', desc: 'Умный помощник прямо в чате' },
  { icon: '🚫', title: 'Без рекламы', desc: 'Полностью чистый интерфейс без рекламных блоков' },
];

const PLANS = [
  { id: 'monthly', label: 'Месяц', price: '299 ₽', per: '/мес', popular: false, save: null },
  { id: 'half', label: '6 месяцев', price: '199 ₽', per: '/мес', popular: true, save: 'Скидка 33%' },
  { id: 'yearly', label: 'Год', price: '149 ₽', per: '/мес', popular: false, save: 'Скидка 50%' },
];

export default function PremiumScreen({ user, onClose }: Props) {
  const [plan, setPlan] = useState('half');
  const [purchasing, setPurchasing] = useState(false);

  const handleBuy = () => {
    setPurchasing(true);
    setTimeout(() => { setPurchasing(false); }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent)]" />

        <div className="relative z-10 px-6 pt-8 pb-10 text-center">
          <button onClick={onClose} className="absolute left-4 top-4 w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon name="X" size={16} className="text-white" />
          </button>

          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-3xl font-black text-white mb-2">Pulse Premium</h1>
          <p className="text-white/80 text-sm">Откройте все возможности мессенджера</p>

          {user.is_premium ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Icon name="CheckCircle" size={14} className="text-white" />
              <span className="text-white text-sm font-medium">Активен до 19 апреля 2026</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Plans */}
        {!user.is_premium && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Выберите план</p>
            <div className="space-y-2">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left
                    ${plan === p.id ? 'border-amber-500 bg-amber-500/10' : 'border-border bg-muted/30 hover:bg-muted/50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${plan === p.id ? 'border-amber-500' : 'border-border'}`}>
                    {plan === p.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{p.label}</span>
                      {p.popular && (
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                          Популярно
                        </span>
                      )}
                      {p.save && (
                        <span className="text-[10px] text-emerald-400 font-semibold">{p.save}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{p.price}</p>
                    <p className="text-xs text-muted-foreground">{p.per}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleBuy}
              disabled={purchasing}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/30 relative z-10 disabled:opacity-70"
            >
              {purchasing ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <>
                  <Icon name="Sparkles" size={18} />
                  Оформить Premium
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">Отмена подписки в любое время</p>
          </div>
        )}

        {/* Features grid */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Что входит</p>
          <div className="grid grid-cols-1 gap-2">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3 glass rounded-2xl px-4 py-3">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                <Icon name="Check" size={14} className="text-amber-500 flex-shrink-0 mt-0.5 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
