"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TeacherHomePage() {
  const features = [
    {
      title: "Reach More Students",
      desc: "Share your knowledge and connect with learners around the world.",
      icon: "/images/feature-world.svg",
    },
    {
      title: "Manage Classes Easily",
      desc: "Create and organize your classes with simple, powerful tools.",
      icon: "/images/feature-classes.svg",
    },
    {
      title: "Upload Content",
      desc: "Share lectures, notes, and multimedia directly with your students.",
      icon: "/images/feature-content.svg",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-green-700 via-teal-800 to-cyan-900 text-white overflow-hidden">
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center">
        <img
          src="/images/title2.png"
          alt="Hero Image"
          className="absolute top- left-0 w-full h-full"
        />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 w-full flex justify-start mt-[350px] px-80"
        >

          <div className="flex justify-right gap-4">
            <Link
              href="/signin"
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </section>

      <section className="py-20 px-8 z-10 relative">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Join as a Teacher?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-white/10 rounded-2xl p-8 shadow-xl text-center hover:bg-white/20 transition-transform duration-300"
            >
              <img src={feature.icon} alt={feature.title} className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-8 text-center relative bg-cover bg-center">
        <div className="bg-black/50 p-12 rounded-2xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Get Started Today 🚀</h2>
          <p className="mb-6 text-gray-200">Sign up now and start managing your classes efficiently.</p>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
