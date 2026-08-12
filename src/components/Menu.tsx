/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Phone, ShoppingBag, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { contactInfo } from '../data';
import { Dish } from '../types';

interface MenuProps {
  dishes: Dish[];
}

export default function Menu({ dishes }: MenuProps) {
  const [activeTab, setActiveTab] = useState<'todos' | 'principais' | 'porcoes' | 'sobremesas' | 'bebidas'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyHighlights, setOnlyHighlights] = useState(false);

  // Filter logic
  const filteredDishes = dishes.filter((dish) => {
    const matchesTab = activeTab === 'todos' || dish.category === activeTab;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHighlight = !onlyHighlights || dish.isHighlight;
    return matchesTab && matchesSearch && matchesHighlight;
  });

  const getWhatsAppOrderLink = (dish: Dish) => {
    const text = encodeURIComponent(
      `Olá! Estava navegando no site e gostaria de pedir o prato: *${dish.name}* (R$ ${dish.price.toFixed(2).replace('.', ',')}). Podem me ajudar com o pedido?`
    );
    return `https://wa.me/${contactInfo.whatsapp}?text=${text}`;
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'todos', label: 'Cardápio Completo' },
    { id: 'principais', label: 'Carnes Nobres' },
    { id: 'porcoes', label: 'Buffet & Acompanhamentos' },
    { id: 'sobremesas', label: 'Sobremesas' },
    { id: 'bebidas', label: 'Vinhos & Bebidas' },
  ];

  return (
    <section id="cardapio" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
            Sabores Autênticos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4">
            Nosso Cardápio Tradicional
          </h2>
          <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
            Escolha entre nossos cortes nobres, buffet e sobremesas, todos preparados com a tradição da brasa. Faça seu pedido ou tire dúvidas diretamente via WhatsApp!
          </p>
        </div>

        {/* Toolbar: Search, Filters & Tabs */}
        <div className="mb-12 bg-white p-5 sm:p-6 rounded-none border border-black/5 shadow-none space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prato, sobremesa ou bebida..."
                className="w-full bg-[#FAF3E7] text-[#1A1A1A] placeholder-gray-400 pl-12 pr-4 py-3 rounded-none border border-black/10 focus:outline-none focus:border-[#E8590C] text-sm"
              />
            </div>

            {/* Highlights Filter Checkbox */}
            <div className="flex items-center space-x-3 select-none">
              <button
                onClick={() => setOnlyHighlights(!onlyHighlights)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-none border text-xs font-bold uppercase tracking-widest transition-all ${
                  onlyHighlights
                    ? 'bg-[#E8590C] text-white border-[#E8590C]'
                    : 'bg-[#FAF3E7] text-gray-700 border-black/10 hover:bg-black/5'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Apenas Destaques</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-black/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-churrasco-red text-white'
                    : 'bg-[#FAF3E7] text-gray-600 hover:bg-black/5 border border-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Dishes Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={`menu-dish-${activeTab}-${onlyHighlights}-${dish.id}`}
                className="bg-white rounded-none overflow-hidden border border-black/5 hover:border-[#E8590C]/25 transition-all duration-300 flex flex-col group h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category/Tags Badge */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                    {dish.isHighlight && (
                      <span className="bg-[#E8590C] text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-none shadow-none flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-churrasco-gold fill-churrasco-gold" />
                        Destaque
                      </span>
                    )}
                    {dish.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#1A1A1A]/95 text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Price overlay */}
                  <div className="absolute bottom-4 right-4 bg-[#C9A227] text-[#1A1A1A] px-3 py-1.5 rounded-none font-sans font-bold text-sm border border-black/5 shadow-none">
                    R$ {dish.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#E8590C] transition-colors mb-2">
                      {dish.name}
                    </h3>
                    <p className="text-gray-500 font-sans text-xs font-light leading-relaxed mb-6">
                      {dish.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[10px] font-sans font-bold text-churrasco-red uppercase tracking-widest">
                      {dish.category === 'principais'
                        ? '🥩 Carne'
                        : dish.category === 'porcoes'
                        ? '🥗 Buffet'
                        : dish.category === 'sobremesas'
                        ? '🍰 Sobremesa'
                        : '🍷 Bebida'}
                    </span>

                    <a
                      href={getWhatsAppOrderLink(dish)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[#E8590C] hover:bg-churrasco-red text-white font-sans font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-none transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Pedir WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Result State */}
        {filteredDishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#FAF3E7] rounded-none border border-dashed border-black/10 max-w-xl mx-auto"
          >
            <p className="text-gray-500 font-sans text-sm mb-4">Nenhum prato encontrado com essas especificações.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('todos');
                setOnlyHighlights(false);
              }}
              className="bg-[#E8590C] hover:bg-churrasco-red text-white font-sans font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-none transition-colors"
            >
              Resetar Filtros
            </button>
          </motion.div>
        )}

        {/* CTA menu WhatsApp */}
        <div className="mt-16 bg-[#1A1A1A] p-8 sm:p-12 rounded-none text-white border border-white/5 shadow-none flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">Quer reservar ou tirar dúvidas sobre o rodízio?</h3>
            <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
              Nossa equipe está pronta para ajudar com reservas, grupos grandes e eventos particulares na região de Pinheiros e arredores.
            </p>
          </div>
          <a
            href={`https://wa.me/${contactInfo.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto flex items-center justify-center space-x-3 bg-white hover:bg-[#C9A227] text-[#1A1A1A] font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300"
          >
            <Phone className="w-4 h-4 text-[#E8590C]" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
