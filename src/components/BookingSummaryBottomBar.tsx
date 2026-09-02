import React from 'react';
import { Scissors, ArrowRight, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { formatThaiDate } from '../utils/dateHelpers';

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
  isSubmitting
}) => {
  return (
    <div className="sticky bottom-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 p-4 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left summary info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span className="truncate">{barberName || 'ยังไม่เลือกช่าง'}</span>
            <span>•</span>
            <span className="truncate">{timeSlot || '--:--'}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-extrabold text-amber-400 font-heading">
              ฿{servicePrice.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-400 truncate max-w-[120px]">
              {serviceName}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={onProceed}
            className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/25 active:scale-98'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <span>จองคิวทันที</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning message if form is incomplete */}
      {!isValid && missingFieldMessage && (
        <p className="text-center text-[11px] text-amber-400/90 mt-2 flex items-center justify-center gap-1">
          <span>* {missingFieldMessage}</span>
        </p>
      )}
    </div>
  );
};
