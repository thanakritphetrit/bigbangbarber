import React from 'react';
import { Scissors, Calendar, Clock, MapPin, Phone, Users, ShieldCheck, Sparkles, Settings, Lock, Unlock, DollarSign, Zap, KeyRound } from 'lucide-react';
import { ShopInfo } from '../types';

interface HeaderProps {
  activeTab: 'book' | 'my-bookings' | 'queue-board' | 'finance';
  setActiveTab: (tab: 'book' | 'my-bookings' | 'queue-board' | 'finance') => void;
  onOpenShopInfo: () => void;
  onOpenSettings: () => void;
  onOpenQuickWalkIn?: () => void;
  totalActiveBookingsToday: number;
  shopInfo: ShopInfo;
  isAdminUnlocked?: boolean;
  onToggleAdminLock?: () => void;
  staffPin?: string;
  onOpenSecuritySettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenShopInfo,
  onOpenSettings,
  onOpenQuickWalkIn,
  totalActiveBookingsToday,
  shopInfo,
  isAdminUnlocked = false,
  onToggleAdminLock,
  staffPin = '1234',
  onOpenSecuritySettings
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Top Status Bar Notice */}
      <div className="bg-[#121418] border-b border-white/5 text-gray-300 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-300 tracking-tighter uppercase font-medium">
            Firebase: bigbangbarber-2f657
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleAdminLock && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleAdminLock}
                className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  isAdminUnlocked
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
                title={isAdminUnlocked ? 'คลิกเพื่อล็อกโหมดแก้ไข (Lock Admin)' : 'คลิกเพื่อใส่รหัสปลดล็อกโหมดแก้ไข'}
              >
                {isAdminUnlocked ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>ADMIN UNLOCKED</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>LOCKED</span>
                  </>
                )}
              </button>

              {/* Direct button to change PIN in Settings */}
              {onOpenSecuritySettings && (
                <button
                  type="button"
                  onClick={onOpenSecuritySettings}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#FACC15] hover:text-yellow-300 bg-[#FACC15]/10 hover:bg-[#FACC15]/20 border border-[#FACC15]/30 px-2 py-0.5 rounded-full transition-all cursor-pointer active:scale-95"
                  title="เปลี่ยนรหัส PIN (อยู่ในตั้งค่า)"
                >
                  <KeyRound className="w-2.5 h-2.5" />
                  <span>เปลี่ยนรหัส</span>
                </button>
              )}
            </div>
          )}

          <button
            onClick={onOpenShopInfo}
            className="flex items-center gap-1 text-[11px] uppercase font-bold text-[#FACC15] hover:underline cursor-pointer shrink-0"
          >
            <MapPin className="w-3 h-3" />
            <span>{shopInfo.openHours || '10:00-20:00'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Brand - Bold Typography Style */}
      <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
        <div 
          onClick={() => setActiveTab('book')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#1C1F26] border-2 border-[#FACC15]/40 group-hover:border-[#FACC15] transition-all flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105">
            <img 
              src={shopInfo.logoUrl || '/logo.jpg'} 
              alt={shopInfo.name || 'Big Bang Barber'} 
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to stylized text if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-black text-xl text-[#FACC15] absolute">
              BB
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-[0.9] uppercase italic font-heading">
              {shopInfo.name || 'Big Bang'}<span className="text-[#FACC15] ml-1.5">Barber</span>
            </h1>
            <p className="mt-1 text-gray-400 font-bold tracking-widest text-[9px] uppercase truncate max-w-[200px]">
              {shopInfo.tagline || 'Premium Grooming & Style Studio'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQuickWalkIn && (
            <button
              type="button"
              onClick={onOpenQuickWalkIn}
              className="h-10 px-3 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:from-[#FDE047] hover:to-[#FACC15] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
              title="เพิ่มคิว Walk-in หน้าร้าน"
            >
              <Zap className="w-4 h-4 fill-black stroke-black" />
              <span className="font-heading">+ Walk-in</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-[#FACC15] hover:border-[#FACC15] flex items-center justify-center transition-all cursor-pointer active:scale-95 group relative"
            title="ตั้งค่าระบบร้าน (Settings)"
          >
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            <span className="sr-only">ตั้งค่า</span>
          </button>

          <a
            href={`tel:${shopInfo.phone}`}
            className="w-10 h-10 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-[#FACC15] hover:border-[#FACC15] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="โทรสอบถามร้าน"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="max-w-md mx-auto px-2.5 pb-2.5">
        <div className="grid grid-cols-4 gap-1 bg-[#121418] p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[10px] sm:text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">จองคิว</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[10px] sm:text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'my-bookings'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">เช็คคิว</span>
          </button>

          <button
            onClick={() => setActiveTab('queue-board')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[10px] sm:text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer relative ${
              activeTab === 'queue-board'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">คิวช่าง</span>
            {totalActiveBookingsToday > 0 && (
              <span className={`px-1 py-0.1 rounded-full text-[8px] font-black ${
                activeTab === 'queue-board' ? 'bg-black text-[#FACC15]' : 'bg-[#FACC15] text-black'
              }`}>
                {totalActiveBookingsToday}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[10px] sm:text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">การเงิน/คอม</span>
          </button>
        </div>
      </div>
    </header>
  );
};
