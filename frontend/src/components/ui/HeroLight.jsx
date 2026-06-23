import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { ArrowRight } from 'lucide-react';
import ShoeModel from './ShoeModel';

export default function HeroLight() {
  return (
    <section className="relative h-screen min-h-[800px] w-full bg-[#FAFAFA] overflow-hidden pt-24 font-sans text-gray-900">
      
      {/* Sidebar Links */}
      <div className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col space-y-8 z-20 hidden lg:flex">
        {['Lifestyle', 'Running', 'Basketball', 'Sales'].map((item, idx) => (
          <Link key={item} to="/shop" className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors rotate-180" style={{ writingMode: 'vertical-rl' }}>
            {item}
          </Link>
        ))}
      </div>

      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-40 z-0 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase text-gray-100 select-none whitespace-nowrap"
        >
          SOUND MIND, <br/>
          SOUND BODY.
        </motion.h1>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 lg:px-24 h-full relative z-10 flex flex-col justify-center">
        
        {/* The 3D Canvas wrapper */}
        <div className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-10" style={{ pointerEvents: 'auto' }}>
          <Canvas shadows camera={{ position: [-2, 0.5, 4.5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
            <Environment preset="city" />
            
            <Suspense fallback={null}>
              <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.5}>
                {/* Asics Yellow/Orange color */}
                <ShoeModel color="#f59e0b" scale={1.8} position={[0, -0.5, 0]} rotation={[0.2, -0.5, 0]} />
              </Float>
              <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000000" />
            </Suspense>

            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              minPolarAngle={Math.PI / 3} 
              maxPolarAngle={Math.PI / 1.8} 
              autoRotate
              autoRotateSpeed={1.5}
            />
          </Canvas>
        </div>
        
        {/* Bottom Right Product Card Info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-12 right-6 lg:right-16 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl p-8 w-[320px] z-20 pointer-events-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Asics</p>
              <h3 className="text-xl font-bold uppercase tracking-tight leading-tight">Gel-Kayano<br/>Edition</h3>
            </div>
            <p className="text-sm font-bold tracking-wider">Rp 2.399.000</p>
          </div>

          <div className="flex items-center space-x-3 mb-8">
            <span className="w-5 h-5 rounded-full bg-[#f59e0b] border-2 border-white shadow-sm cursor-pointer ring-1 ring-gray-200"></span>
            <span className="w-5 h-5 rounded-full bg-gray-900 border-2 border-white shadow-sm cursor-pointer"></span>
            <span className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white shadow-sm cursor-pointer"></span>
          </div>

          <Link 
            to="/shop" 
            className="w-full flex items-center justify-between bg-black text-white px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-all group"
          >
            <span>Add to Bag</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:left-32 lg:-translate-x-0 flex items-center space-x-3 text-xs font-medium tracking-widest uppercase text-gray-400 z-0">
          <div className="w-8 h-[1px] bg-gray-300"></div>
          <span>Drag to Rotate 3D Model</span>
        </div>

      </div>
    </section>
  );
}
