/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { galleryImages } from '../data';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'culinaria' | 'ambiente' | 'bebidas'>('todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryImages.filter((img) => {
    return activeFilter === 'todos' || img.category === activeFilter;
  });

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(nextIndex);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(prevIndex);
  };

  const filters: { id: typeof activeFilter; label: string }[] = [
    { id: 'todos', label: 'Tudo' },
    { id: 'culinaria', label: 'Cortes & Buffet' },
    { id: 'ambiente', label: 'Ambiente & Salão' },
    { id: 'bebidas', label: 'Bebidas & Drinks' },
  ];

  return (
    <section id="galeria" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
            Galeria de Fotos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4">
            Nosso Espaço & Nossos Cortes
          </h2>
          <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
            Dê uma espiada no nosso salão, na área externa e no capricho por trás de cada corte que sai da nossa churrasqueira.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filt) => (
            <button
              key={filt.id}
              onClick={() => setActiveFilter(filt.id)}
              className={`px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                activeFilter === filt.id
                  ? 'bg-[#E8590C] text-white border-[#E8590C]'
                  : 'bg-white text-gray-600 hover:bg-black/5 border-black/5'
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>

        {/* Modern Bento/Grid of Photos with elegant zoom triggers */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={`gallery-img-${activeFilter}-${img.src}`}
                className="relative rounded-none overflow-hidden aspect-4/3 shadow-none group cursor-pointer border border-black/10 bg-white p-2"
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Image */}
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay */}
                <div className="absolute inset-2 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 border border-white/10">
                  <div className="p-2.5 bg-[#E8590C] rounded-none w-fit mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-white font-serif text-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {img.title}
                  </h4>
                  <p className="text-[#C9A227] text-[10px] font-sans uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                    {img.category === 'culinaria' ? 'Culinária' : img.category === 'ambiente' ? 'Ambiente' : 'Bebidas'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-8"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-white/20 border border-white/20 p-2.5 rounded-none text-white transition-colors"
                onClick={() => setLightboxIndex(null)}
                aria-label="Fechar galeria"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation controls */}
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-none text-white transition-colors z-10"
                onClick={handlePrev}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-none text-white transition-colors z-10"
                onClick={handleNext}
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Main lightbox view */}
              <div className="relative max-w-5xl max-h-[80vh] flex flex-col items-center bg-zinc-900 p-2 border border-white/10 rounded-none">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-none border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                  referrerPolicy="no-referrer"
                />

                {/* Photo info */}
                <div
                  className="mt-6 text-center text-white select-none max-w-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-churrasco-gold">
                    {filteredImages[lightboxIndex].title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 uppercase font-sans tracking-widest font-semibold flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-churrasco-ember" />
                    <span>
                      {filteredImages[lightboxIndex].category === 'culinaria'
                        ? 'Cortes & Buffet'
                        : filteredImages[lightboxIndex].category === 'ambiente'
                        ? 'Ambiente & Salão'
                        : 'Bebidas & Drinks'}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span>
                      {lightboxIndex + 1} de {filteredImages.length}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
