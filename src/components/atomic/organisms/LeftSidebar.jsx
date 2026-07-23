import React, { useState } from 'react';
import {
  Home, Compass, Newspaper, Layers, Plus, Gamepad2, Skull, Grid,
  Crosshair, ShieldCheck, Wrench
} from 'lucide-react';
import { GameBannerCard } from '../molecules';

export default function LeftSidebar({ activeNav, setActiveNav }) {
  const [gamesOpen, setGamesOpen] = useState(true);
  const [modOpen, setModOpen] = useState(true);

  return (
    <aside className="w-64 border-r border-gray-200 p-3 hidden lg:block space-y-4 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar">
      {/* Main Links */}
      <div className="space-y-1">
        {[
          { id: 'Home', label: 'Home', icon: Home },
          { id: 'Popular', label: 'Popular', icon: Compass },
          { id: 'News', label: 'News', icon: Newspaper },
          { id: 'Explore', label: 'Explore', icon: Layers },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer ${
              activeNav === id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5 text-gray-700" />
            {label}
          </button>
        ))}

        <button className="w-full flex items-center gap-3.5 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-2xl cursor-pointer">
          <Plus className="w-5 h-5 text-gray-700" />
          Start a community
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* GAMES ON REDDIT */}
      <div>
        <button
          onClick={() => setGamesOpen(!gamesOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>GAMES ON REDDIT</span>
          <span className={`transform transition-transform ${gamesOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {gamesOpen && (
          <div className="space-y-2">
            <GameBannerCard
              title="Slingblade"
              tag="NEW"
              subtitle="Reach the top!"
            />

            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Skull className="w-4 h-4 text-gray-500" />
              <span>Bonkyard</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Grid className="w-4 h-4 text-gray-500" />
              <span>4 Pics 1 Word</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Crosshair className="w-4 h-4 text-gray-500" />
              <span>Sword & Supper</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Gamepad2 className="w-4 h-4 text-gray-500" />
              <span>Discover More</span>
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* MODERATION */}
      <div>
        <button
          onClick={() => setModOpen(!modOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>MODERATION</span>
          <span className={`transform transition-transform ${modOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {modOpen && (
          <div className="space-y-1">
            {['Mod Queue', 'Mod Mail', 'r/Mod'].map(name => (
              <button key={name} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                <span>{name}</span>
              </button>
            ))}

            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Wrench className="w-4 h-4 text-gray-500" />
              <span>Manage</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
