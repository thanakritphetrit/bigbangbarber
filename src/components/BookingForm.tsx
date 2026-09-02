import React from 'react';
import { User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { formatPhoneNumber } from '../utils/dateHelpers';

interface BookingFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerNote: string;
  setCustomerNote: (note: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerNote,
  setCustomerNote
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(raw);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-end">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-black text-xs flex items-center justify-center font-black">
            5
          </span>
          <span>Customer Information</span>
        </h3>
        <span className="text-xs text-[#FACC15] uppercase font-bold tracking-wider">
          Direct Sync
        </span>
      </div>

      <div className="space-y-3.5 bg-[#1C1F26] p-5 rounded-3xl border border-white/10 shadow-xl">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>ชื่อผู้จอง / ชื่อเล่น <span className="text-[#FACC15]">*</span></span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="เช่น คุณกอล์ฟ หรือ อภิชาติ"
            className="w-full px-4 py-3 rounded-xl bg-[#0A0A0B] border border-white/10 text-white placeholder-gray-600 text-sm font-semibold focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-all"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>เบอร์โทรศัพท์มือถือ <span className="text-[#FACC15]">*</span></span>
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-mono">10 DIGITS</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formatPhoneNumber(customerPhone)}
              onChange={handlePhoneChange}
              placeholder="08X-XXX-XXXX"
              maxLength={12}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A0B] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-all font-mono font-bold"
            />
            {customerPhone.length === 10 && (
              <span className="absolute right-3 top-3 text-[10px] font-black uppercase text-black bg-[#FACC15] px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
              </span>
            )}
          </div>
        </div>

        {/* Notes / Special Request */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>หมายเหตุ / ทรงผมที่ต้องการเป็นพิเศษ (ถ้ามี)</span>
          </label>
          <textarea
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="เช่น มีรูปตัวอย่างมาให้ดู, แพ้น้ำยาย้อม, หรือระบุทรงเฉพาะ"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};
