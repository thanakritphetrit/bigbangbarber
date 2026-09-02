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
  serverTimestamp
} from 'firebase/firestore';
import { Booking, Barber, BarberService, BookingStatus } from '../types';
import { INITIAL_BARBERS, INITIAL_SERVICES } from '../data/mockData';
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

// Local storage backup keys for offline resilience
const LOCAL_BOOKINGS_KEY = 'bbb_bookings_cache';

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
 * Initialize sample barbers in Firestore if database is empty
 */
export async function initializeFirestoreData(): Promise<void> {
  try {
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
