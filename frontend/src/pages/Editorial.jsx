import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Editorial() {
  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const yImage1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen text-black font-sans pb-32">
      
      {/* Navbar overlay for editorial page (very minimal) */}
      <div className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center mix-blend-difference text-white">
        <Link to="/" className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold tracking-[0.3em] uppercase">Editorial Issue No. 01</span>
      </div>

      {/* Hero Header */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
        <motion.div 
          style={{ y: yImage1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/editorial.png" 
            alt="Editorial Cover" 
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 text-gray-300"
          >
            Design Philosophy
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter uppercase leading-[0.85] mb-8"
          >
            The Architecture<br/>of Comfort
          </motion.h1>
        </div>
      </header>

      {/* Article Content */}
      <main className="container mx-auto px-6 lg:px-24 mt-32 lg:mt-48">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Column - Big Text */}
          <div className="w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] sticky top-40"
            >
              Blurring the lines between high fashion and everyday utility.
            </motion.h2>
          </div>

          {/* Right Column - Paragraphs */}
          <div className="w-full lg:w-1/2 space-y-12 text-lg lg:text-xl font-medium leading-relaxed text-gray-800">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              In the modern urban landscape, footwear is no longer just a functional necessity. It has evolved into an architectural foundation for the human body. Every stitch, every curve, and every material choice is a calculated decision designed to withstand the brutalist environments we navigate daily.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Our latest collection explores the intersection of brutalist aesthetics and unparalleled comfort. We stripped away the unnecessary, focusing purely on raw materials and structural integrity. The result is a silhouette that feels as robust as concrete yet as light as air.
            </motion.p>
          </div>
        </div>

        {/* Parallax Image Break */}
        <div className="relative w-full h-[60vh] lg:h-[80vh] mt-32 overflow-hidden bg-black">
          <motion.div 
            style={{ y: yImage2 }}
            className="absolute inset-0 -top-[20%] -bottom-[20%]"
          >
            <img 
              src="/editorial.png" 
              alt="Editorial Detail" 
              className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h3 className="text-white text-5xl lg:text-8xl font-black tracking-tighter uppercase drop-shadow-2xl">Raw Materials</h3>
          </div>
        </div>

        {/* Conclusion */}
        <div className="max-w-3xl mx-auto text-center mt-32">
          <h3 className="text-3xl font-black tracking-tighter uppercase mb-6">Built for the Streets</h3>
          <p className="text-xl text-gray-600 mb-12">
            Experience the future of urban mobility. Step into the architecture of comfort.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-black text-white px-12 py-5 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </main>

    </div>
  );
}
