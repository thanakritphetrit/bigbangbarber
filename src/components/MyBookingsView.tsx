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
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FACC15] text-black flex items-center gap-1">
            <Scissors className="w-3 h-3 animate-spin" /> IN PROGRESS
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40">
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#1C1F26] text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Title */}
      <div className="bg-[#1C1F26] p-5 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Ticket className="w-5 h-5 text-[#FACC15]" />
          <h2 className="text-lg font-black uppercase tracking-tight text-white font-heading">
            MY BOOKINGS & QUEUE PASS
          </h2>
        </div>
        <p className="text-xs text-gray-400 font-medium">
          กรอกเบอร์โทรศัพท์เพื่อตรวจสอบตั๋วคิว สถานะคิวสด หรือดูรายละเอียดนัดหมาย
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => {
                setSearchPhone(e.target.value);
                if (!hasSearched) setHasSearched(true);
              }}
              placeholder="กรอกเบอร์โทร เช่น 0812345678"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A0A0B] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>FIND</span>
          </button>
        </form>
      </div>

      {/* Results */}
      {cleanSearch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1 font-bold uppercase tracking-wider">
            <span>PHONE: <strong className="text-white font-mono">{formatPhoneNumber(cleanSearch)}</strong></span>
            <span className="text-[#FACC15]">FOUND {filteredBookings.length} TICKETS</span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center bg-[#1C1F26] rounded-3xl border border-white/10 space-y-3">
              <AlertCircle className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-base font-black uppercase text-white font-heading">
                NO BOOKINGS FOUND
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                ไม่พบคิวที่ตรงกับเบอร์โทรศัพท์นี้ กรุณาตรวจสอบเบอร์อีกครั้ง หรือกดจองคิวใหม่
              </p>
              <button
                type="button"
                onClick={onGoToBooking}
                className="mt-2 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FACC15] text-black font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:bg-yellow-400 active:scale-95"
              >
                <Scissors className="w-4 h-4 stroke-[3]" />
                <span>BOOK NEW QUEUE</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id || b.bookingCode}
                  onClick={() => onSelectBookingForTicket(b)}
                  className="p-5 rounded-3xl bg-[#1C1F26] border border-white/10 hover:border-[#FACC15] transition-all cursor-pointer space-y-3.5 group shadow-xl"
                >
                  {/* Top Bar: Code & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#FACC15] text-base">
                        {b.bookingCode}
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase">• {b.customerName}</span>
                    </div>
                    <div>{getStatusBadge(b.status)}</div>
                  </div>

                  {/* Main Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-[#FACC15] shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">BARBER</span>
                        <span className="text-white font-bold truncate block">{b.barberName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FACC15] shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">DATE</span>
                        <span className="text-white font-bold">{formatThaiDate(b.date, 'short')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FACC15] shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">TIME</span>
                        <span className="text-[#FACC15] font-black">{b.timeSlot} น.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">PRICE</span>
                      <span className="text-white font-black font-heading text-sm">฿{b.servicePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Bottom View Ticket CTA */}
                  <div className="flex items-center justify-between text-xs text-[#FACC15] group-hover:text-yellow-400 pt-1 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4" /> VIEW PASS & TICKET
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* If haven't searched yet, show hint */}
      {!cleanSearch && (
        <div className="p-8 text-center bg-[#1C1F26]/60 rounded-3xl border border-white/5 space-y-2">
          <Search className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            SEARCH BY PHONE NUMBER
          </p>
          <p className="text-[11px] text-gray-500">
            ระบบจะดึงข้อมูลการจองแบบเรียลไทม์จากฐานข้อมูล Firestore
          </p>
        </div>
      )}
    </div>
  );
};
