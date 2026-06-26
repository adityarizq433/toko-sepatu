import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroData = [
  {
    id: 1,
    brand: 'NIKE',
    slogan: 'JUST DO IT.',
    model: 'Nike Air Force 1 Low',
    price: 'Rp 1.549.000',
    image: '/hero/nike.png',
    accentColor: '#FFFFFF',
    bgText: 'NIKE',
    scale: 1.0 // Ubah angka ini untuk memperbesar/memperkecil (contoh: 1.2 atau 0.8)
  },
  {
    id: 2,
    brand: 'PUMA',
    slogan: 'FOREVER FASTER.',
    model: 'Puma Palermo',
    price: 'Rp 1.499.000',
    image: '/hero/puma.png',
    accentColor: '#E2E8F0',
    bgText: 'PUMA',
    scale: 1.0 // Ubah angka ini untuk memperbesar/memperkecil
  },
  {
    id: 3,
    brand: 'VANS',
    slogan: 'OFF THE WALL.',
    model: 'Vans Old Skool',
    price: 'Rp 999.000',
    image: '/hero/vans.png',
    accentColor: '#D1D5DB',
    bgText: 'VANS',
    scale: 1.0 // Ubah angka ini untuk memperbesar/memperkecil
  },
  {
    id: 4,
    brand: 'ASICS',
    slogan: 'SOUND MIND, SOUND BODY.',
    model: 'Asics Gel-Kayano',
    price: 'Rp 2.399.000',
    image: '/hero/asics.png',
    accentColor: '#9CA3AF',
    bgText: 'ASICS',
    scale: 1.0 // Ubah angka ini untuk memperbesar/memperkecil
  },
  {
    id: 5,
    brand: 'HOKA',
    slogan: 'TIME TO FLY.',
    model: 'Hoka Clifton 9',
    price: 'Rp 2.599.000',
    image: '/hero/hoka.png',
    accentColor: '#E5E7EB',
    bgText: 'HOKA',
    scale: 1.0 // Ubah angka ini untuk memperbesar/memperkecil
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideLeft = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? heroData.length - 1 : prevIndex - 1));
  };

  const slideRight = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === heroData.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      slideRight();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentSlide = heroData[currentIndex];

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <section className="relative min-h-[85vh] h-auto lg:h-[85vh] py-12 lg:py-0 w-full bg-white overflow-hidden flex items-center">


      {/* No Gradient Overlay Needed for Reference Design */}

      <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-between relative z-10">

        {/* Left Content (Slogan & Details) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center mt-8 lg:mt-0 order-2 lg:order-1 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white py-6 pr-8 inline-block shadow-[20px_0_20px_white]"
            >
              <h2 className="text-4xl md:text-5xl lg:text-[5.5rem] font-black tracking-tighter uppercase leading-[0.9] text-black mb-6">
                {currentSlide.slogan.split(',').map((part, i) => (
                  <span key={i}>
                    {part.trim()}
                    {i !== currentSlide.slogan.split(',').length - 1 && <>,<br/></>}
                  </span>
                ))}
              </h2>
              
              <div className="mb-8 border-l-2 pl-4 border-black">
                <p className="text-xl text-black font-bold tracking-wide uppercase">
                  {currentSlide.model}
                </p>
                <p className="text-sm text-black font-bold tracking-[0.2em] mt-1">
                  {currentSlide.price}
                </p>
              </div>

              <Link 
                to="/shop" 
                className="inline-flex items-center space-x-4 bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors group"
              >
                <span>Shop Collection</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Content (Floating 3D Shoe) */}
        <motion.div
          className="w-full lg:w-[55%] h-[40vh] lg:h-full flex items-center justify-center relative order-1 lg:order-2 z-10 pointer-events-none"
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full max-w-[700px] h-[500px] flex items-center justify-center"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.model}
                className="w-full h-auto object-contain mix-blend-multiply drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
                style={{ 
                  filter: 'contrast(1.05) brightness(1.03)',
                  transform: `scale(${currentSlide.scale || 1.0})`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 z-30">
        <button
          onClick={slideLeft}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-black hover:border-black transition-all group"
        >
          <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="flex space-x-3 items-center">
          {heroData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-[2px] transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-black' : 'w-4 bg-gray-300'}`}
            />
          ))}
        </div>

        <button
          onClick={slideRight}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-black hover:border-black transition-all group"
        >
          <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
