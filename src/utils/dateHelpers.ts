import { Booking, Barber, TimeSlotOption } from '../types';
import { TIME_SLOTS } from '../data/mockData';

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_DAYS = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
];

export const THAI_DAYS_SHORT = [
  'อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'
];

/**
 * Format date string "YYYY-MM-DD" into readable Thai text
 * e.g. "พุธที่ 2 กันยายน 2569"
 */
export function formatThaiDate(dateStr: string, format: 'full' | 'short' | 'medium' = 'medium'): string {
  if (!dateStr) return '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  
  const dateObj = new Date(year, monthIdx, day);
  const dayOfWeek = THAI_DAYS_SHORT[dateObj.getDay()];
  const thaiYear = year + 543;

  if (format === 'short') {
    return `${day} ${THAI_MONTHS_SHORT[monthIdx]} ${thaiYear.toString().slice(-2)}`;
  }
  if (format === 'full') {
    return `วัน${THAI_DAYS[dateObj.getDay()]}ที่ ${day} ${THAI_MONTHS[monthIdx]} ${thaiYear}`;
  }
  return `${dayOfWeek} ${day} ${THAI_MONTHS_SHORT[monthIdx]} ${thaiYear}`;
}

/**
 * Get date string in "YYYY-MM-DD"
 */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generate 14 upcoming booking dates starting from today
 */
export function getUpcomingDates(daysCount = 14): { dateStr: string; label: string; subLabel: string; isToday: boolean; isTomorrow: boolean }[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = toDateString(d);
    
    let label = `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]}`;
    let subLabel = THAI_DAYS_SHORT[d.getDay()];

    if (i === 0) {
      subLabel = 'วันนี้';
    } else if (i === 1) {
      subLabel = 'พรุ่งนี้';
    }

    dates.push({
      dateStr,
      label,
      subLabel,
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }

  return dates;
}

/**
 * Format phone number e.g. 0812345678 -> 081-234-5678
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Calculate slot availability for a selected date and selected barber (or 'any' barber)
 * Barbers: 3 barbers (Ek, Boss, Jack)
 */
export function calculateSlotAvailability(
  selectedDate: string,
  selectedBarberId: string,
  allBookings: Booking[],
  barbers: Barber[]
): TimeSlotOption[] {
  const activeBookings = allBookings.filter(
    b => b.date === selectedDate && b.status !== 'cancelled'
  );

  return TIME_SLOTS.map(time => {
    // Find who is booked at this time on this date
    const bookingsAtTime = activeBookings.filter(b => b.timeSlot === time);
    const bookedBarberIds = bookingsAtTime.map(b => b.barberId);

    if (selectedBarberId === 'any') {
      // If choosing "Any Barber", slot is available if at least 1 of the 3 barbers is free
      const freeBarberCount = barbers.filter(b => !bookedBarberIds.includes(b.id)).length;
      const isAvailable = freeBarberCount > 0;
      return {
        time,
        isAvailable,
        reason: isAvailable ? `ว่าง ${freeBarberCount} ช่าง` : 'เต็มทุกช่าง',
        bookedBarberIds
      };
    } else {
      // Specific barber selected
      const isBooked = bookedBarberIds.includes(selectedBarberId);
      return {
        time,
        isAvailable: !isBooked,
        reason: isBooked ? 'คิวเต็มแล้ว' : 'คิวว่าง',
        bookedBarberIds
      };
    }
  });
}

/**
 * Find the best available barber if user chose "any"
 */
export function pickFreeBarberForSlot(
  selectedDate: string,
  timeSlot: string,
  allBookings: Booking[],
  barbers: Barber[]
): Barber | null {
  const activeBookings = allBookings.filter(
    b => b.date === selectedDate && b.timeSlot === timeSlot && b.status !== 'cancelled'
  );
  const bookedBarberIds = activeBookings.map(b => b.barberId);

  // Return the first barber that is not booked
  const freeBarber = barbers.find(b => !bookedBarberIds.includes(b.id));
  return freeBarber || null;
}
