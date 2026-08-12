/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Phone, Utensils, Star, MapPin } from 'lucide-react';
import { contactInfo } from '../data';

export default function Hero() {
  const navigate = useNavigate();
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+o+rod%C3%ADzio+e+o+card%C3%A1pio.`;

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-churrasco-dark overflow-hidden pt-16"
    >
      {/* Background Image with Parallax & Ken Burns effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 0.65 }}
          transition={{ duration: 12, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
          alt="Tradição Churrascaria"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-churrasco-cream via-churrasco-dark/50 to-churrasco-dark/70 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-churrasco-dark/90 via-transparent to-churrasco-dark/80 z-10" />
      </div>

      {/* Decorative Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-churrasco-cream via-transparent to-transparent opacity-40 z-20" />

      {/* Hero Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-12 md:py-24">
        {/* Award/Badge Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-[#E8590C]/10 border border-[#E8590C]/30 px-5 py-2 rounded-none mb-6 sm:mb-8"
        >
          <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
          <span className="text-xs font-sans font-bold tracking-widest text-[#FFFDF9] uppercase">
            ★ 4.8/5 no Google — A Tradição da Brasa
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          O Fogo <span className="text-[#E8590C] italic font-normal">Que Une</span> a <br />
          <span className="font-serif font-black text-churrasco-gold">
            Mesa Desde 1998
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-200 font-sans font-light max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
        >
          Rodízio de carnes nobres grelhadas na brasa, buffet completo e o atendimento caloroso que conquista gerações de paulistanos. Reserve sua mesa e venha sentir o cheiro da brasa.
        </motion.p>

        {/* Buttons Action */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
        >
          <button
            onClick={() => navigate('/reservas')}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-churrasco-red hover:bg-[#E8590C] text-white font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300 group"
          >
            <Phone className="w-4 h-4 text-white" />
            <span>Reservar Mesa</span>
          </button>

          <button
            onClick={() => navigate('/cardapio')}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-transparent hover:bg-white/10 text-white font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300 border border-white/50 hover:border-white"
          >
            <Utensils className="w-4 h-4 text-churrasco-gold" />
            <span>Ver Cardápio</span>
          </button>
        </motion.div>

        {/* Quick Highlights Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mt-16 sm:mt-24 pt-8 border-t border-white/10"
        >
          <div className="flex items-center justify-center sm:justify-start space-x-3 text-left">
            <div className="p-2.5 rounded-none bg-[#E8590C]/10 text-[#E8590C] border border-[#E8590C]/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Localização</p>
              <p className="text-sm font-medium text-white font-sans">{contactInfo.address.neighborhood}, SP</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3 text-left">
            <div className="p-2.5 rounded-none bg-churrasco-gold/10 text-churrasco-gold border border-churrasco-gold/20">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Culinária</p>
              <p className="text-sm font-medium text-white font-sans">Rodízio Brasileiro Autêntico</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3 text-left">
            <div className="p-2.5 rounded-none bg-churrasco-red/10 text-churrasco-red-light border border-churrasco-red-light/20">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Desde</p>
              <p className="text-sm font-medium text-white font-sans">1998 · Tradição da Brasa</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
