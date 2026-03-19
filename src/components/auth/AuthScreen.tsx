import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { API, setToken, User } from '@/lib/api';

type Step = 'phone' | 'code' | 'register';

interface Props {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer(t => {
          if (t <= 1) { clearInterval(timerRef.current!); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resendTimer]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.startsWith('7') || digits.startsWith('8')) {
      const d = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
      let result = '+7';
      if (d.length > 1) result += ' (' + d.slice(1, 4);
      if (d.length > 4) result += ') ' + d.slice(4, 7);
      if (d.length > 7) result += '-' + d.slice(7, 9);
      if (d.length > 9) result += '-' + d.slice(9, 11);
      return result;
    }
    return '+' + digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setError('');
  };

  const handleSendCode = async () => {
    const raw = phone.replace(/\D/g, '');
    if (raw.length < 11) { setError('Введите полный номер телефона'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(API.sendCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ошибка'); return; }
      setDemoCode(data.demo_code || '');
      setStep('code');
      setResendTimer(60);
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    setError('');
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every(c => c !== '')) {
      verifyCode(next.join(''));
    }
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split('');
      setCode(next);
      codeRefs.current[5]?.focus();
      verifyCode(pasted);
    }
  };

  const verifyCode = async (codeStr: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(API.verifyCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: codeStr }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Неверный код'); setCode(['','','','','','']); codeRefs.current[0]?.focus(); return; }
      if (data.needs_register) {
        setStep('register');
      } else {
        setToken(data.token);
        onAuth(data.user);
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || name.trim().length < 2) { setError('Введите имя (минимум 2 символа)'); return; }
    const emailTrim = email.trim();
    if (emailTrim && !/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(emailTrim)) {
      setError('Неверный формат email'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: name.trim(), email: emailTrim }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ошибка'); return; }
      setToken(data.token);
      onAuth(data.user);
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-96 h-96 bg-purple-600 top-[-15%] left-[-10%]" />
      <div className="orb w-72 h-72 bg-cyan-500 bottom-[-10%] right-[-5%]" style={{ animationDelay: '3s' }} />
      <div className="orb w-56 h-56 bg-pink-600 top-[50%] right-[10%]" style={{ animationDelay: '6s' }} />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl btn-grad flex items-center justify-center text-4xl mb-4 neon-purple">
            💬
          </div>
          <h1 className="text-3xl font-bold grad-text">Pulse</h1>
          <p className="text-muted-foreground text-sm mt-1">Защищённый мессенджер</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="Lock" size={11} className="text-cyan-400" />
            <span className="text-xs text-cyan-400">End-to-end шифрование</span>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6 animate-scale-in">
          {/* STEP: PHONE */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Войти или зарегистрироваться</h2>
                <p className="text-sm text-muted-foreground">Введите номер телефона</p>
              </div>

              <div>
                <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3 focus-within:border-purple-500/60 transition-colors">
                  <span className="text-xl">🇷🇺</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                    placeholder="+7 (999) 000-00-00"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              </div>

              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full btn-grad text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
              >
                {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>
                  <span>Получить код</span>
                  <Icon name="ArrowRight" size={16} />
                </>}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Отправим SMS с кодом подтверждения
              </p>
            </div>
          )}

          {/* STEP: CODE */}
          {step === 'code' && (
            <div className="space-y-5">
              <div>
                <button onClick={() => { setStep('phone'); setCode(['','','','','','']); setError(''); }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
                  <Icon name="ChevronLeft" size={16} />Назад
                </button>
                <h2 className="text-xl font-bold mb-1">Введите код</h2>
                <p className="text-sm text-muted-foreground">Отправили на <span className="text-foreground font-medium">{phone}</span></p>
              </div>

              {demoCode && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Icon name="Info" size={13} className="text-cyan-400 flex-shrink-0" />
                  <p className="text-xs text-cyan-400">Демо-код: <span className="font-bold font-mono">{demoCode}</span></p>
                </div>
              )}

              <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                {code.map((c, i) => (
                  <input
                    key={i}
                    ref={el => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={c}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border transition-all bg-muted/50 focus:outline-none
                      ${c ? 'border-purple-500/60 text-purple-300' : 'border-border text-foreground'}
                      focus:border-purple-500`}
                    disabled={loading}
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-400 flex items-center gap-1 justify-center"><Icon name="AlertCircle" size={12} />{error}</p>}

              {loading && (
                <div className="flex justify-center">
                  <Icon name="Loader2" size={20} className="animate-spin text-purple-400" />
                </div>
              )}

              <div className="text-center">
                {resendTimer > 0
                  ? <p className="text-xs text-muted-foreground">Повторный код через {resendTimer}с</p>
                  : <button onClick={handleSendCode} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                      Отправить код повторно
                    </button>
                }
              </div>
            </div>
          )}

          {/* STEP: REGISTER */}
          {step === 'register' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Добро пожаловать!</h2>
                <p className="text-sm text-muted-foreground">Заполните данные профиля</p>
              </div>

              <div className="flex justify-center">
                <div className="avatar-ring">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-3xl">
                    🧑‍🚀
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Имя *</label>
                  <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3 focus-within:border-purple-500/60 transition-colors">
                    <Icon name="User" size={15} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setError(''); }}
                      placeholder="Ваше имя"
                      autoFocus
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Email <span className="text-muted-foreground/60">(необязательно)</span></label>
                  <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3 focus-within:border-purple-500/60 transition-colors">
                    <Icon name="Mail" size={15} className="text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()}
                      placeholder="email@example.com"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full btn-grad text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60 relative z-10"
              >
                {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>
                  <Icon name="Rocket" size={16} />
                  <span>Создать аккаунт</span>
                </>}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Регистрируясь, вы соглашаетесь с условиями использования
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
