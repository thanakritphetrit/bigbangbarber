import React from 'react';
import { X, MapPin, Phone, Clock, Instagram, MessageCircle, ExternalLink, Wifi, Coffee, Car, Shield, Sparkles } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';

interface ShopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopInfoModal: React.FC<ShopInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-br from-amber-600 to-stone-900 px-5 py-4 flex items-start justify-between text-stone-950">
          <div>
            <h3 className="font-extrabold text-lg font-heading text-stone-950">
              BIGBANG<span className="text-amber-100">BARBER</span>
            </h3>
            <p className="text-xs font-semibold text-stone-900">ทองหล่อ • Modern Gentlemen Grooming</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-950/30 hover:bg-stone-950/50 text-stone-950 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Address */}
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800 space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-200 block text-sm mb-0.5">ที่ตั้งร้าน</span>
                <p className="text-stone-300 leading-relaxed">{SHOP_INFO.address}</p>
                <a
                  href={SHOP_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <span>เปิด Google Maps นำทาง</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Time & Contacts */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800 space-y-1">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] text-stone-500 block">เวลาเปิด-ปิด</span>
              <span className="font-bold text-stone-200 block">10:00 - 20:00 น.</span>
              <span className="text-[10px] text-emerald-400 block">เปิดบริการทุกวัน</span>
            </div>

            <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800 space-y-1">
              <Phone className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] text-stone-500 block">เบอร์โทรศัพท์</span>
              <a href={`tel:${SHOP_INFO.phone}`} className="font-bold text-amber-400 block font-mono hover:underline">
                {SHOP_INFO.phone}
              </a>
              <span className="text-[10px] text-stone-400 block">โทรสอบถาม/เลื่อนคิว</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800 space-y-2 text-xs">
            <span className="font-bold text-stone-300 block">ช่องทางออนไลน์</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <Instagram className="w-4 h-4 text-pink-400" />
                <div>
                  <span className="text-[10px] text-stone-500 block">Instagram</span>
                  <span className="text-stone-200 font-medium">{SHOP_INFO.instagram}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-stone-500 block">LINE Official</span>
                  <span className="text-stone-200 font-medium">{SHOP_INFO.lineId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities / Amenities */}
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800 space-y-2">
            <span className="text-xs font-bold text-stone-300 block">สิ่งอำนวยความสะดวก</span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center gap-1">
                <Wifi className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-stone-300">Free Wi-Fi</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center gap-1">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-stone-300">เครื่องดื่มฟรี</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center gap-1">
                <Car className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-stone-300">ที่จอดรถหน้าร้าน</span>
              </div>
            </div>
          </div>

          {/* Rules & Payment */}
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-300/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>การชำระเงิน & ข้อตกลง</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              รองรับเงินสด, โอนผ่านพร้อมเพย์ (PromptPay), และบัตรเครดิตทุกธนาคาร ไม่มีค่าธรรมเนียม
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 bg-stone-950 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
