import React from 'react';
import { Barber } from '../types';
import { X, Star, Calendar, Clock, Award, Instagram, CheckCircle2, Scissors, Edit3 } from 'lucide-react';

interface BarberDetailModalProps {
  barber: Barber | null;
  onClose: () => void;
  onSelectAndClose: (barberId: string) => void;
  onEditBarber?: (barber: Barber) => void;
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80';
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80';

export const BarberDetailModal: React.FC<BarberDetailModalProps> = ({
  barber,
  onClose,
  onSelectAndClose,
  onEditBarber
}) => {
  if (!barber) return null;

  // Sample portfolio style photos for this barber
  const portfolioPhotos = [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover & Close button */}
        <div className="relative h-36 bg-gradient-to-br from-yellow-600/30 to-[#1C1F26] overflow-hidden">
          <img
            src={barber.coverImage || FALLBACK_COVER}
            alt={barber.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_COVER;
            }}
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] via-transparent to-transparent" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {onEditBarber && (
              <button
                onClick={() => {
                  onClose();
                  onEditBarber(barber);
                }}
                className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black border border-white/20 text-[#FACC15] flex items-center gap-1.5 font-bold text-xs cursor-pointer transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไข</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/70 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barber Profile Header */}
        <div className="px-6 -mt-12 relative flex-1 overflow-y-auto space-y-4 pb-6">
          <div className="flex items-end justify-between">
            <div className="relative">
              <img
                src={barber.avatar || FALLBACK_AVATAR}
                alt={barber.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FACC15] shadow-2xl bg-stone-900"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1C1F26]" />
            </div>

            <div className="flex items-center gap-1.5 bg-[#0A0A0B] border border-white/10 px-3.5 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
              <span className="text-sm font-black text-white">{barber.rating}</span>
              <span className="text-xs text-gray-400 font-bold">({barber.reviewsCount} REVIEWS)</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase text-white font-heading">{barber.nickname}</h3>
            <p className="text-xs text-[#FACC15] font-black uppercase tracking-wider">{barber.title} • {barber.name}</p>
            <p className="text-xs text-gray-300 mt-2.5 leading-relaxed bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/5 font-medium">
              {barber.bio}
            </p>
          </div>

          {/* Work Hours and Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#FACC15] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">DAYS</span>
                <span className="text-white font-bold">{barber.workDays}</span>
              </div>
            </div>

            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#FACC15] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">HOURS</span>
                <span className="text-white font-bold">{barber.workHours}</span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FACC15]" />
              <span>SPECIALTIES & SKILLS</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {barber.specialties.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xl bg-[#0A0A0B] text-white border border-white/10 font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Sample Styles Portfolio */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-[#FACC15]" />
              <span>PORTFOLIO SHOWCASE</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {portfolioPhotos.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0B]">
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
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1 font-bold">
            <span className="flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>IG: <strong className="text-white">{barber.instagram}</strong></span>
            </span>
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ONLINE BOOKING READY</span>
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/10">
          <button
            onClick={() => {
              onSelectAndClose(barber.id);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Scissors className="w-4 h-4 stroke-[3]" />
            <span>SELECT {barber.nickname.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
