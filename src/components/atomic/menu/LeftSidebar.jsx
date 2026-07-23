import React, { useState } from 'react';
import {
  Home, Compass, Newspaper, Layers, Plus, Gamepad2, Skull, Grid,
  Crosshair, ShieldCheck, Wrench
} from 'lucide-react';
import { GameBannerCard } from '../molecules';
import LeftSidebarItem from './LeftSidebarItem';

export default function LeftSidebar({ activeNav, setActiveNav }) {
  const [gamesOpen, setGamesOpen] = useState(false); // default collapsed as in latest screenshot
  const [modOpen, setModOpen] = useState(true);
  const [customFeedsOpen, setCustomFeedsOpen] = useState(true);

  return (
    <aside className="w-64 border-r border-gray-200 p-3 hidden lg:block space-y-4 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar">
      {/* Main Navigation Links */}
      <div className="space-y-1">
        {[
          { id: 'Home', label: 'Home', icon: Home },
          { id: 'Popular', label: 'Popular', icon: Compass },
          { id: 'News', label: 'News', icon: Newspaper },
          { id: 'Explore', label: 'Explore', icon: Layers },
        ].map(({ id, label, icon: Icon }) => (
          <LeftSidebarItem
            key={id}
            label={label}
            icon={Icon}
            active={activeNav === id}
            onClick={() => setActiveNav(id)}
          />
        ))}

        <LeftSidebarItem
          label="Start a community"
          icon={Plus}
        />
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

            {[
              { name: 'Bonkyard', icon: Skull },
              { name: '4 Pics 1 Word', icon: Grid },
              { name: 'Sword & Supper', icon: Crosshair },
              { name: 'Discover More', icon: Gamepad2 }
            ].map(game => (
              <LeftSidebarItem
                key={game.name}
                label={game.name}
                icon={game.icon}
              />
            ))}
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
            {[
              { name: 'Mod Queue', icon: ShieldCheck },
              { name: 'Mod Mail', icon: ShieldCheck },
              { name: 'r/Mod', icon: ShieldCheck }
            ].map(item => (
              <LeftSidebarItem
                key={item.name}
                label={item.name}
                icon={item.icon}
              />
            ))}

            <LeftSidebarItem
              label="Manage"
              icon={Wrench}
            />

            {/* Starred moderation subreddits */}
            <LeftSidebarItem
              label="r/cjppartyy"
              imageIcon="👑"
              hasStarAction={true}
              starred={true}
            />
            <LeftSidebarItem
              label="r/hfsnrndijd"
              imageIcon="💬"
              hasStarAction={true}
              starred={true}
            />
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* CUSTOM FEEDS */}
      <div>
        <button
          onClick={() => setCustomFeedsOpen(!customFeedsOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>CUSTOM FEEDS</span>
          <span className={`transform transition-transform ${customFeedsOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {customFeedsOpen && (
          <div className="space-y-1">
            <LeftSidebarItem
              label="Create Custom Feed"
              icon={Plus}
            />
            <LeftSidebarItem
              label="Nenn"
              imageIcon="🔥"
              hasStarAction={true}
              starred={true}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
