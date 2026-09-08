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
  shopInfo?: ShopInfo;
  isAdminUnlocked?: boolean;
  onToggleAdminLock?: () => void;
  staffPin?: string;
  onOpenSecuritySettings?: () => void;
  onOpenQrSettings?: () => void;
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
  onOpenSecuritySettings,
  onOpenQrSettings
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Top Status Bar */}
      <div className="bg-[#121418] border-b border-white/5 text-gray-300 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-400 tracking-tight">
            เปิดรับจองคิวออนไลน์ 24 ชม.
          </span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            หน้าร้าน 10:00 - 20:00 น.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick QR Settings Button */}
          {onOpenQrSettings && (
            <button
              type="button"
              onClick={onOpenQrSettings}
              className="flex items-center gap-1 text-[10px] font-bold text-[#FACC15] hover:text-yellow-300 bg-[#FACC15]/10 hover:bg-[#FACC15]/20 border border-[#FACC15]/30 px-2.5 py-0.5 rounded-full transition-all cursor-pointer active:scale-95"
              title="เปลี่ยน QR Code รับเงิน (ในตั้งค่า)"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>QR รับเงิน</span>
            </button>
          )}

          {onToggleAdminLock && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleAdminLock}
                className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  isAdminUnlocked
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
                title={isAdminUnlocked ? 'คลิกเพื่อล็อกโหมดผู้ดูแล (Admin Mode)' : 'คลิกเพื่อปลดล็อกโหมดผู้ดูแล (ใส่ PIN)'}
              >
                {isAdminUnlocked ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>ADMIN ปลดล็อก</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>LOCKED</span>
                  </>
                )}
              </button>
            </div>
          )}

          <button
            onClick={onOpenShopInfo}
            className="flex items-center gap-1 text-[11px] font-bold text-[#FACC15] hover:underline cursor-pointer shrink-0"
          >
            <MapPin className="w-3 h-3" />
            <span>{shopInfo?.openHours || '10:00-20:00'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          onClick={() => setActiveTab('book')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#1C1F26] border-2 border-[#FACC15]/40 group-hover:border-[#FACC15] transition-all flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105">
            <img 
              src={shopInfo?.logoUrl || '/logo.jpg'} 
              alt={shopInfo?.name || 'Big Bang Barber'} 
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-black text-xl text-[#FACC15] absolute">
              BB
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-[0.95] uppercase italic font-heading">
              {shopInfo?.name || 'Big Bang'}<span className="text-[#FACC15] ml-1.5">Barber</span>
            </h1>
            <p className="mt-1 text-gray-400 font-bold tracking-wider text-[10px] uppercase truncate max-w-[200px]">
              {shopInfo?.tagline || 'Premium Grooming Studio'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQuickWalkIn && (
            <button
              type="button"
              onClick={onOpenQuickWalkIn}
              className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:from-[#FDE047] hover:to-[#FACC15] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
              title="เพิ่มคิวด่วน Walk-in หน้าร้าน"
            >
              <Zap className="w-4 h-4 fill-black stroke-black" />
              <span className="font-heading">+ คิวด่วน</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-[#FACC15] hover:border-[#FACC15] flex items-center justify-center transition-all cursor-pointer active:scale-95 group relative"
            title="ตั้งค่าระบบร้าน (Settings & QR Code)"
          >
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            <span className="sr-only">ตั้งค่า</span>
          </button>

          <a
            href={shopInfo?.phone ? `tel:${shopInfo.phone}` : 'tel:0897654321'}
            className="w-10 h-10 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-[#FACC15] hover:border-[#FACC15] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="โทรติดต่อร้าน"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="max-w-md mx-auto px-3 pb-2.5">
        <div className="grid grid-cols-4 gap-1.5 bg-[#121418] p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'my-bookings'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">คิวของฉัน</span>
          </button>

          <button
            onClick={() => setActiveTab('queue-board')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer relative ${
              activeTab === 'queue-board'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">กระดานคิว</span>
            {totalActiveBookingsToday > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeTab === 'queue-board' ? 'bg-black text-[#FACC15]' : 'bg-[#FACC15] text-black'
              }`}>
                {totalActiveBookingsToday}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`py-2 px-1 rounded-xl font-bold uppercase text-[11px] tracking-tight transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-[#FACC15] text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">การเงิน</span>
          </button>
        </div>
      </div>
    </header>
  );
};
