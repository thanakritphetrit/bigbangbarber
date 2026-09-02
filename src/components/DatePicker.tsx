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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold border border-amber-500/30">
            3
          </span>
          <span>เลือกวันที่ต้องการจอง (Select Date)</span>
        </label>
        
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected date formatted banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>วันที่เลือก: <strong className="text-amber-400 font-medium">{formatThaiDate(selectedDate, 'full')}</strong></span>
        </div>
      </div>

      {/* Horizontal scrolling dates */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5 scroll-smooth"
      >
        {upcomingDates.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[72px] py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-102'
                  : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800'
              }`}
            >
              <span
                className={`text-[11px] mb-1 font-medium ${
                  isSelected
                    ? 'text-stone-950 font-bold'
                    : item.isToday
                    ? 'text-amber-400 font-semibold'
                    : 'text-stone-400'
                }`}
              >
                {item.subLabel}
              </span>

              <span className={`text-base font-extrabold font-heading ${isSelected ? 'text-stone-950' : 'text-stone-100'}`}>
                {item.label.split(' ')[0]}
              </span>

              <span className={`text-[10px] ${isSelected ? 'text-stone-950 font-medium' : 'text-stone-400'}`}>
                {item.label.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
