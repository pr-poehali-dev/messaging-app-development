import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { API, getToken } from '@/lib/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const BG_OPTIONS = [
  { key: 'gradient-1', label: '💜', class: 'from-purple-600 via-pink-600 to-orange-500' },
  { key: 'gradient-2', label: '💙', class: 'from-cyan-500 via-blue-600 to-purple-700' },
  { key: 'gradient-3', label: '💚', class: 'from-emerald-500 via-teal-600 to-cyan-700' },
  { key: 'gradient-4', label: '❤️', class: 'from-rose-500 via-pink-600 to-purple-600' },
  { key: 'gradient-5', label: '🧡', class: 'from-amber-500 via-orange-600 to-red-600' },
  { key: 'gradient-6', label: '💜', class: 'from-indigo-500 via-purple-600 to-pink-600' },
];

const QUICK_EMOJIS = ['🔥', '❤️', '🎉', '🚀', '😂', '😍', '💪', '🌙', '🌊', '🎵', '✨', '🙏'];

export default function CreateStoryModal({ onClose, onCreated }: Props) {
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');
  const [bg, setBg] = useState('gradient-1');
  const [loading, setLoading] = useState(false);

  const selectedBg = BG_OPTIONS.find(b => b.key === bg) || BG_OPTIONS[0];

  const handleCreate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const token = getToken();
      const storyUrl = (await import('../../backend/func2url.json')).default['stories'];
      await fetch(`${storyUrl}?action=create_story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token || '' },
        body: JSON.stringify({ content: content.trim(), caption: caption.trim(), bg_color: bg }),
      });
      onCreated();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full md:max-w-sm glass-strong rounded-t-3xl md:rounded-3xl overflow-hidden animate-fade-in">
        {/* Preview */}
        <div className={`h-48 bg-gradient-to-br ${selectedBg.class} flex flex-col items-center justify-center p-6 relative`}>
          <p className="text-4xl leading-tight text-center">{content || '✨'}</p>
          {caption && <p className="text-white/80 text-sm mt-2 text-center">{caption}</p>}
          <div className="absolute top-3 right-3">
            <button onClick={onClose} className="w-8 h-8 bg-black/30 rounded-xl flex items-center justify-center">
              <Icon name="X" size={14} className="text-white" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/30 rounded-full px-2 py-1">
            <Icon name="Clock" size={10} className="text-white" />
            <span className="text-white text-[10px]">24 часа</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Что хотите показать? Напишите текст или вставьте эмодзи..."
              maxLength={200}
              rows={2}
              autoFocus
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
            />
          </div>

          {/* Quick emojis */}
          <div className="flex flex-wrap gap-2">
            {QUICK_EMOJIS.map(e => (
              <button key={e} onClick={() => setContent(prev => prev + e)}
                className="text-xl hover:scale-125 transition-transform">
                {e}
              </button>
            ))}
          </div>

          {/* Caption */}
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Подпись (необязательно)"
            maxLength={100}
            className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
          />

          {/* BG picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Фон</p>
            <div className="flex gap-2">
              {BG_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setBg(opt.key)}
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opt.class} transition-all ${bg === opt.key ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!content.trim() || loading}
            className="w-full btn-grad text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 relative z-10"
          >
            {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <>
              <Icon name="Sparkles" size={16} />
              Опубликовать статус
            </>}
          </button>
        </div>
      </div>
    </div>
  );
}
