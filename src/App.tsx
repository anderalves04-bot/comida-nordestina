/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUp } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import ReservationForm from './components/ReservationForm';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

import { contactInfo, dishes as initialDishes } from './data';
import AdminPanel from './components/AdminPanel';
import { getDishes } from './lib/supabaseService';
import { Dish } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhatsAppBadge, setShowWhatsAppBadge] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [dishes, setDishes] = useState<Dish[]>(initialDishes);

  // Load dishes on mount from Supabase / localStorage fallback
  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await getDishes();
        setDishes(data);
      } catch (e) {
        console.error('Error fetching dishes:', e);
      }
    };
    loadDishes();
  }, []);


  // Simulated Elegant Loading Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Watch page scroll for active sections and triggers
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show/hide floating components
      setShowScrollTop(scrollY > 500);

      // Section tracker based on intersection positions
      const sections = ['inicio', 'sobre', 'cardapio', 'galeria', 'avaliacoes', 'reservas', 'localizacao'];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section is taking up the upper-middle of viewport
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80; // height of pinned navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: sectionId === 'inicio' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-churrasco-cream font-sans selection:bg-churrasco-ember/30 selection:text-churrasco-brown antialiased">
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Elegant Traditional Loading Screen */
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#161311] z-[9999] flex flex-col items-center justify-center p-4"
          >
            <div className="relative flex flex-col items-center">
              {/* Rotating Ember Motif */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-churrasco-ember flex items-center justify-center relative mb-8"
              >
                <div className="w-16 h-16 rounded-full border-2 border-churrasco-gold flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </motion.div>

              {/* Text Loading Animation */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="font-serif text-2xl sm:text-3xl font-bold text-churrasco-gold tracking-wide text-center"
              >
                Tradição Churrascaria
              </motion.h1>

              <p className="text-gray-400 font-display font-medium text-xs uppercase tracking-[0.2em] mt-2">
                Acendendo a Brasa...
              </p>
            </div>
          </motion.div>
        ) : (
          /* Main Page Render */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Navigation Header */}
            <Navbar 
              onNavigate={navigateToSection} 
              activeSection={activeSection} 
              onOpenAdmin={() => setIsAdminOpen(true)} 
            />

            {/* Sections */}
            <main>
              {/* 1. Hero Section */}
              <Hero onNavigate={navigateToSection} />

              {/* 2. Sobre o Restaurante */}
              <About />

              {/* 3. Cardápio / Pratos Em Destaque */}
              <Menu dishes={dishes} />

              {/* 4. Galeria de Fotos */}
              <Gallery />

              {/* 5. Avaliações dos Clientes */}
              <Reviews />

              {/* 6. Reservas */}
              <ReservationForm />

              {/* 7. Localização */}
              <MapSection />
            </main>

            {/* Footer */}
            <Footer 
              onNavigate={navigateToSection} 
              onOpenAdmin={() => setIsAdminOpen(true)} 
            />

            {/* Admin Panel Panel Overlay */}
            <AnimatePresence>
              {isAdminOpen && (
                <AdminPanel 
                  dishes={dishes}
                  onUpdateDishes={setDishes}
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

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
