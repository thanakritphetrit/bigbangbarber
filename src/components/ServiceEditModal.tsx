import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scissors, 
  Sparkles, 
  Wind, 
  Palette, 
  Feather, 
  Crown, 
  Zap, 
  Flame, 
  Star, 
  Smile, 
  Trash2, 
  Check, 
  Clock, 
  DollarSign, 
  Plus, 
  Save, 
  RotateCcw,
  Tag
} from 'lucide-react';
import { BarberService } from '../types';

interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: BarberService | null; // null = Add New Service, object = Edit Service
  onSave: (service: BarberService) => void;
  onDelete?: (serviceId: string) => void;
  onResetDefaults?: () => void;
  canDelete?: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'Scissors', label: 'กรรไกร', icon: Scissors },
  { name: 'Sparkles', label: 'ดาววิเศษ', icon: Sparkles },
  { name: 'Wind', label: 'ไดร์/ดัด', icon: Wind },
  { name: 'Palette', label: 'ทำสี', icon: Palette },
  { name: 'Feather', label: 'สปา/โกน', icon: Feather },
  { name: 'Crown', label: 'VIP พรีเมียม', icon: Crown },
  { name: 'Zap', label: 'ควิก/รวดเร็ว', icon: Zap },
  { name: 'Flame', label: 'ฮิต/ยอดนิยม', icon: Flame },
  { name: 'Star', label: 'บริการเด่น', icon: Star },
  { name: 'Smile', label: 'นวดผ่อนคลาย', icon: Smile }
];

const DURATION_PRESETS = [30, 45, 60, 90, 120];

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
  onDelete,
  onResetDefaults,
  canDelete = true
}) => {
  const isCreateMode = service === null;

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(350);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [iconName, setIconName] = useState<string>('Scissors');
  const [popular, setPopular] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setNameEn(service.nameEn);
      setDescription(service.description);
      setPrice(service.price);
      setDurationMinutes(service.durationMinutes);
      setIconName(service.iconName || 'Scissors');
      setPopular(!!service.popular);
      setShowConfirmDelete(false);
    } else {
      // Default values for new service
      setName('');
      setNameEn('');
      setDescription('');
      setPrice(350);
      setDurationMinutes(45);
      setIconName('Scissors');
      setPopular(false);
      setShowConfirmDelete(false);
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedService: BarberService = {
      id: service ? service.id : `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      description: description.trim(),
      price: Number(price) > 0 ? Number(price) : 0,
      durationMinutes: Number(durationMinutes) > 0 ? Number(durationMinutes) : 45,
      iconName: iconName || 'Scissors',
      popular: popular
    };

    onSave(savedService);
    onClose();
  };

  const handleDelete = () => {
    if (service && onDelete) {
      onDelete(service.id);
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
                  <span>เพิ่มรายการบริการใหม่</span>
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 stroke-[2.5]" />
                  <span>แก้ไขรายการบริการ</span>
                </>
              )}
            </h3>
            <p className="text-xs font-black uppercase tracking-wider text-black/80">
              {isCreateMode ? 'CREATE NEW BARBER SERVICE' : `EDIT: ${service?.nameEn || service?.name}`}
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
        <form id="service-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Service Names (TH & EN) */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-3">
            <span className="font-black uppercase tracking-wider text-[#FACC15] text-xs flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>ชื่อบริการ (Service Name)</span>
            </span>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                ชื่อภาษาไทย *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ตัดผม + เซ็ตทรงพรีเมียม"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                ชื่อภาษาอังกฤษ (English Name)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Signature Haircut & Styling"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/10 space-y-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>ราคา (บาท) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={0}
                  step={50}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="350"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-[#FACC15] font-black text-sm font-heading focus:outline-none focus:border-[#FACC15]"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 font-bold text-xs">฿</span>
              </div>
            </div>

            <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/10 space-y-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>ระยะเวลา (นาที) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={10}
                  max={240}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  placeholder="45"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-black text-sm font-heading focus:outline-none focus:border-[#FACC15]"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 font-bold text-xs">MIN</span>
              </div>
            </div>
          </div>

          {/* Duration Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">เลือกด่วน:</span>
            {DURATION_PRESETS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-[#FACC15] text-black'
                    : 'bg-[#0A0A0B] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {mins} นาที
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-1.5">
            <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
              รายละเอียดขั้นตอนบริการ (Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น ปรึกษาทรงผม ออกแบบตามรูปหน้า ขึ้นทรงเฟด/วินเทจ พร้อมเซ็ตด้วยโพเมด..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-[#FACC15] resize-none"
            />
          </div>

          {/* Icon Selection */}
          <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/10 space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-gray-300 block">
              เลือกไอคอนประจำบริการ (SERVICE ICON)
            </span>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1F26] border-[#FACC15] text-[#FACC15] shadow-lg scale-105 ring-1 ring-[#FACC15]'
                        : 'bg-[#121418] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                    title={item.label}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[9px] font-bold truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Badge Toggle */}
          <div className="bg-[#0A0A0B] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-black text-xs text-white uppercase tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>ติดป้าย POPULAR ยอดนิยม</span>
              </span>
              <p className="text-[10px] text-gray-400 font-medium">
                เน้นไฮไลท์บริการนี้บนหน้าเลือกบริการให้ลูกค้าเห็นเด่นชัด
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPopular(!popular)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                popular ? 'bg-[#FACC15]' : 'bg-gray-700'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  popular ? 'left-6.5' : 'left-0.5'
                }`} 
              />
            </button>
          </div>

          {/* Delete Option for existing service */}
          {!isCreateMode && canDelete && onDelete && (
            <div className="pt-2">
              {!showConfirmDelete ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบรายการบริการนี้</span>
                </button>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-2xl space-y-2 text-center">
                  <p className="text-red-300 font-bold text-xs">
                    ยืนยันการลบ "{service?.name}" ใช่หรือไม่?
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
            form="service-form"
            className="flex-2 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isCreateMode ? 'เพิ่มบริการ (ADD SERVICE)' : 'บันทึกการแก้ไข (SAVE)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
