import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'NEW ARRIVALS', path: '/shop?category=new' },
    { name: 'SNEAKERS', path: '/shop' },
    { name: 'BRANDS', path: '/brands' },
    { name: 'ADMIN', path: '/admin' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Links (Left) */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs font-medium tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter uppercase">
            Langkah<span className="text-gray-400 font-light">Kita</span>
          </Link>

          {/* Desktop Links (Right) & Icons */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <nav className="hidden lg:flex space-x-8 items-center mr-4">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xs font-medium tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <button className="text-foreground/80 hover:text-foreground transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/login" className="hidden lg:block text-foreground/80 hover:text-foreground transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="relative text-foreground/80 hover:text-foreground transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-foreground text-background text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[60] bg-white h-screen w-screen flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <span className="text-xl font-black tracking-tighter uppercase">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col p-8 space-y-8 flex-grow">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="text-2xl font-light tracking-wide uppercase"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-6">
               <Link to="/login" className="flex items-center space-x-2 text-sm font-medium tracking-widest uppercase">
                  <User size={18} /> <span>Account</span>
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
