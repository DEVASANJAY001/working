import React from 'react';
import { Badge } from '../atoms';

export default function GameBannerCard({ title, tag, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0055D4] text-white rounded-2xl p-3 shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black tracking-wide">{title}</span>
        {tag && <Badge variant="new">{tag}</Badge>}
      </div>
      {subtitle && <p className="text-[11px] text-blue-100 mt-0.5">{subtitle}</p>}
    </div>
  );
}
