'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function FooterModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-white/15 text-white/25 text-[10px] hover:border-white/40 hover:text-white/60 transition-all align-middle ml-2"
        title="?"
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-md glass p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/80">idk</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-sm text-white/50 leading-relaxed">
              I dont know
            </p>
          </div>
        </div>
      )}
    </>
  );
}
