import React from 'react';
import { ArrowLeft } from 'lucide-react';
import bgImage from '../../assets/image.png';

export function AuthHeader({ title, subtitle, onBack }) {
  return (
    <div className="mb-6">
      {onBack && (
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer mb-3"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      )}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs md:text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function AuthErrorAlert({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-shake">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

export function AuthInput({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightElement,
  required = false,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-3 ${Icon ? 'pl-10' : 'pl-4'} ${
            rightElement ? 'pr-12' : 'pr-4'
          } border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}) {
  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-full h-12 md:h-13 rounded-full text-white font-bold text-sm md:text-base bg-cover bg-center hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/20 disabled:opacity-60 cursor-pointer overflow-hidden relative ${className}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            children
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-12 md:h-13 rounded-full border-2 border-violet-600 hover:bg-violet-50 text-violet-700 font-bold text-sm md:text-base active:scale-[0.98] transition-all flex items-center justify-center bg-white cursor-pointer disabled:opacity-60 ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </span>
    </button>
  );
}

export function SocialAuthButtons({ onGoogleSignIn, loading = false }) {
  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-semibold">or continue with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2.5 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer"
        >
          <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">A</span>
          Apple
        </button>
      </div>
    </div>
  );
}
