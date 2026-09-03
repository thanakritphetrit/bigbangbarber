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
  commissionRate?: number; // Barber commission % (default 50)
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
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'completed';
export type PaymentMethod = 'promptpay_qr' | 'cash' | 'credit_card';

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
  isWalkIn?: boolean;
  createdAt: number;
  updatedAt?: number;

  // Deposit & Payment System
  requireDeposit?: boolean;
  depositAmount?: number;
  depositPaid?: boolean;
  depositPaidAt?: number;
  depositSlipUrl?: string;
  depositSlipNote?: string;
  totalPrice?: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Barber 50% Commission
  commissionRate?: number; // default 50
  barberCommission?: number; // 50% of price
  shopShare?: number; // 50% of price
  settledAt?: number;
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

  // PromptPay & Financial settings
  promptPayNumber?: string;
  promptPayName?: string;
  promptPayBank?: string;
  promptPayQrImageUrl?: string;
  promptPayMode?: 'auto_generate' | 'custom_image';
  requireDeposit?: boolean;
  defaultDepositAmount?: number;
  defaultCommissionRate?: number; // 50%
  staffPin?: string;
}

export type ExpenseCategory = 'supplies' | 'utilities' | 'rent' | 'equipment' | 'maintenance' | 'marketing' | 'salary' | 'other';

export interface ShopExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  categoryLabel?: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
  createdBy?: string;
}

export type TransactionType = 'deposit' | 'service_payment' | 'expense' | 'commission_payout';

export interface ShopTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  bookingId?: string;
  bookingCode?: string;
  customerName?: string;
  barberId?: string;
  barberName?: string;
  serviceName?: string;
  paymentMethod?: PaymentMethod;
  commissionAmount?: number;
  shopAmount?: number;
  barberCommission?: number;
  shopShare?: number;
  date: string; // YYYY-MM-DD
  createdAt: number;
  note?: string;
}

