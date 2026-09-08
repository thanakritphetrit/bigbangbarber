import React, { useState, useEffect, useMemo } from 'react';
import { 
  Barber, 
  BarberService, 
  Booking, 
  BookingStatus,
  ShopInfo,
  ShopExpense,
  ShopTransaction,
  PaymentMethod
} from './types';
import { 
  INITIAL_BARBERS, 
  INITIAL_SERVICES, 
  SHOP_INFO,
  TIME_SLOTS 
} from './data/mockData';
import { 
  subscribeToBookings, 
  createBooking, 
  updateBookingStatus, 
  deleteBooking, 
  initializeFirestoreData, 
  generateBookingCode,
  subscribeToBarbers,
  saveBarberToFirestore,
  deleteBarberFromFirestore,
  subscribeToServices,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  subscribeToShopInfo,
  saveShopInfoToFirestore,
  subscribeToExpenses,
  addExpenseToFirestore,
  deleteExpenseFromFirestore,
  subscribeToTransactions,
  addTransactionToFirestore,
  updateBookingPaymentDetails
} from './lib/firebase';
import { 
  toDateString, 
  calculateSlotAvailability, 
  pickFreeBarberForSlot,
  formatThaiDate 
} from './utils/dateHelpers';

// Components
import { Header } from './components/Header';
import { BarberSelector } from './components/BarberSelector';
import { BarberDetailModal } from './components/BarberDetailModal';
import { ServiceSelector } from './components/ServiceSelector';
import { DatePicker } from './components/DatePicker';
import { TimeSlotSelector } from './components/TimeSlotSelector';
import { BookingForm } from './components/BookingForm';
import { BookingSummaryBottomBar } from './components/BookingSummaryBottomBar';
import { BookingTicketModal } from './components/BookingTicketModal';
import { MyBookingsView } from './components/MyBookingsView';
import { QueueBoardView } from './components/QueueBoardView';
import { ShopInfoModal } from './components/ShopInfoModal';
import { QuickWalkInModal } from './components/QuickWalkInModal';
import { SettingsModal, ShopSettingsState } from './components/SettingsModal';
import { ServiceEditModal } from './components/ServiceEditModal';
import { BarberEditModal } from './components/BarberEditModal';
import { PinAuthModal } from './components/PinAuthModal';
import { Toast } from './components/Toast';
import { DepositPaymentModal } from './components/DepositPaymentModal';
import { CheckoutPaymentModal } from './components/CheckoutPaymentModal';
import { FinanceAccountingView } from './components/FinanceAccountingView';
import { playBarberChime } from './utils/audio';
import { seedSampleBookings } from './lib/firebase';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  Flame,
  Award,
  AlertOctagon,
  Settings,
  Lock,
  Unlock,
  KeyRound,
  Zap,
  Plus
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings' | 'queue-board' | 'finance'>('book');

  // Master Data
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const saved = localStorage.getItem('bbb_barbers');
      if (saved) {
        const parsed: Barber[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(b => {
            const match = INITIAL_BARBERS.find(init => init.id === b.id);
            return {
              ...(match || {}),
              ...b,
              specialties: b.specialties || match?.specialties || ['Classic Cut', 'Fade'],
              commissionRate: b.commissionRate || 50,
              avatar: (match && (!b.avatar || b.avatar.includes('unsplash.com'))) ? match.avatar : (b.avatar || '/barber_ek.jpg'),
              coverImage: (match && (!b.coverImage || b.coverImage.includes('unsplash.com'))) ? match.coverImage : (b.coverImage || '/shop_hero.jpg')
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_BARBERS;
  });
  const [services, setServices] = useState<BarberService[]>(() => {
    try {
      const saved = localStorage.getItem('bbb_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SERVICES;
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<ShopExpense[]>([]);
  const [transactions, setTransactions] = useState<ShopTransaction[]>([]);

  // Shop & App Settings
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    try {
      const saved = localStorage.getItem('bbb_shop_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...SHOP_INFO,
          ...parsed,
          defaultCommissionRate: parsed.defaultCommissionRate ?? SHOP_INFO.defaultCommissionRate ?? 50,
          defaultDepositAmount: parsed.defaultDepositAmount ?? SHOP_INFO.defaultDepositAmount ?? 100,
          logoUrl: parsed.logoUrl || '/logo.jpg'
        };
      }
    } catch {
      // fallback
    }
    return SHOP_INFO;
  });

  const [shopSettings, setShopSettings] = useState<ShopSettingsState>(() => {
    try {
      const saved = localStorage.getItem('bbb_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          isOnlineBookingOpen: true,
          autoConfirmWalkIn: true,
          soundEnabled: true,
          staffPinRequired: false,
          staffPin: '1234',
          shopPhone: SHOP_INFO.phone,
          shopNotice: 'เปิดบริการตามปกติ 10:00 - 20:00 น. รับจองคิว 24 ชม.',
          hapticEnabled: true,
          ...parsed
        };
      }
    } catch {
      // fallback
    }
    return {
      isOnlineBookingOpen: true,
      autoConfirmWalkIn: true,
      soundEnabled: true,
      staffPinRequired: false,
      staffPin: '1234',
      shopPhone: shopInfo.phone || SHOP_INFO.phone,
      shopNotice: 'เปิดบริการตามปกติ 10:00 - 20:00 น. รับจองคิว 24 ชม.',
      hapticEnabled: true
    };
  });

  const handleUpdateShopInfo = async (updated: ShopInfo) => {
    setShopInfo(updated);
    try {
      localStorage.setItem('bbb_shop_info', JSON.stringify(updated));
    } catch {
      // ignore
    }
    try {
      await saveShopInfoToFirestore(updated);
    } catch (err) {
      console.error('Failed to sync shop info to Firestore:', err);
    }
    setShopSettings(prev => ({
      ...prev,
      shopPhone: updated.phone
    }));
  };

  // Services Management Handlers
  const handleSaveService = (serviceToSave: BarberService) => {
    setServices(prev => {
      const existsIndex = prev.findIndex(s => s.id === serviceToSave.id);
      let updatedList: BarberService[];
      if (existsIndex >= 0) {
        updatedList = [...prev];
        updatedList[existsIndex] = serviceToSave;
      } else {
        updatedList = [serviceToSave, ...prev];
      }
      try {
        localStorage.setItem('bbb_services', JSON.stringify(updatedList));
      } catch {
        // ignore
      }
      return updatedList;
    });

    setToast({
      message: `บันทึกบริการ "${serviceToSave.name}" เรียบร้อยแล้ว`,
      type: 'success'
    });
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== serviceId);
      try {
        localStorage.setItem('bbb_services', JSON.stringify(updated));
      } catch {
        // ignore
      }
      // If deleted service was selected, switch to first available
      if (selectedServiceId === serviceId && updated.length > 0) {
        setSelectedServiceId(updated[0].id);
      }
      return updated;
    });

    setToast({
      message: 'ลบรายการบริการเรียบร้อยแล้ว',
      type: 'info'
    });
  };

  const handleResetServices = () => {
    setServices(INITIAL_SERVICES);
    try {
      localStorage.setItem('bbb_services', JSON.stringify(INITIAL_SERVICES));
    } catch {
      // ignore
    }
    setSelectedServiceId(INITIAL_SERVICES[0].id);
    setToast({
      message: 'รีเซ็ตรายการบริการกลับเป็นค่าเริ่มต้นแล้ว',
      type: 'info'
    });
  };

  // Barbers Management Handlers
  const handleSaveBarber = (barberToSave: Barber) => {
    setBarbers(prev => {
      const existsIndex = prev.findIndex(b => b.id === barberToSave.id);
      let updatedList: Barber[];
      if (existsIndex >= 0) {
        updatedList = [...prev];
        updatedList[existsIndex] = barberToSave;
      } else {
        updatedList = [...prev, barberToSave];
      }
      try {
        localStorage.setItem('bbb_barbers', JSON.stringify(updatedList));
      } catch {
        // ignore
      }
      return updatedList;
    });

    setToast({
      message: `บันทึกข้อมูล "${barberToSave.nickname || barberToSave.name}" เรียบร้อยแล้ว`,
      type: 'success'
    });
  };

  const handleDeleteBarber = (barberId: string) => {
    setBarbers(prev => {
      const updated = prev.filter(b => b.id !== barberId);
      try {
        localStorage.setItem('bbb_barbers', JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (selectedBarberId === barberId) {
        setSelectedBarberId('any');
      }
      return updated;
    });

    setToast({
      message: 'ลบโปรไฟล์ช่างเรียบร้อยแล้ว',
      type: 'info'
    });
  };

  // Booking Form State
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bbb_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch {
      // fallback
    }
    return INITIAL_SERVICES[0].id;
  });
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals & Popups
  const [viewingBarberDetail, setViewingBarberDetail] = useState<Barber | null>(null);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [isShopInfoOpen, setIsShopInfoOpen] = useState<boolean>(false);
  const [isQuickWalkInOpen, setIsQuickWalkInOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'shop' | 'qr' | 'barbers' | 'sound' | 'database' | 'security'>('shop');
  const [barberModalState, setBarberModalState] = useState<{
    isOpen: boolean;
    barber: Barber | null;
  }>({
    isOpen: false,
    barber: null
  });
  const [serviceModalState, setServiceModalState] = useState<{
    isOpen: boolean;
    service: BarberService | null;
  }>({
    isOpen: false,
    service: null
  });
  const [depositModalState, setDepositModalState] = useState<{
    isOpen: boolean;
    booking: Booking | null;
  }>({
    isOpen: false,
    booking: null
  });
  const [checkoutModalState, setCheckoutModalState] = useState<{
    isOpen: boolean;
    booking: Booking | null;
  }>({
    isOpen: false,
    booking: null
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Security & Admin Edit PIN Auth State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [pinAuthModal, setPinAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    title: 'กรุณาใส่รหัสเพื่อแก้ไขข้อมูล',
    description: 'กรอกรหัส PIN ผู้ดูแล/พนักงานเพื่อเข้าสู่โหมดแก้ไข',
    onSuccess: () => {}
  });

  const requireAdminAuth = (action: () => void, title?: string, description?: string) => {
    if (isAdminUnlocked) {
      action();
      return;
    }
    setPinAuthModal({
      isOpen: true,
      title: title || 'กรุณาใส่รหัสเพื่อแก้ไขข้อมูล',
      description: description || 'กรอกรหัส PIN ผู้ดูแล/พนักงาน (ค่าเริ่มต้น: 1234)',
      onSuccess: () => {
        setIsAdminUnlocked(true);
        action();
        setToast({
          message: 'ปลดล็อกโหมดแก้ไขข้อมูลสำเร็จ (Admin Mode)',
          type: 'success'
        });
      }
    });
  };

  const handleToggleAdminLock = () => {
    if (isAdminUnlocked) {
      setIsAdminUnlocked(false);
      setToast({
        message: 'ล็อกโหมดแก้ไขข้อมูลเรียบร้อย',
        type: 'info'
      });
    } else {
      requireAdminAuth(() => {}, 'ปลดล็อกโหมดแก้ไขข้อมูล', 'กรอกรหัส PIN ผู้ดูแลเพื่อเปิดใช้งานโหมดแก้ไข');
    }
  };

  // Initialize Firestore listeners
  useEffect(() => {
    // Seed initial docs if needed
    initializeFirestoreData();

    // Subscribe to real-time booking stream
    const unsubscribeBookings = subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings);
    });

    // Subscribe to real-time expenses stream
    const unsubscribeExpenses = subscribeToExpenses((updatedExpenses) => {
      setExpenses(updatedExpenses);
    });

    // Subscribe to real-time transactions stream
    const unsubscribeTransactions = subscribeToTransactions((updatedTransactions) => {
      setTransactions(updatedTransactions);
    });

    // Subscribe to shop info updates
    const unsubscribeShopInfo = subscribeToShopInfo((updatedInfo) => {
      setShopInfo((prev) => ({
        ...SHOP_INFO,
        ...prev,
        ...updatedInfo,
        defaultCommissionRate: updatedInfo.defaultCommissionRate ?? prev.defaultCommissionRate ?? SHOP_INFO.defaultCommissionRate ?? 50,
        defaultDepositAmount: updatedInfo.defaultDepositAmount ?? prev.defaultDepositAmount ?? SHOP_INFO.defaultDepositAmount ?? 100,
        logoUrl: updatedInfo.logoUrl || '/logo.jpg'
      }));
    });

    // Subscribe to barbers updates
    const unsubscribeBarbers = subscribeToBarbers((updatedBarbers) => {
      if (updatedBarbers && updatedBarbers.length > 0) {
        setBarbers(updatedBarbers);
      }
    });

    // Subscribe to services updates
    const unsubscribeServices = subscribeToServices((updatedServices) => {
      if (updatedServices && updatedServices.length > 0) {
        setServices(updatedServices);
      }
    });

    return () => {
      unsubscribeBookings();
      unsubscribeExpenses();
      unsubscribeTransactions();
      unsubscribeShopInfo();
      unsubscribeBarbers();
      unsubscribeServices();
    };
  }, []);

  // Selected Entities
  const selectedBarber = useMemo(() => {
    if (selectedBarberId === 'any') {
      return {
        id: 'any',
        name: 'ช่างที่ว่างเร็วที่สุด',
        nickname: 'ช่างคนไหนก็ได้ (ว่างเร็วที่สุด)',
        title: 'ระบบจัดช่างที่ว่างให้อัตโนมัติ',
        experienceYears: 8,
        avatar: '',
        bio: '',
        specialties: [],
        rating: 4.9,
        reviewsCount: 650,
        instagram: '',
        status: 'available' as const,
        workDays: 'ทุกวัน',
        workHours: '10:00 - 20:00'
      };
    }
    return barbers.find(b => b.id === selectedBarberId) || barbers[0];
  }, [barbers, selectedBarberId]);

  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  // Available Time Slots Calculation for Selected Date & Barber
  const timeSlots = useMemo(() => {
    return calculateSlotAvailability(
      selectedDate,
      selectedBarberId,
      bookings,
      barbers
    );
  }, [selectedDate, selectedBarberId, bookings, barbers]);

  // Reset selected time if the currently selected slot is not available in the new date/barber
  useEffect(() => {
    if (selectedTime) {
      const currentSlot = timeSlots.find(s => s.time === selectedTime);
      if (!currentSlot || !currentSlot.isAvailable) {
        setSelectedTime('');
      }
    }
  }, [timeSlots, selectedTime]);

  // Form Validation
  const { isValid, missingMessage } = useMemo(() => {
    if (!selectedTime) {
      return { isValid: false, missingMessage: 'กรุณาเลือกเวลาที่สะดวก (Available Slot)' };
    }
    if (!customerName.trim()) {
      return { isValid: false, missingMessage: 'กรุณากรอกชื่อผู้จอง' };
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      return { isValid: false, missingMessage: 'กรุณากรอกเบอร์โทรศัพท์ 9-10 หลัก' };
    }
    return { isValid: true, missingMessage: '' };
  }, [selectedTime, customerName, customerPhone]);

  // Handle Booking Submission
  const handleCreateBooking = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Determine final assigned barber
      let finalBarberId = selectedBarberId;
      let finalBarberName = selectedBarber.nickname;

      if (selectedBarberId === 'any') {
        const assignedBarber = pickFreeBarberForSlot(selectedDate, selectedTime, bookings, barbers);
        if (assignedBarber) {
          finalBarberId = assignedBarber.id;
          finalBarberName = assignedBarber.nickname;
        } else {
          finalBarberId = barbers[0].id;
          finalBarberName = barbers[0].nickname;
        }
      }

      const bookingCode = generateBookingCode();
      const depositAmount = shopInfo.defaultDepositAmount || 100;
      const newBookingData: Omit<Booking, 'id'> = {
        bookingCode,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerNote: customerNote.trim(),
        barberId: finalBarberId,
        barberName: finalBarberName,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        durationMinutes: selectedService.durationMinutes,
        date: selectedDate,
        timeSlot: selectedTime,
        status: 'confirmed',
        createdAt: Date.now(),
        depositAmount,
        depositPaid: false,
        paymentStatus: 'unpaid',
        commissionRate: 50
      };

      const docId = await createBooking(newBookingData);
      
      const createdBookingWithId: Booking = {
        ...newBookingData,
        id: docId
      };

      // Show ticket modal and reset form
      setActiveTicketBooking(createdBookingWithId);
      if (shopSettings.soundEnabled) {
        playBarberChime();
      }
      setToast({
        message: `จองคิวสำเร็จ! รหัส ${bookingCode} นัดกับ ${finalBarberName}`,
        type: 'success'
      });

      // Reset form selections
      setSelectedTime('');
      setCustomerNote('');
    } catch (error) {
      console.error('Booking submission error:', error);
      setToast({
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Walk-in Submission Handler
  const handleCreateWalkIn = async (walkInData: Omit<Booking, 'id'>, autoOpenTicket = true): Promise<string> => {
    try {
      const docId = await createBooking(walkInData);
      
      const fullBooking: Booking = {
        ...walkInData,
        id: docId
      };

      // If user chose upfront payment (cash or promptpay qr)
      if (walkInData.paymentStatus === 'completed' && walkInData.paidAmount) {
        const barberCommission = walkInData.barberCommission || Math.round(walkInData.paidAmount * 0.5);
        const shopShare = walkInData.shopShare || (walkInData.paidAmount - barberCommission);

        await addTransactionToFirestore({
          bookingId: docId,
          bookingCode: walkInData.bookingCode,
          type: 'service_payment',
          amount: walkInData.paidAmount,
          barberId: walkInData.barberId,
          barberName: walkInData.barberName,
          paymentMethod: walkInData.paymentMethod || 'cash',
          barberCommission,
          shopShare,
          note: `Walk-in หน้าร้าน #${walkInData.bookingCode} - ${walkInData.serviceName} (ช่าง ${walkInData.barberName} ได้รับ ฿${barberCommission})`,
          date: walkInData.date || toDateString(new Date()),
          createdAt: Date.now(),
          serviceName: walkInData.serviceName
        });
      }

      if (shopSettings.soundEnabled) {
        playBarberChime();
      }

      setToast({
        message: `เพิ่มคิว Walk-in #${walkInData.bookingCode} (ช่าง ${walkInData.barberName}) เรียบร้อย!`,
        type: 'success'
      });

      if (autoOpenTicket) {
        setActiveTicketBooking(fullBooking);
      }

      return docId;
    } catch (err) {
      console.error('Walk-in submission error:', err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการบันทึก Walk-in กรุณาลองใหม่',
        type: 'error'
      });
      throw err;
    }
  };

  // Payment & Finance Handlers
  const handleConfirmDepositPayment = async (bookingId: string, depositAmount: number, slipNote?: string) => {
    try {
      const targetBooking = bookings.find(b => b.id === bookingId) || activeTicketBooking;
      
      await updateBookingPaymentDetails(bookingId, {
        depositPaid: true,
        depositAmount,
        depositPaidAt: Date.now(),
        depositSlipNote: slipNote || '',
        paymentStatus: 'deposit_paid'
      });

      // Record transaction
      if (targetBooking) {
        await addTransactionToFirestore({
          bookingId,
          bookingCode: targetBooking.bookingCode,
          type: 'deposit',
          amount: depositAmount,
          barberId: targetBooking.barberId,
          barberName: targetBooking.barberName,
          paymentMethod: 'promptpay_qr',
          note: `มัดจำคิว #${targetBooking.bookingCode} (${targetBooking.customerName})`,
          date: targetBooking.date || toDateString(new Date()),
          createdAt: Date.now(),
          serviceName: targetBooking.serviceName
        });
      }

      // Update active ticket state if currently viewing it
      if (activeTicketBooking && activeTicketBooking.id === bookingId) {
        setActiveTicketBooking(prev => prev ? {
          ...prev,
          depositPaid: true,
          depositAmount,
          paymentStatus: 'deposit_paid'
        } : null);
      }

      if (shopSettings.soundEnabled) {
        playBarberChime();
      }

      setToast({
        message: `บันทึกการรับเงินมัดจำ ฿${depositAmount} สำเร็จแล้ว!`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error confirming deposit:', err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการบันทึกมัดจำ',
        type: 'error'
      });
    }
  };

  const handleCompleteCheckout = async (
    bookingId: string,
    paymentMethod: PaymentMethod,
    totalPaid: number,
    barberCommission: number,
    shopShare: number
  ) => {
    try {
      const targetBooking = bookings.find(b => b.id === bookingId);
      if (!targetBooking) return;

      await updateBookingPaymentDetails(bookingId, {
        status: 'completed',
        paymentStatus: 'completed',
        paidAmount: totalPaid,
        paymentMethod,
        barberCommission,
        shopShare,
        settledAt: Date.now()
      });

      // Record completed transaction
      await addTransactionToFirestore({
        bookingId,
        bookingCode: targetBooking.bookingCode,
        type: 'service_payment',
        amount: totalPaid,
        barberId: targetBooking.barberId,
        barberName: targetBooking.barberName,
        paymentMethod,
        barberCommission,
        shopShare,
        note: `ชำระค่าบริการ #${targetBooking.bookingCode} - ${targetBooking.serviceName} (ช่าง ${targetBooking.barberName} ได้รับ ฿${barberCommission})`,
        date: targetBooking.date || toDateString(new Date()),
        createdAt: Date.now(),
        serviceName: targetBooking.serviceName
      });

      if (shopSettings.soundEnabled) {
        playBarberChime();
      }

      setToast({
        message: `เช็คบิลเสร็จสิ้น! รับเงิน ฿${totalPaid} (ค่าคอมช่าง ${targetBooking.barberName} 50%: ฿${barberCommission})`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error during checkout:', err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการเช็คบิล',
        type: 'error'
      });
    }
  };

  const handleAddExpense = async (expense: Omit<ShopExpense, 'id'>) => {
    try {
      await addExpenseToFirestore(expense);
      setToast({
        message: `บันทึกรายจ่าย "${expense.title}" ฿${expense.amount} สำเร็จ`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการบันทึกรายจ่าย',
        type: 'error'
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpenseFromFirestore(expenseId);
      setToast({
        message: 'ลบรายการค่าใช้จ่ายเรียบร้อย',
        type: 'info'
      });
    } catch (err) {
      console.error('Error deleting expense:', err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการลบรายจ่าย',
        type: 'error'
      });
    }
  };

  // Status update handler (for Queue Board)
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, status);
      if (shopSettings.soundEnabled) {
        playBarberChime();
      }
      const statusLabels: Record<BookingStatus, string> = {
        pending: 'รอยืนยัน',
        confirmed: 'ยืนยันคิวแล้ว',
        in_progress: 'กำลังเริ่มตัดผม',
        completed: 'ตัดผมเสร็จสิ้นเรียบร้อย',
        cancelled: 'ยกเลิกคิวแล้ว'
      };
      setToast({
        message: `อัปเดตสถานะคิวเป็น: ${statusLabels[status]}`,
        type: 'info'
      });
    } catch (err) {
      console.error(err);
      setToast({
        message: 'ไม่สามารถอัปเดตสถานะคิวได้',
        type: 'error'
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      if (activeTicketBooking && activeTicketBooking.id === bookingId) {
        setActiveTicketBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
      setToast({
        message: 'ยกเลิกคิวการจองเรียบร้อยแล้ว',
        type: 'info'
      });
    } catch (err) {
      console.error(err);
      setToast({
        message: 'ไม่สามารถยกเลิกคิวได้',
        type: 'error'
      });
    }
  };

  const handleToggleBarberStatus = (barberId: string) => {
    setBarbers(prev => prev.map(b => {
      if (b.id === barberId) {
        const nextStatus = b.status === 'available' ? 'day_off' : 'available';
        return {
          ...b,
          status: nextStatus
        };
      }
      return b;
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<ShopSettingsState>) => {
    setShopSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings
      };
      try {
        localStorage.setItem('bbb_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetSampleData = async () => {
    try {
      await seedSampleBookings();
      setToast({
        message: 'รีเซ็ตและโหลดข้อมูลตัวอย่างสำหรับทดสอบเรียบร้อย',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      setToast({
        message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลตัวอย่าง',
        type: 'error'
      });
    }
  };

  const todayStr = toDateString(new Date());
  const totalActiveBookingsToday = bookings.filter(
    b => b.date === todayStr && b.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col justify-between selection:bg-[#FACC15] selection:text-black font-sans">
      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />

      {/* Mobile Wrapper */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#0A0A0B] flex flex-col shadow-2xl relative border-x border-white/5">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenShopInfo={() => setIsShopInfoOpen(true)}
          onOpenSettings={() => {
            setSettingsInitialTab('shop');
            setIsSettingsOpen(true);
          }}
          onOpenQuickWalkIn={() => setIsQuickWalkInOpen(true)}
          totalActiveBookingsToday={totalActiveBookingsToday}
          shopInfo={shopInfo}
          isAdminUnlocked={isAdminUnlocked}
          onToggleAdminLock={handleToggleAdminLock}
          staffPin={shopSettings.staffPin || '1234'}
          onOpenSecuritySettings={() => {
            setSettingsInitialTab('security');
            setIsSettingsOpen(true);
          }}
          onOpenQrSettings={() => {
            setSettingsInitialTab('qr');
            setIsSettingsOpen(true);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-4 space-y-6">
          {activeTab === 'book' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Notice if booking is paused in settings */}
              {!shopSettings.isOnlineBookingOpen && (
                <div className="p-4 bg-[#1C1F26] border border-[#FACC15]/40 rounded-3xl flex items-start gap-3 shadow-lg">
                  <AlertOctagon className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">
                      ระบบปิดรับจองออนไลน์ชั่วคราว
                    </h4>
                    <p className="text-xs text-gray-300 mt-1 font-medium">
                      {shopSettings.shopNotice || 'กรุณาโทรติดต่อร้านโดยตรง หรือ Walk-in หน้าร้าน'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`tel:${shopSettings.shopPhone}`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FACC15] text-black font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>โทร {shopSettings.shopPhone}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => requireAdminAuth(() => setIsSettingsOpen(true), 'ตั้งค่าระบบร้าน', 'กรอกรหัส PIN เพื่อเข้าสู่หน้าตั้งค่า')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0A0A0B] text-gray-300 border border-white/10 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        เปิดในตั้งค่า
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {/* Quick Walk-in Quick Entry Card */}
              <div className="bg-gradient-to-r from-amber-500/15 via-[#FACC15]/10 to-amber-500/15 border border-[#FACC15]/30 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shrink-0 shadow-lg">
                    <Zap className="w-6 h-6 fill-black stroke-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white uppercase tracking-tight font-heading">
                        ลูกค้า WALK-IN หน้าร้าน?
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FACC15] text-black text-[9px] font-black uppercase tracking-wider">
                        ด่วนทันที
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5 font-medium">
                      ลูกค้ามาถึงร้านแล้ว ลงคิวหน้าร้าน หรือเริ่มตัดได้ทันทีใน 10 วินาที
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickWalkInOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:from-[#FDE047] hover:to-[#FACC15] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ เพิ่มคิว WALK-IN</span>
                </button>
              </div>

              {/* Studio Visual Showcase Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-[#121418] group">
                <div className="h-40 sm:h-48 w-full relative overflow-hidden">
                  <img
                    src="/shop_hero.jpg"
                    alt="Big Bang Barber Shop Interior"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] text-[#FACC15] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#FACC15]" />
                      <span>PREMIUM GENTLEMEN SALON</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => setIsShopInfoOpen(true)}
                      className="px-3 py-1 rounded-full bg-black/75 hover:bg-black backdrop-blur-md border border-white/15 text-white text-[11px] font-bold cursor-pointer transition-all active:scale-95"
                    >
                      ดูข้อมูลร้าน & แผนที่
                    </button>
                  </div>
                </div>

                <div className="p-4 -mt-6 relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-heading flex items-center gap-2">
                        <span>{shopInfo.name}</span>
                        <span className="text-[#FACC15] text-[11px] not-italic font-bold px-2 py-0.5 rounded-md bg-[#FACC15]/10 border border-[#FACC15]/30">
                          ทองหล่อ ซอย 55
                        </span>
                      </h2>
                      <p className="text-xs text-gray-400 font-medium line-clamp-1 mt-0.5">
                        {shopInfo.tagline} • ทีมช่างมืออาชีพ {barbers.length} ท่าน พร้อมบริการ
                      </p>
                    </div>

                    {/* Barber Avatars Thumbnail Group */}
                    <div className="flex -space-x-2 shrink-0">
                      {barbers.slice(0, 3).map((b) => (
                        <img
                          key={b.id}
                          src={b.avatar || '/barber_ek.jpg'}
                          alt={b.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#121418] shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Barber Selection */}
              <BarberSelector
                barbers={barbers}
                selectedBarberId={selectedBarberId}
                onSelectBarber={(id) => setSelectedBarberId(id)}
                onViewBarberDetail={(barber) => setViewingBarberDetail(barber)}
                onEditBarber={(barber) => requireAdminAuth(() => setBarberModalState({ isOpen: true, barber }), 'แก้ไขข้อมูลช่าง', `กรอกรหัส PIN เพื่อแก้ไขข้อมูลโปรไฟล์ของ ${barber.nickname}`)}
                onAddNewBarber={() => requireAdminAuth(() => setBarberModalState({ isOpen: true, barber: null }), 'เพิ่มช่างใหม่', 'กรอกรหัส PIN เพื่อเพิ่มช่างใหม่ในระบบ')}
              />

              {/* Step 2: Service Selection */}
              <ServiceSelector
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectService={(id) => setSelectedServiceId(id)}
                onEditService={(service) => requireAdminAuth(() => setServiceModalState({ isOpen: true, service }), 'แก้ไขบริการ', `กรอกรหัส PIN เพื่อแก้ไขราคาหรือข้อมูลบริการ ${service.name}`)}
                onAddNewService={() => requireAdminAuth(() => setServiceModalState({ isOpen: true, service: null }), 'เพิ่มบริการใหม่', 'กรอกรหัส PIN เพื่อเพิ่มรายการบริการใหม่')}
              />

              {/* Step 3: Date Picker */}
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={(dateStr) => setSelectedDate(dateStr)}
              />

              {/* Step 4: Available Time Slots */}
              <TimeSlotSelector
                slots={timeSlots}
                selectedTime={selectedTime}
                onSelectTime={(time) => setSelectedTime(time)}
                selectedBarberName={selectedBarber.nickname}
                selectedBarberId={selectedBarberId}
                barbers={barbers}
              />

              {/* Step 5: Customer Information Form */}
              <BookingForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerNote={customerNote}
                setCustomerNote={setCustomerNote}
              />

              {/* Bottom spacing before fixed bar */}
              <div className="h-6" />
            </div>
          )}

          {activeTab === 'my-bookings' && (
            <MyBookingsView
              bookings={bookings}
              onSelectBookingForTicket={(b) => setActiveTicketBooking(b)}
              onCancelBooking={handleCancelBooking}
              onGoToBooking={() => setActiveTab('book')}
              onOpenDepositModal={(b) => setDepositModalState({ isOpen: true, booking: b })}
            />
          )}

          {activeTab === 'queue-board' && (
            <QueueBoardView
              bookings={bookings}
              barbers={barbers}
              onUpdateStatus={handleUpdateBookingStatus}
              onOpenQuickWalkIn={() => setIsQuickWalkInOpen(true)}
              onSelectBookingForTicket={(b) => setActiveTicketBooking(b)}
              onOpenDepositModal={(b) => setDepositModalState({ isOpen: true, booking: b })}
              onOpenCheckoutModal={(b) => setCheckoutModalState({ isOpen: true, booking: b })}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceAccountingView
              bookings={bookings}
              barbers={barbers}
              expenses={expenses}
              transactions={transactions}
              shopInfo={shopInfo}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onOpenDepositModal={(b) => setDepositModalState({ isOpen: true, booking: b })}
              onOpenCheckoutModal={(b) => setCheckoutModalState({ isOpen: true, booking: b })}
            />
          )}
        </main>

        {/* Sticky Bottom Action Bar when on Booking tab */}
        {activeTab === 'book' && (
          <BookingSummaryBottomBar
            barberName={selectedBarber.nickname}
            serviceName={selectedService.name}
            servicePrice={selectedService.price}
            date={selectedDate}
            timeSlot={selectedTime}
            isValid={isValid}
            missingFieldMessage={missingMessage}
            onProceed={handleCreateBooking}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Footer */}
        <footer className="px-4 py-6 bg-[#0A0A0B] border-t border-white/5 text-center text-xs text-gray-500 space-y-1">
          <p className="font-bold text-gray-400 uppercase tracking-wider">
            {shopInfo.name || 'BIGBANG BARBER'} {shopInfo.tagline ? `• ${shopInfo.tagline}` : ''} • TEL {shopInfo.phone}
          </p>
          <p className="text-[11px] text-gray-600 font-mono">
            FIRESTORE CONNECTED: <span className="text-[#FACC15]">bigbangbarber-2f657</span>
          </p>
        </footer>
      </div>

      {/* Barber Detail Profile Modal */}
      <BarberDetailModal
        barber={viewingBarberDetail}
        onClose={() => setViewingBarberDetail(null)}
        onSelectAndClose={(barberId) => {
          setSelectedBarberId(barberId);
          setViewingBarberDetail(null);
        }}
        onEditBarber={(barber) => requireAdminAuth(() => setBarberModalState({ isOpen: true, barber }), 'แก้ไขข้อมูลช่าง', `กรอกรหัส PIN เพื่อแก้ไขข้อมูล ${barber.nickname}`)}
      />

      {/* Digital Ticket / Pass Modal */}
      <BookingTicketModal
        booking={activeTicketBooking}
        onClose={() => setActiveTicketBooking(null)}
        onCancelBooking={handleCancelBooking}
        onOpenDepositModal={(b) => setDepositModalState({ isOpen: true, booking: b })}
        shopInfo={shopInfo}
      />

      {/* Deposit QR Payment Modal */}
      <DepositPaymentModal
        isOpen={depositModalState.isOpen}
        onClose={() => setDepositModalState({ isOpen: false, booking: null })}
        booking={depositModalState.booking}
        shopInfo={shopInfo}
        onConfirmDeposit={handleConfirmDepositPayment}
        onUpdateShopInfo={handleUpdateShopInfo}
      />

      {/* Checkout & 50% Barber Commission Payment Modal */}
      <CheckoutPaymentModal
        isOpen={checkoutModalState.isOpen}
        onClose={() => setCheckoutModalState({ isOpen: false, booking: null })}
        booking={checkoutModalState.booking}
        shopInfo={shopInfo}
        onCompleteCheckout={handleCompleteCheckout}
        onUpdateShopInfo={handleUpdateShopInfo}
      />

      {/* Shop Info Modal */}
      <ShopInfoModal
        isOpen={isShopInfoOpen}
        onClose={() => setIsShopInfoOpen(false)}
        shopInfo={shopInfo}
        onUpdateShopInfo={handleUpdateShopInfo}
        onShowToast={(msg, type) => setToast({ message: msg, type: type || 'info' })}
        onRequireAuth={requireAdminAuth}
        isAdmin={isAdminUnlocked}
      />

      {/* Quick Walk-in Modal */}
      <QuickWalkInModal
        isOpen={isQuickWalkInOpen}
        onClose={() => setIsQuickWalkInOpen(false)}
        barbers={barbers}
        services={services}
        bookings={bookings}
        onAddBooking={handleCreateWalkIn}
      />

      {/* Barber Add/Edit Modal */}
      <BarberEditModal
        isOpen={barberModalState.isOpen}
        onClose={() => setBarberModalState({ isOpen: false, barber: null })}
        barber={barberModalState.barber}
        onSave={handleSaveBarber}
        onDelete={handleDeleteBarber}
        canDelete={barbers.length > 1}
      />

      {/* Service Add/Edit Modal */}
      <ServiceEditModal
        isOpen={serviceModalState.isOpen}
        onClose={() => setServiceModalState({ isOpen: false, service: null })}
        service={serviceModalState.service}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
        onResetDefaults={handleResetServices}
        canDelete={services.length > 1}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        barbers={barbers}
        onToggleBarberStatus={handleToggleBarberStatus}
        settings={shopSettings}
        onUpdateSettings={handleUpdateSettings}
        bookings={bookings}
        onResetSampleData={handleResetSampleData}
        onShowToast={(msg, type) => setToast({ message: msg, type: type || 'info' })}
        onEditBarber={(barber) => setBarberModalState({ isOpen: true, barber })}
        onAddNewBarber={() => setBarberModalState({ isOpen: true, barber: null })}
        initialTab={settingsInitialTab}
        shopInfo={shopInfo}
        onUpdateShopInfo={handleUpdateShopInfo}
      />

      {/* Security PIN Authentication Modal */}
      <PinAuthModal
        isOpen={pinAuthModal.isOpen}
        onClose={() => setPinAuthModal(prev => ({ ...prev, isOpen: false }))}
        onSuccess={pinAuthModal.onSuccess}
        correctPin={shopSettings.staffPin || '1234'}
        title={pinAuthModal.title}
        description={pinAuthModal.description}
        onOpenChangePin={() => {
          setSettingsInitialTab('security');
          setIsSettingsOpen(true);
        }}
      />
    </div>
  );
}
