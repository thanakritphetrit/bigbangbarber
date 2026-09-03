import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Plus, 
  Trash2, 
  Calendar, 
  Filter, 
  Scissors, 
  Wallet, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt,
  QrCode,
  Banknote,
  CheckCircle2,
  Users,
  PieChart,
  Tag
} from 'lucide-react';
import { 
  Booking, 
  Barber, 
  ShopExpense, 
  ShopTransaction, 
  ShopInfo, 
  ExpenseCategory 
} from '../types';

interface FinanceAccountingViewProps {
  bookings: Booking[];
  barbers: Barber[];
  expenses: ShopExpense[];
  transactions: ShopTransaction[];
  shopInfo: ShopInfo;
  onAddExpense: (expense: Omit<ShopExpense, 'id'>) => Promise<string>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
}

export const FinanceAccountingView: React.FC<FinanceAccountingViewProps> = ({
  bookings,
  barbers,
  expenses,
  transactions,
  shopInfo,
  onAddExpense,
  onDeleteExpense
}) => {
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'barbers' | 'expenses' | 'transactions'>('overview');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);

  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('supplies');
  const [expenseNote, setExpenseNote] = useState<string>('');
  const [isSubmittingExpense, setIsSubmittingExpense] = useState<boolean>(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Filter bookings and expenses by selected timeframe
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDateStr = '';

    if (dateFilter === 'today') {
      startDateStr = todayStr;
    } else if (dateFilter === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startDateStr = d.toISOString().slice(0, 10);
    } else if (dateFilter === 'month') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      startDateStr = d.toISOString().slice(0, 10);
    }

    const filteredBookings = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (dateFilter === 'all') return true;
      if (dateFilter === 'today') return b.date === todayStr;
      return b.date >= startDateStr;
    });

    const filteredExpenses = expenses.filter(e => {
      if (dateFilter === 'all') return true;
      if (dateFilter === 'today') return e.date === todayStr;
      return e.date >= startDateStr;
    });

    const filteredTransactions = transactions.filter(t => {
      if (dateFilter === 'all') return true;
      if (dateFilter === 'today') return t.date === todayStr;
      return t.date >= startDateStr;
    });

    return { filteredBookings, filteredExpenses, filteredTransactions };
  }, [bookings, expenses, transactions, dateFilter, todayStr]);

  // Financial Metrics
  const metrics = useMemo(() => {
    const completedBookings = filteredData.filteredBookings.filter(b => b.status === 'completed');
    const depositPaidBookings = filteredData.filteredBookings.filter(b => b.depositPaid);

    // Total Revenue calculation:
    // Completed bookings revenue + any pending bookings that already paid deposit
    const completedRevenue = completedBookings.reduce((sum, b) => sum + (b.servicePrice || 0), 0);
    const depositOnlyRevenue = filteredData.filteredBookings
      .filter(b => b.status !== 'completed' && b.depositPaid)
      .reduce((sum, b) => sum + (b.depositAmount || 100), 0);
    const totalRevenue = completedRevenue + depositOnlyRevenue;

    // Barber Commission (50%)
    // Each completed haircut generates 50% commission for the barber
    const totalBarberCommission = completedBookings.reduce((sum, b) => {
      const rate = b.commissionRate || shopInfo.defaultCommissionRate || 50;
      return sum + Math.round((b.servicePrice * rate) / 100);
    }, 0);

    // Total Expenses
    const totalExpenses = filteredData.filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Net Shop Profit = Total Revenue - Total Barber Commission - Total Expenses
    const shopGrossShare = totalRevenue - totalBarberCommission;
    const netShopProfit = shopGrossShare - totalExpenses;

    return {
      totalRevenue,
      totalBarberCommission,
      totalExpenses,
      netShopProfit,
      completedCount: completedBookings.length,
      depositCount: depositPaidBookings.length
    };
  }, [filteredData, shopInfo]);

  // Barber Commission breakdown per barber (50%)
  const barberCommissionStats = useMemo(() => {
    return barbers.map(barber => {
      const barberBookings = filteredData.filteredBookings.filter(
        b => b.barberId === barber.id && b.status === 'completed'
      );
      const totalCuts = barberBookings.length;
      const totalSales = barberBookings.reduce((sum, b) => sum + b.servicePrice, 0);
      const rate = barber.commissionRate || shopInfo.defaultCommissionRate || 50;
      const commissionEarned = Math.round((totalSales * rate) / 100);
      const shopEarned = totalSales - commissionEarned;

      return {
        barber,
        totalCuts,
        totalSales,
        commissionRate: rate,
        commissionEarned,
        shopEarned
      };
    });
  }, [barbers, filteredData.filteredBookings, shopInfo]);

  // Add Expense Handler
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount || Number(expenseAmount) <= 0) return;

    setIsSubmittingExpense(true);
    try {
      await onAddExpense({
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        category: expenseCategory,
        date: todayStr,
        note: expenseNote.trim() || undefined,
        createdAt: Date.now()
      });
      setExpenseTitle('');
      setExpenseAmount('');
      setExpenseNote('');
      setShowAddExpenseModal(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const getCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'supplies':
        return { label: 'อุปกรณ์ / ใบมีด', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'utilities':
        return { label: 'น้ำ / ไฟฟ้า', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'rent':
        return { label: 'ค่าเช่าร้าน', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'equipment':
        return { label: 'เครื่องมือบาร์เบอร์', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      default:
        return { label: 'ทั่วไป', color: 'bg-gray-500/10 text-gray-300 border-gray-500/20' };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-28">
      {/* View Header with Date Filter */}
      <div className="bg-[#121418] p-4 rounded-3xl border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white font-heading">
                รายรับ - รายจ่าย & ค่าคอมช่าง 50%
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                สรุปบัญชีร้าน, สแกน QR, รายจ่าย และส่วนแบ่งช่างตัดผม
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">บันทึก</span>รายจ่าย
          </button>
        </div>

        {/* Date Filters - Mobile Optimized Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pt-1">
          {[
            { id: 'today', label: 'วันนี้ (Today)' },
            { id: 'week', label: '7 วันล่าสุด' },
            { id: 'month', label: '30 วันล่าสุด' },
            { id: 'all', label: 'ประวัติทั้งหมด' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDateFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                dateFilter === tab.id
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-[#1C1F26] text-gray-300 border-white/5 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Total Revenue */}
        <div className="bg-[#121418] p-3.5 sm:p-4 rounded-3xl border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">รายรับรวม</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-white font-heading">
              ฿{metrics.totalRevenue.toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
              {metrics.completedCount} คิวสำเร็จ • {metrics.depositCount} มัดจำ
            </p>
          </div>
        </div>

        {/* Barber Commission 50% */}
        <div className="bg-[#121418] p-3.5 sm:p-4 rounded-3xl border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">คอมช่าง 50%</span>
            <div className="w-6 h-6 rounded-lg bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-[#FACC15] font-heading">
              ฿{metrics.totalBarberCommission.toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              ส่วนแบ่งช่าง (50% ของงานตัด)
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#121418] p-3.5 sm:p-4 rounded-3xl border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">รายจ่ายร้าน</span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-rose-400 font-heading">
              ฿{metrics.totalExpenses.toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
              {filteredData.filteredExpenses.length} รายการค่าใช้จ่าย
            </p>
          </div>
        </div>

        {/* Net Shop Profit */}
        <div className="bg-gradient-to-br from-[#1C1F26] to-[#121418] p-3.5 sm:p-4 rounded-3xl border border-[#FACC15]/30 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#FACC15]">กำไรสุทธิร้าน</span>
            <div className="w-6 h-6 rounded-lg bg-[#FACC15]/20 text-[#FACC15] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">
              ฿{metrics.netShopProfit.toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-300 mt-0.5">
              หลังหักค่าคอม 50% & รายจ่าย
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="bg-[#121418] p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`flex-1 py-2 px-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'overview'
              ? 'bg-[#FACC15] text-black font-black shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ภาพรวม
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('barbers')}
          className={`flex-1 py-2 px-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'barbers'
              ? 'bg-[#FACC15] text-black font-black shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ค่าคอมช่าง (50%)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('expenses')}
          className={`flex-1 py-2 px-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'expenses'
              ? 'bg-[#FACC15] text-black font-black shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          บันทึกรายจ่าย
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('transactions')}
          className={`flex-1 py-2 px-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer text-center ${
            activeSubTab === 'transactions'
              ? 'bg-[#FACC15] text-black font-black shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ประวัติบิล
        </button>
      </div>

      {/* SUBTAB: OVERVIEW & BARBERS (50% COMMISSION) */}
      {(activeSubTab === 'overview' || activeSubTab === 'barbers') && (
        <div className="bg-[#121418] p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#FACC15]" />
              <h3 className="font-black text-sm uppercase text-white font-heading tracking-tight">
                สรุปค่าคอมมิชชั่นช่างแต่ละคน (ส่วนแบ่ง 50%)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30">
              อัตราคอมมิชชั่น 50%
            </span>
          </div>

          <div className="space-y-3">
            {barberCommissionStats.map(({ barber, totalCuts, totalSales, commissionRate, commissionEarned, shopEarned }) => (
              <div 
                key={barber.id}
                className="bg-[#1C1F26] p-4 rounded-2xl border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={barber.avatar} 
                      alt={barber.name} 
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#FACC15]/40"
                    />
                    <div>
                      <h4 className="font-black text-sm text-white font-heading">{barber.nickname}</h4>
                      <p className="text-[11px] text-gray-400">{barber.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 font-bold block">ตัดเสร็จ</span>
                    <span className="font-black text-base text-white font-heading">{totalCuts} หัว</span>
                  </div>
                </div>

                {/* Progress bar visual 50/50 */}
                <div className="w-full h-2 bg-black rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#FACC15]" style={{ width: '50%' }} title="คอมช่าง 50%" />
                  <div className="h-full bg-gray-500" style={{ width: '50%' }} title="เข้าร้าน 50%" />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">ยอดขายรวม</span>
                    <span className="font-black text-sm text-white font-mono mt-0.5 block">฿{totalSales.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#FACC15] font-bold uppercase block">ค่าคอมช่าง (50%)</span>
                    <span className="font-black text-sm text-[#FACC15] font-mono mt-0.5 block">฿{commissionEarned.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">ส่วนของร้าน (50%)</span>
                    <span className="font-black text-sm text-gray-200 font-mono mt-0.5 block">฿{shopEarned.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: EXPENSES MANAGEMENT (รายจ่าย) */}
      {(activeSubTab === 'overview' || activeSubTab === 'expenses') && (
        <div className="bg-[#121418] p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-rose-400" />
              <h3 className="font-black text-sm uppercase text-white font-heading tracking-tight">
                รายการรายจ่ายของร้าน ({filteredData.filteredExpenses.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddExpenseModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>เพิ่มรายจ่าย</span>
            </button>
          </div>

          {filteredData.filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs bg-[#1C1F26]/50 rounded-2xl border border-dashed border-white/10">
              ยังไม่มีบันทึกรายจ่ายในช่วงเวลานี้
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.filteredExpenses.map((exp) => {
                const badge = getCategoryBadge(exp.category);
                return (
                  <div 
                    key={exp.id}
                    className="bg-[#1C1F26] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{exp.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{exp.date}</span>
                        {exp.note && <span>• {exp.note}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black font-mono text-rose-400 text-sm">
                        -฿{exp.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteExpense(exp.id)}
                        className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: BILLS & RECENT TRANSACTIONS */}
      {activeSubTab === 'transactions' && (
        <div className="bg-[#121418] p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#FACC15]" />
              <h3 className="font-black text-sm uppercase text-white font-heading tracking-tight">
                ประวัติบิล & รายการชำระเงิน
              </h3>
            </div>
          </div>

          {filteredData.filteredBookings.filter(b => b.status === 'completed' || b.depositPaid).length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs bg-[#1C1F26]/50 rounded-2xl border border-dashed border-white/10">
              ยังไม่มีประวัติการชำระเงินในช่วงนี้
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.filteredBookings
                .filter(b => b.status === 'completed' || b.depositPaid)
                .map((b) => (
                  <div
                    key={b.id || b.bookingCode}
                    className="bg-[#1C1F26] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FACC15]">{b.bookingCode}</span>
                        <span className="font-bold text-white">{b.customerName}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span>ช่าง {b.barberName}</span>
                        <span>• {b.serviceName}</span>
                        <span>• {b.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-emerald-400 block">
                        +฿{(b.status === 'completed' ? b.servicePrice : (b.depositAmount || 100)).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        {b.status === 'completed' ? 'ชำระครบถ้วน' : 'มัดจำแล้ว'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="w-full max-w-md bg-[#121418] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-white uppercase font-heading">
                  บันทึกรายจ่ายใหม่
                </h3>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  ชื่อรายการรายจ่าย *
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="เช่น ค่าใบมีดโกน Astra, ค่าน้ำยาโพเมด, ค่าไฟร้าน"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    จำนวนเงิน (฿) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    หมวดหมู่
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white focus:outline-none focus:border-[#FACC15]"
                  >
                    <option value="supplies">อุปกรณ์ / ใบมีด</option>
                    <option value="utilities">ค่าน้ำ / ค่าไฟ</option>
                    <option value="equipment">เครื่องมือบาร์เบอร์</option>
                    <option value="rent">ค่าเช่าร้าน</option>
                    <option value="marketing">การตลาด / โฆษณา</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  หมายเหตุเพิ่มเติม
                </label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="เช่น ซื้อจากร้านอุปกรณ์สำเพ็ง มีบิล"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-white focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase tracking-wider text-xs cursor-pointer transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExpense}
                  className="flex-1 py-3 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] text-black font-black uppercase tracking-wider text-xs cursor-pointer shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmittingExpense ? 'กำลังบันทึก...' : 'บันทึกรายจ่าย'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
