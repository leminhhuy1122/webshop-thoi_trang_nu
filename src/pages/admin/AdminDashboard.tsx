import { useStore } from '../../store/useStore';
import { Package, ShoppingBag, DollarSign, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const revenueData = [
  { name: 'T2', revenue: 4000000, orders: 24 },
  { name: 'T3', revenue: 3000000, orders: 18 },
  { name: 'T4', revenue: 5500000, orders: 35 },
  { name: 'T5', revenue: 4500000, orders: 28 },
  { name: 'T6', revenue: 6000000, orders: 42 },
  { name: 'T7', revenue: 8000000, orders: 55 },
  { name: 'CN', revenue: 7500000, orders: 48 },
];

export function AdminDashboard() {
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0) || 12500000;
  const totalOrders = orders.length || 24;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Grid 2x2 on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Doanh thu</p>
              <h3 className="text-lg md:text-2xl font-serif italic truncate">{new Intl.NumberFormat('vi-VN', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'VND' }).format(totalRevenue)}</h3>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> +12.5%
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Đơn hàng</p>
              <h3 className="text-lg md:text-2xl font-serif italic">{totalOrders}</h3>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> +5.2%
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Sản phẩm</p>
              <h3 className="text-lg md:text-2xl font-serif italic">{products.length}</h3>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          <div className="hidden md:block text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 font-bold mt-1">Đang bán</div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="z-10">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Khách hàng</p>
              <h3 className="text-lg md:text-2xl font-serif italic">1,204</h3>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> +8.1%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-black/5">
          <h3 className="text-base md:text-lg font-serif italic mb-4 md:mb-6">Doanh Thu (Tuần)</h3>
          <div className="h-48 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-black/5">
          <h3 className="text-base md:text-lg font-serif italic mb-4 md:mb-6">Đơn Hàng (Tuần)</h3>
          <div className="h-48 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f5f5f5' }}
                />
                <Bar dataKey="orders" name="Số đơn" fill="#000" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
