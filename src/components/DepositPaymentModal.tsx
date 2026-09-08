import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Download,
  Building2,
  Phone,
  Sparkles,
  Edit3,
  Settings
} from 'lucide-react';
import { Booking, ShopInfo } from '../types';
import { generatePromptPayQRDataUrl } from '../utils/promptpay';
import { PromptPaySettingsModal } from './PromptPaySettingsModal';

interface DepositPaymentModalProps {
  isOpen: boolean;
  booking: Booking | null;
  shopInfo?: ShopInfo;
  onClose: () => void;
  onConfirmDeposit: (bookingId: string, slipNote?: string) => Promise<void>;
  onUpdateShopInfo?: (updated: ShopInfo) => Promise<void> | void;
}

export const DepositPaymentModal: React.FC<DepositPaymentModalProps> = ({
  isOpen,
  booking,
  shopInfo,
  onClose,
  onConfirmDeposit,
  onUpdateShopInfo
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [slipNote, setSlipNote] = useState<string>('');
  const [step, setStep] = useState<'qr' | 'success'>('qr');
  const [countdown, setCountdown] = useState<number>(900); // 15 minutes timer
  const [isQrSettingsOpen, setIsQrSettingsOpen] = useState<boolean>(false);

  const depositAmount = booking?.depositAmount || shopInfo?.defaultDepositAmount || 100;
  const promptPayNumber = shopInfo?.promptPayNumber || shopInfo?.phone || '089-765-4321';
  const cleanPromptPay = promptPayNumber.replace(/[^0-9]/g, '');

  const isCustomQr = shopInfo?.promptPayMode === 'custom_image' && !!shopInfo?.promptPayQrImageUrl;
  const currentQrImage = isCustomQr ? shopInfo?.promptPayQrImageUrl : qrDataUrl;

  useEffect(() => {
    if (isOpen && booking) {
      setStep('qr');
      setSlipNote('');
      setCountdown(900);
      if (shopInfo?.promptPayMode !== 'custom_image') {
        generatePromptPayQRDataUrl(cleanPromptPay, depositAmount)
          .then(url => setQrDataUrl(url))
          .catch(err => console.error('QR generation error:', err));
      }
    }
  }, [isOpen, booking, cleanPromptPay, depositAmount, shopInfo?.promptPayMode, shopInfo?.promptPayQrImageUrl]);

  useEffect(() => {
    if (!isOpen || step !== 'qr') return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen || !booking) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopyPromptPay = () => {
    navigator.clipboard.writeText(cleanPromptPay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!booking.id) return;
    setIsSubmitting(true);
    try {
      await onConfirmDeposit(booking.id, slipNote);
      setStep('success');
    } catch (err) {
      console.error('Failed to confirm deposit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Header */}
        <div className="bg-gradient-to-r from-[#FACC15] to-[#EAB308] px-5 py-3.5 text-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-[#FACC15] flex items-center justify-center shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight uppercase font-heading">
                ชำระเงินมัดจำจองคิว
              </h3>
              <p className="text-[10px] font-bold text-black/80 uppercase tracking-wider">
                THAI QR PAYMENT (PROMPTPAY)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'qr' ? (
          <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Booking Reference Pill */}
            <div className="bg-[#1C1F26] p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">รหัสการจอง</span>
                <span className="font-mono font-black text-sm text-[#FACC15]">{booking.bookingCode}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">ยอดมัดจำ</span>
                <span className="font-black text-base text-white font-heading">฿{depositAmount}</span>
              </div>
            </div>

            {/* PromptPay QR Code Canvas Box */}
            <div className="bg-white p-4 rounded-3xl text-center shadow-lg border-2 border-[#FACC15]/50 flex flex-col items-center justify-center">
              {/* PromptPay Official Style Banner */}
              <div className="w-full bg-[#003B70] text-white py-1.5 px-3 rounded-xl mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs tracking-wider">Prompt Pay</span>
                  <span className="text-[9px] font-mono bg-white/15 px-2 py-0.5 rounded-full font-bold">
                    พร้อมเพย์
                  </span>
                </div>
                {onUpdateShopInfo && (
                  <button
                    type="button"
                    onClick={() => setIsQrSettingsOpen(true)}
                    className="px-2 py-0.5 rounded-md bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                    title="เปลี่ยน QR Code หรือเลขบัญชีพร้อมเพย์"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>เปลี่ยน QR</span>
                  </button>
                )}
              </div>

              {/* QR Image */}
              <div className="relative w-56 h-56 bg-white rounded-2xl flex items-center justify-center p-1 border border-gray-100 shadow-inner">
                {currentQrImage ? (
                  <img 
                    src={currentQrImage} 
                    alt="PromptPay QR Code" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs animate-pulse">
                    กำลังสร้างคิวอาร์โค้ด...
                  </div>
                )}
                {isCustomQr && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold">
                    QR ร้านค้า
                  </span>
                )}
              </div>

              {/* Shop PromptPay Name */}
              <div className="mt-3 pt-2 border-t border-gray-200 w-full text-center">
                <p className="text-xs font-black text-gray-900 truncate">
                  {shopInfo?.promptPayName || shopInfo?.name || 'BIGBANG BARBER'}
                </p>
                <p className="text-[11px] text-gray-600 font-mono mt-0.5 font-bold">
                  เลขพร้อมเพย์: {promptPayNumber}
                </p>
                {shopInfo?.promptPayBank && (
                  <p className="text-[10px] text-gray-500">
                    {shopInfo.promptPayBank}
                  </p>
                )}
                {onUpdateShopInfo && (
                  <button
                    type="button"
                    onClick={() => setIsQrSettingsOpen(true)}
                    className="mt-2 text-[10px] text-blue-700 hover:text-blue-900 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>เปลี่ยน QR หรือเลขบัญชี</span>
                  </button>
                )}
              </div>
            </div>

            {/* Copy PromptPay & Instructions */}
            <div className="bg-[#1C1F26] p-3.5 rounded-2xl border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span className="font-mono font-bold">{promptPayNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPromptPay}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] text-[#FACC15] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกเบอร์'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FACC15]" />
                  เวลาทำรายการที่เหลือ:
                </span>
                <span className="font-mono font-bold text-[#FACC15]">{timeString}</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-[#0A0A0B] p-3 rounded-2xl border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>ค่าบริการ {booking.serviceName}</span>
                <span>฿{booking.servicePrice}</span>
              </div>
              <div className="flex justify-between font-bold text-[#FACC15]">
                <span>ยอดมัดจำตอนนี้</span>
                <span>฿{depositAmount}</span>
              </div>
              <div className="flex justify-between text-gray-400 pt-1 border-t border-white/5">
                <span>ยอดชำระที่ร้านหลังตัดผมเสร็จ</span>
                <span className="text-white font-bold">฿{Math.max(0, booking.servicePrice - depositAmount)}</span>
              </div>
            </div>

            {/* Note / Slip confirmation input */}
            <div className="space-y-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                บันทึกช่วยจำ / 4 ตัวท้ายบัญชีที่โอน (ถ้ามี)
              </label>
              <input
                type="text"
                value={slipNote}
                onChange={(e) => setSlipNote(e.target.value)}
                placeholder="เช่น โอนจาก KBank x-1234 หรือ ยืนยันโอนแล้ว"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            {/* Confirm Payment Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FACC15]/20 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>กำลังบันทึกการชำระเงิน...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>แจ้งโอนเงินมัดจำเรียบร้อยแล้ว (฿{depositAmount})</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ระบบจะล็อคคิวตัดผมให้อัตโนมัติทันที
              </p>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black uppercase text-white font-heading tracking-tight">
                ชำระมัดจำสำเร็จ!
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                ระบบได้บันทึกการชำระมัดจำ <span className="text-[#FACC15] font-bold">฿{depositAmount}</span> เรียบร้อยแล้ว
              </p>
            </div>

            <div className="bg-[#1C1F26] p-4 rounded-2xl border border-white/5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">รหัสคิว:</span>
                <span className="font-mono font-bold text-[#FACC15]">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ช่างตัดผม:</span>
                <span className="font-bold text-white">{booking.barberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">วัน-เวลา:</span>
                <span className="text-white">{booking.date} เวลา {booking.timeSlot} น.</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-gray-400">คงเหลือจ่ายที่ร้าน:</span>
                <span className="font-black text-[#FACC15]">฿{Math.max(0, booking.servicePrice - depositAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-black uppercase tracking-wider text-xs cursor-pointer hover:bg-gray-100 transition-all"
            >
              ดูตั๋วคิวของฉัน (E-Ticket)
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
          onSave={async (updated) => {
            await onUpdateShopInfo(updated);
            setIsQrSettingsOpen(false);
          }}
          sampleAmount={depositAmount}
        />
      )}
    </div>
  );
};
