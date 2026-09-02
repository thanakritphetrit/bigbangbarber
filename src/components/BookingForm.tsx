import React from 'react';
import { User, Phone, MessageSquare, Tag, ShieldCheck } from 'lucide-react';
import { formatPhoneNumber } from '../utils/dateHelpers';

interface BookingFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerNote: string;
  setCustomerNote: (note: string) => void;
}

const QUICK_TAGS = [
  'เฟดกริบเบอร์ 0',
  'เอาความยาวออกนิดเดียว',
  'ทรง Two-Block เกาหลี',
  'เซ็ตทรงวินเทจ',
  'กันขอบคมๆ',
  'ดัดวอลลุ่มครั้งแรก'
];

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

  const handleAddTag = (tag: string) => {
    if (!customerNote.includes(tag)) {
      const newNote = customerNote ? `${customerNote}, ${tag}` : tag;
      setCustomerNote(newNote);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold border border-amber-500/30">
            5
          </span>
          <span>ข้อมูลสำหรับติดต่อ (Customer Info)</span>
        </label>
        <span className="text-xs text-amber-400/90 font-medium">บันทึกลงระบบทันที</span>
      </div>

      <div className="space-y-3 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>ชื่อผู้จอง / ชื่อเล่น <span className="text-rose-400">*</span></span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="เช่น คุณกอล์ฟ หรือ อภิชาติ"
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>เบอร์โทรศัพท์มือถือ <span className="text-rose-400">*</span></span>
            </span>
            <span className="text-[10px] text-stone-400">ใช้สำหรับค้นหาและเช็คคิว</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formatPhoneNumber(customerPhone)}
              onChange={handlePhoneChange}
              placeholder="08X-XXX-XXXX"
              maxLength={12}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
            {customerPhone.length === 10 && (
              <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ถูกต้อง
              </span>
            )}
          </div>
        </div>

        {/* Notes / Special Request */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>ความต้องการเพิ่มเติม / ทรงผมที่ชอบ (ถ้ามี)</span>
          </label>
          <textarea
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="เช่น มีรูปตัวอย่างมาให้ดู, แพ้น้ำยาย้อม, หรือระบุทรงเฉพาะ"
            rows={2}
            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />

          {/* Quick style tags */}
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="text-[10px] text-stone-500 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> แตะเพื่อเพิ่ม:
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-stone-700 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
