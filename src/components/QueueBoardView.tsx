import React, { useState } from 'react';
import { Booking, Barber, BookingStatus } from '../types';
import { 
  Users, 
  Clock, 
  Calendar, 
  Scissors, 
  CheckCircle, 
  Play, 
  Check, 
  X, 
  Phone, 
  PlusCircle, 
  Filter,
  DollarSign,
  TrendingUp,
  Sparkles,
  Receipt,
  QrCode
} from 'lucide-react';
import { formatThaiDate, formatPhoneNumber, toDateString } from '../utils/dateHelpers';

interface QueueBoardViewProps {
  bookings: Booking[];
  barbers: Barber[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onOpenQuickWalkIn: () => void;
  onSelectBookingForTicket: (booking: Booking) => void;
  onOpenCheckoutModal?: (booking: Booking) => void;
  onOpenDepositModal?: (booking: Booking) => void;
}

export const QueueBoardView: React.FC<QueueBoardViewProps> = ({
  bookings,
  barbers,
  onUpdateStatus,
  onOpenQuickWalkIn,
  onSelectBookingForTicket,
  onOpenCheckoutModal,
  onOpenDepositModal
}) => {
  const todayStr = toDateString(new Date());
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(todayStr);
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');

  // Filter bookings
  const dateBookings = bookings.filter(b => {
    if (selectedDateFilter === 'all') return true;
    return b.date === selectedDateFilter;
  });

  const filteredBookings = dateBookings.filter(b => {
    if (selectedBarberFilter === 'all') return true;
    return b.barberId === selectedBarberFilter;
  });

  // Sort by timeSlot ascending
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  // Calculate statistics for the selected date
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');
  const inProgressCount = todayBookings.filter(b => b.status === 'in_progress').length;
  const completedCount = todayBookings.filter(b => b.status === 'completed').length;
  const pendingOrConfirmedCount = todayBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const todayTotalRevenue = todayBookings.reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner with Quick Action */}
      <div className="bg-[#1C1F26] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#FACC15]" />
            <div>
              <h2 className="text-lg font-black tracking-tight text-white font-heading">
                กระดานคิวสด ({barbers.length} ช่าง)
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                จัดการสถานะคิว อัปเดตงานตัดผม และเช็คบิลรับเงิน
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenQuickWalkIn}
            className="px-4 py-2.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>+ WALK-IN</span>
          </button>
        </div>

        {/* Today Summary Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center pt-1">
          <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">คิววันนี้</span>
            <span className="text-xl font-black text-white font-heading">
              {todayBookings.length}
            </span>
          </div>
          <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#FACC15] font-bold uppercase tracking-wider block">กำลังตัด</span>
            <span className="text-xl font-black text-[#FACC15] font-heading">
              {inProgressCount}
            </span>
          </div>
          <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">ตัดเสร็จ</span>
            <span className="text-xl font-black text-emerald-400 font-heading">
              {completedCount}
            </span>
          </div>
          <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">รายได้วันนี้</span>
            <span className="text-xs font-black text-[#FACC15] font-heading mt-1 block">
              ฿{todayTotalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Date & Barber */}
      <div className="space-y-2.5">
        {/* Barber selection pills - Mobile Optimized Smooth Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1">
          <button
            type="button"
            onClick={() => setSelectedBarberFilter('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
              selectedBarberFilter === 'all'
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
            }`}
          >
            ช่างทุกคน ({barbers.length})
          </button>

          {barbers.map((barber) => (
            <button
              key={barber.id}
              type="button"
              onClick={() => setSelectedBarberFilter(barber.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border flex items-center gap-2 ${
                selectedBarberFilter === barber.id
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
              }`}
            >
              <img
                src={barber.avatar || '/barber_ek.jpg'}
                alt={barber.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/barber_ek.jpg';
                }}
                className="w-5 h-5 rounded-full object-cover border border-black/20"
              />
              <span className="whitespace-nowrap">{barber.nickname.replace(/\(.*\)/, '').trim()}</span>
            </button>
          ))}
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center justify-between text-xs px-2 text-gray-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>วันที่: <strong className="text-white">{selectedDateFilter === todayStr ? 'วันนี้ (' + formatThaiDate(todayStr, 'short') + ')' : formatThaiDate(selectedDateFilter, 'short')}</strong></span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDateFilter(todayStr)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                selectedDateFilter === todayStr ? 'bg-[#FACC15] text-black' : 'text-gray-400 hover:text-white bg-[#1C1F26]'
              }`}
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                selectedDateFilter === 'all' ? 'bg-[#FACC15] text-black' : 'text-gray-400 hover:text-white bg-[#1C1F26]'
              }`}
            >
              ทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {sortedBookings.length === 0 ? (
          <div className="p-8 text-center bg-[#1C1F26] rounded-3xl border border-white/10 space-y-2">
            <Clock className="w-8 h-8 text-gray-600 mx-auto" />
            <h4 className="text-base font-black uppercase text-white font-heading">NO QUEUES SCHEDULED</h4>
            <p className="text-xs text-gray-400">
              {selectedBarberFilter !== 'all' 
                ? 'ช่างท่านนี้ยังไม่มีคิวจองในวันที่เลือก' 
                : 'ยังไม่มีการจองคิวในวันที่เลือก สามารถคลิกเพิ่มคิว Walk-in ได้ทันที'}
            </p>
          </div>
        ) : (
          sortedBookings.map((b) => {
            const isInProgress = b.status === 'in_progress';
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id || b.bookingCode}
                className={`p-5 rounded-3xl border transition-all space-y-3.5 shadow-xl ${
                  isInProgress
                    ? 'bg-[#1C1F26] border-4 border-[#FACC15]'
                    : isCompleted
                    ? 'bg-[#121418] border-white/5 opacity-70'
                    : isCancelled
                    ? 'bg-[#0A0A0B] border-white/5 opacity-40'
                    : 'bg-[#1C1F26] border-white/10'
                }`}
              >
                {/* Header: Time, Barber, Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-[#FACC15] text-black font-black text-sm font-heading">
                      {b.timeSlot} น.
                    </span>
                    <span className="text-sm font-black uppercase text-white font-heading">
                      {b.barberName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.isWalkIn && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] font-black text-[10px] border border-[#FACC15]/40 flex items-center gap-1">
                        <span>🚶 WALK-IN</span>
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-gray-400">
                      #{b.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Customer & Service Info */}
                <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-base">{b.customerName}</span>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="text-[#FACC15] hover:underline flex items-center gap-1 font-mono text-xs font-bold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{formatPhoneNumber(b.customerPhone)}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-gray-400 font-medium">
                    <span>{b.serviceName} ({b.durationMinutes} นาที)</span>
                    <span className="text-[#FACC15] font-black font-heading text-sm">
                      ฿{(b.servicePrice || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Deposit and Payment Badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    {b.depositPaid ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        ✓ มัดจำแล้ว ฿{b.depositAmount || 100}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenDepositModal && onOpenDepositModal(b)}
                        className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 font-bold text-[10px] border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <QrCode className="w-2.5 h-2.5 text-[#FACC15]" />
                        <span>ชำระมัดจำ QR</span>
                      </button>
                    )}

                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                        ชำระแล้ว • ค่าคอมช่าง 50% (฿{Math.round((b.servicePrice || 0) * 0.5)})
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        คงเหลือจ่ายหน้าร้าน: ฿{Math.max(0, (b.servicePrice || 0) - (b.depositPaid ? (b.depositAmount || 100) : 0))}
                      </span>
                    )}
                  </div>

                  {b.customerNote && (
                    <div className="text-[11px] text-gray-300 bg-[#121418] p-2 rounded-xl border border-white/5 mt-1 font-medium">
                      <span className="text-gray-500 uppercase font-bold">NOTE: </span>
                      {b.customerNote}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-500 uppercase font-bold pt-0.5">
                    <span>DATE: {formatThaiDate(b.date, 'full')}</span>
                  </div>
                </div>

                {/* Status Action Buttons for Barber/Admin */}
                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onSelectBookingForTicket(b)}
                    className="text-[11px] font-bold text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    ดูตั๋วคิว
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Checkout Button: Available for non-completed bookings */}
                    {!isCompleted && !isCancelled && onOpenCheckoutModal && (
                      <button
                        type="button"
                        onClick={() => onOpenCheckoutModal(b)}
                        className="px-3 py-2 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                        title="เช็คบิล คิดค่าบริการและคำนวณคอมมิชชั่น 50%"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>เช็คบิล / รับเงิน</span>
                      </button>
                    )}

                    {/* If Confirmed, can Start Cut */}
                    {b.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => b.id && onUpdateStatus(b.id, 'in_progress')}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 border border-white/10 cursor-pointer active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current text-[#FACC15]" />
                        <span>เริ่มตัดผม</span>
                      </button>
                    )}

                    {/* If In Progress, can Complete Cut */}
                    {b.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenCheckoutModal) {
                            onOpenCheckoutModal(b);
                          } else if (b.id) {
                            onUpdateStatus(b.id, 'completed');
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ตัดเสร็จ / เช็คบิล</span>
                      </button>
                    )}

                    {/* If Completed, can revert or stay */}
                    {b.status === 'completed' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> เสร็จสิ้นแล้ว
                      </span>
                    )}

                    {/* Cancel / Re-confirm trigger */}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`ยืนยันการยกเลิกคิว #${b.bookingCode}?`)) {
                            b.id && onUpdateStatus(b.id, 'cancelled');
                          }
                        }}
                        className="p-2 rounded-xl bg-[#0A0A0B] hover:bg-rose-950 text-gray-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                        title="ยกเลิกคิวนี้"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {b.status === 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => b.id && onUpdateStatus(b.id, 'confirmed')}
                        className="px-2.5 py-1.5 rounded-xl bg-[#0A0A0B] hover:bg-[#1C1F26] text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        กู้คืนคิว
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
