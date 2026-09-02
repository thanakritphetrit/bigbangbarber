import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, X, Check, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  title?: string;
  description?: string;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  title = 'กรุณาใส่รหัสเพื่อแก้ไขข้อมูล',
  description = 'กรอกรหัส PIN ผู้ดูแล/พนักงานเพื่อเข้าสู่โหมดแก้ไข'
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (pinToTest: string) => {
    const targetPin = correctPin || '1234';
    if (pinToTest.trim() === targetPin.trim()) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('กรุณากรอกรหัส PIN');
      return;
    }
    handleVerify(pin);
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      // Auto submit if reached correct pin length
      if (nextPin.length === (correctPin || '1234').length) {
        handleVerify(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className={`relative w-full max-w-sm bg-[#1C1F26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all ${
          isShaking ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#FACC15] px-5 py-4 text-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-[#FACC15] flex items-center justify-center shadow-md">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight font-heading">
                SECURITY VERIFICATION
              </h3>
              <p className="text-[10px] font-black uppercase tracking-wider text-black/80">
                ระบบยืนยันตัวตนสำหรับแก้ไขข้อมูล
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <h4 className="font-black text-base text-white tracking-tight">
              {title}
            </h4>
            <p className="text-xs text-gray-400 font-medium">
              {description}
            </p>
          </div>

          {/* PIN Input field */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="relative flex items-center justify-center">
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPin(val);
                  setErrorMsg('');
                  if (val.length === (correctPin || '1234').length) {
                    handleVerify(val);
                  }
                }}
                placeholder="••••"
                className="w-full text-center py-3.5 px-4 rounded-2xl bg-[#0A0A0B] border-2 border-white/10 text-white font-mono text-2xl font-black tracking-widest focus:outline-none focus:border-[#FACC15] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                title={showPin ? 'ซ่อนรหัส' : 'แสดงรหัส'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 py-1.5 px-3 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitClick(num)}
                  className="py-3 rounded-xl bg-[#0A0A0B] hover:bg-white hover:text-black text-white font-black text-lg transition-all border border-white/5 active:scale-95 cursor-pointer shadow"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-xl bg-[#0A0A0B] hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider transition-all border border-white/5 active:scale-95 cursor-pointer"
              >
                ล้าง
              </button>
              <button
                type="button"
                onClick={() => handleDigitClick('0')}
                className="py-3 rounded-xl bg-[#0A0A0B] hover:bg-white hover:text-black text-white font-black text-lg transition-all border border-white/5 active:scale-95 cursor-pointer shadow"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-xl bg-[#0A0A0B] hover:bg-white/10 text-gray-300 font-bold text-xs uppercase tracking-wider transition-all border border-white/5 active:scale-95 cursor-pointer"
              >
                ลบ
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10"
            >
              <KeyRound className="w-4 h-4 stroke-[2.5]" />
              <span>ยืนยันรหัสผ่าน (UNLOCK)</span>
            </button>
          </form>

          {/* Hint / Helper */}
          <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>รหัสเริ่มต้นจากระบบ:</span>
            </span>
            <span className="font-mono font-black text-[#FACC15] bg-[#1C1F26] px-2 py-0.5 rounded border border-white/10">
              {correctPin || '1234'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
