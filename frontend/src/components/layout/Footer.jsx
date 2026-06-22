export default function Footer() {
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
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">New Arrivals</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Sneakers</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Accessories</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-gray-500">Support</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">FAQ</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Track Order</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300 transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-gray-500">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent w-full text-sm outline-none placeholder-gray-600 text-white"
            />
            <button className="text-xs font-bold tracking-widest uppercase hover:text-gray-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Langkah Kita. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
