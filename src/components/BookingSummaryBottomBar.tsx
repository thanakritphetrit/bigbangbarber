import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BookingSummaryBottomBarProps {
  barberName: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  timeSlot: string;
  isValid: boolean;
  missingFieldMessage?: string;
  onProceed: () => void;
  isSubmitting?: boolean;
  depositAmount?: number;
}

export const BookingSummaryBottomBar: React.FC<BookingSummaryBottomBarProps> = ({
  barberName,
  serviceName,
  servicePrice,
  date,
  timeSlot,
  isValid,
  missingFieldMessage,
  onProceed,
  isSubmitting,
  depositAmount = 100
}) => {
  return (
    <div className="sticky bottom-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md border-t border-white/10 p-4 shadow-[0_-15px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3.5">
        {/* Left summary info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="truncate">{barberName || 'เลือกช่าง'}</span>
            <span>•</span>
            <span className="truncate text-white">{timeSlot || '--:--'}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-[#FACC15] font-heading">
              ฿{servicePrice.toLocaleString()}
            </span>
            <span className="text-xs font-bold uppercase text-gray-400 truncate max-w-[130px]">
              {serviceName}
            </span>
          </div>
          {servicePrice > 0 && (
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              <span>มัดจำ ฿{depositAmount} (ชำระหน้าร้าน ฿{Math.max(0, servicePrice - depositAmount)})</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={onProceed}
            className={`py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xl ${
              isValid && !isSubmitting
                ? 'bg-[#FACC15] hover:bg-yellow-400 text-black active:scale-95 shadow-[#FACC15]/20'
                : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <span>CONFIRM QUEUE</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning message if form is incomplete */}
      {!isValid && missingFieldMessage && (
        <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[#FACC15] mt-2 flex items-center justify-center gap-1">
          <span>* {missingFieldMessage}</span>
        </p>
      )}
    </div>
  );
};
