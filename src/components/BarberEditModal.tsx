import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  Scissors, 
  Calendar, 
  Clock, 
  Star, 
  Instagram, 
  Award, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Plus,
  Check,
  RotateCcw
} from 'lucide-react';
import { Barber } from '../types';

interface BarberEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  barber: Barber | null; // null = Add new barber, object = Edit barber
  onSave: (barber: Barber) => void;
  onDelete?: (barberId: string) => void;
  canDelete?: boolean;
}

const PRESET_AVATARS = [
  { label: 'Classic Barber (ช่างเอก)', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80' },
  { label: 'Modern Stylist (ช่างบอส)', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80' },
  { label: 'Razor Artist (ช่างแจ็ค)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Street Stylist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Gentlemen Master', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80' },
  { label: 'Fade Specialist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' }
];

export const BarberEditModal: React.FC<BarberEditModalProps> = ({
  isOpen,
  onClose,
  barber,
  onSave,
  onDelete,
  canDelete = true
}) => {
  const isCreateMode = barber === null;

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [workDays, setWorkDays] = useState('จันทร์ - เสาร์ (หยุดวันอาทิตย์)');
  const [workHours, setWorkHours] = useState('10:00 - 20:00');
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(180);
  const [instagram, setInstagram] = useState('@bigbangbarber');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (barber) {
      setName(barber.name || '');
      setNickname(barber.nickname || '');
      setTitle(barber.title || '');
      setExperienceYears(barber.experienceYears || 5);
      setAvatar(barber.avatar || PRESET_AVATARS[0].url);
      setBio(barber.bio || '');
      setSpecialtiesText((barber.specialties || []).join(', '));
      setWorkDays(barber.workDays || 'จันทร์ - เสาร์ (หยุดวันอาทิตย์)');
      setWorkHours(barber.workHours || '10:00 - 20:00');
      setRating(barber.rating || 4.9);
      setReviewsCount(barber.reviewsCount || 150);
      setInstagram(barber.instagram || '@bigbangbarber');
      setShowConfirmDelete(false);
    } else {
      setName('');
      setNickname('');
      setTitle('Barber & Stylist');
      setExperienceYears(3);
      setAvatar(PRESET_AVATARS[3].url);
      setBio('');
      setSpecialtiesText('Classic Cut, Skin Fade, Set Pomade');
      setWorkDays('เปิดบริการทุกวัน');
      setWorkHours('10:00 - 20:00');
      setRating(4.9);
      setReviewsCount(100);
      setInstagram('@bigbangbarber');
      setShowConfirmDelete(false);
    }
  }, [barber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() && !name.trim()) return;

    const splittedSpecialties = specialtiesText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const savedBarber: Barber = {
      id: barber ? barber.id : `barber_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || nickname.trim(),
      nickname: nickname.trim() || name.trim(),
      title: title.trim() || 'Barber & Stylist',
      experienceYears: Number(experienceYears) || 1,
      avatar: avatar.trim() || PRESET_AVATARS[0].url,
      coverImage: barber?.coverImage || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      bio: bio.trim() || 'ช่างมืออาชีพพร้อมให้บริการตัดแต่งทรงผมคุณภาพสูง',
      specialties: splittedSpecialties.length > 0 ? splittedSpecialties : ['Classic Cut', 'Fade'],
      rating: Number(rating) || 4.9,
      reviewsCount: Number(reviewsCount) || 100,
      instagram: instagram.trim() || '@bigbangbarber',
      status: 'available',
      workDays: workDays.trim() || 'เปิดบริการทุกวัน',
      workHours: workHours.trim() || '10:00 - 20:00'
    };

    onSave(savedBarber);
    onClose();
  };

  const handleDelete = () => {
    if (barber && onDelete) {
      onDelete(barber.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#FACC15] px-6 py-4 flex items-center justify-between text-black shrink-0">
          <div>
            <h3 className="font-black text-xl font-heading tracking-tight text-black flex items-center gap-2 uppercase">
              {isCreateMode ? (
                <>
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>เพิ่มช่างตัดผมใหม่</span>
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 stroke-[2.5]" />
                  <span>แก้ไขข้อมูลช่างตัดผม</span>
                </>
              )}
            </h3>
            <p className="text-xs font-black uppercase tracking-wider text-black/80">
              {isCreateMode ? 'ADD NEW BARBER PROFILE' : `EDIT: ${barber?.nickname || barber?.name}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form id="barber-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Avatar Preview & Selection */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3">
            <span className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>รูปโปรไฟล์ช่าง (Avatar Image)</span>
            </span>

            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={avatar || PRESET_AVATARS[0].url}
                  alt="Avatar Preview"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = PRESET_AVATARS[0].url;
                  }}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FACC15] shadow-lg bg-[#1C1F26]"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  URL รูปภาพรูปโปรไฟล์ (Image URL)
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#FACC15]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                เลือกรูปตัวอย่างด่วน:
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      avatar === p.url ? 'border-[#FACC15] scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Names & Nickname */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3">
            <span className="font-black uppercase tracking-wider text-gray-300 text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FACC15]" />
              <span>ข้อมูลชื่อช่าง (Barber Name)</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  ชื่อเรียก / ฉายา *
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="เช่น ช่างแจ็ค (Barber Jack)"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  ชื่อ-นามสกุลจริง
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เกริกพล ทรงเดช"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  ตำแหน่ง / ความถนัดหลัก
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Street Barber & Razor Artist"
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-[#FACC15] font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  ประสบการณ์ (ปี)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  placeholder="8"
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
                />
              </div>
            </div>
          </div>

          {/* Bio / Description */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-1.5">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
              ประวัติและสไตล์การตัดผม (Bio)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="สไตล์สตรีท บัซคัท สกินเฟด และการกรีดลาย Hair Tattoo ใบมีดโกนแม่นยำ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15] resize-none"
            />
          </div>

          {/* Specialties (Comma-separated) */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-1.5">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>ความเชี่ยวชาญพิเศษ (คั่นด้วยเครื่องหมายจุลภาค , )</span>
            </label>
            <input
              type="text"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="Skin Fade 0 mm., Buzz Cut, Hair Tattoo, Beard Grooming"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Work Schedule & Social */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/10 space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#FACC15]" />
                <span>วันทำงาน</span>
              </label>
              <input
                type="text"
                value={workDays}
                onChange={(e) => setWorkDays(e.target.value)}
                placeholder="พุธ - จันทร์ (หยุดวันอังคาร)"
                className="w-full px-2.5 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-[11px] focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/10 space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FACC15]" />
                <span>เวลาทำงาน</span>
              </label>
              <input
                type="text"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="10:00 - 20:00"
                className="w-full px-2.5 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-[11px] focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/10 space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Instagram className="w-3 h-3 text-pink-400" />
                <span>Instagram</span>
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@jack_bigbangfade"
                className="w-full px-2.5 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-[11px] focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/10 space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FACC15]" />
                <span>คะแนนรีวิว</span>
              </label>
              <input
                type="number"
                step={0.1}
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                placeholder="4.9"
                className="w-full px-2.5 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-[#FACC15] font-black text-[11px] focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          {/* Delete Option for existing barber */}
          {!isCreateMode && canDelete && onDelete && (
            <div className="pt-2">
              {!showConfirmDelete ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบโปรไฟล์ช่างตัดผมนี้</span>
                </button>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-2xl space-y-2 text-center">
                  <p className="text-red-300 font-bold text-xs">
                    ยืนยันการลบ "{barber?.nickname || barber?.name}" ใช่หรือไม่?
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-lg bg-black/40 text-gray-300 font-bold text-xs"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-black text-xs"
                    >
                      ยืนยันลบทันที
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/10 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-[#1C1F26] hover:bg-[#252830] text-gray-300 hover:text-white font-black text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            form="barber-form"
            className="flex-2 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isCreateMode ? 'เพิ่มช่างใหม่ (ADD BARBER)' : 'บันทึกการแก้ไข (SAVE)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
