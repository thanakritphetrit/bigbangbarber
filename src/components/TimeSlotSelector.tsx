import React from 'react';
import { Clock, CheckCircle2, XCircle, Sparkles, Sun, Sunset, Moon } from 'lucide-react';
import { TimeSlotOption, Barber } from '../types';

interface TimeSlotSelectorProps {
  slots: TimeSlotOption[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  selectedBarberName: string;
  selectedBarberId: string;
  barbers: Barber[];
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  slots,
  selectedTime,
  onSelectTime,
  selectedBarberName,
  selectedBarberId,
  barbers
}) => {
  // Categorize slots
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 13;
  });

  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 13 && hour < 17;
  });

  const eveningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  const renderSlotGroup = (title: string, groupSlots: TimeSlotOption[], icon: React.ReactNode) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider pt-1">
          {icon}
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {groupSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectTime(slot.time)}
                className={`py-3.5 px-2 rounded-xl text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-black text-lg border-2 border-white shadow-2xl scale-[1.02]'
                    : isAvailable
                    ? 'border border-white/10 rounded-xl font-bold text-base hover:bg-white hover:text-black bg-[#1C1F26] text-white'
                    : 'border border-white/5 rounded-xl font-bold text-base opacity-25 cursor-not-allowed bg-[#121418] text-gray-500'
                }`}
              >
                <span className={`text-base sm:text-lg font-black font-heading ${
                  isSelected ? 'text-black' : isAvailable ? 'text-white' : 'text-gray-500 line-through'
                }`}>
                  {slot.time}
                </span>

                <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                  isSelected
                    ? 'text-black/80'
                    : isAvailable
                    ? 'text-[#FACC15]'
                    : 'text-gray-600'
                }`}>
                  {isAvailable ? (slot.reason || 'AVAILABLE') : 'BOOKED'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const availableCount = slots.filter(s => s.isAvailable).length;

  return (
    <div className="space-y-3.5 bg-[#121418] rounded-3xl p-5 border border-white/10 shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-black text-xs flex items-center justify-center font-black">
            4
          </span>
          <span>Available Slots</span>
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-white rounded-sm" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-800 rounded-sm" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Booked</span>
          </div>
        </div>
      </div>

      {/* Helper info bar */}
      <div className="px-4 py-2.5 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FACC15] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            ช่าง: <strong className="text-[#FACC15] font-black">{selectedBarberName}</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
          {availableCount} ช่วงเวลาว่าง
        </span>
      </div>

      {/* Slots divided by time of day */}
      <div className="space-y-3 pt-1">
        {renderSlotGroup('ช่วงเช้า • Morning', morningSlots, <Sun className="w-3.5 h-3.5 text-[#FACC15]" />)}
        {renderSlotGroup('ช่วงบ่าย • Afternoon', afternoonSlots, <Sunset className="w-3.5 h-3.5 text-amber-500" />)}
        {renderSlotGroup('ช่วงเย็น • Evening', eveningSlots, <Moon className="w-3.5 h-3.5 text-indigo-400" />)}
      </div>

      {availableCount === 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-center space-y-1">
          <p className="text-xs font-black uppercase text-rose-400">รอบเวลาในวันนี้เต็มทั้งหมดแล้ว</p>
          <p className="text-[11px] text-gray-400">กรุณาเลือกวันอื่น หรือเลือกจองแบบ "ช่างคนไหนก็ได้"</p>
        </div>
      )}
    </div>
  );
};
