/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Layout & Routing helpers
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import SobrePage from './pages/SobrePage';
import CardapioPage from './pages/CardapioPage';
import GaleriaPage from './pages/GaleriaPage';
import AvaliacoesPage from './pages/AvaliacoesPage';
import ReservasPage from './pages/ReservasPage';
import LocalizacaoPage from './pages/LocalizacaoPage';

import { dishes as initialDishes } from './data';
import { getDishes } from './lib/supabaseService';
import { Dish } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
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
            <ScrollToTop />

            <Routes>
              <Route element={<Layout dishes={dishes} onUpdateDishes={setDishes} />}>
                <Route path="/" element={<HomePage dishes={dishes} />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/cardapio" element={<CardapioPage dishes={dishes} />} />
                <Route path="/galeria" element={<GaleriaPage />} />
                <Route path="/avaliacoes" element={<AvaliacoesPage />} />
                <Route path="/reservas" element={<ReservasPage />} />
                <Route path="/localizacao" element={<LocalizacaoPage />} />
              </Route>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
