import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [shoeBrands, setShoeBrands] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const fetchCartCount = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/cart');
        const totalQty = res.data.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(totalQty);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBrands = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const res = await api.get('/brands');
        setShoeBrands(res.data);
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };

    fetchCartCount();
    fetchBrands();
    
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try {
          setUser(JSON.parse(storedUser));
        } catch(e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();

    window.addEventListener('cartUpdated', fetchCartCount);
    window.addEventListener('authStateChanged', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', fetchCartCount);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  const mobileLinks = [
    { name: 'BRANDS', isBrand: true },
  ];
  if (user?.role === 'admin') {
    mobileLinks.push({ name: 'ADMIN', path: '/admin' });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-gray-50/95 backdrop-blur-md border-b border-gray-200 py-4' : 'bg-gray-50 py-4 border-b border-gray-100'
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
            <div 
              className="relative group"
              onMouseEnter={() => setIsBrandsOpen(true)}
              onMouseLeave={() => setIsBrandsOpen(false)}
            >
              <button 
                className="text-xs font-medium tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors flex items-center space-x-1 py-4"
                onClick={() => setIsBrandsOpen(!isBrandsOpen)}
              >
                <span>BRANDS</span>
              </button>
              
              <AnimatePresence>
                {isBrandsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[90vw] md:w-[600px] lg:w-[700px] bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl overflow-hidden z-50 mt-4"
                  >
                    <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                      {shoeBrands.map((brand) => (
                        <Link 
                          key={brand.id || brand.nama} 
                          to={`/brand/${brand.nama}`}
                          className="group relative flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
                          onClick={() => setIsBrandsOpen(false)}
                        >
                          <div className="h-12 w-24 relative mb-4 flex items-center justify-center mix-blend-multiply">
                            <img 
                              src={brand.logo} 
                              alt={brand.nama} 
                              className="max-h-full max-w-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" 
                            />
                          </div>
                          <span className="text-xs font-bold tracking-widest uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            {brand.nama}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter uppercase">
            Langkah<span className="text-gray-400 font-light">Kita</span>
          </Link>

          {/* Desktop Links (Right) & Icons */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <nav className="hidden lg:flex space-x-8 items-center mr-4">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs font-medium tracking-[0.15em] text-foreground/80 hover:text-foreground transition-colors"
                >
                  ADMIN
                </Link>
              )}
            </nav>
            
            <button onClick={() => setIsSearchOpen(true)} className="text-foreground/80 hover:text-foreground transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to={user ? "/profile" : "/login"} className="hidden lg:block text-foreground/80 hover:text-foreground transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="relative text-foreground/80 hover:text-foreground transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-foreground text-background text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
              {mobileLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  {link.isBrand ? (
                    <div className="flex flex-col space-y-4">
                      <span className="text-2xl font-light tracking-wide uppercase">
                        {link.name}
                      </span>
                      <div className="flex flex-col space-y-3 pl-4 border-l border-gray-200">
                        {shoeBrands.map((brand) => (
                          <Link
                            key={brand.id || brand.nama}
                            to={`/brand/${brand.nama}`}
                            className="text-lg font-light tracking-wide text-foreground/70"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {brand.nama}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-2xl font-light tracking-wide uppercase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-6">
               <Link 
                 to={user ? "/profile" : "/login"} 
                 className="flex items-center space-x-2 text-sm font-medium tracking-widest uppercase"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                  <User size={18} /> <span>{user ? 'My Account' : 'Login / Register'}</span>
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-md flex flex-col justify-center items-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-black hover:text-gray-500 transition-colors"
            >
              <X size={36} strokeWidth={1} />
            </button>
            <form onSubmit={handleSearch} className="w-full max-w-4xl relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH FOR SNEAKERS..."
                className="w-full bg-transparent border-b-4 border-black text-2xl md:text-4xl lg:text-7xl font-black tracking-tighter uppercase pb-4 outline-none placeholder-gray-300 text-black"
              />
              <button type="submit" className="absolute right-0 bottom-6 text-black hover:text-gray-500">
                <ArrowRight size={40} strokeWidth={2} />
              </button>
            </form>
            <p className="mt-8 text-sm font-bold tracking-[0.3em] uppercase text-gray-400">
              Press Enter to search
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
