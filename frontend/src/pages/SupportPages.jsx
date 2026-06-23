import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Package, ArrowRight } from 'lucide-react';

const PageWrapper = ({ title, children }) => (
  <div className="min-h-screen bg-white text-black pt-16 pb-32">
    <div className="container mx-auto px-6 lg:px-24">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-16 border-b-4 border-black pb-8"
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  </div>
);

export const ContactUs = () => {
  return (
    <PageWrapper title="Contact Us">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-8">Get In Touch</h2>
          <div className="space-y-6 mb-12 text-gray-600">
            <p className="flex items-center space-x-4"><Mail className="text-black" /> <span>support@langkahkita.com</span></p>
            <p className="flex items-center space-x-4"><Phone className="text-black" /> <span>+62 811 2233 4455</span></p>
            <p className="flex items-center space-x-4"><MapPin className="text-black" /> <span>Jl. Sudirman No. 123, Jakarta Selatan, 12190</span></p>
          </div>
        </div>
        <div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Name</label>
              <input type="text" required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <input type="email" required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Message</label>
              <textarea required rows="4" className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors resize-none"></textarea>
            </div>
            <button className="bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors w-full lg:w-auto">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    setStatus('Sedang mencari resi...');
    setTimeout(() => {
      setStatus('Resi tidak ditemukan. Pastikan Anda memasukkan nomor yang benar (Contoh: LK123456789).');
    }, 1500);
  };

  return (
    <PageWrapper title="Track Order">
      <div className="max-w-2xl">
        <p className="text-gray-600 mb-8 text-lg">Enter your order number to track the current status of your shipment.</p>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. LK123456789" 
              className="w-full border-2 border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-black transition-colors text-lg font-medium"
            />
          </div>
          <button className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap">
            <span>Track</span>
            <ArrowRight size={18} />
          </button>
        </form>
        {status && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-gray-50 border-l-4 border-black">
            <p className="font-medium text-gray-800">{status}</p>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: "Are your sneakers authentic?", a: "Yes, 100%. We guarantee the authenticity of every item we sell. We source directly from brands and trusted premium retailers." },
    { q: "How long does shipping take?", a: "Standard domestic shipping takes 2-4 business days. Express shipping takes 1-2 business days. International shipping takes 5-10 business days." },
    { q: "Do you accept returns?", a: "Yes, we accept returns within 14 days of delivery. The item must be unworn, with all original tags and packaging intact." },
    { q: "What payment methods are accepted?", a: "We accept all major credit cards, bank transfers, GoPay, OVO, and ShopeePay." }
  ];

  return (
    <PageWrapper title="FAQ">
      <div className="max-w-3xl space-y-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-8">
            <h3 className="text-xl font-bold tracking-tight mb-4">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export const ShippingReturns = () => (
  <PageWrapper title="Shipping & Returns">
    <div className="max-w-3xl space-y-12 text-gray-700 leading-relaxed">
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black">Shipping Policy</h2>
        <p className="mb-4">All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Standard Shipping (2-4 days): Rp 20.000</li>
          <li>Express Shipping (1-2 days): Rp 50.000</li>
          <li>Free Shipping on all orders over Rp 2.000.000</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black">Returns Policy</h2>
        <p className="mb-4">We accept returns up to 14 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.</p>
        <p>If your order arrives damaged in any way, please email us as soon as possible at support@langkahkita.com with your order number and a photo of the item's condition.</p>
      </section>
    </div>
  </PageWrapper>
);

export const Policy = ({ title }) => (
  <PageWrapper title={title}>
    <div className="max-w-3xl space-y-6 text-gray-600 leading-relaxed">
      <p>This is a standard placeholder for the {title}. This document sets out the terms and conditions that govern the use of our website and services.</p>
      <p>1. Acceptance of Terms: By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <p>2. Modifications: We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically.</p>
      <p>3. Warranties: The service is provided "as is," without warranty of any kind.</p>
    </div>
  </PageWrapper>
);
