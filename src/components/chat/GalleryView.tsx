import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GALLERY_ITEMS } from './data';

type Filter = 'all' | 'photo' | 'video' | 'files';

export default function GalleryView() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<number | null>(null);

  const filters: { key: Filter; label: string; icon: string }[] = [
    { key: 'all', label: 'Все', icon: 'LayoutGrid' },
    { key: 'photo', label: 'Фото', icon: 'Image' },
    { key: 'video', label: 'Видео', icon: 'Film' },
    { key: 'files', label: 'Файлы', icon: 'FileText' },
  ];

  const selectedItem = GALLERY_ITEMS.find(i => i.id === selected);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold grad-text mb-4">Галерея</h1>

        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${filter === f.key ? 'btn-grad text-white' : 'glass text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={f.icon} size={12} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {GALLERY_ITEMS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className="aspect-square rounded-2xl glass border border-border/50 flex flex-col items-center justify-center gap-1 hover:border-purple-500/50 hover:scale-[1.02] transition-all overflow-hidden group slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</div>
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 glass rounded-2xl p-3">
          <p className="text-xs text-muted-foreground text-center">
            {GALLERY_ITEMS.length} медиафайлов · Все зашифрованы
            <Icon name="Lock" size={10} className="inline ml-1 text-cyan-400" />
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in"
          onClick={() => setSelected(null)}
        >
          <div className="glass-strong rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="text-8xl">{selectedItem.emoji}</div>
            <div className="text-center">
              <p className="font-semibold text-lg">{selectedItem.label}</p>
              <p className="text-sm text-muted-foreground">от {selectedItem.from} · {selectedItem.date}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1.5">
              <Icon name="Lock" size={12} className="text-cyan-400" />
              <span className="text-xs text-cyan-400">Зашифровано E2E</span>
            </div>
            <div className="flex gap-3 w-full">
              <button className="flex-1 glass rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2">
                <Icon name="Download" size={14} />
                Скачать
              </button>
              <button className="flex-1 glass rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2">
                <Icon name="Share2" size={14} />
                Поделиться
              </button>
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl glass flex items-center justify-center">
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
