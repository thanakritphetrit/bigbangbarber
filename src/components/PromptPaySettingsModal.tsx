import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Upload, 
  Phone, 
  User, 
  Building, 
  Check, 
  Sparkles, 
  Trash2, 
  Camera, 
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ShopInfo } from '../types';
import { SHOP_INFO } from '../data/mockData';
import { generatePromptPayQRDataUrl } from '../utils/promptpay';

interface PromptPaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopInfo?: ShopInfo;
  onSave: (updated: ShopInfo) => Promise<void> | void;
  sampleAmount?: number;
}

const COMMON_BANKS = [
  'พร้อมเพย์ (ทุกธนาคาร)',
  'ธนาคารกสิกรไทย (KBANK)',
  'ธนาคารไทยพาณิชย์ (SCB)',
  'ธนาคารกรุงเทพ (BBL)',
  'ธนาคารกรุงไทย (KTB)',
  'ธนาคารกรุงศรีอยุธยา (BAY)',
  'ธนาคารทหารไทยธนชาต (TTB)',
  'ธนาคารออมสิน (GSB)',
  'ทรูมันนี่ วอลเล็ท (TrueMoney)'
];

export const PromptPaySettingsModal: React.FC<PromptPaySettingsModalProps> = ({
  isOpen,
  onClose,
  shopInfo,
  onSave,
  sampleAmount = 450
}) => {
  const [promptPayNumber, setPromptPayNumber] = useState(shopInfo?.promptPayNumber || shopInfo?.phone || '089-765-4321');
  const [promptPayName, setPromptPayName] = useState(shopInfo?.promptPayName || shopInfo?.name || 'บิ๊กแบง บาร์เบอร์ (BIGBANG BARBER)');
  const [promptPayBank, setPromptPayBank] = useState(shopInfo?.promptPayBank || COMMON_BANKS[0]);
  const [promptPayMode, setPromptPayMode] = useState<'auto_generate' | 'custom_image'>(shopInfo?.promptPayMode || 'auto_generate');
  const [promptPayQrImageUrl, setPromptPayQrImageUrl] = useState(shopInfo?.promptPayQrImageUrl || '');
  
  const [previewQrUrl, setPreviewQrUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPromptPayNumber(shopInfo?.promptPayNumber || shopInfo?.phone || '089-765-4321');
      setPromptPayName(shopInfo?.promptPayName || shopInfo?.name || 'บิ๊กแบง บาร์เบอร์ (BIGBANG BARBER)');
      setPromptPayBank(shopInfo?.promptPayBank || COMMON_BANKS[0]);
      setPromptPayMode(shopInfo?.promptPayMode || 'auto_generate');
      setPromptPayQrImageUrl(shopInfo?.promptPayQrImageUrl || '');
      setSaveSuccess(false);
    }
  }, [isOpen, shopInfo]);

  // Update dynamic preview
  useEffect(() => {
    if (promptPayMode === 'auto_generate') {
      const cleanTarget = promptPayNumber.replace(/[^0-9]/g, '');
      if (cleanTarget.length >= 9) {
        generatePromptPayQRDataUrl(cleanTarget, sampleAmount)
          .then(url => setPreviewQrUrl(url))
          .catch(() => setPreviewQrUrl(''));
      } else {
        setPreviewQrUrl('');
      }
    } else {
      setPreviewQrUrl(promptPayQrImageUrl);
    }
  }, [promptPayNumber, sampleAmount, promptPayMode, promptPayQrImageUrl]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, WEBP)');
      return;
    }

    // Convert file to base64 Data URL for instant rendering & persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPromptPayQrImageUrl(result);
        setPromptPayMode('custom_image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomImage = () => {
    setPromptPayQrImageUrl('');
    setPromptPayMode('auto_generate');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: ShopInfo = {
        ...SHOP_INFO,
        ...(shopInfo || {}),
        promptPayNumber: promptPayNumber.trim(),
        promptPayName: promptPayName.trim(),
        promptPayBank: promptPayBank.trim(),
        promptPayMode,
        promptPayQrImageUrl: promptPayQrImageUrl.trim()
      };

      await onSave(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to save QR settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] px-5 py-4 text-black flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-[#FACC15] flex items-center justify-center font-black">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-base uppercase tracking-tight font-heading leading-tight">
                ตั้งค่า / เปลี่ยน QR CODE ชำระเงิน
              </h3>
              <p className="text-[10px] font-bold text-black/80 tracking-wider">
                PROMPTPAY & QR PAYMENT SETTINGS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Mode Selector Tabs */}
          <div className="bg-[#0A0A0B] p-1.5 rounded-2xl border border-white/10 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setPromptPayMode('auto_generate')}
              className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                promptPayMode === 'auto_generate'
                  ? 'bg-[#FACC15] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>สร้าง QR อัตโนมัติตามยอด</span>
            </button>

            <button
              type="button"
              onClick={() => setPromptPayMode('custom_image')}
              className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                promptPayMode === 'custom_image'
                  ? 'bg-[#FACC15] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>ใช้รูป QR ของร้าน / ป้ายธนาคาร</span>
            </button>
          </div>

          {/* Mode Description Banner */}
          <div className="bg-[#0A0A0B] border border-white/5 p-3 rounded-2xl flex items-start gap-2.5 text-gray-300">
            <AlertCircle className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {promptPayMode === 'auto_generate' ? (
                <span>
                  <strong>ระบบสร้าง QR อัตโนมัติ:</strong> ลูกค้าสแกนแล้วยอดเงินจะขึ้นตรงตามบิล (เช่น ฿{sampleAmount}) ทันที ไม่ต้องกดพิมพ์ยอดเอง รองรับเบอร์โทร, เลขบัตรประชาชน หรือเลขนิติบุคคล
                </span>
              ) : (
                <span>
                  <strong>ใช้รูปภาพ QR ของร้าน:</strong> เหมาะสำหรับร้านที่มีป้ายตั้งโต๊ะของธนาคาร (เช่น ป้ายแม่มณี, K-Shop, ป้าย QR ของร้าน) สามารถถ่ายรูปหรืออัปโหลดรูป QR มาใช้แทนได้ทันที
                </span>
              )}
            </p>
          </div>

          {/* Form Fields for Auto Generate Mode */}
          {promptPayMode === 'auto_generate' && (
            <div className="space-y-3 bg-[#0A0A0B] p-4 rounded-2xl border border-white/10">
              <span className="text-gray-400 font-black uppercase text-[10px] tracking-wider block">
                ข้อมูลบัญชีพร้อมเพย์ (PROMPTPAY DETAILS)
              </span>

              {/* PromptPay Number */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>เบอร์โทรศัพท์ / เลขประจำตัวผู้เสียภาษี พร้อมเพย์</span>
                </label>
                <input
                  type="text"
                  required
                  value={promptPayNumber}
                  onChange={(e) => setPromptPayNumber(e.target.value)}
                  placeholder="เช่น 089-765-4321 หรือ 0812345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono font-bold text-xs focus:border-[#FACC15] focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 block">
                  รองรับเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก
                </span>
              </div>

              {/* PromptPay Name */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>ชื่อบัญชีผู้รับเงิน / ชื่อร้าน</span>
                </label>
                <input
                  type="text"
                  required
                  value={promptPayName}
                  onChange={(e) => setPromptPayName(e.target.value)}
                  placeholder="เช่น บิ๊กแบง บาร์เบอร์ (BIGBANG BARBER)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:border-[#FACC15] focus:outline-none"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>ธนาคารผู้ให้บริการ</span>
                </label>
                <select
                  value={promptPayBank}
                  onChange={(e) => setPromptPayBank(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:border-[#FACC15] focus:outline-none"
                >
                  {COMMON_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Form Fields for Custom QR Image Mode */}
          {promptPayMode === 'custom_image' && (
            <div className="space-y-3 bg-[#0A0A0B] p-4 rounded-2xl border border-white/10">
              <span className="text-gray-400 font-black uppercase text-[10px] tracking-wider block">
                อัปโหลดรูป QR CODE ร้านค้า (CUSTOM QR CODE IMAGE)
              </span>

              {/* File Upload Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="qr-image-upload-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10 active:scale-95"
                >
                  <Upload className="w-4 h-4 text-[#FACC15]" />
                  <span>เลือกรูปจากเครื่อง / ถ่ายรูปป้าย QR</span>
                </button>

                {promptPayQrImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomImage}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบรูป</span>
                  </button>
                )}
              </div>

              {/* Direct Image URL input as alternative */}
              <div className="space-y-1 pt-1">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  หรือวางลิงก์รูปภาพ QR (Direct Image URL)
                </label>
                <input
                  type="url"
                  value={promptPayQrImageUrl}
                  onChange={(e) => setPromptPayQrImageUrl(e.target.value)}
                  placeholder="https://.../my-shop-qr.png"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono text-xs focus:border-[#FACC15] focus:outline-none"
                />
              </div>

              {/* Account Label for Custom Mode */}
              <div className="space-y-1 pt-1">
                <label className="text-gray-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>ชื่อที่แสดงใต้ QR</span>
                </label>
                <input
                  type="text"
                  value={promptPayName}
                  onChange={(e) => setPromptPayName(e.target.value)}
                  placeholder="เช่น บิ๊กแบง บาร์เบอร์ (BIGBANG BARBER)"
                  className="w-full px-4 py-2 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-bold text-xs focus:border-[#FACC15] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="bg-white p-4 rounded-3xl text-center border-2 border-[#FACC15]/50 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[11px] font-black text-gray-800 uppercase tracking-wider mb-2">
              ภาพตัวอย่าง QR ชำระเงิน (PREVIEW)
            </span>

            <div className="w-44 h-44 bg-white rounded-xl p-1 flex items-center justify-center border border-gray-100 shadow-inner">
              {previewQrUrl ? (
                <img 
                  src={previewQrUrl} 
                  alt="QR Preview" 
                  className="w-full h-full object-contain"
                  onError={() => setPreviewQrUrl('')}
                />
              ) : (
                <div className="text-center p-4 text-gray-400">
                  <QrCode className="w-10 h-10 mx-auto text-gray-300 mb-1" />
                  <span className="text-[11px]">
                    {promptPayMode === 'custom_image' ? 'ยังไม่มีรูปภาพ QR' : 'กรอกเบอร์เพื่อสร้าง QR'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 text-center text-xs">
              {promptPayMode === 'auto_generate' && (
                <span className="font-black text-gray-900 font-heading text-lg block">฿{sampleAmount}</span>
              )}
              <p className="text-[11px] text-gray-700 font-mono mt-0.5 font-bold">
                {promptPayNumber} ({promptPayName || 'BIGBANG BARBER'})
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                {promptPayBank}
              </p>
            </div>
          </div>

          {/* Submit / Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] hover:from-[#FDE047] hover:to-[#FACC15] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                  <span>บันทึก QR สำเร็จแล้ว!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกและใช้ QR CODE นี้ทันที'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
