import React from 'react';
import { Scissors, Calendar, Clock, MapPin, Phone, Users, ShieldCheck } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';

interface HeaderProps {
  activeTab: 'book' | 'my-bookings' | 'queue-board';
  setActiveTab: (tab: 'book' | 'my-bookings' | 'queue-board') => void;
  onOpenShopInfo: () => void;
  totalActiveBookingsToday: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenShopInfo,
  totalActiveBookingsToday
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-stone-950 px-3 py-1 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-stone-950 animate-pulse" />
          <span className="truncate">Bigbangbarber ทองหล่อ • เปิด 10:00 - 20:00 น.</span>
        </div>
        <button
          onClick={onOpenShopInfo}
          className="flex items-center gap-1 underline text-stone-950 hover:text-stone-900 font-semibold cursor-pointer shrink-0 ml-2"
        >
          <MapPin className="w-3 h-3" />
          <span>แผนที่ร้าน</span>
        </button>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          onClick={() => setActiveTab('book')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-amber-400 -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-wider text-amber-400 font-heading">
                BIGBANG<span className="text-stone-100">BARBER</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-stone-400 flex items-center gap-1">
              <span>จองคิวออนไลน์ 3 ช่างระดับโปร</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition-colors"
            title="โทรสอบถามร้าน"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="max-w-md mx-auto px-3 pb-2.5">
        <div className="grid grid-cols-3 gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>จองคิวใหม่</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'my-bookings'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>เช็คคิวของฉัน</span>
          </button>

          <button
            onClick={() => setActiveTab('queue-board')}
            className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeTab === 'queue-board'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>คิวช่าง 3 คน</span>
            {totalActiveBookingsToday > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                activeTab === 'queue-board' ? 'bg-stone-950 text-amber-400' : 'bg-amber-500 text-stone-950'
              }`}>
                {totalActiveBookingsToday}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
