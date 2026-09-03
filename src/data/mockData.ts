import { Barber, BarberService, ShopInfo } from '../types';

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber_ek',
    name: 'เอกชัย ชำนาญศิลป์',
    nickname: 'ช่างเอก (Master Ek)',
    title: 'Master Barber / Head Stylist',
    experienceYears: 10,
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    bio: 'ช่างใหญ่ผู้ก่อตั้งร้าน บาร์เบอร์สไตล์คลาสสิก-วินเทจ มีความละเอียดสูงในการขึ้นทรง Fade กรรไกรซอยจัดทรงคมกริบ',
    specialties: ['Classic Pompadour', 'Low/Mid/High Fade', 'Taper Fade', 'โกนหนวดสปาผ้าอุ่น'],
    rating: 4.9,
    reviewsCount: 248,
    instagram: '@ek_bigbangbarber',
    status: 'available',
    workDays: 'จันทร์ - เสาร์ (หยุดวันอาทิตย์)',
    workHours: '10:00 - 19:30',
    commissionRate: 50
  },
  {
    id: 'barber_boss',
    name: 'วรภัทร ลีลากุล',
    nickname: 'ช่างบอส (Stylist Boss)',
    title: 'Creative Stylist & Perm Specialist',
    experienceYears: 7,
    avatar: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80',
    bio: 'เชี่ยวชาญทรงผมโมเดิร์น สไตล์เกาหลี ญี่ปุ่น Two-Block, Mullet, Drop Cut และการดัดผมวอลลุ่มชาย เซ็ตง่ายในชีวิตประจำวัน',
    specialties: ['Korean Two-Block', 'Drop Cut / Mullet', 'ดัดวอลลุ่มชาย (Perm)', 'เซ็ตทรง Texture'],
    rating: 4.8,
    reviewsCount: 195,
    instagram: '@boss_hairlab',
    status: 'available',
    workDays: 'อังคาร - อาทิตย์ (หยุดวันจันทร์)',
    workHours: '10:30 - 20:00',
    commissionRate: 50
  },
  {
    id: 'barber_jack',
    name: 'เกริกพล ทรงเดช',
    nickname: 'ช่างแจ็ค (Barber Jack)',
    title: 'Street Barber & Razor Artist',
    experienceYears: 8,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    bio: 'สไตล์สตรีท บัซคัท สกินเฟด และการกรีดลาย Hair Tattoo ใบมีดโกนแม่นยำ พร้อมการตัดแต่งหนวดเคราและจัดแต่งทรงแนว Old School',
    specialties: ['Skin Fade 0 mm.', 'Buzz Cut / Crew Cut', 'Hair Tattoo / แกะลาย', 'Beard Grooming'],
    rating: 4.9,
    reviewsCount: 210,
    instagram: '@jack_bigbangfade',
    status: 'available',
    workDays: 'พุธ - จันทร์ (หยุดวันอังคาร)',
    workHours: '10:00 - 20:00',
    commissionRate: 50
  }
];

export const INITIAL_SERVICES: BarberService[] = [
  {
    id: 'srv_cut_style',
    name: 'ตัดผม + เซ็ตทรงพรีเมียม',
    nameEn: 'Signature Haircut & Styling',
    description: 'ปรึกษาทรงผม ออกแบบตามรูปหน้า ขึ้นทรงเฟด/วินเทจ/โมเดิร์น พร้อมเซ็ตด้วยโพเมดหรือแว็กซ์พรีเมียม',
    durationMinutes: 45,
    price: 350,
    iconName: 'Scissors',
    popular: true
  },
  {
    id: 'srv_cut_wash',
    name: 'ตัดผม + สระไดร์นวดศีรษะ',
    nameEn: 'Cut, Wash & Head Massage',
    description: 'ตัดแต่งทรงผม สระด้วยแชมพูสูตรเย็น นวดผ่อนคลายศีรษะและต้นคอ ไดร์เซ็ตทรงเป๊ะ',
    durationMinutes: 60,
    price: 450,
    iconName: 'Sparkles',
    popular: true
  },
  {
    id: 'srv_perm',
    name: 'ดัดผมวอลลุ่ม / สไตล์เกาหลี',
    nameEn: 'Korean Texture Perm',
    description: 'เพิ่มวอลลุ่มให้เส้นผมดูหนานุ่ม มีมิติ จัดทรงง่าย เหมาะกับทรง Comma หรือ Two-Block',
    durationMinutes: 90,
    price: 1200,
    iconName: 'Wind'
  },
  {
    id: 'srv_color',
    name: 'ทำสีผมแฟชั่น / ฟอกสี',
    nameEn: 'Hair Color & Bleach Tone',
    description: 'เปลี่ยนสีผมตามเทรนด์ น้ำยาถนอมหนังศีรษะและเส้นผม พร้อมปรับโทนสี',
    durationMinutes: 120,
    price: 1500,
    iconName: 'Palette'
  },
  {
    id: 'srv_shave',
    name: 'โกนหนวด สปาผ้าอุ่น & กันเครา',
    nameEn: 'Hot Towel Shave & Beard Trim',
    description: 'ประคบผ้าขนหนูอุ่น โกนหนวดด้วยครีมโฟมสูตรพิเศษ กันเส้นขอบคมกริบ และบำรุงด้วยอาฟเตอร์เชฟ',
    durationMinutes: 30,
    price: 300,
    iconName: 'Feather'
  },
  {
    id: 'srv_full_vip',
    name: 'VIP Full Grooming Package',
    nameEn: 'Complete Barber & Facial Spa',
    description: 'บริการครบวงจร: ตัดผม + สระไดร์ + โกนหนวดสปาผ้าอุ่น + มาส์กหน้าโคลนดีท็อกซ์',
    durationMinutes: 90,
    price: 850,
    iconName: 'Crown',
    popular: true
  }
];

export const TIME_SLOTS: string[] = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00'
];

export const SHOP_INFO: ShopInfo = {
  name: 'BIGBANG BARBER',
  tagline: 'THONGLOR • GENTLEMEN GROOMING',
  address: '142/8 ถนนสุขุมวิท ซอย 55 (ทองหล่อ) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
  phone: '089-765-4321',
  openHours: '10:00 - 20:00',
  openDaysText: 'OPEN EVERYDAY',
  lineId: '@bigbangbarber',
  instagram: '@bigbangbarber.bkk',
  facebook: 'Bigbangbarber Bangkok',
  googleMapsUrl: 'https://maps.google.com/?q=Bigbang+Barber+Thonglor',
  logoUrl: '/logo.jpg',
  hasWifi: true,
  hasBeverages: true,
  hasParking: true,
  policyNote: 'รองรับเงินสด, โอนผ่านพร้อมเพย์ (PromptPay), และบัตรเครดิตทุกธนาคาร ไม่มีค่าธรรมเนียม',
  promptPayNumber: '089-765-4321',
  promptPayName: 'บิ๊กแบงบาร์เบอร์ (Bigbang Barber)',
  promptPayBank: 'พร้อมเพย์ (ธ.กสิกรไทย / ทุกธนาคาร)',
  requireDeposit: true,
  defaultDepositAmount: 100,
  defaultCommissionRate: 50
};
