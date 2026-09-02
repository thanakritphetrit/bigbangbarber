import React, { useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUpcomingDates, formatThaiDate } from '../utils/dateHelpers';

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const upcomingDates = getUpcomingDates(14);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-end">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-black text-xs flex items-center justify-center font-black">
            3
          </span>
          <span>Select Date</span>
        </h3>
        
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-white hover:border-[#FACC15] flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-xl bg-[#1C1F26] border border-white/10 text-gray-300 hover:text-white hover:border-[#FACC15] flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected date formatted banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121418] border border-white/10 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#FACC15] shrink-0" />
          <span className="uppercase text-[11px] font-bold tracking-wider">
            วันที่เลือก: <strong className="text-[#FACC15] font-black text-xs">{formatThaiDate(selectedDate, 'full')}</strong>
          </span>
        </div>
      </div>

      {/* Horizontal scrolling dates */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 scroll-smooth"
      >
        {upcomingDates.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[76px] py-3.5 px-2 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-black border-[#FACC15] shadow-2xl scale-[1.03] font-black'
                  : 'bg-[#1C1F26] border-white/10 text-gray-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <span
                className={`text-[10px] mb-1 font-bold uppercase tracking-wider ${
                  isSelected
                    ? 'text-black/80 font-black'
                    : item.isToday
                    ? 'text-[#FACC15] font-black'
                    : 'text-gray-400'
                }`}
              >
                {item.subLabel}
              </span>

              <span className={`text-lg font-black font-heading ${isSelected ? 'text-black' : 'text-white'}`}>
                {item.label.split(' ')[0]}
              </span>

              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>
                {item.label.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
