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
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockData';
import { ShopInfo } from '../types';

interface BookingTicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
  shopInfo?: ShopInfo;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  booking,
  onClose,
  onCancelBooking,
  shopInfo = DEFAULT_SHOP_INFO
}) => {
  useEffect(() => {
    if (booking) {
      // Trigger festive confetti on successful booking
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#eab308', '#ffffff', '#10b981']
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
    const title = encodeURIComponent(`ตัดผมร้าน ${shopInfo.name || 'BIGBANG BARBER'} (${booking.serviceName})`);
    const details = encodeURIComponent(
      `คิวตัดผมกับ ${booking.barberName}\nรหัสจอง: ${booking.bookingCode}\nเบอร์โทรติดต่อ: ${shopInfo.phone}`
    );
    const location = encodeURIComponent(shopInfo.address);
    
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#FACC15] px-6 py-4 text-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-black flex items-center justify-center shadow-md shrink-0">
              <img 
                src={shopInfo.logoUrl || '/logo.jpg'} 
                alt={shopInfo.name || 'Bigbang Barber'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Scissors className="w-4 h-4 -rotate-45 stroke-[3] text-[#FACC15] absolute" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight font-heading uppercase">{shopInfo.name || 'BIGBANG BARBER'}</h3>
              <p className="text-[10px] font-black uppercase tracking-wider text-black/80">E-TICKET & QUEUE PASS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Success Banner */}
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 p-3 text-center flex items-center justify-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>CONFIRMED & SAVED TO FIREBASE</span>
        </div>

        {/* Ticket Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Booking Code Banner */}
          <div className="p-5 rounded-2xl bg-[#0A0A0B] border-2 border-dashed border-[#FACC15] text-center relative group">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">BOOKING PASS CODE</span>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <span className="text-3xl font-black text-[#FACC15] tracking-widest font-heading">
                {booking.bookingCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-[#1C1F26] hover:bg-[#FACC15] hover:text-black text-gray-300 transition-all cursor-pointer"
                title="คัดลอกรหัส"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              STATUS: CONFIRMED
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 text-xs">
            {/* Barber */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#FACC15]" /> BARBER:
              </span>
              <span className="text-white font-black">{booking.barberName}</span>
            </div>

            {/* Service */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-gray-400 font-bold uppercase">SERVICE:</span>
              <div className="text-right">
                <span className="text-white font-bold block">{booking.serviceName}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{booking.durationMinutes} MINS</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FACC15]" /> SCHEDULE:
              </span>
              <div className="text-right">
                <span className="text-[#FACC15] font-black text-sm block">{booking.timeSlot} น.</span>
                <span className="text-[11px] text-gray-300 font-medium">{formatThaiDate(booking.date, 'full')}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FACC15]" /> CUSTOMER:
              </span>
              <div className="text-right">
                <span className="text-white font-black block">{booking.customerName}</span>
                <span className="text-[10px] text-gray-400 font-mono font-bold">{formatPhoneNumber(booking.customerPhone)}</span>
              </div>
            </div>

            {/* Note */}
            {booking.customerNote && (
              <div className="pt-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">NOTE / PREFERENCES:</span>
                <p className="text-xs text-gray-200 bg-[#1C1F26] p-2.5 rounded-xl border border-white/5 font-medium">
                  {booking.customerNote}
                </p>
              </div>
            )}

            {/* Total Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-400 font-black uppercase">PRICE DUE:</span>
              <span className="text-xl font-black text-[#FACC15] font-heading">
                ฿{booking.servicePrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* QR Code Ticket Scan */}
          <div className="p-3.5 bg-[#0A0A0B] rounded-2xl border border-white/5 flex items-center gap-3.5">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black uppercase text-white tracking-wider">SHOW AT SHOP FRONT</h5>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed font-medium">
                กรุณามาถึงก่อนเวลานัดหมาย 5-10 นาที เพื่อเตรียมตัวสระและขึ้นทรง
              </p>
            </div>
          </div>

          {/* Shop Location & Contact */}
          <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs text-gray-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
              <span className="text-[11px] font-medium leading-relaxed">{shopInfo.address}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[11px] font-bold">TEL: <strong className="text-white">{shopInfo.phone}</strong></span>
              {shopInfo.googleMapsUrl && (
                <a
                  href={shopInfo.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#FACC15] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                >
                  <span>OPEN MAPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="py-3 px-3 rounded-2xl bg-[#0A0A0B] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <Calendar className="w-4 h-4 text-[#FACC15]" />
              <span>CALENDAR</span>
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
              className="py-3 px-3 rounded-2xl bg-[#0A0A0B] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
            >
              <Share2 className="w-4 h-4 text-[#FACC15]" />
              <span>SHARE PASS</span>
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
                className="text-[11px] text-gray-500 hover:text-rose-400 transition-colors uppercase font-bold tracking-wider underline cursor-pointer"
              >
                CANCEL THIS BOOKING
              </button>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-wider transition-all cursor-pointer active:scale-98"
          >
            CLOSE TICKET
          </button>
        </div>
      </div>
    </div>
  );
};
