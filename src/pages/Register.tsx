import React, { useState } from 'react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 👈 add this import
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (password !== confirmPassword) {
    //   alert('Passwords do not match')
    //   return
    // }
    try {
      await api.post('/auth/register', { name, email, password })
      alert('Registered! Please login.')
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Navigation />
      <section
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/img2.jpg')",
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
            Create Account
          </motion.h2>

          <motion.form
            onSubmit={submit}
            className="flex flex-col space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Full Name */}
            <input
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />

            {/* Email */}
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />

            {/* Password with toggle */}
            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>

            {/* Confirm Password with toggle */}
            {/* <div className="relative">
              <input
                placeholder="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div> */}

            {/* Register button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59,130,246,0.6)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 w-full py-3 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300"
            >
              Register
            </motion.button>
          </motion.form>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-gray-300 mt-6 text-sm"
          >
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:underline hover:text-blue-300 transition-all"
            >
              Login
            </a>
          </motion.p>
        </motion.div>
      </section>
      <Footer />
    </main>
  )
}
