'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  // Floating circles data
  const circles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 150 + 50,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
  }));

  // Add class to html element on mount
  useEffect(() => {
    document.documentElement.classList.add('not-found-page');
    return () => {
      document.documentElement.classList.remove('not-found-page');
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden isolate">
      {/* Background floating circles */}
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          initial={{ y: 0, opacity: 0.2 }}
          animate={{
            y: [0, 100, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-indigo-200/30 dark:bg-indigo-400/20 backdrop-blur-sm"
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            left: `${circle.left}%`,
            top: `${circle.top}%`,
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl mx-4 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="text-center">
          {/* 404 number with animation */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            404
          </motion.div>

          {/* Title with staggered letters */}
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {'Page Not Found'.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 200 },
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20"
            >
              Return Home
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 dark:text-indigo-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50 transition-all duration-200"
            >
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Astronaut floating animation */}
      <motion.div
        initial={{ x: -200, y: 100, rotate: -15, opacity: 0 }}
        animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
        className="absolute left-10 bottom-10 hidden md:block"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Astronaut SVG illustration */}
          <motion.path
            d="M60 30C70 20 90 25 90 40C90 55 70 60 60 50C50 60 30 55 30 40C30 25 50 20 60 30Z"
            fill="#6366F1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <circle cx="50" cy="35" r="5" fill="white" />
          <circle cx="70" cy="35" r="5" fill="white" />
          <path d="M50 45Q60 50 70 45" stroke="white" strokeWidth="2" />
        </svg>
      </motion.div>
    </div>
  );
}