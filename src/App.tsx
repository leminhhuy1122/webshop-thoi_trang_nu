/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useStore } from './store/useStore';
import { PageLoader } from './components/ui/PageLoader';

// Lazy loaded main pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Category = lazy(() => import('./pages/Category').then(m => ({ default: m.Category })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const Account = lazy(() => import('./pages/Account').then(m => ({ default: m.Account })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogDetail = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

// Lazy loaded admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminVouchers = lazy(() => import('./pages/admin/AdminVouchers').then(m => ({ default: m.AdminVouchers })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog').then(m => ({ default: m.AdminBlog })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory').then(m => ({ default: m.AdminInventory })));
const AdminStorefront = lazy(() => import('./pages/admin/AdminStorefront').then(m => ({ default: m.AdminStorefront })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
}

const LoadingFallback = () => null;

function RouteChangeListener() {
  const { isGlobalLoading } = useStore();

  if (isGlobalLoading) {
    return <PageLoader />;
  }
  return null;
}

export default function App() {
  const { initSocket } = useStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <BrowserRouter>
      <RouteChangeListener />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category" element={<Category />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="auth" element={<Auth />} />
            <Route path="account" element={<Account />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="storefront" element={<AdminStorefront />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
