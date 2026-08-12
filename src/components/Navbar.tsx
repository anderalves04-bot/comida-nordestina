/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Clock, Calendar, Lock } from 'lucide-react';
import { contactInfo } from '../data';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenAdmin }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);

  // Check if restaurant is currently open
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeInMins = hours * 60 + minutes;

      const openTimeInMins = 11 * 60; // 11:00

      let closeTimeInMins = 23 * 60; // 23:00 (Sábado)
      if (day === 0) {
        closeTimeInMins = 19 * 60; // 19:00 (Domingo)
      }

      let open = currentTimeInMins >= openTimeInMins && currentTimeInMins < closeTimeInMins;

      // Segunda a Sexta: pausa entre o almoço e o jantar
      if (open && day >= 1 && day <= 5) {
        const lunchCloseInMins = 16 * 60; // 16:00
        const dinnerOpenInMins = 18 * 60; // 18:00
        if (currentTimeInMins >= lunchCloseInMins && currentTimeInMins < dinnerOpenInMins) {
          open = false;
        }
      }

      setIsOpenNow(open);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre Nós' },
    { path: '/cardapio', label: 'Cardápio' },
    { path: '/galeria', label: 'Galeria' },
    { path: '/avaliacoes', label: 'Avaliações' },
    { path: '/reservas', label: 'Reservas' },
    { path: '/localizacao', label: 'Localização' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-churrasco-cream/95 backdrop-blur-md py-4 border-b border-black/5 shadow-none text-[#1A1A1A]'
          : 'bg-gradient-to-b from-[#1A1A1A]/80 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex flex-col cursor-pointer select-none group"
          >
            <span
              className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-churrasco-red' : 'text-churrasco-gold'
              } group-hover:text-[#E8590C]`}
            >
              Tradição
            </span>
            <span
              className={`text-[9px] uppercase tracking-[0.25em] font-sans font-semibold transition-colors duration-300 ${
                isScrolled ? 'text-[#E8590C]' : 'text-gray-200'
              }`}
            >
              Churrascaria
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <button
                key={`desktop-nav-${link.path}`}
                onClick={() => handleLinkClick(link.path)}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-200 relative ${
                  isActive(link.path)
                    ? isScrolled
                      ? 'text-[#E8590C] font-bold'
                      : 'text-churrasco-gold font-bold'
                    : isScrolled
                    ? 'text-gray-700 hover:text-[#E8590C]'
                    : 'text-gray-150 hover:text-churrasco-gold'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute bottom-0 left-3 right-3 h-[2px] ${
                      isScrolled ? 'bg-[#E8590C]' : 'bg-churrasco-gold'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Opening Status and Booking Button */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Live Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-none border ${
              isScrolled ? 'bg-white/50 border-black/5 text-[#1A1A1A]' : 'bg-black/20 border-white/10 text-white'
            }`}>
              <span className={`relative flex h-2 w-2`}>
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOpenNow ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOpenNow ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
              </span>
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                {isOpenNow ? 'Aberto Agora' : 'Fechado'}
              </span>
            </div>

            {/* Quick Reservation Button */}
            <button
              onClick={() => handleLinkClick('/reservas')}
              className={`flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-bold px-5 py-2.5 rounded-none transition-all duration-300 shadow-none border ${
                isScrolled
                  ? 'bg-churrasco-red border-churrasco-red text-white hover:bg-[#E8590C] hover:border-[#E8590C]'
                  : 'bg-white text-[#1A1A1A] border-white hover:bg-churrasco-gold'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Mesa</span>
            </button>

            {/* Admin Key Button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-none border transition-all duration-300 ${
                isScrolled
                  ? 'bg-transparent border-black/10 text-gray-700 hover:text-churrasco-ember hover:border-churrasco-ember'
                  : 'bg-black/20 border-white/10 text-white hover:text-churrasco-gold hover:border-churrasco-gold'
              }`}
              title="Painel do Administrador"
              aria-label="Painel Administrativo"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Live Status Indicator for Mobile */}
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full border border-current/15 text-[10px]">
              <span className={`relative flex h-2 w-2`}>
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOpenNow ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOpenNow ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
              </span>
              <span
                className={`font-display font-medium ${
                  isScrolled
                    ? isOpenNow
                      ? 'text-emerald-600'
                      : 'text-red-600'
                    : 'text-white'
                }`}
              >
                {isOpenNow ? 'ABERTO' : 'FECHADO'}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none transition-colors ${
                isScrolled ? 'text-gray-800 hover:bg-black/5' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Menu principal"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-churrasco-cream border-b border-churrasco-ember/10 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <button
                  key={`mobile-nav-${link.path}`}
                  onClick={() => handleLinkClick(link.path)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-churrasco-ember/10 text-churrasco-ember font-semibold'
                      : 'text-gray-700 hover:bg-black/5 hover:text-churrasco-ember'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-200/50 mt-4 flex flex-col gap-3">
                <button
                  onClick={() => handleLinkClick('/reservas')}
                  className="w-full flex items-center justify-center space-x-2 bg-churrasco-ember hover:bg-churrasco-brown text-white font-display font-bold py-3 rounded-lg shadow transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>RESERVAR MESA</span>
                </button>

                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-display font-bold py-3 rounded-lg shadow transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>PEDIR PELO WHATSAPP</span>
                </a>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center space-x-2 border border-churrasco-ember/30 text-churrasco-ember hover:bg-churrasco-ember/5 font-display font-bold py-3 rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>PAINEL ADMINISTRATIVO</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
