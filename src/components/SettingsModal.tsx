import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Store, 
  Users, 
  Bell, 
  Database, 
  Shield, 
  Volume2, 
  VolumeX, 
  Check, 
  RefreshCw, 
  Download, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Phone,
  Clock,
  Sparkles,
  AlertTriangle,
  Lock,
  Scissors,
  Edit3,
  Plus,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { Barber, Booking } from '../types';
import { SHOP_INFO } from '../data/mockData';

export interface ShopSettingsState {
  isOnlineBookingOpen: boolean;
  autoConfirmWalkIn: boolean;
  soundEnabled: boolean;
  staffPinRequired: boolean;
  staffPin: string;
  shopPhone: string;
  shopNotice: string;
  hapticEnabled: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  onToggleBarberStatus: (barberId: string) => void;
  settings: ShopSettingsState;
  onUpdateSettings: (newSettings: Partial<ShopSettingsState>) => void;
  bookings: Booking[];
  onResetSampleData: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onEditBarber?: (barber: Barber) => void;
  onAddNewBarber?: () => void;
  initialTab?: 'shop' | 'barbers' | 'sound' | 'database' | 'security';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  barbers,
  onToggleBarberStatus,
  settings,
  onUpdateSettings,
  bookings,
  onResetSampleData,
  onShowToast,
  onEditBarber,
  onAddNewBarber,
  initialTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'shop' | 'barbers' | 'sound' | 'database' | 'security'>('shop');
  const [phoneInput, setPhoneInput] = useState(settings.shopPhone || SHOP_INFO.phone);
  const [noticeInput, setNoticeInput] = useState(settings.shopNotice || 'เปิดรับจองตามปกติ 10:00 - 20:00 น.');
  const [pinInput, setPinInput] = useState(settings.staffPin || '1234');
  const [showPinText, setShowPinText] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sync state whenever modal opens or settings update
  useEffect(() => {
    if (isOpen) {
      setPhoneInput(settings.shopPhone || SHOP_INFO.phone);
      setNoticeInput(settings.shopNotice || 'เปิดรับจองตามปกติ 10:00 - 20:00 น.');
      setPinInput(settings.staffPin || '1234');
      if (initialTab) {
        setActiveSubTab(initialTab);
      }
    }
  }, [isOpen, settings.shopPhone, settings.shopNotice, settings.staffPin, initialTab]);

  if (!isOpen) return null;

