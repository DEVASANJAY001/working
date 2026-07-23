import React from 'react';
import { Sparkles } from 'lucide-react';
import { Input, Button } from '../atoms';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full h-10 border border-orange-300 hover:border-orange-500 focus-within:border-orange-500 rounded-full bg-white flex items-center px-3 gap-2 transition-all shadow-2xs">
      <div className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center text-[10px] font-bold">
        r/
      </div>
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
