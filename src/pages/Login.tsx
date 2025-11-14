import React, { useState } from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react"; 
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      console.log('Login successful:', res.data);
      // Save authentication info
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem("userId", res.data.user.id || res.data.user._id);
      localStorage.setItem("userName",res.data.user.name );
      window.dispatchEvent(new Event("userChange"));

      setAuthToken(token);

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'pharmacist':
          navigate('/pharmacist-dashboard');
          break;
        case 'nurse':
          navigate('/nurse-dashboard');
          break;
        case 'patient':
          navigate('/home');
          break;
        default:
          navigate('/'); // fallback route
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Navigation />
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('/images/img2.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Animated glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-lg w-[90%] max-w-md text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold text-white mb-6"
        >
          Login
        </motion.h2>

        <motion.form
          onSubmit={submit}
          className="flex flex-col space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          />

          <div>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59,130,246,0.6)", cursor: "pointer" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 w-full py-3 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300"
          >
            Login
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-300 mt-6 text-sm"
        >
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:underline hover:text-blue-300 transition-all"
          >
            Sign up
          </a>
        </motion.p>
      </motion.div>
    </section>

    <Footer />
    </main>
    
  );
}
