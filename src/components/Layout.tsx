/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUp } from 'lucide-react';

import Navbar from './Navbar';
import Footer from './Footer';
import AdminPanel from './AdminPanel';

import { contactInfo } from '../data';
import { Dish } from '../types';

interface LayoutProps {
  dishes: Dish[];
  onUpdateDishes: (dishes: Dish[]) => void;
}

export default function Layout({ dishes, onUpdateDishes }: LayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhatsAppBadge] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Show/hide floating scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Navigation Header */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Routed Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            dishes={dishes}
            onUpdateDishes={onUpdateDishes}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Triggers */}
      <AnimatePresence>
        {/* Floating WhatsApp Button */}
        {showWhatsAppBadge && (
          <motion.a
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            href={`https://wa.me/${contactInfo.whatsapp}?text=Ol%C3%A1%21+Gostaria+de+fazer+um+pedido+ou+reservar+uma+mesa+na+Tradi%C3%A7%C3%A3o+Churrascaria.`}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 z-40 bg-churrasco-red hover:bg-churrasco-red-light text-white p-4 rounded-full shadow-2xl hover:shadow-red-900/20 transition-all flex items-center justify-center group"
            aria-label="Falar no WhatsApp"
          >
            <MessageCircle className="w-6 h-6 animate-pulse" />

            {/* Tooltip badge */}
            <span className="absolute right-16 bg-churrasco-dark text-white text-xs font-display font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow whitespace-nowrap border border-white/10">
              Faça sua Reserva!
            </span>

            {/* Pulsing rings */}
            <span className="absolute -inset-1 rounded-full border border-churrasco-red animate-ping opacity-45 -z-10" />
          </motion.a>
        )}

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 bg-white/90 hover:bg-white text-gray-800 hover:text-churrasco-ember border border-gray-200 p-3.5 rounded-full shadow-lg transition-all"
            aria-label="Ir para o topo"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
