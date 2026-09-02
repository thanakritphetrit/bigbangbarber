import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Booking, Barber, BarberService, BookingStatus, ShopInfo } from '../types';
import { INITIAL_BARBERS, INITIAL_SERVICES, SHOP_INFO } from '../data/mockData';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || "AIzaSyBL9adzI3-NgZFRu3LSDbOVbnpRAXg4pyE",
  authDomain: firebaseConfigJson.authDomain || "bigbangbarber-2f657.firebaseapp.com",
  projectId: firebaseConfigJson.projectId || "bigbangbarber-2f657",
  storageBucket: firebaseConfigJson.storageBucket || "bigbangbarber-2f657.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "716536571100",
  appId: firebaseConfigJson.appId || "1:716536571100:web:4ebe2c00bebf07fc818019"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use specific database ID if configured, or default
export const db = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

const BOOKINGS_COLLECTION = 'bookings';
const BARBERS_COLLECTION = 'barbers';
const SERVICES_COLLECTION = 'services';
const SHOP_INFO_COLLECTION = 'shop_info';
const SHOP_INFO_DOC = 'main';

// Local storage backup keys for offline resilience
const LOCAL_BOOKINGS_KEY = 'bbb_bookings_cache';
const LOCAL_BARBERS_KEY = 'bbb_barbers';
const LOCAL_SERVICES_KEY = 'bbb_services';
const LOCAL_SHOP_INFO_KEY = 'bbb_shop_info';

/**
 * Generate a unique 4-character uppercase alphanumeric booking code
 * e.g. BBB-8492
 */
