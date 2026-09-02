export interface Barber {
  id: string;
  name: string;
  nickname: string;
  title: string;
  experienceYears: number;
  avatar: string;
  coverImage?: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  instagram: string;
  status: 'available' | 'busy' | 'day_off';
  workDays: string; // e.g. "จันทร์ - เสาร์"
  workHours: string; // e.g. "10:00 - 20:00"
}

export interface BarberService {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  durationMinutes: number;
  price: number;
  iconName: string;
  popular?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  barberId: string; // "any" or barber id
  barberName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  durationMinutes: number;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "10:00"
  status: BookingStatus;
  createdAt: number;
  updatedAt?: number;
}

export interface TimeSlotOption {
  time: string;
  isAvailable: boolean;
  reason?: string;
  bookedBarberIds: string[];
}

export interface ShopInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  openHours: string;
  openDaysText: string;
  lineId: string;
  instagram: string;
  facebook?: string;
  googleMapsUrl: string;
  logoUrl?: string;
  hasWifi?: boolean;
  hasBeverages?: boolean;
  hasParking?: boolean;
  policyNote?: string;
}
