import React, { useState, useEffect, useMemo } from 'react';
import { 
  Barber, 
  BarberService, 
  Booking, 
  BookingStatus 
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
  generateBookingCode 
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
import { Toast } from './components/Toast';
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
  Award
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings' | 'queue-board'>('book');

  // Master Data
  const [barbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [services] = useState<BarberService[]>(INITIAL_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Booking Form State
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(INITIAL_SERVICES[0].id);
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize Firestore listeners
  useEffect(() => {
    // Seed initial docs if needed
    initializeFirestoreData();

    // Subscribe to real-time booking stream
    const unsubscribe = subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings);
    });

    return () => {
      unsubscribe();
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
        createdAt: Date.now()
      };

      const docId = await createBooking(newBookingData);
      
      const createdBookingWithId: Booking = {
        ...newBookingData,
        id: docId
      };

      // Show ticket modal and reset form
      setActiveTicketBooking(createdBookingWithId);
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

  // Status update handler (for Queue Board)
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, status);
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

  const todayStr = toDateString(new Date());
  const totalActiveBookingsToday = bookings.filter(
    b => b.date === todayStr && b.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />

      {/* Mobile Wrapper */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-stone-950 flex flex-col shadow-2xl relative border-x border-stone-850">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenShopInfo={() => setIsShopInfoOpen(true)}
          totalActiveBookingsToday={totalActiveBookingsToday}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-4 space-y-6">
          {activeTab === 'book' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Hero Banner Feature */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600/30 via-stone-900 to-stone-950 border border-amber-500/20 p-4 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ระบบจองคิวตัดผม Real-Time</span>
                    </div>
                    <h2 className="text-lg font-black text-stone-100 tracking-tight font-heading">
                      เลือกช่าง เช็คเวลา จองได้ทันที
                    </h2>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      3 ช่างยอดฝีมือ 3 สไตล์ พร้อมระบบล็อคคิวแม่นยำ ไม่ต้องนั่งรอคิวนาน
                    </p>
                  </div>
                </div>

                {/* Live Stats Pills */}
                <div className="mt-3 pt-3 border-t border-stone-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] text-stone-400 block">ช่างมืออาชีพ</span>
                    <span className="font-extrabold text-amber-400 text-sm font-heading">3 ท่าน</span>
                  </div>
                  <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] text-stone-400 block">คิววันนี้</span>
                    <span className="font-extrabold text-stone-100 text-sm font-heading">
                      {totalActiveBookingsToday} คิว
                    </span>
                  </div>
                  <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] text-stone-400 block">เปิดทำการ</span>
                    <span className="font-extrabold text-emerald-400 text-sm font-heading">10:00-20:00</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Barber Selection */}
              <BarberSelector
                barbers={barbers}
                selectedBarberId={selectedBarberId}
                onSelectBarber={(id) => setSelectedBarberId(id)}
                onViewBarberDetail={(barber) => setViewingBarberDetail(barber)}
              />

              {/* Step 2: Service Selection */}
              <ServiceSelector
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectService={(id) => setSelectedServiceId(id)}
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
            />
          )}

          {activeTab === 'queue-board' && (
            <QueueBoardView
              bookings={bookings}
              barbers={barbers}
              onUpdateStatus={handleUpdateBookingStatus}
              onOpenQuickWalkIn={() => setIsQuickWalkInOpen(true)}
              onSelectBookingForTicket={(b) => setActiveTicketBooking(b)}
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
        <footer className="px-4 py-6 bg-stone-950 border-t border-stone-900 text-center text-xs text-stone-500 space-y-1">
          <p className="font-medium text-stone-400">
            Bigbangbarber ทองหล่อ • โทร {SHOP_INFO.phone}
          </p>
          <p className="text-[11px] text-stone-600">
            ฐานข้อมูลเรียลไทม์เชื่อมต่อกับ Firebase Firestore: <span className="font-mono text-stone-500">bigbangbarber-2f657</span>
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
      />

      {/* Digital Ticket / Pass Modal */}
      <BookingTicketModal
        booking={activeTicketBooking}
        onClose={() => setActiveTicketBooking(null)}
        onCancelBooking={handleCancelBooking}
      />

      {/* Shop Info Modal */}
      <ShopInfoModal
        isOpen={isShopInfoOpen}
        onClose={() => setIsShopInfoOpen(false)}
      />

      {/* Quick Walk-in Modal */}
      <QuickWalkInModal
        isOpen={isQuickWalkInOpen}
        onClose={() => setIsQuickWalkInOpen(false)}
        barbers={barbers}
        services={services}
        onAddBooking={createBooking}
      />
    </div>
  );
}
