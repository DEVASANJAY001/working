import React from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Input, Button } from '../atoms';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full h-10 border border-orange-300 hover:border-orange-500 focus-within:border-orange-500 rounded-full bg-white flex items-center px-3.5 gap-2.5 transition-all shadow-2xs">
      <Search className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
      <Input
        placeholder="Find anything"
        value={value}
        onChange={onChange}
      />
      <Button variant="ask" size="sm">
        <Sparkles className="w-3.5 h-3.5" />
        Ask
      </Button>
    </div>
  );
}
