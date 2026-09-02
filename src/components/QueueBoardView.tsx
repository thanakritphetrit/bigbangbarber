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
  Sparkles
} from 'lucide-react';
import { formatThaiDate, formatPhoneNumber, toDateString } from '../utils/dateHelpers';

interface QueueBoardViewProps {
  bookings: Booking[];
  barbers: Barber[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onOpenQuickWalkIn: () => void;
  onSelectBookingForTicket: (booking: Booking) => void;
}

export const QueueBoardView: React.FC<QueueBoardViewProps> = ({
  bookings,
  barbers,
  onUpdateStatus,
  onOpenQuickWalkIn,
  onSelectBookingForTicket
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
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-stone-100 font-heading">
                บอร์ดคิวช่าง 3 คน (Live Queue Board)
              </h2>
              <p className="text-[11px] text-stone-400">
                จัดการสถานะคิว อัปเดตงานตัดผม และตรวจดูความว่าง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenQuickWalkIn}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ เพิ่มคิว Walk-in</span>
          </button>
        </div>

        {/* Today Summary Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center pt-1">
          <div className="bg-stone-950/70 p-2 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 block">คิววันนี้</span>
            <span className="text-base font-extrabold text-stone-100 font-heading">
              {todayBookings.length}
            </span>
          </div>
          <div className="bg-stone-950/70 p-2 rounded-xl border border-stone-800">
            <span className="text-[10px] text-amber-400 block">กำลังตัด</span>
            <span className="text-base font-extrabold text-amber-400 font-heading">
              {inProgressCount}
            </span>
          </div>
          <div className="bg-stone-950/70 p-2 rounded-xl border border-stone-800">
            <span className="text-[10px] text-emerald-400 block">เสร็จแล้ว</span>
            <span className="text-base font-extrabold text-emerald-400 font-heading">
              {completedCount}
            </span>
          </div>
          <div className="bg-stone-950/70 p-2 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 block">ยอดรวม</span>
            <span className="text-xs font-bold text-amber-300 font-heading mt-1 block">
              ฿{todayTotalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Date & Barber */}
      <div className="space-y-2">
        {/* Barber selection pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedBarberFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
              selectedBarberFilter === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-sm'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
            }`}
          >
            รวมช่างทั้งหมด (3 คน)
          </button>

          {barbers.map((barber) => (
            <button
              key={barber.id}
              type="button"
              onClick={() => setSelectedBarberFilter(barber.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                selectedBarberFilter === barber.id
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-sm'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <img
                src={barber.avatar}
                alt={barber.name}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{barber.nickname.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center justify-between text-xs px-1 text-stone-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>วันที่: <strong>{selectedDateFilter === todayStr ? 'วันนี้ (' + formatThaiDate(todayStr, 'short') + ')' : formatThaiDate(selectedDateFilter, 'short')}</strong></span>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedDateFilter(todayStr)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                selectedDateFilter === todayStr ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                selectedDateFilter === 'all' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
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
          <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 space-y-2">
            <Clock className="w-8 h-8 text-stone-600 mx-auto" />
            <h4 className="text-sm font-bold text-stone-300">ยังไม่มีคิวในรอบนี้</h4>
            <p className="text-xs text-stone-500">
              {selectedBarberFilter !== 'all' 
                ? 'ช่างท่านนี้ยังไม่มีคิวจองในวันที่เลือก' 
                : 'ยังไม่มีการจองคิวในวันที่เลือก สามารถคลิกเพิ่มคิว Walk-in ได้ทันที'}
            </p>
          </div>
        ) : (
          sortedBookings.map((b) => {
            const isToday = b.date === todayStr;
            const isInProgress = b.status === 'in_progress';
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id || b.bookingCode}
                className={`p-4 rounded-2xl border transition-all space-y-3 shadow-md ${
                  isInProgress
                    ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50'
                    : isCompleted
                    ? 'bg-stone-950/60 border-stone-800/80 opacity-75'
                    : isCancelled
                    ? 'bg-stone-950/40 border-stone-900 opacity-50'
                    : 'bg-stone-900/90 border-stone-800'
                }`}
              >
                {/* Header: Time, Barber, Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-sm font-heading shadow-sm">
                      {b.timeSlot} น.
                    </span>
                    <span className="text-xs font-bold text-stone-200 font-heading">
                      {b.barberName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      #{b.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Customer & Service Info */}
                <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-100 text-sm">{b.customerName}</span>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{formatPhoneNumber(b.customerPhone)}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-stone-400">
                    <span>{b.serviceName} ({b.durationMinutes} นาที)</span>
                    <span className="text-amber-400 font-extrabold font-heading text-sm">
                      ฿{b.servicePrice.toLocaleString()}
                    </span>
                  </div>

                  {b.customerNote && (
                    <div className="text-[11px] text-stone-300 bg-stone-900 p-1.5 rounded-lg border border-stone-800 mt-1">
                      <span className="text-stone-500 font-medium">หมายเหตุ: </span>
                      {b.customerNote}
                    </div>
                  )}

                  <div className="text-[10px] text-stone-500 pt-0.5">
                    <span>วันที่: {formatThaiDate(b.date, 'full')}</span>
                  </div>
                </div>

                {/* Status Action Buttons for Barber/Admin */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectBookingForTicket(b)}
                    className="text-[11px] text-stone-400 hover:text-stone-200 underline cursor-pointer"
                  >
                    ดู E-Ticket
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* If Confirmed, can Start Cut */}
                    {b.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => b.id && onUpdateStatus(b.id, 'in_progress')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>เริ่มตัดผม</span>
                      </button>
                    )}

                    {/* If In Progress, can Complete Cut */}
                    {b.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => b.id && onUpdateStatus(b.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ตัดเสร็จสิ้น (รับเงิน)</span>
                      </button>
                    )}

                    {/* If Completed, can revert or stay */}
                    {b.status === 'completed' && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> ตัดเสร็จแล้ว
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
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-700 transition-colors cursor-pointer"
                        title="ยกเลิกคิว"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {b.status === 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => b.id && onUpdateStatus(b.id, 'confirmed')}
                        className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                      >
                        คืนสถานะ
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
