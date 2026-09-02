import React from 'react';
import { BarberService } from '../types';
import { Scissors, Sparkles, Wind, Palette, Feather, Crown, Check, Clock } from 'lucide-react';

interface ServiceSelectorProps {
  services: BarberService[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onSelectService
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
      default:
        return <Scissors className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold border border-amber-500/30">
            2
          </span>
          <span>เลือกบริการ (Service & Grooming)</span>
        </label>
        <span className="text-xs text-stone-400">ราคามาตรฐาน</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-800 text-amber-400 border border-stone-700'
                    }`}
                  >
                    {getIcon(service.iconName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-stone-100">{service.name}</h4>
                      {service.popular && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          ฮิต
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-400/80 font-medium">{service.nameEn}</p>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{service.description}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-stone-400">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>{service.durationMinutes} นาที</span>
                      </span>
                      <span className="text-amber-400 font-extrabold text-sm font-heading">
                        ฿{service.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-stone-950'
                        : 'border-stone-700 bg-stone-950/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
