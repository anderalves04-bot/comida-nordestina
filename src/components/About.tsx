/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Flame, Award, Users, Heart, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Users className="w-5 h-5 text-[#E8590C]" />,
      title: 'Ambiente Familiar',
      description: 'Um espaço amplo e acolhedor, ideal para reunir a família e os amigos ao redor da mesa em qualquer ocasião.',
    },
    {
      icon: <Flame className="w-5 h-5 text-[#8C1D18]" />,
      title: 'Cortes Selecionados',
      description: 'Trabalhamos com fornecedores de confiança, escolhendo pessoalmente cada peça antes de ir para a brasa de carvão.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#C9A227]" />,
      title: 'Tradição da Brasa',
      description: 'Nossa técnica de assar é herdada da tradição gaúcha do fogo de chão, passada de churrasqueiro para churrasqueiro desde 1998.',
    },
    {
      icon: <Heart className="w-6 h-6 text-[#E8590C]" />,
      title: 'Atendimento de Casa',
      description: 'Nossos passadores conhecem o ritmo de cada mesa. Aqui, cada visita é tratada com o cuidado de quem recebe em casa.',
    },
  ];

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Visual Showcase Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            {/* Background earthy geometric accent */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-[#C9A227]/20 rounded-none -z-10 animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-44 h-44 border border-[#E8590C]/10 rounded-none -z-10" />

            {/* Main Image */}
            <div className="relative rounded-none overflow-hidden border border-black/10 bg-white p-2 shadow-none">
              <img
                src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80&w=800"
                alt="Ambiente Tradição Churrascaria"
                loading="lazy"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Overlay with info */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#1A1A1A]/90 p-6 text-white border border-white/10">
                <p className="font-serif text-lg italic text-churrasco-gold">"A tradição da brasa em cada corte."</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
                  <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
                  <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
                  <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
                  <Star className="w-4 h-4 text-churrasco-gold fill-churrasco-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 ml-2">(4.8 / 5 Google)</span>
                </div>
              </div>
            </div>

            {/* Small floating badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-[#E8590C] text-white p-4 rounded-none border border-black/10 flex flex-col items-center justify-center text-center w-28 h-28"
            >
              <span className="font-serif text-3xl font-bold text-white">1998</span>
              <span className="text-[9px] uppercase font-bold tracking-widest font-sans leading-tight text-white/90">Ano de Fundação</span>
            </motion.div>
          </motion.div>

          {/* Text Content Block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col"
          >
            <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3">Nossa História</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-6 leading-tight">
              A Tradição da Brasa em São Paulo
            </h2>

            <div className="prose prose-lg text-gray-600 font-sans space-y-4 mb-8 leading-relaxed">
              <p>
                A <strong className="text-churrasco-red font-bold">Tradição Churrascaria</strong> nasceu em 1998 do desejo de reproduzir em São Paulo o churrasco como ele é feito nos pampas: fogo de chão, sal grosso e tempo. O costume de assar carne lentamente sobre brasas, celebrado há gerações no Sul do Brasil, é a base de tudo o que servimos até hoje.
              </p>
              <p>
                Nossos passadores são treinados para reconhecer o ponto certo de cada corte, do primeiro giro no espeto até a mesa. Cuidamos da seleção das carnes, do preparo do buffet de saladas e da temperatura da churrasqueira com a mesma atenção de sempre — porque tradição, para nós, se renova a cada rodízio.
              </p>
            </div>

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex space-x-4 p-5 rounded-none bg-white border border-black/5 shadow-none hover:border-black/15 transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-3 rounded-none bg-[#FAF3E7] h-fit border border-black/5">
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-bold tracking-wider uppercase text-[#1A1A1A] mb-1">{val.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