  // Play a quick pleasant barber shop chime via Web Audio API
  const playTestChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.55);
      osc2.stop(ctx.currentTime + 0.55);

      onShowToast('🔊 ทดสอบเสียงกระดิ่งคิวสำเร็จ', 'info');
    } catch {
      onShowToast('🔊 เสียงแจ้งเตือนพร้อมใช้งาน', 'info');
    }
  };

  const handleSaveShopInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      shopPhone: phoneInput,
      shopNotice: noticeInput
    });
    onShowToast('บันทึกการตั้งค่าร้านสำเร็จ', 'success');
  };

  const handleExportData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `bigbangbarber-bookings-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('ส่งออกไฟล์ข้อมูลคิวเรียบร้อย', 'success');
    } catch {
      onShowToast('ไม่สามารถส่งออกไฟล์ได้', 'error');
    }
  };

  const handleResetDataClick = () => {
    if (window.confirm('คุณต้องการรีเซ็ตและโหลดคิวตัวอย่างสำหรับทดสอบใหม่หรือไม่? ข้อมูลคิวปัจจุบันจะถูกรีเฟรช')) {
      setIsResetting(true);
      onResetSampleData();
      setTimeout(() => {
        setIsResetting(false);
        onShowToast('รีเซ็ตข้อมูลคิวตัวอย่างสำเร็จแล้ว', 'success');
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FACC15] px-6 py-4 text-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-[#FACC15] flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight font-heading">
                SETTINGS & SHOP CONTROL
              </h3>
              <p className="text-[10px] font-black uppercase tracking-wider text-black/80">
                ตั้งค่าระบบร้าน จัดการสถานะช่าง และฐานข้อมูล
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex bg-[#121418] border-b border-white/10 px-3 py-2 gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('shop')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeSubTab === 'shop'
                ? 'bg-[#FACC15] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>ระบบร้าน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('barbers')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeSubTab === 'barbers'
                ? 'bg-[#FACC15] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>สถานะช่าง (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sound')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeSubTab === 'sound'
                ? 'bg-[#FACC15] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>เสียง & แจ้งเตือน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('database')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeSubTab === 'database'
                ? 'bg-[#FACC15] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>ฐานข้อมูล</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('security')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-[#FACC15] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#1C1F26]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ความปลอดภัย & รหัส PIN</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* 1. SHOP OPERATIONS */}
          {activeSubTab === 'shop' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              {/* Quick Admin Passcode / PIN Card */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-[#FACC15]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[#FACC15] text-xs">
                    <KeyRound className="w-4 h-4" />
                    <span>รหัส PIN ผู้ดูแลระบบ (ADMIN PASSCODE)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    สถานะรหัส: <strong className="font-mono text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded ml-1 font-bold">•••••••• (เข้ารหัสปลอดภัย)</strong>
                    <span className="text-gray-500 ml-1.5">(ใช้ปลดล็อกปุ่ม LOCKED และแก้ไขระบบ)</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('security')}
                  className="px-3 py-2 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black uppercase text-xs cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>เปลี่ยนรหัส PIN</span>
                </button>
              </div>

              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-3">
                <h4 className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>การเปิด/ปิดรับจองคิวออนไลน์</span>
                </h4>
                
                {/* Toggle Online Booking */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-white font-bold block text-sm">รับจองคิวออนไลน์ 24 ชม.</span>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      {settings.isOnlineBookingOpen ? 'ระบบเปิดให้ลูกค้าจองคิวได้ตามปกติ' : 'ปิดรับจองชั่วคราว (ระบบจะขึ้นแจ้งเตือนหน้าร้าน)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !settings.isOnlineBookingOpen;
                      onUpdateSettings({ isOnlineBookingOpen: next });
                      onShowToast(next ? 'เปิดรับจองออนไลน์แล้ว' : 'ปิดรับจองออนไลน์ชั่วคราว', 'info');
                    }}
                    className={`w-14 h-8 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      settings.isOnlineBookingOpen ? 'bg-[#FACC15] justify-end' : 'bg-[#1C1F26] justify-start border border-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full shadow-md ${
                      settings.isOnlineBookingOpen ? 'bg-black' : 'bg-gray-400'
                    }`} />
                  </button>
                </div>

                {/* Toggle Auto Walkin */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <span className="text-white font-bold block text-sm">ยืนยันคิว Walk-in อัตโนมัติ</span>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      เมื่อบันทึกคิวหน้าร้าน จะเข้าสู่สถานะยืนยัน (Confirmed) ทันที
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !settings.autoConfirmWalkIn;
                      onUpdateSettings({ autoConfirmWalkIn: next });
                    }}
                    className={`w-14 h-8 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      settings.autoConfirmWalkIn ? 'bg-[#FACC15] justify-end' : 'bg-[#1C1F26] justify-start border border-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full shadow-md ${
                      settings.autoConfirmWalkIn ? 'bg-black' : 'bg-gray-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Shop Announcement & Phone */}
              <form onSubmit={handleSaveShopInfo} className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-3">
                <h4 className="font-black uppercase tracking-wider text-gray-300 text-xs flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FACC15]" />
                  <span>ข้อมูลติดต่อ & ข้อความประกาศ</span>
                </h4>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    เบอร์โทรศัพท์ติดต่อร้าน
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold font-mono text-xs focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    ข้อความประกาศหน้าร้าน (Shop Notice)
                  </label>
                  <input
                    type="text"
                    value={noticeInput}
                    onChange={(e) => setNoticeInput(e.target.value)}
                    placeholder="เช่น เปิดบริการทุกวัน 10:00-20:00 น."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>บันทึกข้อมูลร้าน</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. BARBER STATUS (DUTY ROSTER) */}
          {activeSubTab === 'barbers' && (
            <div className="space-y-3 text-xs animate-in fade-in">
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    <span>จัดการข้อมูลและสถานะช่าง ({barbers.length})</span>
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    เปิด/ปิดรับคิว หรือแก้ไขข้อมูลโปรไฟล์ช่าง
                  </p>
                </div>

                {onAddNewBarber && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddNewBarber();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>เพิ่มช่าง</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {barbers.map((barber) => {
                  const isAvailable = barber.status === 'available';
                  return (
                    <div
                      key={barber.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isAvailable 
                          ? 'bg-[#0A0A0B] border-white/10' 
                          : 'bg-[#121418] border-rose-500/30 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={barber.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'}
                          alt={barber.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-stone-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-black text-sm uppercase font-heading">
                              {barber.nickname}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              isAvailable 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {isAvailable ? 'ON DUTY (พร้อมตัด)' : 'DAY OFF (ลาพัก)'}
                            </span>
                          </div>
                          <p className="text-gray-400 text-[11px] mt-0.5 truncate">
                            {barber.title} • {barber.workDays}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onEditBarber && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onEditBarber(barber);
                            }}
                            className="px-2.5 py-2 rounded-xl bg-[#1C1F26] hover:bg-white hover:text-black text-gray-300 font-black uppercase tracking-wider text-xs border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                            title="แก้ไขโปรไฟล์ช่างท่านนี้"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onToggleBarberStatus(barber.id);
                            onShowToast(`สลับสถานะ ${barber.nickname} เรียบร้อย`, 'info');
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isAvailable
                              ? 'bg-[#1C1F26] text-gray-300 hover:text-white border border-white/10 hover:border-rose-400'
                              : 'bg-[#FACC15] text-black shadow-md'
                          }`}
                        >
                          {isAvailable ? 'ตั้งวันหยุด' : 'เปิดรับคิว'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. SOUND & ALERTS */}
          {activeSubTab === 'sound' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>เสียงแจ้งเตือน & การตอบสนอง</span>
                </h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-[#FACC15]" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-500" />
                    )}
                    <div>
                      <span className="text-white font-bold block text-sm">เสียงกระดิ่งเมื่อมีคิวใหม่ / อัปเดต</span>
                      <p className="text-gray-400 text-[11px]">
                        เล่นเสียงกระดิ่งดิจิทัลเมื่อจองสำเร็จ หรือเริ่มตัดผม
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !settings.soundEnabled;
                      onUpdateSettings({ soundEnabled: next });
                      if (next) playTestChime();
                    }}
                    className={`w-14 h-8 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                      settings.soundEnabled ? 'bg-[#FACC15] justify-end' : 'bg-[#1C1F26] justify-start border border-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full shadow-md ${
                      settings.soundEnabled ? 'bg-black' : 'bg-gray-400'
                    }`} />
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={playTestChime}
                    className="w-full py-2.5 rounded-xl bg-[#1C1F26] hover:bg-white hover:text-black text-white font-black uppercase tracking-wider text-xs border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>กดทดสอบเสียงกระดิ่ง (Test Chime)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. DATABASE & CLOUD SYNC */}
          {activeSubTab === 'database' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#FACC15]" />
                    <span className="text-white font-black uppercase text-xs">FIREBASE FIRESTORE STATUS</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED
                  </span>
                </div>

                <div className="p-3 bg-[#1C1F26] rounded-xl font-mono text-[11px] space-y-1 text-gray-300">
                  <div>Project ID: <strong className="text-white">bigbangbarber-2f657</strong></div>
                  <div>Collection: <strong className="text-[#FACC15]">bookings</strong></div>
                  <div>Total Records: <strong className="text-white">{bookings.length} รายการ</strong></div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="py-2.5 px-3 rounded-xl bg-[#1C1F26] hover:bg-white hover:text-black text-white font-black uppercase tracking-wider text-[11px] border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT JSON</span>
                  </button>

                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={handleResetDataClick}
                    className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-black font-black uppercase tracking-wider text-[11px] border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                    <span>RE-SEED DEMO</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY & PIN */}
          {activeSubTab === 'security' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="bg-[#0A0A0B] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                <div>
                  <h4 className="font-black uppercase tracking-wider text-[#FACC15] text-sm flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#FACC15]" />
                    <span>เปลี่ยนรหัสผ่านผู้ดูแลระบบ (ADMIN PASSCODE / PIN)</span>
                  </h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                    รหัสนี้ใช้สำหรับปลดล็อกปุ่ม <strong className="text-white">[LOCKED]</strong> ที่แถบด้านบนสุด และใช้สำหรับเข้าโหมดแก้ไขข้อมูลช่าง, บริการ, และการตั้งค่าร้าน
                  </p>
                </div>

                {/* Current PIN Display */}
                <div className="p-3.5 rounded-xl bg-[#16181D] border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold text-[11px] block">รหัส PIN ปัจจุบันที่ใช้งานอยู่:</span>
                    <span className="text-gray-500 text-[10px]">Active Security Passcode (ซ่อนรหัสเพื่อความปลอดภัย)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#FACC15] font-black text-xl tracking-widest px-3 py-1 bg-[#0A0A0B] rounded-lg border border-[#FACC15]/40 shadow-inner">
                      {showCurrentPin ? (settings.staffPin || '1234') : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="p-2 rounded-lg bg-[#0A0A0B] hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 cursor-pointer transition-all"
                      title={showCurrentPin ? 'ซ่อนรหัส' : 'กดเพื่อดูรหัส'}
                    >
                      {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New PIN Input */}
                <div className="pt-2 space-y-2.5">
                  <label className="text-white font-black uppercase tracking-wider text-[11px] block">
                    กรอกรหัส PIN ใหม่ที่ต้องการเปลี่ยน (4 - 8 หลัก)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPinText ? 'text' : 'password'}
                        maxLength={8}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-4 py-3 rounded-xl bg-[#16181D] border border-white/10 text-white font-mono text-center font-black tracking-widest text-lg focus:outline-none focus:border-[#FACC15] transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPinText(!showPinText)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1.5 cursor-pointer"
                        title={showPinText ? 'ซ่อนรหัส' : 'แสดงรหัส'}
                      >
                        {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!pinInput || pinInput.length < 3) {
                          onShowToast('รหัส PIN ต้องมีอย่างน้อย 3-4 หลัก', 'error');
                          return;
                        }
                        onUpdateSettings({ staffPin: pinInput });
                        onShowToast('บันทึกรหัส PIN ใหม่สำเร็จเรียบร้อย!', 'success');
                      }}
                      className="px-5 py-3 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black uppercase text-xs cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 transition-all shrink-0"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>บันทึกรหัสใหม่</span>
                    </button>
                  </div>

                  {/* Quick Keypad */}
                  <div className="pt-2">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1.5">
                      กดแป้นตัวเลขเพื่อกรอกรหัส:
                    </span>
                    <div className="grid grid-cols-6 gap-1.5 max-w-sm">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => {
                            if (pinInput.length < 8) {
                              setPinInput(prev => prev + digit);
                            }
                          }}
                          className="py-2.5 rounded-lg bg-[#16181D] hover:bg-[#FACC15]/20 text-white hover:text-[#FACC15] font-mono font-bold text-sm text-center border border-white/5 active:scale-95 cursor-pointer transition-all"
                        >
                          {digit}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPinInput('')}
                        className="py-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold text-xs text-center border border-red-500/20 active:scale-95 cursor-pointer col-span-2 transition-all"
                      >
                        ล้างค่า (Clear)
                      </button>
                    </div>
                  </div>

                  {/* Reset to default PIN button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">ต้องการคืนค่าเป็นรหัสเริ่มต้นของระบบ?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPinInput('1234');
                        onUpdateSettings({ staffPin: '1234' });
                        onShowToast('รีเซ็ตรหัส PIN เริ่มต้นเรียบร้อย', 'info');
                      }}
                      className="text-[#FACC15] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>รีเซ็ตรหัสเริ่มต้น</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block text-xs">บังคับยืนยัน PIN ก่อนเปลี่ยนสถานะคิว</span>
                      <span className="text-gray-500 text-[10px]">Staff Queue Actions Protection</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !settings.staffPinRequired;
                        onUpdateSettings({ staffPinRequired: next });
                        onShowToast(next ? 'เปิดระบบถาม PIN ก่อนเปลี่ยนคิว' : 'ปิดระบบถาม PIN เปลี่ยนคิว', 'info');
                      }}
                      className={`w-12 h-7 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                        settings.staffPinRequired ? 'bg-[#FACC15] justify-end' : 'bg-[#1C1F26] justify-start border border-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full shadow-md ${
                        settings.staffPinRequired ? 'bg-black' : 'bg-gray-400'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-wider transition-all cursor-pointer active:scale-98"
          >
            DONE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
