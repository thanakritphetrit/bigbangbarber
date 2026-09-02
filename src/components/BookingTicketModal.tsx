import React, { useEffect } from 'react';
import { Booking } from '../types';
import { 
  CheckCircle2, 
  Scissors, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  QrCode, 
  Share2, 
  Download, 
  X, 
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatThaiDate, formatPhoneNumber } from '../utils/dateHelpers';
import { SHOP_INFO } from '../data/mockData';

interface BookingTicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  booking,
  onClose,
  onCancelBooking
}) => {
  useEffect(() => {
    if (booking) {
      // Trigger festive confetti on successful booking
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#ffffff', '#10b981']
        });
      } catch {
        // ignore
      }
    }
  }, [booking]);

  if (!booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.bookingCode);
    alert(`คัดลอกรหัสการจอง ${booking.bookingCode} เรียบร้อยแล้ว`);
  };

  const handleAddToCalendar = () => {
    // Generate simple Google Calendar URL
    const title = encodeURIComponent(`ตัดผมร้าน Bigbangbarber (${booking.serviceName})`);
    const details = encodeURIComponent(
      `คิวตัดผมกับ ${booking.barberName}\nรหัสจอง: ${booking.bookingCode}\nเบอร์โทรติดต่อ: ${SHOP_INFO.phone}`
    );
    const location = encodeURIComponent(SHOP_INFO.address);
    
    // Parse time
    const [h, m] = booking.timeSlot.split(':');
    const startHour = parseInt(h, 10);
    const startMin = parseInt(m, 10);
    const endMinTotal = startHour * 60 + startMin + booking.durationMinutes;
    const endH = Math.floor(endMinTotal / 60);
    const endM = endMinTotal % 60;
    
    const dateCompact = booking.date.replace(/-/g, '');
    const startTimeStr = `${dateCompact}T${String(startHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;
    const endTimeStr = `${dateCompact}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeStr}/${endTimeStr}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-5 py-4 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-950 text-amber-400 flex items-center justify-center shadow-md">
              <Scissors className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide font-heading uppercase">Bigbangbarber</h3>
              <p className="text-[10px] font-semibold text-stone-900">E-TICKET / บัตรคิวออนไลน์</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-950/20 hover:bg-stone-950/40 text-stone-950 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Banner */}
        <div className="bg-emerald-950/60 border-b border-emerald-900/50 p-3 text-center flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>บันทึกลงระบบ Firebase เรียบร้อยแล้ว!</span>
        </div>

        {/* Ticket Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Booking Code Banner */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-dashed border-amber-500/50 text-center relative group">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">รหัสคิวการจอง (Booking Code)</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 tracking-widest font-heading">
                {booking.bookingCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 rounded bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
                title="คัดลอกรหัส"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              สถานะ: ยืนยันแล้ว (Confirmed)
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 bg-stone-950/50 p-4 rounded-2xl border border-stone-800 text-xs">
            {/* Barber */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-400" /> ช่างตัดผม:
              </span>
              <span className="text-stone-100 font-bold">{booking.barberName}</span>
            </div>

            {/* Service */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <span className="text-stone-400">บริการ:</span>
              <div className="text-right">
                <span className="text-stone-100 font-medium block">{booking.serviceName}</span>
                <span className="text-[10px] text-stone-500">ใช้เวลาประมาณ {booking.durationMinutes} นาที</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> วันที่ & เวลา:
              </span>
              <div className="text-right">
                <span className="text-amber-400 font-bold block">{booking.timeSlot} น.</span>
                <span className="text-[11px] text-stone-300">{formatThaiDate(booking.date, 'full')}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <span className="text-stone-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> ผู้จอง:
              </span>
              <div className="text-right">
                <span className="text-stone-100 font-medium block">{booking.customerName}</span>
                <span className="text-[10px] text-stone-400 font-mono">{formatPhoneNumber(booking.customerPhone)}</span>
              </div>
            </div>

            {/* Note */}
            {booking.customerNote && (
              <div className="pt-1">
                <span className="text-[11px] text-stone-500 block mb-0.5">หมายเหตุ / ทรงผมที่ชอบ:</span>
                <p className="text-xs text-stone-300 bg-stone-900 p-2 rounded-lg border border-stone-800/80">
                  {booking.customerNote}
                </p>
              </div>
            )}

            {/* Total Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-stone-300 font-bold">ยอดชำระที่หน้าร้าน:</span>
              <span className="text-lg font-black text-amber-400 font-heading">
                ฿{booking.servicePrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* QR Code Ticket Scan */}
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-stone-950" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-stone-200">แสดงหน้าร้านเมื่อมาถึง</h5>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                กรุณามาถึงก่อนเวลานัดหมาย 5-10 นาที เพื่อเตรียมตัวสระและขึ้นทรง
              </p>
            </div>
          </div>

          {/* Shop Location & Contact */}
          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800 space-y-1.5 text-xs text-stone-400">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[11px]">{SHOP_INFO.address}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px]">โทรติดต่อ: <strong className="text-stone-200">{SHOP_INFO.phone}</strong></span>
              <a
                href={SHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>เปิดแผนที่</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>บันทึกลงปฏิทิน</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `คิวตัดผมร้าน Bigbangbarber #${booking.bookingCode}`,
                    text: `จองคิวตัดผมกับ ${booking.barberName} วันที่ ${formatThaiDate(booking.date)} เวลา ${booking.timeSlot} น.`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  handleCopyCode();
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>แชร์คิว / ส่งต่อ</span>
            </button>
          </div>

          {/* Cancel button if needed */}
          {onCancelBooking && booking.status !== 'cancelled' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`คุณต้องการยกเลิกการจองรหัส ${booking.bookingCode} หรือไม่?`)) {
                    if (booking.id) {
                      onCancelBooking(booking.id);
                    }
                  }
                }}
                className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors underline cursor-pointer"
              >
                ต้องการยกเลิกคิวนี้
              </button>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="p-4 bg-stone-950 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all cursor-pointer"
          >
            เสร็จสิ้น / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
