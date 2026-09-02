import React, { useState } from 'react';
import { Barber, BarberService, Booking } from '../types';
import { X, Plus, Scissors, User, Phone, Calendar, Clock, DollarSign } from 'lucide-react';
import { TIME_SLOTS } from '../data/mockData';
import { toDateString, formatPhoneNumber } from '../utils/dateHelpers';
import { generateBookingCode } from '../lib/firebase';

interface QuickWalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  services: BarberService[];
  onAddBooking: (booking: Omit<Booking, 'id'>) => Promise<string>;
}

export const QuickWalkInModal: React.FC<QuickWalkInModalProps> = ({
  isOpen,
  onClose,
  barbers,
  services,
  onAddBooking
}) => {
  const todayStr = toDateString(new Date());
  const [customerName, setCustomerName] = useState('ลูกค้า Walk-in');
  const [customerPhone, setCustomerPhone] = useState('0800000000');
  const [barberId, setBarberId] = useState(barbers[0]?.id || 'barber_ek');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'srv_cut_style');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0] || '10:00');
  const [customerNote, setCustomerNote] = useState('Walk-in หน้าร้าน');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !timeSlot) return;

    setIsSubmitting(true);
    try {
      const selectedBarber = barbers.find(b => b.id === barberId);
      const selectedService = services.find(s => s.id === serviceId);

      const newBooking: Omit<Booking, 'id'> = {
        bookingCode: generateBookingCode(),
        customerName,
        customerPhone,
        customerNote,
        barberId,
        barberName: selectedBarber?.nickname || 'ช่างประจำร้าน',
        serviceId,
        serviceName: selectedService?.name || 'ตัดผม + เซ็ตทรงพรีเมียม',
        servicePrice: selectedService?.price || 350,
        durationMinutes: selectedService?.durationMinutes || 45,
        date,
        timeSlot,
        status: 'in_progress', // Walk-in is often in progress immediately
        createdAt: Date.now()
      };

      await onAddBooking(newBooking);
      onClose();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก Walk-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-amber-500 px-5 py-3.5 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 font-black" />
            <h3 className="font-extrabold text-sm font-heading">เพิ่มคิว Walk-in หน้าร้าน</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-950/20 hover:bg-stone-950/40 text-stone-950 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">ชื่อลูกค้า</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-500"
            />
          </div>

          {/* Customer Phone */}
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs font-mono focus:border-amber-500"
            />
          </div>

          {/* Barber Selection */}
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">เลือกช่าง (3 คน)</label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-500"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nickname} ({b.specialties[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">เลือกบริการ</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ฿{s.price} ({s.durationMinutes} นาที)
                </option>
              ))}
            </select>
          </div>

          {/* Time slot & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">วันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">เวลา</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-500"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t} น.
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">หมายเหตุ</label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกคิว Walk-in ทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
