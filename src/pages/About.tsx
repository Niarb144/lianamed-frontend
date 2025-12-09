'use client';
import React from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function About() {
  return (
    <main>
        <Navigation />
        <section
            className="relative flex items-center justify-center h-[40dvh] bg-cover bg-center"
            style={{
                backgroundImage:
                "url('/images/img1.jpg')",
            }}
            >
            {/* Overlay for darker contrast */}
            <div className="absolute inset-0 bg-black/50 "></div>

            {/* Centered content box */}
            <motion.div
                whileHover={{ boxShadow: "0 0 30px 8px rgba(0, 153, 255, 0.5)" }}
                className="relative z-10 max-w-xl mx-auto p-10 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-center transition-all duration-300"
            >
                {/* Title */}
                <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                >
                About LianaMed
                </motion.h1>
                
            </motion.div>
        </section>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Who We Are</h1>
            <p className="text-lg text-gray-700 mb-4">
                LianaMed is a leading provider of medical supplies, dedicated to delivering high-quality products to healthcare professionals and institutions worldwide. Our mission is to enhance patient care by ensuring timely access to essential medical equipment and supplies.
            </p>
            <p className="text-lg text-gray-700 mb-4">
                Founded in 2025, LianaMed has grown to become a trusted name in the medical supply industry. We pride ourselves on our commitment to innovation, quality, and customer satisfaction. Our  extensive product range includes everything from surgical instruments to diagnostic equipment, all sourced from reputable manufacturers.
            </p>
            <p className="text-lg text-gray-700 mb-4">
                At LianaMed, we understand the critical role that medical supplies play in healthcare delivery. That's why we work closely with our clients to provide tailored solutions that meet their specific needs. Our team of experts is always available to offer guidance and support, ensuring that our customers receive the best possible service.
            </p>
            <p className="text-lg text-gray-700">
                Thank you for choosing LianaMed as your trusted partner in healthcare. We look forward to serving you and contributing to the advancement of medical care worldwide.
            </p>
            </div>
            
        </div>
        <Footer />
    </main>
    
    );
}