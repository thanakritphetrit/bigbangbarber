import React, { useState, useMemo } from 'react';
import { Barber, BarberService, Booking, BookingStatus, PaymentMethod, PaymentStatus } from '../types';
import { 
  X, 
  Plus, 
  Scissors, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Check, 
  Zap, 
  Banknote, 
  QrCode, 
  CreditCard,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import { TIME_SLOTS } from '../data/mockData';
import { toDateString, formatPhoneNumber } from '../utils/dateHelpers';
import { generateBookingCode } from '../lib/firebase';

interface QuickWalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  services: BarberService[];
  bookings?: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id'>, autoOpenTicket?: boolean) => Promise<string>;
}

export const QuickWalkInModal: React.FC<QuickWalkInModalProps> = ({
  isOpen,
  onClose,
  barbers,
  services,
  bookings = [],
  onAddBooking
}) => {
  const todayStr = toDateString(new Date());

  // Detect current approximate time slot
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const defaultSlot = TIME_SLOTS.find(slot => {
    const [h] = slot.split(':').map(Number);
    return h >= currentHour;
  }) || TIME_SLOTS[0] || '10:00';

  const [customerName, setCustomerName] = useState('ลูกค้า Walk-in');
  const [customerPhone, setCustomerPhone] = useState('0800000000');
  const [barberId, setBarberId] = useState(barbers[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState(defaultSlot);
  const [status, setStatus] = useState<BookingStatus>('in_progress');
  const [paymentChoice, setPaymentChoice] = useState<'pay_later' | 'cash' | 'promptpay_qr'>('pay_later');
  const [customerNote, setCustomerNote] = useState('ลูกค้า Walk-in หน้าร้าน');
  const [autoOpenTicket, setAutoOpenTicket] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate live busy/free status of barbers today
  const barberLiveStatus = useMemo(() => {
    const activeToday = bookings.filter(b => b.date === todayStr && b.status === 'in_progress');
    const map: Record<string, { isBusy: boolean; currentCustomer?: string }> = {};
    barbers.forEach(b => {
      const activeBooking = activeToday.find(booking => booking.barberId === b.id);
      map[b.id] = {
        isBusy: !!activeBooking,
        currentCustomer: activeBooking?.customerName
      };
    });
    return map;
  }, [bookings, barbers, todayStr]);

  if (!isOpen) return null;

  const selectedBarber = barbers.find(b => b.id === barberId) || barbers[0];
  const selectedService = services.find(s => s.id === serviceId) || services[0];

  const handleQuickPresetName = (name: string) => {
    setCustomerName(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    try {
      const finalPrice = selectedService?.price || 350;
      const isPaidUpfront = paymentChoice !== 'pay_later';
      const paidMethod: PaymentMethod = paymentChoice === 'cash' ? 'cash' : 'promptpay_qr';
      const barberCommission = isPaidUpfront ? Math.round(finalPrice * 0.5) : undefined;
      const shopShare = isPaidUpfront ? finalPrice - (barberCommission || 0) : undefined;

      const newBooking: Omit<Booking, 'id'> = {
        bookingCode: generateBookingCode(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || '0800000000',
        customerNote: customerNote.trim() || 'ลูกค้า Walk-in หน้าร้าน',
        barberId: selectedBarber?.id || barbers[0]?.id || 'barber_ek',
        barberName: selectedBarber?.nickname || 'ช่างประจำร้าน',
        serviceId: selectedService?.id || services[0]?.id || 'srv_cut_style',
        serviceName: selectedService?.name || 'ตัดผม + เซ็ตทรงพรีเมียม',
        servicePrice: finalPrice,
        durationMinutes: selectedService?.durationMinutes || 45,
        date,
        timeSlot,
        status,
        isWalkIn: true,
        createdAt: Date.now(),
        // Payment info if settled upfront
        paymentStatus: isPaidUpfront ? 'completed' : 'unpaid',
        paymentMethod: isPaidUpfront ? paidMethod : undefined,
        paidAmount: isPaidUpfront ? finalPrice : 0,
        remainingAmount: isPaidUpfront ? 0 : finalPrice,
        barberCommission,
        shopShare,
        commissionRate: 50,
        settledAt: isPaidUpfront ? Date.now() : undefined
      };

      await onAddBooking(newBooking, autoOpenTicket);
      onClose();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก Walk-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] px-5 py-4 text-black flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-[#FACC15] flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-[#FACC15]" />
            </div>
            <div>
              <h3 className="font-black text-base uppercase tracking-tight font-heading leading-tight">
                เพิ่มคิวลูกค้า WALK-IN หน้าร้าน
              </h3>
              <p className="text-[10px] font-bold text-black/80 tracking-wider">
                QUICK WALK-IN DESK • บันทึกคิว & คิดเงินด่วน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Quick Presets for Customer Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>ชื่อลูกค้า (CUSTOMER NAME)</span>
              </label>
              <div className="flex items-center gap-1">
                {['ลูกค้า Walk-in', 'ลูกค้าหน้าร้าน #1', 'ลูกค้าประจำ'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickPresetName(tag)}
                    className="px-2 py-0.5 rounded-lg bg-[#0A0A0B] text-gray-300 hover:text-white hover:border-[#FACC15] border border-white/10 text-[10px] font-bold transition-all cursor-pointer active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ระบุชื่อลูกค้า เช่น พี่เบิร์ด, น้องเจมส์..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
            />
          </div>

          {/* Customer Phone (Optional / Fast) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>เบอร์โทรศัพท์ (ไม่บังคับ)</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomerPhone('0800000000')}
                className="text-[10px] text-gray-400 hover:text-[#FACC15] underline cursor-pointer"
              >
                ใส่เบอร์ชั่วคราว
              </button>
            </div>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="080-000-0000 (ใส่หรือไม่ใส่ก็ได้)"
              className="w-full px-4 py-2 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-mono font-bold focus:border-[#FACC15] focus:outline-none"
            />
          </div>

          {/* Barber Selection with Live Status Cards */}
          <div className="space-y-2">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>เลือกช่างตัดผม (BARBER SELECTION)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {barbers.map((b) => {
                const isSelected = barberId === b.id;
                const statusInfo = barberLiveStatus[b.id] || { isBusy: false };

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBarberId(b.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col items-center text-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#FACC15]/15 border-[#FACC15] shadow-md'
                        : 'bg-[#0A0A0B] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden mb-1.5 bg-black/40">
                      <img
                        src={b.avatarUrl}
                        alt={b.nickname}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#FACC15]/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-black stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="font-black text-xs text-white uppercase">{b.nickname}</span>
                    <span className="text-[9px] text-gray-400 font-medium truncate w-full">
                      {b.specialties[0] || 'Master Barber'}
                    </span>

                    {/* Live status badge */}
                    <div className="mt-1">
                      {statusInfo.isBusy ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[8px] border border-amber-500/30 inline-block">
                          ติดตัดอยู่
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[8px] border border-emerald-500/30 inline-block">
                          ● ว่างพร้อมตัด
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>เลือกบริการ (SERVICE)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {services.map((s) => {
                const isSelected = serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FACC15]/15 border-[#FACC15] shadow-md'
                        : 'bg-[#0A0A0B] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-[#FACC15] font-heading">฿{s.price}</span>
                      <span className="text-[10px] text-gray-400">{s.durationMinutes} นาที</span>
                    </div>
                    <div className="font-black text-xs text-white uppercase mt-0.5 line-clamp-1">
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Queue Status Toggle */}
          <div className="space-y-1.5">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[11px] block">
              สถานะเริ่มต้นของคิว (QUEUE STATUS)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`py-2.5 px-3 rounded-2xl border font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  status === 'in_progress'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-md'
                    : 'bg-[#0A0A0B] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🟢 เริ่มตัดทันที (In Chair)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`py-2.5 px-3 rounded-2xl border font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  status === 'confirmed'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-md'
                    : 'bg-[#0A0A0B] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>🟡 รอคิวหน้าร้าน (Waiting)</span>
              </button>
            </div>
          </div>

          {/* Payment Method Upfront Choice */}
          <div className="space-y-1.5 bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>การคิดเงิน Walk-in (PAYMENT)</span>
              </label>
              <span className="text-xs font-black text-[#FACC15] font-heading">
                ยอด ฿{selectedService?.price || 350}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setPaymentChoice('pay_later')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  paymentChoice === 'pay_later'
                    ? 'bg-white/15 text-white border-[#FACC15]'
                    : 'bg-[#121418] text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                ⏳ จ่ายหลังตัดเสร็จ
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('cash')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  paymentChoice === 'cash'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-[#121418] text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                💵 ชำระเงินสดแล้ว
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('promptpay_qr')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  paymentChoice === 'promptpay_qr'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500'
                    : 'bg-[#121418] text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                📱 สแกน QR แล้ว
              </button>
            </div>
          </div>

          {/* Time Slot & Date (Collapsible/compact) */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider block">วันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-white/10 text-white font-bold focus:border-[#FACC15] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider block">ช่วงเวลา</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0B] border border-white/10 text-white font-bold focus:border-[#FACC15] focus:outline-none"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t} น.
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto Open Ticket Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300 select-none">
              <input
                type="checkbox"
                checked={autoOpenTicket}
                onChange={(e) => setAutoOpenTicket(e.target.checked)}
                className="w-4 h-4 rounded text-[#FACC15] focus:ring-[#FACC15] bg-[#0A0A0B] border-white/20 accent-[#FACC15]"
              />
              <span className="font-bold text-[11px]">เปิดบัตรคิว E-Ticket ทันทีหลังบันทึก</span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:from-[#FDE047] hover:to-[#FACC15] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-black stroke-black" />
              <span>{isSubmitting ? 'กำลังบันทึก WALK-IN...' : 'ยืนยันลงคิว WALK-IN หน้าร้านทันที'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

