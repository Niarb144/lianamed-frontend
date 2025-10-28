import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
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
          LianaMed
        </motion.h1>
        <p className="text-lg text-gray-200 mb-8">
          Delivering Quality Care, One Supply at a Time.
          <br />
          driven by innovation, precision, and commitment to timely medical solutions
           that empower healthcare excellence.
        </p>
        <button className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold text-lg shadow-md hover:bg-blue-600 hover:shadow-blue-500/50 transition-all duration-300">
          <a href="/login">Get Started</a>
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
