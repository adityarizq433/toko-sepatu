import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Shop from './pages/Shop';
import BrandPage from './pages/BrandPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Editorial from './pages/Editorial';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { ContactUs, TrackOrder, FAQ, ShippingReturns, Policy } from './pages/SupportPages';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/utils/ScrollToTop';
import SocketProvider from './components/utils/SocketProvider';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SocketProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<Admin />} />
            <Route path="shop" element={<Shop />} />
            <Route path="brand/:brandName" element={<BrandPage />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping-returns" element={<ShippingReturns />} />
            <Route path="privacy" element={<Policy title="Privacy Policy" />} />
            <Route path="terms" element={<Policy title="Terms of Service" />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/editorial" element={<Editorial />} />
        </Routes>
      </BrowserRouter>
      </SocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
