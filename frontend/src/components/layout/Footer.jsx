import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Silakan masukkan alamat email Anda.');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Format email tidak valid.');
      return;
    }
    toast.success('Terima kasih! Anda telah berlangganan Newsletter kami.');
    setEmail('');
  };

  const handleSupportClick = (e, name) => {
    e.preventDefault();
    toast('Halaman ' + name + ' sedang dalam tahap pengembangan.', { icon: '🛠️' });
  };

  return (
    <footer className="bg-foreground text-background py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div>
          <h3 className="text-xl font-black tracking-tighter uppercase mb-6">Langkah<span className="text-gray-400 font-light">Kita</span></h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Curated selection of premium sneakers and streetwear from the world's most coveted brands.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-gray-500">Shop</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-sm hover:text-gray-300 transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop" className="text-sm hover:text-gray-300 transition-colors">Sneakers</Link></li>
            <li><Link to="/shop" className="text-sm hover:text-gray-300 transition-colors">Accessories</Link></li>
            <li><Link to="/shop" className="text-sm hover:text-gray-300 transition-colors">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-gray-500">Support</h4>
          <ul className="space-y-4">
            <li><Link to="/faq" className="text-sm hover:text-gray-300 transition-colors">FAQ</Link></li>
            <li><Link to="/shipping-returns" className="text-sm hover:text-gray-300 transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/track-order" className="text-sm hover:text-gray-300 transition-colors">Track Order</Link></li>
            <li><Link to="/contact" className="text-sm hover:text-gray-300 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-gray-500">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form onSubmit={handleSubscribe} className="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="bg-transparent w-full text-sm outline-none placeholder-gray-600 text-white"
            />
            <button type="submit" className="text-xs font-bold tracking-widest uppercase hover:text-gray-300 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Langkah Kita. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
