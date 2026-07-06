import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/ToastContainer';
import { ScrollToTop } from '../ui/ScrollToTop';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from '../ui/SearchOverlay';
import { QuickView } from '../ui/QuickView';
import { BottomNav } from './BottomNav';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans pb-16 md:pb-0">
      <Header />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickView />
      <main className="flex-1 p-4 md:p-6 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <ToastContainer />
      <ScrollToTop />
    </div>
  );
}
