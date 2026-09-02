import React from 'react';
import { Barber } from '../types';
import { X, Star, Calendar, Clock, Award, Instagram, CheckCircle2, Scissors } from 'lucide-react';

interface BarberDetailModalProps {
  barber: Barber | null;
  onClose: () => void;
  onSelectAndClose: (barberId: string) => void;
}

export const BarberDetailModal: React.FC<BarberDetailModalProps> = ({
  barber,
  onClose,
  onSelectAndClose
}) => {
  if (!barber) return null;

  // Sample portfolio style photos for this barber
  const portfolioPhotos = [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517832606589-7629c3395909?w=400&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover & Close button */}
        <div className="relative h-36 bg-gradient-to-br from-amber-600 to-stone-900 overflow-hidden">
          {barber.coverImage && (
            <img
              src={barber.coverImage}
              alt={barber.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-950/70 border border-stone-700 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barber Profile Header */}
        <div className="px-5 -mt-12 relative flex-1 overflow-y-auto space-y-4 pb-6">
          <div className="flex items-end justify-between">
            <div className="relative">
              <img
                src={barber.avatar}
                alt={barber.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-stone-900" />
            </div>

            <div className="flex items-center gap-1.5 bg-stone-800/80 border border-stone-700 px-3 py-1 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-stone-100">{barber.rating}</span>
              <span className="text-xs text-stone-400">({barber.reviewsCount} รีวิว)</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-100 font-heading">{barber.nickname}</h3>
            <p className="text-xs text-amber-400 font-medium">{barber.title} • {barber.name}</p>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed bg-stone-950/40 p-3 rounded-xl border border-stone-800/60">
              {barber.bio}
            </p>
          </div>

          {/* Work Hours and Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block">วันเข้าทำงาน</span>
                <span className="text-stone-200 font-medium">{barber.workDays}</span>
              </div>
            </div>

            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block">เวลาให้บริการ</span>
                <span className="text-stone-200 font-medium">{barber.workHours}</span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>ความถนัดและสไตล์เฉพาะตัว</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {barber.specialties.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Sample Styles Portfolio */}
          <div>
            <h4 className="text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>ผลงานทรงผมตัวอย่าง</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {portfolioPhotos.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                  <img
                    src={url}
                    alt="ผลงาน"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Instagram handle */}
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>IG: <strong className="text-stone-200">{barber.instagram}</strong></span>
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>รับจองคิวออนไลน์</span>
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 bg-stone-950 border-t border-stone-800">
          <button
            onClick={() => {
              onSelectAndClose(barber.id);
            }}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Scissors className="w-4 h-4" />
            <span>เลือกจองคิวกับ {barber.nickname}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
