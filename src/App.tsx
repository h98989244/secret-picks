import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminLayout from '@/components/layout/AdminLayout'
import AgeVerification from '@/components/AgeVerification'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { useStoreInfoStore } from '@/stores/storeInfoStore'

import Home from '@/pages/Home'
import Category from '@/pages/Category'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Login from '@/pages/Login'

import About from '@/pages/static/About'
import Guide from '@/pages/static/Guide'
import Privacy from '@/pages/static/Privacy'
import Faq from '@/pages/static/Faq'
import OrderTrack from '@/pages/static/OrderTrack'
import ReturnPolicy from '@/pages/static/ReturnPolicy'
import Shipping from '@/pages/static/Shipping'

import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'

import AdminLogin from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'
import StoreSettings from '@/pages/admin/StoreSettings'
import ProductList from '@/pages/admin/ProductList'
import ProductEdit from '@/pages/admin/ProductEdit'
import AdminOrderList from '@/pages/admin/AdminOrderList'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function FrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)
  const initProducts = useProductStore((s) => s.initData)
  const fetchStoreInfo = useStoreInfoStore((s) => s.fetchInfo)

  useEffect(() => {
    restoreSession()
    initProducts()
    fetchStoreInfo()
  }, [restoreSession, initProducts, fetchStoreInfo])

  return (
    <>
      <ScrollToTop />
      <AgeVerification />
      <Routes>
        {/* Front-end routes */}
        <Route element={<FrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/order/track" element={<OrderTrack />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/confirmation/:orderNumber" element={<OrderConfirmation />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="orders" element={<AdminOrderList />} />
          <Route path="settings" element={<StoreSettings />} />
        </Route>
      </Routes>
    </>
  )
}
