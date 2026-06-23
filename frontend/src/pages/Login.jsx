import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Welcome back!');
      } else {
        await api.post('/auth/register', { nama: name, email, password });
        const loginRes = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('user', JSON.stringify(loginRes.data.user));
        toast.success('Account created and logged in!');
      }
      
      window.dispatchEvent(new Event('authStateChanged'));
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || (error.response?.data?.errors?.[0]?.msg) || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col relative">
      {/* Minimal Header */}
      <header className="absolute top-0 w-full p-6 lg:px-12 flex justify-between items-center z-10">
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
          Langkah<span className="text-gray-400 font-light">Kita</span>
        </Link>
        <Link to="/" className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 lg:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.05)] w-full max-w-lg relative z-20"
        >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Enter your details to access your account.' : 'Join us for exclusive releases and faster checkout.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400">Password</label>
              {isLogin && <a href="#" className="text-xs text-gray-500 hover:text-black">Forgot?</a>}
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
          </div>

          <button disabled={loading} className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-8 flex justify-center items-center space-x-2 disabled:bg-gray-400">
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-bold uppercase tracking-wider ml-1 hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
