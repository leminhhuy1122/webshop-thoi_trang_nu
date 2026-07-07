import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Wallet, Truck, Lock, ShoppingBag, X, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function Checkout() {
  const { user, cartItems, clearCart, vouchers, addToast, setGlobalLoading, isGlobalLoading } = useStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState('');

  const [shippingFee, setShippingFee] = useState(30000); // Mặc định 30.000đ, có thể kết nối API GHTK sau

  // Các trường địa chỉ và liên hệ khách hàng
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [addressCity, setAddressCity] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
    }
  }, [user, navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyVoucher = () => {
    setVoucherError('');
    if (!voucherCode.trim()) return;

    const voucher = vouchers?.find((v: any) => v.code.toUpperCase() === voucherCode.toUpperCase());
    
    if (!voucher) {
      setVoucherError('Mã giảm giá không tồn tại.');
      return;
    }

    if (voucher.status !== 'active' || new Date(voucher.expiresAt) < new Date()) {
      setVoucherError('Mã giảm giá đã hết hạn hoặc không còn hiệu lực.');
      return;
    }

    if (subtotal < voucher.minOrder) {
      setVoucherError(`Đơn hàng tối thiểu là ${formatPrice(voucher.minOrder)}.`);
      return;
    }

    setAppliedVoucher(voucher);
    setVoucherCode('');
    addToast('Áp dụng mã giảm giá thành công!', 'success');
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'freeship') {
      discountAmount = Math.min(shippingFee, appliedVoucher.value);
    } else if (appliedVoucher.type === 'fixed') {
      discountAmount = appliedVoucher.value;
    } else if (appliedVoucher.type === 'percent') {
      discountAmount = Math.floor(subtotal * (appliedVoucher.value / 100));
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleCheckout = async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !addressCity.trim() || !addressStreet.trim()) {
      addToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
      return;
    }

    setGlobalLoading(true);

    const token = localStorage.getItem('accessToken');
    const shippingAddress = `${addressStreet}, ${addressCity}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          recipientName: fullName,
          recipientPhone: phone,
          recipientEmail: email,
          notes,
          paymentMethod,
          voucherCode: appliedVoucher?.code || null,
          shippingFee
        })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        clearCart();
        addToast('Đặt hàng thành công!', 'success');
      } else {
        addToast(data.message || 'Đặt hàng thất bại', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Lỗi kết nối tới máy chủ', 'error');
    } finally {
      setGlobalLoading(false);
    }
  };

  if (!user) return null;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Truck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif italic mb-4">Đặt Hàng Thành Công!</h1>
        <p className="text-sm text-black/60 mb-10 max-w-md mx-auto">
          Cảm ơn bạn đã mua sắm tại AURA. Đơn hàng của bạn đã được xác nhận và đang được xử lý. Bạn có thể theo dõi trạng thái đơn hàng trong trang tài khoản.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/account')}
            className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Theo Dõi Đơn Hàng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white border border-black/10 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
          >
            Trở Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 bg-[#F3F2F0] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-black/20" />
        </div>
        <h2 className="text-2xl font-serif italic mb-4">Giỏ Hàng Trống</h2>
        <p className="text-sm text-black/60 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng để thanh toán.</p>
        <button 
          onClick={() => navigate('/category')}
          className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-block"
        >
          Khám Phá Sản Phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif italic mb-2">Thanh Toán</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Hoàn tất đơn hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Shipping Address */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span> 
              Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow" required />
              <input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow" required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow md:col-span-2" required />
              
              <div className="md:col-span-2">
                <input type="text" placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow mb-4" required />
                <input type="text" placeholder="Số nhà, tên đường" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow" required />
              </div>
              
              <div className="md:col-span-2 mt-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Đơn vị vận chuyển (Dự kiến kết nối GHTK)</label>
                <select 
                  className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 appearance-none cursor-pointer"
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                >
                  <option value="30000">Giao hàng tiêu chuẩn (30.000đ)</option>
                  <option value="50000">Giao hàng hỏa tốc (50.000đ)</option>
                </select>
              </div>

              <textarea placeholder="Ghi chú đơn hàng (không bắt buộc)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 transition-shadow md:col-span-2 h-20 resize-none mt-2"></textarea>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">2</span> 
              Phương thức thanh toán
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-4 p-4 border border-black/10 rounded-2xl cursor-pointer hover:border-black transition-colors bg-white">
                <input type="radio" name="payment" className="w-4 h-4 accent-black" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <Truck className="w-5 h-5 text-black/60" />
                <div className="flex-1">
                  <p className="text-xs font-bold">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-[10px] text-black/60 mt-1">Thanh toán bằng tiền mặt khi giao hàng.</p>
                </div>
              </label>
              
              <label className="flex items-center gap-4 p-4 border border-black/10 rounded-2xl cursor-pointer hover:border-black transition-colors bg-white">
                <input type="radio" name="payment" className="w-4 h-4 accent-black" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} />
                <Wallet className="w-5 h-5 text-black/60" />
                <div className="flex-1">
                  <p className="text-xs font-bold">Ví điện tử Momo</p>
                  <p className="text-[10px] text-black/60 mt-1">Thanh toán an toàn qua ví Momo.</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-black/10 rounded-2xl cursor-pointer hover:border-black transition-colors bg-white">
                <input type="radio" name="payment" className="w-4 h-4 accent-black" checked={paymentMethod === 'ZALOPAY'} onChange={() => setPaymentMethod('ZALOPAY')} />
                <Wallet className="w-5 h-5 text-black/60" />
                <div className="flex-1">
                  <p className="text-xs font-bold">Ví điện tử ZaloPay</p>
                  <p className="text-[10px] text-black/60 mt-1">Thanh toán an toàn qua ví ZaloPay.</p>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-[#FAF9F6] border border-black/5 rounded-3xl p-6 md:p-8 sticky top-24">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Đơn hàng của bạn</h2>
          
          <div className="flex flex-col gap-4 mb-6">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-black/5 relative">
                  <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white rounded-bl-lg flex items-center justify-center text-[8px] font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h4 className="text-xs font-bold line-clamp-1 mb-1">{item.product.name}</h4>
                  <p className="text-[9px] uppercase tracking-widest text-black/40 mb-2">{item.color} / {item.size}</p>
                  <span className="text-xs font-bold">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 pt-6 border-t border-black/5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Mã giảm giá
            </h3>
            
            {appliedVoucher ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-700">{appliedVoucher.code}</span>
                  <span className="text-[10px] text-green-600">
                    ({appliedVoucher.type === 'percent' ? `-${appliedVoucher.value}%` : `-${formatPrice(appliedVoucher.value)}`})
                  </span>
                </div>
                <button onClick={removeVoucher} className="text-black/40 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá" 
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-black/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-black/30 transition-colors uppercase"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    disabled={!voucherCode.trim()}
                    className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:hover:bg-black"
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherError && <p className="text-[10px] text-red-500">{voucherError}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 py-6 border-y border-black/5 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-black/60">Tạm tính</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-black/60">Phí vận chuyển</span>
              <span className="font-bold">{shippingFee > 0 ? formatPrice(shippingFee) : <span className="text-[10px] uppercase tracking-widest text-green-600">Miễn phí</span>}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-green-600">
                <span>Giảm giá ({appliedVoucher?.code})</span>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mb-8">
            <span className="text-sm font-bold uppercase tracking-widest">Tổng cộng</span>
            <span className="text-2xl font-serif italic text-red-600">{formatPrice(finalTotal)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isGlobalLoading}
            className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGlobalLoading ? (
              <LoadingSpinner size="sm" className="border-white/20 border-t-white" />
            ) : (
              'Đặt Hàng'
            )}
          </button>
          
          <div className="mt-6 pt-6 border-t border-black/5">
            <div className="flex items-center justify-center gap-2 mb-3 text-black/60">
              <Lock className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Thanh toán bảo mật</span>
            </div>
            <div className="flex gap-4 justify-center items-center opacity-60 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
