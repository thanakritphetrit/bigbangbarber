import React from 'react';
import { Barber } from '../types';
import { Star, Sparkles, Check, Info, Plus, Edit3 } from 'lucide-react';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelectBarber: (barberId: string) => void;
  onViewBarberDetail: (barber: Barber) => void;
  onEditBarber?: (barber: Barber) => void;
  onAddNewBarber?: () => void;
}

const FALLBACK_AVATAR = '/barber_ek.jpg';

export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
  onViewBarberDetail,
  onEditBarber,
  onAddNewBarber
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-black text-xs flex items-center justify-center font-black">
            1
          </span>
          <span>เลือกช่างตัดผม</span>
          <span className="text-xs text-gray-400 font-normal uppercase tracking-wider hidden sm:inline-block">Select Barber</span>
        </h3>

        <div className="flex items-center gap-2">
          {onAddNewBarber && (
            <button
              type="button"
              onClick={onAddNewBarber}
              className="px-3 py-1.5 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>เพิ่มช่าง</span>
            </button>
          )}

          <span className="text-xs text-[#FACC15] uppercase font-bold tracking-wider hidden sm:inline-block">
            ช่างในระบบ ({barbers.length})
          </span>
        </div>
      </div>

      {/* Option 0: Auto / Any Barber (Quickest Slot) */}
      <div
        onClick={() => onSelectBarber('any')}
        className={`relative transition-all cursor-pointer p-4 rounded-2xl flex items-center justify-between gap-3.5 ${
          selectedBarberId === 'any'
            ? 'bg-white text-black border-4 border-[#FACC15] shadow-2xl scale-[1.01]'
            : 'group bg-[#1C1F26] text-white hover:bg-[#FACC15] hover:text-black border border-white/5'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-black text-2xl shrink-0 transition-colors ${
            selectedBarberId === 'any'
              ? 'bg-black text-[#FACC15] border-black'
              : 'bg-black/40 text-[#FACC15] border-white/20 group-hover:bg-black group-hover:text-[#FACC15] group-hover:border-black'
          }`}>
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black uppercase tracking-tight">ช่างคนไหนก็ได้</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                selectedBarberId === 'any'
                  ? 'bg-black text-[#FACC15]'
                  : 'bg-emerald-500/20 text-emerald-400 group-hover:bg-black group-hover:text-white'
              }`}>
                ว่างเร็วที่สุด
              </span>
            </div>
            <p className={`text-xs mt-0.5 line-clamp-1 font-medium ${
              selectedBarberId === 'any' ? 'text-black/70 font-semibold' : 'text-gray-400 group-hover:text-black/80'
            }`}>
              ระบบจัดคิวกับช่างยอดฝีมือที่ว่างเร็วที่สุดให้ทันที
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedBarberId === 'any'
                ? 'bg-black border-black text-[#FACC15]'
                : 'border-white/30 bg-transparent group-hover:border-black group-hover:bg-black group-hover:text-[#FACC15]'
            }`}
          >
            {selectedBarberId === 'any' && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* Barbers List */}
      <div className="space-y-3">
        {barbers.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          return (
            <div
              key={barber.id}
              onClick={() => onSelectBarber(barber.id)}
              className={`relative transition-all cursor-pointer p-4 rounded-2xl flex items-start justify-between gap-3.5 ${
                isSelected
                  ? 'bg-white text-black border-4 border-[#FACC15] shadow-2xl scale-[1.01]'
                  : 'group bg-[#1C1F26] text-white hover:bg-[#FACC15] hover:text-black border border-white/5'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Barber Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={barber.avatar || FALLBACK_AVATAR}
                    alt={barber.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                    className={`w-14 h-14 rounded-xl object-cover border-2 shadow-md bg-stone-900 ${
                      isSelected ? 'border-black' : 'border-white/20 group-hover:border-black/30'
                    }`}
                  />
                  <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md font-black text-[9px] flex items-center gap-0.5 ${
                    isSelected ? 'bg-black text-[#FACC15]' : 'bg-[#0A0A0B] text-[#FACC15] border border-white/10 group-hover:bg-black group-hover:text-[#FACC15]'
                  }`}>
                    <Star className="w-2.5 h-2.5 fill-[#FACC15]" />
                    <span>{barber.rating}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black uppercase tracking-tight font-heading">
                      {barber.nickname}
                    </h4>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-black/10 text-black border border-black/20'
                        : 'bg-white/10 text-gray-300 border border-white/10 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/20'
                    }`}>
                      {barber.experienceYears} ปี
                    </span>
                  </div>

                  <p className={`text-xs font-bold uppercase mt-0.5 tracking-wide ${
                    isSelected ? 'text-black/80' : 'text-[#FACC15] group-hover:text-black'
                  }`}>
                    {barber.title}
                  </p>
                  <p className={`text-[11px] line-clamp-1 mt-1 font-medium ${
                    isSelected ? 'text-black/70' : 'text-gray-400 group-hover:text-black/80'
                  }`}>
                    {barber.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(barber.specialties || []).slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-[#121418] text-gray-300 border border-white/10 group-hover:bg-black group-hover:text-white group-hover:border-transparent'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Selection & Edit / View detail */}
              <div className="flex flex-col items-end justify-between shrink-0 h-full min-h-[64px] gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected
                      ? 'bg-black border-black text-[#FACC15]'
                      : 'border-white/30 bg-transparent group-hover:border-black group-hover:bg-black group-hover:text-[#FACC15]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  {onEditBarber && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBarber(barber);
                      }}
                      className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 py-1 px-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black/10 text-black border-black/20 hover:bg-black/20'
                          : 'bg-[#0A0A0B] text-gray-300 border-white/10 hover:text-white hover:border-white/30 group-hover:bg-black group-hover:text-white group-hover:border-black'
                      }`}
                      title="แก้ไขข้อมูลช่าง"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>แก้ไข</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewBarberDetail(barber);
                    }}
                    className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 py-1 px-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black hover:bg-stone-800'
                        : 'bg-[#121418] text-[#FACC15] border-white/10 group-hover:bg-black group-hover:text-white group-hover:border-black'
                    }`}
                  >
                    <Info className="w-3 h-3" />
                    <span>โปรไฟล์</span>
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
