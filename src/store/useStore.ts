import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface CartItem {
  cartItemId: string;
  product: any;
  quantity: number;
  size: string;
  color: string;
}

interface AppState {
  user: User | null;
  cartItems: CartItem[];
  wishlistItems: any[];
  cartCount: number;
  wishlistCount: number;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: any | null;
  toasts: Toast[];

  products: any[];
  categories: any[];
  orders: any[];
  banners: any[];
  flashSale: any;
  vouchers: any[];
  socket: Socket | null;
  isGlobalLoading: boolean;
  
  setGlobalLoading: (loading: boolean) => void;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  setQuickViewProduct: (product: any | null) => void;
  
  addToCart: (product: any, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (product: any) => void;

  login: (user: User) => void;
  logout: () => void;

  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  initSocket: () => void;
  fetchInitialData: () => Promise<void>;
  createProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, product: any) => void;
  deleteProduct: (id: string) => void;
  clearProducts: () => void;
  clearOrders: () => void;
  clearVouchers: () => void;
  addReview: (productId: string, review: any) => void;
  updateStorefront: (banners: any[], flashSale: any) => void;
  updateVouchers: (vouchers: any[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  cartItems: [],
  wishlistItems: [],
  cartCount: 0,
  wishlistCount: 0,
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  toasts: [],
  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
  
  products: [],
  categories: [],
  orders: [],
  banners: [
    { 
      id: '1', 
      title: 'AURA ESSENTIALS', 
      subtitle: 'BỘ SƯU TẬP MỚI', 
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', 
      link: '/category',
      status: 'active',
      textColor: 'light',
      textAlign: 'center',
      buttonText: 'Mua ngay',
      secondaryButtonText: 'Xem Lookbook',
      secondaryButtonLink: '/category',
      overlayOpacity: 60,
      buttonStyle: 'solid',
      campaign: 'Xuân Hè 2026',
      tags: 'hero, new-arrival'
    },
    { 
      id: '2', 
      title: 'THANH LỊCH &<br/>HIỆN ĐẠI', 
      subtitle: 'ĐỘC QUYỀN ONLINE', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop', 
      link: '/category',
      status: 'active',
      textColor: 'light',
      textAlign: 'left',
      buttonText: 'Khám phá',
      overlayOpacity: 40,
      buttonStyle: 'outline',
      campaign: 'Thu Đông 2026',
      tags: 'hero, exclusive'
    },
    { 
      id: '3', 
      title: 'TỐI GIẢN TỪNG<br/>CHI TIẾT', 
      subtitle: 'PHỤ KIỆN CAO CẤP', 
      image: '/hero_4.jpg', 
      link: '/category',
      status: 'active',
      textColor: 'dark',
      textAlign: 'right',
      buttonText: 'Xem ngay',
      overlayOpacity: 10,
      buttonStyle: 'glass',
      campaign: 'Phụ kiện',
      tags: 'hero, accessories'
    }
  ],
  flashSale: {
    isActive: true,
    endTime: '2026-12-31T23:59',
    products: [
      {
        id: "prod-fs-1",
        name: "Áo Khoác Da Mẫu C",
        description: "Chất liệu da tổng hợp cao cấp.",
        price: 1500000,
        salePrice: 899000,
        image: "https://images.unsplash.com/photo-1521223890158-5d5b1faaee86?q=80&w=1927&auto=format&fit=crop",
        category: "Áo Khoác",
      }
    ]
  },
  vouchers: [
    { id: '1', code: 'AURA100K', type: 'fixed', value: 100000, minOrder: 500000, usageLimit: 100, usedCount: 45, status: 'active', expiresAt: '2026-12-31', isWelcome: false },
    { id: '2', code: 'FREESHIP', type: 'freeship', value: 30000, minOrder: 0, usageLimit: 500, usedCount: 420, status: 'active', expiresAt: '2026-08-30', isWelcome: false },
    { id: '3', code: 'NEWBIE10', type: 'percent', value: 10, minOrder: 300000, usageLimit: 1000, usedCount: 1000, status: 'active', expiresAt: '2026-12-31', isWelcome: true },
  ],
  socket: null,

  updateStorefront: (banners, flashSale) => set({ banners, flashSale }),
  updateVouchers: (vouchers) => set({ vouchers }),

  initSocket: () => {
    if (get().socket) return;
    
    // Tải trước dữ liệu qua API HTTP làm baseline
    get().fetchInitialData();
    
    const socket = io();
    
    socket.on('initial_data', (data) => {
      set({ 
        products: data.products || [], 
        categories: data.categories || [],
        orders: data.orders || []
      });
    });

    socket.on('products_updated', (products) => {
      set({ products });
    });

    socket.on('categories_updated', (categories) => {
      set({ categories });
    });

    socket.on('orders_updated', (orders) => {
      set({ orders });
    });

    set({ socket });
  },

  fetchInitialData: async () => {
    set({ isGlobalLoading: true });
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/orders')
      ]);

      let products = productsRes.ok ? await productsRes.json() : [];
      let categories = categoriesRes.ok ? await categoriesRes.json() : [];
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      if (!products || products.length === 0) {
        products = mockProducts;
      }
      if (!categories || categories.length === 0) {
        categories = mockCategories;
      }

      set({ products, categories, orders });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu ban đầu, sử dụng dữ liệu mặc định:', error);
      set({ products: mockProducts, categories: mockCategories });
    } finally {
      set({ isGlobalLoading: false });
    }
  },

  createProduct: async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const newProduct = await res.json();
        
        // Tự động thêm danh mục mới nếu chưa có trong state local
        const currentCategories = get().categories;
        const catExists = currentCategories.find(c => c.name.toLowerCase() === newProduct.category.toLowerCase());
        let updatedCategories = currentCategories;
        if (newProduct.category && !catExists) {
          const newCat = { id: `cat-${Date.now()}`, name: newProduct.category, createdAt: new Date().toISOString() };
          updatedCategories = [...currentCategories, newCat];
        }

        set((state) => ({
          products: [...state.products, newProduct],
          categories: updatedCategories
        }));

        get().addToast('Thêm sản phẩm thành công', 'success');
      } else {
        get().addToast('Lỗi khi thêm sản phẩm', 'error');
      }
    } catch (error) {
      get().addToast('Lỗi kết nối', 'error');
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        set((state) => ({
          products: state.products.map(p => p.id === id ? updatedProduct : p)
        }));
        get().addToast('Cập nhật sản phẩm thành công', 'success');
      } else {
        get().addToast('Lỗi khi cập nhật sản phẩm', 'error');
      }
    } catch (error) {
      get().addToast('Lỗi kết nối', 'error');
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }));
        get().addToast('Xóa sản phẩm thành công', 'info');
      } else {
        get().addToast('Lỗi khi xóa sản phẩm', 'error');
      }
    } catch (error) {
      get().addToast('Lỗi kết nối', 'error');
    }
  },

  clearProducts: () => set({ products: [] }),
  clearOrders: () => set({ orders: [] }),
  clearVouchers: () => set({ vouchers: [] }),

  addReview: async (productId, review) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        const newReview = await res.json();
        set((state) => {
          const updatedProducts = state.products.map(p => {
            if (p.id === productId) {
              const reviews = p.reviews ? [...p.reviews, newReview] : [newReview];
              const totalRating = reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
              const rating = totalRating / reviews.length;
              return { ...p, reviews, rating };
            }
            return p;
          });
          return { products: updatedProducts };
        });
        get().addToast('Cảm ơn bạn đã nhận xét!', 'success');
      } else {
        get().addToast('Lỗi khi gửi nhận xét', 'error');
      }
    } catch (error) {
      get().addToast('Lỗi kết nối', 'error');
    }
  },

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
  
  addToCart: (product, quantity = 1, size = 'M', color = 'Đen') => set((state) => {
    const cartItemId = `${product.id}-${size}-${color}`;
    const existingItem = state.cartItems.find(item => item.cartItemId === cartItemId);
    const toastId = Math.random().toString(36).substring(7);
    
    let newCartItems;
    if (existingItem) {
      newCartItems = state.cartItems.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCartItems = [...state.cartItems, { cartItemId, product, quantity, size, color }];
    }
    
    return { 
      cartItems: newCartItems,
      cartCount: state.cartCount + quantity,
      toasts: [...state.toasts, { id: toastId, message: 'Đã thêm vào giỏ hàng', type: 'success' }]
    };
  }),

  removeFromCart: (cartItemId) => set((state) => {
    const itemToRemove = state.cartItems.find(item => item.cartItemId === cartItemId);
    if (!itemToRemove) return state;
    
    return {
      cartItems: state.cartItems.filter(item => item.cartItemId !== cartItemId),
      cartCount: state.cartCount - itemToRemove.quantity
    };
  }),

  updateCartQuantity: (cartItemId, quantity) => set((state) => {
    if (quantity < 1) return state;
    const existingItem = state.cartItems.find(item => item.cartItemId === cartItemId);
    if (!existingItem) return state;
    
    const quantityDiff = quantity - existingItem.quantity;
    
    return {
      cartItems: state.cartItems.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ),
      cartCount: state.cartCount + quantityDiff
    };
  }),

  clearCart: () => set({ cartItems: [], cartCount: 0 }),

  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlistItems.find(item => item.id === product.id);
    const toastId = Math.random().toString(36).substring(7);
    
    if (exists) {
      return {
        wishlistItems: state.wishlistItems.filter(item => item.id !== product.id),
        wishlistCount: state.wishlistCount - 1,
        toasts: [...state.toasts, { id: toastId, message: 'Đã xóa khỏi yêu thích', type: 'info' }]
      };
    } else {
      return {
        wishlistItems: [...state.wishlistItems, product],
        wishlistCount: state.wishlistCount + 1,
        toasts: [...state.toasts, { id: toastId, message: 'Đã thêm vào yêu thích', type: 'success' }]
      };
    }
  }),

  login: (user) => set({ user }),
  logout: () => set({ user: null }),

  addToast: (message, type = 'info') => set((state) => ({
    toasts: [...state.toasts, { id: Math.random().toString(36).substring(7), message, type }]
  })),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));

