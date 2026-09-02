import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  MessageCircle, 
  ExternalLink, 
  Wifi, 
  Coffee, 
  Car, 
  Shield, 
  Edit3, 
  Check, 
  RotateCcw, 
  Globe, 
  Save,
  Sparkles
} from 'lucide-react';
import { ShopInfo } from '../types';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockData';

interface ShopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopInfo: ShopInfo;
  onUpdateShopInfo: (updated: ShopInfo) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequireAuth?: (onSuccess: () => void, title?: string, description?: string) => void;
  isAdmin?: boolean;
}

export const ShopInfoModal: React.FC<ShopInfoModalProps> = ({ 
  isOpen, 
  onClose,
  shopInfo,
  onUpdateShopInfo,
  onShowToast,
  onRequireAuth,
  isAdmin = false
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ShopInfo>(shopInfo);

  // Sync form data when modal opens or shopInfo prop changes
  useEffect(() => {
    setFormData(shopInfo);
    setIsEditing(false);
  }, [shopInfo, isOpen]);

  if (!isOpen) return null;

  const handleStartEdit = () => {
    if (isAdmin) {
      setIsEditing(true);
    } else if (onRequireAuth) {
      onRequireAuth(
        () => setIsEditing(true),
        'เข้าสู่โหมดแก้ไขข้อมูลร้าน',
        'กรอกรหัส PIN เพื่อแก้ไขข้อมูลที่อยู่ เบอร์โทร และรายละเอียดร้าน'
      );
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShopInfo(formData);
    setIsEditing(false);
    if (onShowToast) {
      onShowToast('บันทึกข้อมูลร้านเรียบร้อยแล้ว', 'success');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลร้านกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setFormData(DEFAULT_SHOP_INFO);
      onUpdateShopInfo(DEFAULT_SHOP_INFO);
      setIsEditing(false);
      if (onShowToast) {
        onShowToast('รีเซ็ตข้อมูลร้านเป็นค่าเริ่มต้นแล้ว', 'info');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#FACC15] px-6 py-4 flex items-center justify-between text-black shrink-0">
          <div>
            <h3 className="font-black text-xl font-heading tracking-tight text-black flex items-center gap-1.5 uppercase">
              {isEditing ? 'EDIT SHOP INFO' : (shopInfo.name || 'BIGBANG BARBER')}
            </h3>
            <p className="text-xs font-black uppercase tracking-wider text-black/80">
              {isEditing ? 'แก้ไขข้อมูลและช่องทางติดต่อร้าน' : (shopInfo.tagline || 'THONGLOR • GENTLEMEN GROOMING')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-3 py-1.5 rounded-xl bg-black text-[#FACC15] hover:bg-black/80 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                title="แก้ไขข้อมูลร้าน"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>แก้ไข</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData(shopInfo);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-black/15 hover:bg-black/25 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                ยกเลิก
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isEditing ? (
            /* ================= EDIT MODE FORM ================= */
            <form id="shop-info-edit-form" onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>ชื่อร้าน & สโลแกน</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[10px] text-gray-400 hover:text-[#FACC15] flex items-center gap-1 cursor-pointer font-bold uppercase"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>คืนค่าเริ่มต้น</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    ชื่อร้าน (Shop Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-black text-xs focus:outline-none focus:border-[#FACC15]"
                    placeholder="BIGBANG BARBER"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    สโลแกน / สาขา (Tagline)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                    placeholder="THONGLOR • GENTLEMEN GROOMING"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    ลิงก์รูปโลโก้ร้าน (Logo Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FACC15]"
                    placeholder="/logo.jpg หรือ https://..."
                  />
                </div>
              </div>

              {/* Address & Maps */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="font-black uppercase tracking-wider text-gray-300 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FACC15]" />
                  <span>ที่ตั้ง & แผนที่ Google Maps</span>
                </span>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    ที่อยู่ร้าน (Address)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15] resize-none"
                    placeholder="142/8 ถนนสุขุมวิท ซอย 55 (ทองหล่อ)..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    ลิงก์ Google Maps Navigation
                  </label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FACC15]"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>

              {/* Time & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-300 font-black uppercase text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>เวลาเปิด-ปิด</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                    placeholder="10:00 - 20:00"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                  />
                  <input
                    type="text"
                    value={formData.openDaysText}
                    onChange={(e) => setFormData({ ...formData, openDaysText: e.target.value })}
                    placeholder="OPEN EVERYDAY"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-emerald-400 font-bold text-[10px] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-300 font-black uppercase text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>เบอร์โทรศัพท์</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="089-765-4321"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-[#FACC15] font-mono font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                  />
                  <span className="text-[10px] text-gray-500 font-bold block pt-1">
                    ใช้สำหรับปุ่มโทรด่วน
                  </span>
                </div>
              </div>

              {/* Online Channels */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="font-black uppercase tracking-wider text-gray-300 text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#FACC15]" />
                  <span>ช่องทางติดต่อออนไลน์</span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@bigbangbarber.bkk"
                      className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>LINE ID</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lineId}
                      onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                      placeholder="@bigbangbarber"
                      className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Toggles */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                  สิ่งอำนวยความสะดวก (AMENITIES)
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasWifi: !formData.hasWifi })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.hasWifi 
                        ? 'bg-[#1C1F26] border-[#FACC15] text-[#FACC15]' 
                        : 'bg-[#0A0A0B] border-white/5 text-gray-500'
                    }`}
                  >
                    <Wifi className="w-4 h-4" />
                    <span className="text-[10px] font-bold">FREE WI-FI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasBeverages: !formData.hasBeverages })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.hasBeverages 
                        ? 'bg-[#1C1F26] border-[#FACC15] text-[#FACC15]' 
                        : 'bg-[#0A0A0B] border-white/5 text-gray-500'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span className="text-[10px] font-bold">BEVERAGES</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasParking: !formData.hasParking })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.hasParking 
                        ? 'bg-[#1C1F26] border-[#FACC15] text-[#FACC15]' 
                        : 'bg-[#0A0A0B] border-white/5 text-gray-500'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span className="text-[10px] font-bold">PARKING</span>
                  </button>
                </div>
              </div>

              {/* Policies & Payments */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-2">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>นโยบายการชำระเงิน (Payments & Policies)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.policyNote || ''}
                  onChange={(e) => setFormData({ ...formData, policyNote: e.target.value })}
                  placeholder="รองรับเงินสด, พร้อมเพย์, บัตรเครดิต..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15] resize-none"
                />
              </div>
            </form>
          ) : (
            /* ================= VIEW MODE ================= */
            <>
              {/* Shop Logo & Visual Banner */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1C1F26] border-2 border-[#FACC15]/40 flex items-center justify-center shrink-0 shadow-lg">
                  <img 
                    src={shopInfo.logoUrl || '/logo.jpg'} 
                    alt={shopInfo.name || 'Big Bang Barber'} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="font-black text-2xl text-[#FACC15] absolute">BB</span>
                </div>
                <div>
                  <h4 className="font-black text-lg text-white uppercase font-heading tracking-tight">
                    {shopInfo.name || 'BIGBANG BARBER'}
                  </h4>
                  <p className="text-xs text-[#FACC15] font-bold uppercase tracking-wider">
                    {shopInfo.tagline || 'THONGLOR • GENTLEMEN GROOMING'}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>เชื่อมต่อระบบ Firebase Realtime</span>
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-white block text-sm uppercase tracking-wider mb-0.5">LOCATION / ADDRESS</span>
                    <p className="text-gray-300 leading-relaxed font-medium">{shopInfo.address}</p>
                    {shopInfo.googleMapsUrl && (
                      <a
                        href={shopInfo.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#FACC15] hover:text-yellow-300 font-bold uppercase tracking-wider"
                      >
                        <span>OPEN GOOGLE MAPS NAVIGATION</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Time & Contacts */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <Clock className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">HOURS</span>
                  <span className="font-black text-white block text-sm font-heading">{shopInfo.openHours || '10:00 - 20:00'}</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">{shopInfo.openDaysText || 'OPEN EVERYDAY'}</span>
                </div>

                <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <Phone className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">PHONE</span>
                  <a href={`tel:${shopInfo.phone}`} className="font-black text-[#FACC15] block font-mono text-sm hover:underline">
                    {shopInfo.phone}
                  </a>
                  <span className="text-[10px] text-gray-400 font-bold block">CALL DIRECT</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-2.5 text-xs">
                <span className="font-black uppercase tracking-wider text-gray-400 block">ONLINE CHANNELS</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1C1F26] border border-white/5">
                    <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">INSTAGRAM</span>
                      <span className="text-white font-bold truncate block">{shopInfo.instagram || '@bigbangbarber.bkk'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1C1F26] border border-white/5">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">LINE ID</span>
                      <span className="text-white font-bold truncate block">{shopInfo.lineId || '@bigbangbarber'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilities / Amenities */}
              <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">AMENITIES & COMFORT</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                    shopInfo.hasWifi !== false ? 'bg-[#1C1F26] border-white/5 text-gray-200' : 'bg-[#0A0A0B] border-white/5 text-gray-600 opacity-50'
                  }`}>
                    <Wifi className={`w-4 h-4 ${shopInfo.hasWifi !== false ? 'text-[#FACC15]' : 'text-gray-600'}`} />
                    <span className="text-[11px] font-bold">FREE WI-FI</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                    shopInfo.hasBeverages !== false ? 'bg-[#1C1F26] border-white/5 text-gray-200' : 'bg-[#0A0A0B] border-white/5 text-gray-600 opacity-50'
                  }`}>
                    <Coffee className={`w-4 h-4 ${shopInfo.hasBeverages !== false ? 'text-[#FACC15]' : 'text-gray-600'}`} />
                    <span className="text-[11px] font-bold">BEVERAGES</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                    shopInfo.hasParking !== false ? 'bg-[#1C1F26] border-white/5 text-gray-200' : 'bg-[#0A0A0B] border-white/5 text-gray-600 opacity-50'
                  }`}>
                    <Car className={`w-4 h-4 ${shopInfo.hasParking !== false ? 'text-[#FACC15]' : 'text-gray-600'}`} />
                    <span className="text-[11px] font-bold">PARKING</span>
                  </div>
                </div>
              </div>

              {/* Rules & Payment */}
              <div className="p-3.5 bg-[#0A0A0B] rounded-2xl border border-[#FACC15]/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[#FACC15]">
                  <Shield className="w-4 h-4" />
                  <span>PAYMENTS & POLICIES</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                  {shopInfo.policyNote || 'รองรับเงินสด, โอนผ่านพร้อมเพย์ (PromptPay), และบัตรเครดิตทุกธนาคาร ไม่มีค่าธรรมเนียม'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/10 flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setFormData(shopInfo);
                  setIsEditing(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#1C1F26] hover:bg-[#252830] text-gray-300 hover:text-white font-black text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="submit"
                form="shop-info-edit-form"
                className="flex-2 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>SAVE CHANGES (บันทึก)</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3.5 rounded-2xl bg-[#1C1F26] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT DETAILS</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98"
              >
                CLOSE
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
