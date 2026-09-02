import React from 'react';
import { BarberService } from '../types';
import { 
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
  Check, 
  Clock, 
  Edit3, 
  Plus 
} from 'lucide-react';

interface ServiceSelectorProps {
  services: BarberService[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  onEditService?: (service: BarberService) => void;
  onAddNewService?: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  onEditService,
  onAddNewService
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Feather':
        return <Feather className="w-5 h-5" />;
      case 'Crown':
        return <Crown className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      default:
        return <Scissors className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-black text-xs flex items-center justify-center font-black">
            2
          </span>
          <span>SELECT SERVICE</span>
        </h3>

        <div className="flex items-center gap-2">
          {onAddNewService && (
            <button
              type="button"
              onClick={onAddNewService}
              className="px-3 py-1.5 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>เพิ่มบริการ</span>
            </button>
          )}

          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider hidden sm:inline-block">
            Standard Menu ({services.length})
          </span>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-2.5">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`relative transition-all cursor-pointer p-4 rounded-2xl flex items-start justify-between gap-3.5 ${
                isSelected
                  ? 'bg-white text-black border-4 border-[#FACC15] shadow-2xl scale-[1.01]'
                  : 'group bg-[#1C1F26] text-white hover:border-white/20 border border-white/5'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Service Icon Box */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'bg-black text-[#FACC15] border-black'
                      : 'bg-[#121418] text-[#FACC15] border-white/10 group-hover:border-[#FACC15]/40'
                  }`}
                >
                  {getIcon(service.iconName)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black uppercase tracking-tight font-heading">
                      {service.name}
                    </h4>
                    {service.popular && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        isSelected
                          ? 'bg-black text-[#FACC15]'
                          : 'bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30'
                      }`}>
                        POPULAR
                      </span>
                    )}
                  </div>

                  <p className={`text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                    isSelected ? 'text-black/80' : 'text-[#FACC15]'
                  }`}>
                    {service.nameEn}
                  </p>

                  {service.description && (
                    <p className={`text-xs mt-1 line-clamp-2 font-medium ${
                      isSelected ? 'text-black/70' : 'text-gray-400'
                    }`}>
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2.5">
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      isSelected ? 'text-black/70' : 'text-gray-400'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} MIN</span>
                    </span>
                    <span className={`font-black text-base font-heading ${
                      isSelected ? 'text-black' : 'text-[#FACC15]'
                    }`}>
                      ฿{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Controls: Edit Button & Selection Checkmark */}
              <div className="flex items-center gap-2 shrink-0 self-start">
                {onEditService && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditService(service);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black/10 hover:bg-black/20 text-black'
                        : 'bg-[#0A0A0B] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                    }`}
                    title="แก้ไขบริการนี้"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span className="text-[10px] font-black">แก้ไข</span>
                  </button>
                )}

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected
                      ? 'bg-black border-black text-[#FACC15]'
                      : 'border-white/30 bg-transparent group-hover:border-white/60'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