export function generateBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BBB-${code}`;
}

/**
 * Listen to all bookings in real time
 */
export function subscribeToBookings(onUpdate: (bookings: Booking[]) => void) {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const bookings: Booking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          bookings.push({
            id: docSnap.id,
            bookingCode: data.bookingCode || docSnap.id.slice(0, 6).toUpperCase(),
            customerName: data.customerName || '',
            customerPhone: data.customerPhone || '',
            customerNote: data.customerNote || '',
            barberId: data.barberId || 'any',
            barberName: data.barberName || '',
            serviceId: data.serviceId || '',
            serviceName: data.serviceName || '',
            servicePrice: Number(data.servicePrice) || 0,
            durationMinutes: Number(data.durationMinutes) || 45,
            date: data.date || '',
            timeSlot: data.timeSlot || '',
            status: data.status || 'confirmed',
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt
          });
        });

        // Save local backup
        try {
          localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
        } catch {
          // ignore storage quota errors
        }

        onUpdate(bookings);
      },
      (error) => {
        console.warn('Firestore real-time listener error, falling back to local state:', error);
        // Fallback to localStorage cache if network fails
        try {
          const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
          if (cached) {
            onUpdate(JSON.parse(cached));
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  } catch (err) {
    console.error('Error initializing Firestore bookings subscription:', err);
    return () => {};
  }
}

/**
 * Save new booking to Firestore
 */
export async function createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
  const bookingData = {
    ...booking,
    createdAt: Date.now(),
    timestamp: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);
    
    // Also update local cache
    try {
      const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
      const list: Booking[] = cached ? JSON.parse(cached) : [];
      list.push({ ...bookingData, id: docRef.id });
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    return docRef.id;
  } catch (error) {
    console.error('Failed to create booking in Firestore, saving locally:', error);
    // Offline local fallback
    const localId = 'local_' + Date.now();
    try {
      const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
      const list: Booking[] = cached ? JSON.parse(cached) : [];
      list.push({ ...bookingData, id: localId });
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
    return localId;
  }
}

/**
 * Update a booking's status
 */
export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
  try {
    if (!bookingId.startsWith('local_')) {
      const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: Date.now()
      });
    }

    // Update local cache
    const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (cached) {
      const list: Booking[] = JSON.parse(cached);
      const idx = list.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        list[idx].status = status;
        list[idx].updatedAt = Date.now();
        localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
      }
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

/**
 * Delete or cancel a booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    if (!bookingId.startsWith('local_')) {
      const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
      await deleteDoc(docRef);
    }

    // Update local cache
    const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (cached) {
      const list: Booking[] = JSON.parse(cached).filter((b: Booking) => b.id !== bookingId);
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

/**
 * Listen to Shop Info from Firestore in real time
 */
export function subscribeToShopInfo(onUpdate: (shopInfo: ShopInfo) => void) {
  try {
    const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ShopInfo;
        const merged: ShopInfo = {
          ...SHOP_INFO,
          ...data,
          logoUrl: data.logoUrl || '/logo.jpg'
        };
        try {
          localStorage.setItem(LOCAL_SHOP_INFO_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        onUpdate(merged);
      }
    }, (err) => {
      console.warn('Firestore shop_info subscribe error:', err);
    });
  } catch (e) {
    console.error('Error subscribing to shop info:', e);
    return () => {};
  }
}

/**
 * Save Shop Info to Firestore
 */
export async function saveShopInfoToFirestore(info: ShopInfo): Promise<void> {
  try {
    const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
    await setDoc(docRef, {
      ...info,
      updatedAt: Date.now()
    }, { merge: true });
    try {
      localStorage.setItem(LOCAL_SHOP_INFO_KEY, JSON.stringify(info));
    } catch {
      // ignore
    }
  } catch (err) {
    console.error('Failed to update shop_info in Firestore:', err);
    throw err;
  }
}

/**
 * Listen to Barbers in real time
 */
export function subscribeToBarbers(onUpdate: (barbers: Barber[]) => void) {
  try {
    const q = query(collection(db, BARBERS_COLLECTION));
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: Barber[] = [];
        snap.forEach(d => {
          list.push({ ...d.data(), id: d.id } as Barber);
        });
        try {
          localStorage.setItem(LOCAL_BARBERS_KEY, JSON.stringify(list));
        } catch {
          // ignore
        }
        onUpdate(list);
      }
    }, (err) => {
      console.warn('Firestore barbers subscribe error:', err);
    });
  } catch (e) {
    console.error('Error subscribing to barbers:', e);
    return () => {};
  }
}

/**
 * Save / Update Barber in Firestore
 */
export async function saveBarberToFirestore(barber: Barber): Promise<void> {
  try {
    const docRef = doc(db, BARBERS_COLLECTION, barber.id);
    await setDoc(docRef, {
      ...barber,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save barber to Firestore:', err);
    throw err;
  }
}

/**
 * Delete Barber from Firestore
 */
export async function deleteBarberFromFirestore(barberId: string): Promise<void> {
  try {
    const docRef = doc(db, BARBERS_COLLECTION, barberId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete barber from Firestore:', err);
    throw err;
  }
}

/**
 * Listen to Services in real time
 */
export function subscribeToServices(onUpdate: (services: BarberService[]) => void) {
  try {
    const q = query(collection(db, SERVICES_COLLECTION));
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: BarberService[] = [];
        snap.forEach(d => {
          list.push({ ...d.data(), id: d.id } as BarberService);
        });
        try {
          localStorage.setItem(LOCAL_SERVICES_KEY, JSON.stringify(list));
        } catch {
          // ignore
        }
        onUpdate(list);
      }
    }, (err) => {
      console.warn('Firestore services subscribe error:', err);
    });
  } catch (e) {
    console.error('Error subscribing to services:', e);
    return () => {};
  }
}

/**
 * Save / Update Service in Firestore
 */
export async function saveServiceToFirestore(service: BarberService): Promise<void> {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, service.id);
    await setDoc(docRef, {
      ...service,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save service to Firestore:', err);
    throw err;
  }
}

/**
 * Delete Service from Firestore
 */
export async function deleteServiceFromFirestore(serviceId: string): Promise<void> {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete service from Firestore:', err);
    throw err;
  }
}

/**
 * Initialize sample barbers, services, and shop info in Firestore if database is empty
 */
export async function initializeFirestoreData(): Promise<void> {
  try {
    // Check shop info doc
    const shopSnap = await getDoc(doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC));
    if (!shopSnap.exists()) {
      await setDoc(doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC), {
        ...SHOP_INFO,
        createdAt: Date.now()
      });
    }

    const barbersSnap = await getDocs(collection(db, BARBERS_COLLECTION));
    if (barbersSnap.empty) {
      for (const barber of INITIAL_BARBERS) {
        await setDoc(doc(db, BARBERS_COLLECTION, barber.id), barber);
      }
    }

    const servicesSnap = await getDocs(collection(db, SERVICES_COLLECTION));
    if (servicesSnap.empty) {
      for (const service of INITIAL_SERVICES) {
        await setDoc(doc(db, SERVICES_COLLECTION, service.id), service);
      }
    }
  } catch (err) {
    // If permission or network restriction, gracefully continue with local data
    console.warn('Notice: Firestore seed check:', err);
  }
}

/**
 * Seed realistic sample bookings for testing
 */
export async function seedSampleBookings(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const sampleList: Omit<Booking, 'id'>[] = [
    {
      bookingCode: 'BBB-A892',
      customerName: 'คุณกวิน ภักดี',
      customerPhone: '0812345678',
      customerNote: 'ขอทรงวินเทจ Pompadour ไถเปิดข้าง',
      barberId: 'barber_ek',
      barberName: 'ช่างเอก (Master Ek)',
      serviceId: 'srv_cut_wash',
      serviceName: 'ตัดผม + สระไดร์นวดศีรษะ',
      servicePrice: 450,
      durationMinutes: 60,
      date: today,
      timeSlot: '11:00',
      status: 'confirmed',
      createdAt: Date.now() - 3600000
    },
    {
      bookingCode: 'BBB-B410',
      customerName: 'คุณนรินทร์ วัฒนา',
      customerPhone: '0898765432',
      customerNote: 'เซ็ต Two-block สไตล์เกาหลี',
      barberId: 'barber_boss',
      barberName: 'ช่างบอส (Stylist Boss)',
      serviceId: 'srv_cut_style',
      serviceName: 'ตัดผม + เซ็ตทรงพรีเมียม',
      servicePrice: 350,
      durationMinutes: 45,
      date: today,
      timeSlot: '13:00',
      status: 'in_progress',
      createdAt: Date.now() - 1800000
    },
    {
      bookingCode: 'BBB-C751',
      customerName: 'คุณธนภพ อัครเดช',
      customerPhone: '0865551234',
      customerNote: 'สกินเฟด 0 mm. และกันเครา',
      barberId: 'barber_jack',
      barberName: 'ช่างแจ็ค (Barber Jack)',
      serviceId: 'srv_full_vip',
      serviceName: 'VIP Full Grooming Package',
      servicePrice: 850,
      durationMinutes: 90,
      date: today,
      timeSlot: '15:00',
      status: 'confirmed',
      createdAt: Date.now() - 7200000
    }
  ];

  for (const item of sampleList) {
    try {
      await createBooking(item);
    } catch (e) {
      console.error(e);
    }
  }
}


