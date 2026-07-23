import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * Responsive Modal:
 * - Desktop (lg+): centered dialog over a full-screen backdrop
 * - Mobile (<lg): bottom sheet that slides up from the bottom, full-width
 *
 * Rendered via ReactDOM.createPortal into document.body so it is NEVER
 * clipped by parent overflow:hidden containers.
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'lg:max-w-sm',
    md: 'lg:max-w-md',
    lg: 'lg:max-w-lg',
    xl: 'lg:max-w-xl',
  }[size] || 'lg:max-w-md';

  const content = (
    <>
      {/* ── Full-viewport backdrop ── */}
      <div
        className="fixed inset-0 z-[500]"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
      />

      {/* ── Desktop: centered dialog ── */}
      <div
        className={`
          fixed inset-0 z-[501]
          hidden lg:flex items-center justify-center p-4
        `}
        onClick={onClose}
      >
        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass} animate-scale-in`}
          onClick={e => e.stopPropagation()}
        >
          {(title || !hideClose) && (
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              {title && <h2 className="text-base font-black text-gray-900">{title}</h2>}
              {!hideClose && (
                <button
                  onClick={onClose}
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <div className="px-6 py-5 overflow-y-auto max-h-[80vh] no-scrollbar">
            {children}
          </div>
        </div>
      </div>

      {/* ── Mobile: bottom sheet that slides up ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-[501] lg:hidden animate-sheet-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="bg-white rounded-t-3xl shadow-2xl w-full">
          {(title || !hideClose) && (
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              {title && <h2 className="text-base font-black text-gray-900">{title}</h2>}
              {!hideClose && (
                <button
                  onClick={onClose}
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <div className="px-5 py-5 overflow-y-auto max-h-[85vh] no-scrollbar pb-safe">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Portal renders directly into <body> — bypasses all overflow:hidden parents
  return ReactDOM.createPortal(content, document.body);
}
