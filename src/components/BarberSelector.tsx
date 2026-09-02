import React from 'react';
import { Barber } from '../types';
import { Star, Sparkles, Check, Info, Award, Flame } from 'lucide-react';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelectBarber: (barberId: string) => void;
  onViewBarberDetail: (barber: Barber) => void;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
  onViewBarberDetail
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold border border-amber-500/30">
            1
          </span>
          <span>เลือกช่างตัดผม (Barber Stylist)</span>
        </label>
        <span className="text-xs text-amber-400/90 font-medium">3 ช่างประจำร้าน</span>
      </div>

      {/* Option 0: Auto / Any Barber (Quickest Slot) */}
      <div
        onClick={() => onSelectBarber('any')}
        className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          selectedBarberId === 'any'
            ? 'bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10'
            : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-100">ช่างคนไหนก็ได้ (คิวว่างเร็วที่สุด)</h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" /> แนะนำ
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              ระบบจะจัดคิวให้กับช่างที่ว่างในเวลาที่คุณสะดวก เหมาะสำหรับคนที่ต้องการเวลาที่ต้องการทันที
            </p>
          </div>
        </div>

        <div className="shrink-0 pl-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              selectedBarberId === 'any'
                ? 'bg-amber-500 border-amber-500 text-stone-950'
                : 'border-stone-700 bg-stone-950/50'
            }`}
          >
            {selectedBarberId === 'any' && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* 3 Dedicated Barbers */}
      <div className="space-y-2.5">
        {barbers.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          return (
            <div
              key={barber.id}
              onClick={() => onSelectBarber(barber.id)}
              className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Barber Avatar & Info */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-700/80 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-stone-950 px-1 py-0.2 rounded-md border border-stone-700 flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      <span>{barber.rating}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-stone-100">{barber.nickname}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                        ประสบการณ์ {barber.experienceYears} ปี
                      </span>
                    </div>

                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">{barber.title}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-1">{barber.bio}</p>

                    {/* Specialties Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {barber.specialties.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800/90 text-stone-300 border border-stone-700/50"
                        >
                          {item}
                        </span>
                      ))}
                      {barber.specialties.length > 2 && (
                        <span className="text-[10px] text-stone-500 self-center">
                          +{barber.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Selection & View detail */}
                <div className="flex flex-col items-end justify-between shrink-0 h-full min-h-[56px]">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-stone-950'
                        : 'border-stone-700 bg-stone-950/50'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewBarberDetail(barber);
                    }}
                    className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>ดูผลงาน</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
