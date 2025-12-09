'use client';
import React from "react";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function Contact() {
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
                    Contact LianaMed
                    </motion.h1>
                    
                </motion.div>
            </section>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8 mt-8">
                <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Contact Us</h1>
                <p className="text-lg text-gray-700 mb-4">
                    We value your feedback and inquiries. Whether you have questions about our products, need assistance with an order, or want to learn more about how LianaMed can support your healthcare needs, we're here to help.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    You can reach us through the following channels:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
                    <li>Email:
                        <a href="mailto: info@lianamed.com" className="text-blue-500 hover:underline"> info@lianamed.com</a>
                    </li>
                    <li>Phone: <a href="tel:+1234567890" className="text-blue-500 hover:underline">+1 (234) 567-890</a></li>
                    <li>Address: 123 Medical Supply St., Health City, HC 12345</li>
                </ul>   
                <p className="text-lg text-gray-700">
                    Our customer service team is available Monday to Friday, from 9:00 AM to 6:00 PM (EST). We strive to respond to all inquiries within 24-48 hours.
                </p>
            </div>
            
        </div>
        <div className="flex justify-center">
                <form className="w-full max-w-lg mt-12">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input className="w-full px-3 py-2 border rounded" type="text" id="name" name="name" placeholder="Your Name"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="w-full px-3 py-2 border rounded" type="email" id="email" name="email" placeholder="
                    Your Email"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                    <textarea className="w-full px-3 py-2 border rounded" id="message" name="message" rows={5} placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Send Message</button>
            </form>
            </div>
        <Footer />
        </main>
        
    );
}