import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Banknote, 
  CreditCard, 
  Scissors, 
  User, 
  DollarSign, 
  Calculator,
  Percent,
  Receipt,
  Sparkles,
  Edit3,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { Booking, ShopInfo, PaymentMethod } from '../types';
import { generatePromptPayQRDataUrl } from '../utils/promptpay';
import { PromptPaySettingsModal } from './PromptPaySettingsModal';

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  booking: Booking | null;
  shopInfo?: ShopInfo;
  onClose: () => void;
  onCompleteCheckout: (
    bookingId: string, 
    paymentMethod: PaymentMethod,
    totalPaid: number,
    commissionAmount: number,
    shopShare: number
  ) => Promise<void>;
  onUpdateShopInfo?: (updated: ShopInfo) => Promise<void> | void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  booking,
  shopInfo,
  onClose,
  onCompleteCheckout,
  onUpdateShopInfo
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay_qr');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isQrSettingsOpen, setIsQrSettingsOpen] = useState<boolean>(false);

  const totalPrice = booking?.servicePrice || 0;
  const depositPaid = booking?.depositPaid ? (booking.depositAmount || 100) : 0;
  const remainingDue = Math.max(0, totalPrice - depositPaid);
  
  // Barber Commission 50%
  const commissionRate = booking?.commissionRate || shopInfo?.defaultCommissionRate || 50;
  const barberCommission = Math.round((totalPrice * commissionRate) / 100);
  const shopShare = totalPrice - barberCommission;

  const promptPayNumber = shopInfo?.promptPayNumber || shopInfo?.phone || '089-765-4321';
  const cleanPromptPay = promptPayNumber.replace(/[^0-9]/g, '');

  const isCustomQr = shopInfo?.promptPayMode === 'custom_image' && !!shopInfo?.promptPayQrImageUrl;
  const currentQrImage = isCustomQr ? shopInfo?.promptPayQrImageUrl : qrDataUrl;

  useEffect(() => {
    if (isOpen && booking) {
      setStep('checkout');
      setPaymentMethod('promptpay_qr');
      setCashTendered(remainingDue);

      if (remainingDue > 0) {
        generatePromptPayQRDataUrl(cleanPromptPay, remainingDue)
          .then(url => setQrDataUrl(url))
          .catch(err => console.error('Error generating checkout QR:', err));
      }
    }
  }, [isOpen, booking, remainingDue, cleanPromptPay, shopInfo?.promptPayMode, shopInfo?.promptPayQrImageUrl]);

  if (!isOpen || !booking) return null;

  const changeAmount = Math.max(0, cashTendered - remainingDue);

  const handleSubmit = async () => {
    if (!booking.id) return;
    setIsSubmitting(true);
    try {
      await onCompleteCheckout(
        booking.id,
        paymentMethod,
        totalPrice,
        barberCommission,
        shopShare
      );
      setStep('success');
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveQrSettings = async (updated: ShopInfo) => {
    if (onUpdateShopInfo) {
      await onUpdateShopInfo(updated);
    }
    // regenerate if needed
    const newClean = (updated.promptPayNumber || updated.phone || '').replace(/[^0-9]/g, '');
    if (newClean.length >= 9 && remainingDue > 0) {
      try {
        const url = await generatePromptPayQRDataUrl(newClean, remainingDue);
        setQrDataUrl(url);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1C1F26] border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white uppercase font-heading tracking-tight">
                เช็คบิล / ชำระเงิน
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                BILLING & BARBER COMMISSION (50%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'checkout' ? (
          <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Customer & Service Info Card */}
            <div className="bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FACC15]" />
                  <span className="font-bold text-sm text-white">{booking.customerName}</span>
                </div>
                <span className="font-mono text-xs font-bold text-gray-400">{booking.bookingCode}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">ช่างผู้ให้บริการ:</span>
                <span className="text-[#FACC15] font-bold">{booking.barberName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">บริการ:</span>
                <span className="text-white font-medium">{booking.serviceName}</span>
              </div>
            </div>

            {/* Price & Balance Calculation */}
            <div className="bg-[#1C1F26] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>ราคาบริการเต็ม</span>
                <span className="font-bold text-white">฿{totalPrice}</span>
              </div>

              {depositPaid > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>หักเงินมัดจำล่วงหน้าแล้ว</span>
                  <span className="font-bold">- ฿{depositPaid}</span>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-black text-sm text-white uppercase tracking-tight">
                  ยอดที่ต้องชำระตอนนี้:
                </span>
                <span className="font-black text-2xl text-[#FACC15] font-heading">
                  ฿{remainingDue}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                ช่องทางการชำระเงิน (Select Payment Method)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('promptpay_qr')}
                  className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'promptpay_qr'
                      ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-[#FACC15]/20 font-black'
                      : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-[11px] uppercase tracking-tight">QR พร้อมเพย์</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'cash'
                      ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-[#FACC15]/20 font-black'
                      : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-[11px] uppercase tracking-tight">เงินสด (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'credit_card'
                      ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-[#FACC15]/20 font-black'
                      : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px] uppercase tracking-tight">บัตรเครดิต</span>
                </button>
              </div>
            </div>

            {/* Content per payment method */}
            {paymentMethod === 'promptpay_qr' && (
              <div className="bg-white p-4 rounded-2xl text-center border-2 border-[#FACC15]/40 flex flex-col items-center shadow-lg relative">
                {/* Header inside QR Card */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#003B70]" />
                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">
                      สแกนชำระเงินผ่าน Mobile Banking
                    </span>
                  </div>

                  {onUpdateShopInfo && (
                    <button
                      type="button"
                      onClick={() => setIsQrSettingsOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#FACC15] text-gray-800 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-gray-200 active:scale-95 shadow-xs shrink-0"
                      title="เปลี่ยน QR Code หรือเลขบัญชีพร้อมเพย์"
                    >
                      <Edit3 className="w-3 h-3 text-gray-700" />
                      <span>เปลี่ยน QR</span>
                    </button>
                  )}
                </div>

                {/* QR Image Frame */}
                <div className="relative w-48 h-48 bg-white rounded-xl p-1 flex items-center justify-center border border-gray-100 shadow-inner">
                  {currentQrImage ? (
                    <img 
                      src={currentQrImage} 
                      alt="PromptPay QR" 
                      className="w-full h-full object-contain rounded-lg" 
                    />
                  ) : (
                    <div className="text-gray-400 text-xs animate-pulse flex flex-col items-center gap-1">
                      <QrCode className="w-8 h-8 text-gray-300" />
                      <span>กำลังโหลด QR...</span>
                    </div>
                  )}

                  {isCustomQr && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold">
                      QR ร้านค้า
                    </span>
                  )}
                </div>

                {/* Amount & Account details */}
                <div className="mt-2.5 text-center text-xs w-full">
                  <span className="font-black text-gray-900 font-heading text-xl">฿{remainingDue}</span>
                  <p className="text-[11px] text-gray-700 font-mono mt-0.5 font-bold truncate">
                    {promptPayNumber} ({shopInfo?.promptPayName || shopInfo?.name || 'Bigbang Barber'})
                  </p>
                  {shopInfo?.promptPayBank && (
                    <p className="text-[10px] text-gray-500 font-medium">
                      {shopInfo.promptPayBank}
                    </p>
                  )}

                  {onUpdateShopInfo && (
                    <button
                      type="button"
                      onClick={() => setIsQrSettingsOpen(true)}
                      className="mt-2.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Settings className="w-3 h-3 text-amber-700" />
                      <span>เปลี่ยน QR หรือเลขพร้อมเพย์</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-[#1C1F26] p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">เงินที่ได้รับจากลูกค้า (฿):</span>
                  <input
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-28 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-white font-mono text-right font-black focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {[remainingDue, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(amt)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-mono text-[#FACC15] shrink-0 cursor-pointer"
                    >
                      {amt === remainingDue ? 'พอดี (฿' + amt + ')' : '฿' + amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">เงินทอน (Change):</span>
                  <span className={`font-mono text-base font-black ${changeAmount > 0 ? 'text-emerald-400' : 'text-gray-300'}`}>
                    ฿{changeAmount}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="bg-[#1C1F26] p-4 rounded-2xl border border-white/5 text-center text-xs text-gray-300 space-y-1">
                <CreditCard className="w-8 h-8 text-[#FACC15] mx-auto mb-1" />
                <p className="font-bold text-white">รูดบัตรหรือแตะบัตรที่เครื่อง EDC หน้าร้าน</p>
                <p className="text-[11px] text-gray-400">รองรับ Visa, Master, PromptPay, JCB</p>
              </div>
            )}

            {/* Confirm Checkout Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (paymentMethod === 'cash' && cashTendered < remainingDue)}
                className="w-full py-4 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#FACC15]/20 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>กำลังบันทึกการชำระเงิน & คำนวณคอมมิชชั่น...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ยืนยันรับเงินเสร็จสิ้น & ปิดคิวตัดผม</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black uppercase text-white font-heading tracking-tight">
                ชำระเงินสำเร็จแล้ว!
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                บันทึกยอดชำระ ฿{totalPrice} และบันทึกค่าคอมมิชชั่นช่างเรียบร้อย
              </p>
            </div>

            <div className="bg-[#1C1F26] p-4 rounded-2xl border border-white/5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ช่างตัดผม:</span>
                <span className="text-white font-bold">{booking.barberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ค่าคอมมิชชั่นช่าง (50%):</span>
                <span className="text-[#FACC15] font-black">฿{barberCommission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">รายได้เข้าร้าน (50%):</span>
                <span className="text-white font-bold">฿{shopShare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ช่องทางชำระ:</span>
                <span className="font-bold text-gray-200 uppercase">
                  {paymentMethod === 'promptpay_qr' ? 'PromptPay QR' : paymentMethod === 'cash' ? 'เงินสด' : 'บัตรเครดิต'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-black uppercase tracking-wider text-xs cursor-pointer hover:bg-gray-100 transition-all"
            >
              เสร็จสิ้น / กลับหน้าคิว
            </button>
          </div>
        )}
      </div>

      {/* PromptPay & QR Settings Modal */}
      {onUpdateShopInfo && (
        <PromptPaySettingsModal
          isOpen={isQrSettingsOpen}
          onClose={() => setIsQrSettingsOpen(false)}
          shopInfo={shopInfo}
          onSave={handleSaveQrSettings}
          sampleAmount={remainingDue}
        />
      )}
    </div>
  );
};
