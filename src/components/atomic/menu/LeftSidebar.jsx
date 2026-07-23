import React, { useState } from 'react';
import {
  Home, Compass, Newspaper, Layers, Plus, Gamepad2, Skull, Grid,
  Crosshair, ShieldCheck, Wrench, Clock, Users, BookOpen, HelpCircle,
  Briefcase, MessageSquare, Info, ShieldAlert, FileText, Scale, Megaphone
} from 'lucide-react';
import { GameBannerCard } from '../molecules';
import LeftSidebarItem from './LeftSidebarItem';

export default function LeftSidebar({ activeNav, setActiveNav }) {
  const [gamesOpen, setGamesOpen] = useState(false);
  const [modOpen, setModOpen] = useState(true);
  const [customFeedsOpen, setCustomFeedsOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);
  const [communitiesOpen, setCommunitiesOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(true);

  return (
    <aside className="w-64 border-r border-gray-200 p-3 hidden lg:block h-full overflow-y-auto no-scrollbar space-y-4 flex-shrink-0">
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

      {/* RECENT */}
      <div>
        <button
          onClick={() => setRecentOpen(!recentOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>RECENT</span>
          <span className={`transform transition-transform ${recentOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {recentOpen && (
          <div className="space-y-1">
            <LeftSidebarItem
              label="ipl"
              imageIcon="🏏"
            />
            <LeftSidebarItem
              label="CarsIndia"
              imageIcon="🚗"
            />
          </div>
        )}
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

      <hr className="border-gray-200" />

      {/* COMMUNITIES */}
      <div>
        <button
          onClick={() => setCommunitiesOpen(!communitiesOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>COMMUNITIES</span>
          <span className={`transform transition-transform ${communitiesOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {communitiesOpen && (
          <div className="space-y-1">
            <LeftSidebarItem
              label="CarsIndia"
              imageIcon="🚗"
              hasStarAction={true}
              starred={true}
            />
            <LeftSidebarItem
              label="ipl"
              imageIcon="🏏"
              hasStarAction={true}
              starred={true}
            />
            <LeftSidebarItem
              label="AI_Agents"
              imageIcon="🤖"
              hasStarAction={true}
              starred={true}
            />
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
              { name: 'Mod Forum', icon: ShieldCheck }
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

            <LeftSidebarItem
              label="cjppartyy"
              imageIcon="👑"
              hasStarAction={true}
              starred={true}
            />
            <LeftSidebarItem
              label="hfsnrndijd"
              imageIcon="💬"
              hasStarAction={true}
              starred={true}
            />
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* RESOURCES */}
      <div>
        <button
          onClick={() => setResourcesOpen(!resourcesOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
        >
          <span>RESOURCES</span>
          <span className={`transform transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}>^</span>
        </button>

        {resourcesOpen && (
          <div className="space-y-1">
            {[
              { name: 'About Reddit', icon: Info },
              { name: 'Advertise', icon: Megaphone },
              { name: 'Developer Platform', icon: BookOpen },
              { name: 'Reddit Pro BETA', icon: ShieldCheck },
              { name: 'Help', icon: HelpCircle },
              { name: 'Blog', icon: MessageSquare },
              { name: 'Careers', icon: Briefcase },
              { name: 'Press', icon: Newspaper },
              { name: 'Best of Reddit', icon: Compass },
              { name: 'Reddit Rules', icon: ShieldAlert },
              { name: 'Privacy Policy', icon: FileText },
              { name: 'User Agreement', icon: Scale },
              { name: 'Accessibility', icon: Info }
            ].map(resource => (
              <LeftSidebarItem
                key={resource.name}
                label={resource.name}
                icon={resource.icon}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
