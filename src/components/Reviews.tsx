/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, PlusCircle, Check, MapPin } from 'lucide-react';
import { defaultReviews } from '../data';
import { Review } from '../types';
import { getReviews, createReview } from '../lib/supabaseService';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load reviews from Supabase / localStorage + defaults
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (e) {
        console.error('Error loading reviews:', e);
        setReviews(defaultReviews);
      }
    };
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    try {
      const newReviewData = {
        author: author.trim(),
        location: location.trim() || 'São Paulo, SP',
        text: text.trim(),
        rating,
      };

      const savedReview = await createReview(newReviewData);
      setReviews(prev => [savedReview, ...prev]);

      // Reset Form & Success State
      setAuthor('');
      setLocation('');
      setText('');
      setRating(5);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (e) {
      console.error('Error creating review:', e);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.7';

  // Stars distribution
  const getRatingCount = (stars: number) => {
    return reviews.filter(r => Math.floor(r.rating) === stars).length;
  };

  return (
    <section id="avaliacoes" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
            A Opinião dos Clientes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4">
            Avaliações e Depoimentos
          </h2>
          <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
            A maior satisfação da nossa equipe é ver nossos clientes satisfeitos. Veja o que dizem sobre nossas carnes e nosso espaço!
          </p>
        </div>

        {/* Rating Overview and Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Big Score Card */}
          <div className="lg:col-span-4 bg-white p-8 rounded-none border border-black/10 shadow-none text-center flex flex-col justify-center items-center">
            <span className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mb-2">
              Nota Média
            </span>
            <div className="font-serif text-6xl sm:text-7xl font-bold text-[#E8590C] mb-3 flex items-baseline">
              <span>{averageRating}</span>
              <span className="text-2xl text-gray-400 font-sans font-light">/5</span>
            </div>

            {/* Stars Row */}
            <div className="flex items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`avg-star-${star}`}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? 'text-churrasco-gold fill-churrasco-gold'
                      : 'text-gray-250'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 font-sans font-medium mb-6">
              Com base em {reviews.length} avaliações de clientes reais
            </p>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-churrasco-red hover:bg-[#E8590C] text-white font-sans font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-none transition-all shadow-none"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Avaliar o Restaurante</span>
            </button>
          </div>

          {/* Rating Bars Distribution */}
          <div className="lg:col-span-8 bg-white p-8 rounded-none border border-black/5 flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-6">Distribuição de Avaliações</h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = getRatingCount(stars);
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={`dist-stars-${stars}`} className="flex items-center space-x-4">
                      <span className="text-xs font-medium text-gray-500 w-12 flex items-center gap-1">
                        {stars} <Star className="w-3.5 h-3.5 text-churrasco-gold fill-churrasco-gold" />
                      </span>
                      <div className="flex-grow bg-gray-100 h-2.5 rounded-none overflow-hidden">
                        <div
                          className="bg-[#E8590C] h-full rounded-none transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 flex items-center space-x-2 text-xs text-gray-500">
              <MessageSquare className="w-4 h-4 text-[#E8590C]" />
              <span>Quer dar sugestões privadas? Fale diretamente no nosso WhatsApp.</span>
            </div>
          </div>

        </div>

        {/* Form Overlay Drawer / Card */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-white border border-black/10 rounded-none p-6 sm:p-8 mb-12 shadow-none overflow-hidden"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <PlusCircle className="text-[#E8590C]" />
                Compartilhe sua Experiência
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-churrasco-red/10 border border-churrasco-red/20 text-churrasco-red rounded-none p-6 text-center flex flex-col items-center gap-2"
                >
                  <div className="bg-churrasco-red text-white p-3 rounded-none mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-base uppercase tracking-wider">Avaliação Enviada!</h4>
                  <p className="text-xs text-churrasco-red/90">Agradecemos de coração pelo carinho e pelas suas palavras.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-bold text-gray-600 uppercase mb-1.5">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full bg-[#FAF3E7] text-gray-800 rounded-none border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-[#E8590C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-bold text-gray-600 uppercase mb-1.5">Sua Cidade / Bairro</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: Pinheiros, São Paulo"
                        className="w-full bg-[#FAF3E7] text-gray-800 rounded-none border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-[#E8590C]"
                      />
                    </div>
                  </div>

                  {/* Interactive Star Selector */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-gray-600 uppercase mb-1.5">Sua Nota *</label>
                    <div className="flex items-center space-x-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={`select-star-${star}`}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform active:scale-95"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoveredRating !== null ? hoveredRating : rating)
                                ? 'text-churrasco-gold fill-churrasco-gold'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-gray-600 uppercase mb-1.5">Seu Depoimento *</label>
                    <textarea
                      required
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Fale um pouco sobre os pratos que experimentou, nosso ambiente e nosso atendimento..."
                      rows={4}
                      className="w-full bg-[#FAF3E7] text-gray-800 rounded-none border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-[#E8590C]"
                    />
                  </div>

                  <div className="flex gap-4 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-none border border-black/10 hover:bg-black/5 text-xs font-bold uppercase tracking-widest text-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-none bg-[#E8590C] hover:bg-churrasco-red text-white font-sans font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Enviar Avaliação
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={rev.id}
              className="bg-white rounded-none p-6 shadow-none border border-black/5 hover:border-[#E8590C]/25 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                {/* Stars and date */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`rev-${rev.id}-star-${star}`}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'text-churrasco-gold fill-churrasco-gold'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 font-sans text-xs">{rev.date}</span>
                </div>

                {/* Feedback Text */}
                <p className="text-gray-600 font-sans text-xs font-light leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div className="p-2 bg-[#E8590C]/10 text-[#E8590C] rounded-none">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-gray-900">{rev.author}</h4>
                  <p className="text-[10px] text-gray-400 font-sans flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-churrasco-red" />
                    <span>{rev.location || 'São Paulo, SP'}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
