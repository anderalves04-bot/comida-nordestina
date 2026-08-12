/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

import Hero from '../components/Hero';
import { Dish } from '../types';

interface HomePageProps {
  dishes: Dish[];
}

export default function HomePage({ dishes }: HomePageProps) {
  const featuredDishes = dishes.filter((dish) => dish.isHighlight).slice(0, 3);

  return (
    <>
      <Hero />

      {/* Short "Sobre Nós" teaser */}
      <section className="py-20 sm:py-24 bg-[#FAF3E7] border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
              Nossa História
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-6 leading-tight">
              A Tradição da Brasa em São Paulo
            </h2>
            <p className="text-gray-600 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              A <strong className="text-churrasco-red font-bold">Tradição Churrascaria</strong> nasceu em 1998 do
              desejo de reproduzir em São Paulo o churrasco como ele é feito nos pampas: fogo de chão, sal grosso e
              tempo. O costume de assar carne lentamente sobre brasas, celebrado há gerações no Sul do Brasil, é a
              base de tudo o que servimos até hoje.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-widest text-[#E8590C] hover:text-churrasco-red transition-colors group"
            >
              <span>Conheça Nossa História</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured dishes teaser */}
      <section className="py-20 sm:py-24 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
              Sabores Autênticos
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              Pratos em Destaque
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-[#FAF3E7] rounded-none overflow-hidden border border-black/5 hover:border-[#E8590C]/25 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-[#E8590C] text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-none shadow-none flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-churrasco-gold fill-churrasco-gold" />
                    Destaque
                  </span>
                  <div className="absolute bottom-4 right-4 bg-[#C9A227] text-[#1A1A1A] px-3 py-1.5 rounded-none font-sans font-bold text-sm border border-black/5 shadow-none">
                    R$ {dish.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#E8590C] transition-colors mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-gray-500 font-sans text-xs font-light leading-relaxed">{dish.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/cardapio"
              className="inline-flex items-center space-x-3 bg-churrasco-red hover:bg-[#E8590C] text-white font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300 group"
            >
              <span>Ver Cardápio Completo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
