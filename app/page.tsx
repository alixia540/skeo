"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PayPalButton from "./components/PayPalButton";
import AIGenerator from "./components/AICVGenerator"; // ton générateur de CV IA

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const packs = [
    { name: "Pack Basic", desc: "CV professionnel + téléchargement PDF", price: "3.99" },
    { name: "Pack Premium", desc: "CV + Lettre de motivation personnalisée", price: "9.99" },
    { name: "Pack Pro", desc: "CV + Lettre + Mail de candidature complet", price: "14.99" },
  ];

  return (
    <main
      className="bg-gradient-to-b from-[--color-bg-top] to-[--color-bg-bottom] 
      dark:from-[#0f172a] dark:to-[#1e293b] text-[--color-dark] dark:text-white 
      transition-colors min-h-screen relative z-0"
    >

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        backdrop-blur-xl border-b border-white/10 dark:border-gray-800/60
        bg-gradient-to-r from-[#0b2b74]/70 via-[#2563eb]/70 to-[#14b8a6]/70
        dark:from-[#1e3a8a]/60 dark:via-[#0ea5e9]/60 dark:to-[#14b8a6]/60
        ${scrolled ? "shadow-lg bg-opacity-90 py-3" : "py-5 bg-opacity-60"}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-10 relative">
          {/* ✅ Logo carré arrondi */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo SKEO"
              width={42}
              height={42}
              priority
              className="rounded-lg drop-shadow-md"
            />
            <span className="font-bold text-xl text-white tracking-wide drop-shadow-sm">
              SKEO
            </span>
          </div>

          {/* Lien Discord centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full 
              bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20
              text-white font-semibold text-sm sm:text-base transition-all duration-300 backdrop-blur-md shadow-md"
            >
              SKEO IA CV Generator
            </a>
          </div>

          {/* Liens + bouton thème */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#cv"
              className="text-white font-medium hover:text-teal-200 transition"
            >
              Générateur
            </Link>

            <Link
              href="#packs"
              className="text-white font-medium hover:text-teal-200 transition"
            >
              Packs
            </Link>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`relative w-14 h-8 rounded-full transition-all duration-500 
                  ${theme === "dark" ? "bg-gradient-to-r from-blue-600 to-teal-400" : "bg-gray-300"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 
                    ${theme === "dark" ? "translate-x-6" : ""}`}
                ></div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="section text-center flex flex-col items-center justify-center min-h-[85vh] pt-44 sm:pt-48 space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/logo.png"
            alt="Logo SKEO"
            width={140}
            height={140}
            priority
            className="
              rounded-3xl bg-transparent
              w-[110px] sm:w-[130px] md:w-[140px]
              transition-transform duration-500 ease-out
              hover:scale-105
              drop-shadow-xl dark:drop-shadow-lg
            "
          />
        </motion.div>

        {/* Slogan */}
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-blue-700 via-blue-500 to-teal-400 bg-clip-text text-transparent animate-gradient-x"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ton futur commence ici.
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Crée ton CV et ta lettre de motivation instantanément grâce à l’intelligence artificielle.
        </motion.p>

        {/* Boutons */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="#cv" className="btn btn-primary">
            Générer mon CV
          </Link>
          <a
            href="https://discord.gg/bPEweHhGhs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Rejoindre Discord
          </a>
        </motion.div>
      </section>

      {/* SECTION GÉNÉRATION */}
      <section id="cv" className="section text-center">
        <AIGenerator />
      </section>

      {/* PACKS */}
      <section id="packs" className="section text-center">
        <motion.h2
          className="text-4xl font-bold mb-12 text-[--color-primary] dark:text-[--color-secondary]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choisis ton pack 💼
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              className="card hover:-translate-y-3 hover:shadow-2xl border-transparent 
              bg-white/90 dark:bg-[#0f172a]/70 backdrop-blur-md transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2">{pack.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{pack.desc}</p>
              <p className="text-3xl font-bold text-[--color-primary] dark:text-[--color-secondary] mb-6">
                {pack.price} €
              </p>
              {/* ✅ PayPal bouton sans fond blanc */}
                <div className="rounded-xl p-1 overflow-hidden">
                  <div className="paypal-container">
                    <PayPalButton key={theme} amount={pack.price} />
                  </div>
                </div>
              </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="
          w-full text-center py-10 mt-16 
          bg-gradient-to-r from-[#0b2b74]/70 via-[#2563eb]/70 to-[#14b8a6]/70
          dark:from-[#1e3a8a]/60 dark:via-[#0ea5e9]/60 dark:to-[#14b8a6]/60
          backdrop-blur-xl border-t border-white/10 dark:border-gray-800/60
          text-white shadow-inner transition-all duration-500
        "
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold drop-shadow-sm">
              SKEO © {new Date().getFullYear()}
            </p>
            <p className="text-sm opacity-90">
              Crée ton avenir, un CV à la fois.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="#cv"
              className="text-white/90 hover:text-teal-200 font-medium transition"
            >
              Générateur
            </a>
            <a
              href="#packs"
              className="text-white/90 hover:text-teal-200 font-medium transition"
            >
              Packs
            </a>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full 
                bg-white/10 hover:bg-white/20 
                dark:bg-white/10 dark:hover:bg-white/20 
                text-white text-sm font-semibold backdrop-blur-md transition-all duration-300"
            >
              SKEO IA CV Generator
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}


