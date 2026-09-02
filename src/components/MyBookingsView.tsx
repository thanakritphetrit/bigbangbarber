import React, { useState } from 'react';
import { Booking } from '../types';
import { 
  Search, 
  Calendar, 
  Clock, 
  Scissors, 
  User, 
  ChevronRight, 
  AlertCircle, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Ticket
} from 'lucide-react';
import { formatThaiDate, formatPhoneNumber } from '../utils/dateHelpers';

interface MyBookingsViewProps {
  bookings: Booking[];
  onSelectBookingForTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onGoToBooking: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onSelectBookingForTicket,
  onCancelBooking,
  onGoToBooking
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const cleanSearch = searchPhone.replace(/\D/g, '');

  const filteredBookings = cleanSearch
    ? bookings.filter(b => b.customerPhone.replace(/\D/g, '').includes(cleanSearch))
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ยืนยันแล้ว
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Scissors className="w-3 h-3 animate-spin" /> กำลังตัดผม
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            เสร็จสิ้น
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> ยกเลิกแล้ว
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-800 text-stone-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Title */}
      <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <Ticket className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-stone-100 font-heading">
            ตรวจสอบคิวและประวัติการจอง (My Bookings)
          </h2>
        </div>
        <p className="text-xs text-stone-400">
          กรอกเบอร์โทรศัพท์ที่ใช้ตอนจอง เพื่อดูตั๋วคิว สถานะคิวสด หรือแก้ไขนัดหมาย
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-3.5 flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => {
                setSearchPhone(e.target.value);
                if (!hasSearched) setHasSearched(true);
              }}
              placeholder="กรอกเบอร์โทร เช่น 0812345678"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหา</span>
          </button>
        </form>
      </div>

      {/* Results */}
      {cleanSearch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span>ผลการค้นหาสำหรับ: <strong className="text-stone-200">{formatPhoneNumber(cleanSearch)}</strong></span>
            <span>พบ {filteredBookings.length} รายการ</span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 space-y-2">
              <AlertCircle className="w-8 h-8 text-stone-600 mx-auto" />
              <h4 className="text-sm font-bold text-stone-300">ไม่พบคิวการจองด้วยเบอร์นี้</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                โปรดตรวจสอบหมายเลขโทรศัพท์อีกครั้ง หรือกดปุ่มด้านล่างเพื่อทำการจองคิวใหม่
              </p>
              <button
                type="button"
                onClick={onGoToBooking}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>จองคิวตัดผมใหม่</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBookings.map((b) => (
                <div
                  key={b.id || b.bookingCode}
                  onClick={() => onSelectBookingForTicket(b)}
                  className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/60 transition-all cursor-pointer space-y-3 group shadow-md"
                >
                  {/* Top Bar: Code & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {b.bookingCode}
                      </span>
                      <span className="text-[11px] text-stone-500">• {b.customerName}</span>
                    </div>
                    <div>{getStatusBadge(b.status)}</div>
                  </div>

                  {/* Main Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-950/50 p-2.5 rounded-xl border border-stone-800/80">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-stone-500 block">ช่างตัดผม</span>
                        <span className="text-stone-200 font-medium truncate block">{b.barberName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-500 block">วันนัดหมาย</span>
                        <span className="text-stone-200 font-medium">{formatThaiDate(b.date, 'short')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-500 block">เวลา</span>
                        <span className="text-amber-400 font-bold">{b.timeSlot} น.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 block">ยอดชำระ</span>
                      <span className="text-stone-100 font-bold font-heading">฿{b.servicePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Bottom View Ticket CTA */}
                  <div className="flex items-center justify-between text-xs text-amber-400 group-hover:text-amber-300 pt-1">
                    <span className="font-medium text-[11px] flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" /> แตะเพื่อดู E-Ticket & บัตรคิว
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* If haven't searched yet, show recent bookings hint */}
      {!cleanSearch && (
        <div className="p-6 text-center bg-stone-900/30 rounded-2xl border border-stone-800/60 space-y-2">
          <Search className="w-6 h-6 text-stone-600 mx-auto" />
          <p className="text-xs text-stone-400">กรอกเบอร์โทรศัพท์เพื่อค้นหาคิวของคุณ</p>
          <p className="text-[11px] text-stone-600">
            ระบบจะดึงข้อมูลการจองแบบเรียลไทม์จากฐานข้อมูล Firestore
          </p>
        </div>
      )}
    </div>
  );
};
