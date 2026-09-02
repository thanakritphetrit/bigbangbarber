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
        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium pt-1">
          {icon}
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {groupSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectTime(slot.time)}
                className={`relative py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-102 ring-2 ring-amber-400/40'
                    : isAvailable
                    ? 'bg-stone-900 border-stone-800 text-stone-100 hover:border-amber-500/50 hover:bg-stone-850'
                    : 'bg-stone-950/60 border-stone-900 text-stone-600 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className={`text-base font-extrabold font-heading ${
                    isSelected ? 'text-stone-950' : isAvailable ? 'text-stone-100' : 'text-stone-600 line-through'
                  }`}>
                    {slot.time}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-center gap-1">
                  {isAvailable ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        isSelected
                          ? 'bg-stone-950 text-amber-400 font-bold'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {slot.reason || 'ว่าง'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-600 font-medium">
                      เต็มแล้ว
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const availableCount = slots.filter(s => s.isAvailable).length;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold border border-amber-500/30">
            4
          </span>
          <span>เลือกเวลาที่สะดวก (Available Slots)</span>
        </label>
        
        <div className="flex items-center gap-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">ว่าง {availableCount} ช่วงเวลา</span>
        </div>
      </div>

      {/* Helper info bar */}
      <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            คิวของ: <strong className="text-amber-400">{selectedBarberName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> ว่าง
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-700" /> เต็ม
          </span>
        </div>
      </div>

      {/* Slots divided by time of day */}
      <div className="space-y-3">
        {renderSlotGroup('ช่วงเช้า (Morning)', morningSlots, <Sun className="w-3.5 h-3.5 text-amber-400" />)}
        {renderSlotGroup('ช่วงบ่าย (Afternoon)', afternoonSlots, <Sunset className="w-3.5 h-3.5 text-amber-500" />)}
        {renderSlotGroup('ช่วงเย็น (Evening)', eveningSlots, <Moon className="w-3.5 h-3.5 text-indigo-400" />)}
      </div>

      {availableCount === 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-center space-y-1">
          <p className="text-xs font-bold text-rose-400">รอบเวลาในวันนี้เต็มทั้งหมดแล้ว</p>
          <p className="text-[11px] text-stone-400">กรุณาเลือกวันอื่น หรือเลือกจองแบบ "ช่างคนไหนก็ได้"</p>
        </div>
      )}
    </div>
  );
};
