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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FACC15] px-6 py-4 text-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 stroke-[3]" />
            <h3 className="font-black text-base uppercase tracking-tight font-heading">ADD WALK-IN QUEUE</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase tracking-wider block">CUSTOMER NAME</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
            />
          </div>

          {/* Customer Phone */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase tracking-wider block">PHONE NUMBER</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-mono font-bold focus:border-[#FACC15] focus:outline-none"
            />
          </div>

          {/* Barber Selection */}
          <div className="space-y-1">
            <label className="text-gray-400 font-bold uppercase tracking-wider block">SELECT BARBER</label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
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
            <label className="text-gray-400 font-bold uppercase tracking-wider block">SELECT SERVICE</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
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
              <label className="text-gray-400 font-bold uppercase tracking-wider block">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider block">TIME SLOT</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-bold focus:border-[#FACC15] focus:outline-none"
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
            <label className="text-gray-400 font-bold uppercase tracking-wider block">NOTE</label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0B] border border-white/10 text-white text-xs font-medium focus:border-[#FACC15] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'SAVING WALK-IN...' : 'START WALK-IN CUT NOW'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
