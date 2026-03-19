import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Chat, MESSAGES, Message } from './data';

interface Props {
  chat: Chat;
  onBack: () => void;
}

const REACTIONS = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

export default function ChatWindow({ chat, onBack }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(MESSAGES[chat.id] || []);
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      mine: true,
      encrypted: true,
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const addReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reaction: emoji } : m));
    setShowReactions(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-strong px-4 py-3 flex items-center gap-3 border-b border-border/50 flex-shrink-0">
        <button onClick={onBack} className="md:hidden w-8 h-8 rounded-xl glass flex items-center justify-center">
          <Icon name="ChevronLeft" size={18} className="text-foreground" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
            {chat.avatar}
          </div>
          {chat.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{chat.name}</span>
            {chat.encrypted && (
              <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">
                <Icon name="Lock" size={10} className="text-cyan-400 lock-glow" />
                <span className="text-xs text-cyan-400 font-medium">E2E</span>
              </div>
            )}
          </div>
          <p className="text-xs text-emerald-400">{chat.online ? 'онлайн' : 'был(а) недавно'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:neon-purple transition-all">
            <Icon name="Phone" size={15} className="text-purple-400" />
          </button>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:neon-cyan transition-all">
            <Icon name="Video" size={15} className="text-cyan-400" />
          </button>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center">
            <Icon name="MoreVertical" size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* E2E notice */}
      {chat.encrypted && (
        <div className="flex items-center justify-center gap-2 py-2 bg-cyan-500/5 border-b border-cyan-500/10">
          <Icon name="ShieldCheck" size={12} className="text-cyan-400" />
          <span className="text-xs text-cyan-400/80">Сообщения защищены сквозным шифрованием</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex msg-in ${msg.mine ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="relative max-w-[75%] group">
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer
                  ${msg.mine
                    ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white rounded-br-sm'
                    : 'glass border border-border/50 text-foreground rounded-bl-sm'
                  }`}
                onDoubleClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
              >
                {msg.text}
                <div className={`flex items-center gap-1 mt-1 ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-[10px] ${msg.mine ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </span>
                  {msg.encrypted && (
                    <Icon name="Lock" size={9} className={msg.mine ? 'text-white/50' : 'text-cyan-400/50'} />
                  )}
                  {msg.mine && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className={msg.read ? 'text-cyan-300' : 'text-white/50'} />
                  )}
                </div>
              </div>

              {msg.reaction && (
                <div className={`absolute -bottom-3 ${msg.mine ? 'right-2' : 'left-2'} bg-card border border-border rounded-full px-1.5 py-0.5 text-sm shadow-lg`}>
                  {msg.reaction}
                </div>
              )}

              {showReactions === msg.id && (
                <div className={`absolute -top-10 ${msg.mine ? 'right-0' : 'left-0'} glass-strong rounded-2xl px-2 py-1.5 flex gap-1 z-10 shadow-xl animate-scale-in`}>
                  {REACTIONS.map(r => (
                    <button key={r} onClick={() => addReaction(msg.id, r)} className="text-lg hover:scale-125 transition-transform">
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass-strong px-4 py-3 border-t border-border/50 flex-shrink-0">
        <div className="flex items-end gap-2">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
            <Icon name="Paperclip" size={16} className="text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Сообщение..."
              rows={1}
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
            <Icon name="Smile" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={send}
            className="w-10 h-10 btn-grad rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 hover:scale-105 transition-transform"
          >
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
