/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Heart, MessageCircle } from 'lucide-react';
import { contactInfo } from '../data';

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre Nós' },
    { path: '/cardapio', label: 'Cardápio' },
    { path: '/galeria', label: 'Galeria' },
    { path: '/avaliacoes', label: 'Avaliações' },
    { path: '/reservas', label: 'Reservas' },
    { path: '/localizacao', label: 'Localização' },
  ];

  return (
    <footer id="footer" className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Presentation Column */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <span className="font-serif text-3xl font-bold text-white tracking-tight">Tradição</span>
              <p className="text-[10px] uppercase font-sans tracking-[0.25em] font-bold text-[#E8590C] -mt-1">
                Churrascaria
              </p>
            </div>
            <p className="text-gray-400 font-sans text-xs font-light leading-relaxed max-w-sm">
              Rodízio de carnes nobres e a tradição da brasa desde 1998, direto para Pinheiros, em São Paulo. Cortes selecionados e sabor inconfundível.
            </p>

            {/* High-conversion WhatsApp CTA inside footer */}
            <div className="pt-1">
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=Ol%C3%A1%21+Gostaria+de+fazer+uma+reserva+na+Tradi%C3%A7%C3%A3o+Churrascaria.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-churrasco-red hover:bg-churrasco-red-light text-white font-bold text-xs uppercase tracking-wider transition-all shadow hover:shadow-red-900/10 rounded-none"
              >
                <MessageCircle className="w-4 h-4 text-white animate-bounce" />
                Falar no WhatsApp
              </a>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-[#E8590C] border border-white/10 rounded-none transition-all text-gray-300 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-[#E8590C] border border-white/10 rounded-none transition-all text-gray-300 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#E8590C]">Navegação</h4>
            <ul className="space-y-2.5 text-xs font-sans font-light text-gray-400">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={`footer-nav-col1-${link.path}`}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-churrasco-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#E8590C] opacity-0 md:opacity-100 select-none">Navegação 2</h4>
            <ul className="space-y-2.5 text-xs font-sans font-light text-gray-400">
              {quickLinks.slice(4).map((link) => (
                <li key={`footer-nav-col2-${link.path}`}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-churrasco-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening hours Column */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#E8590C]">Funcionamento</h4>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex gap-2.5 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white uppercase tracking-wider">Terça a Sábado</p>
                  <p className="text-xs text-gray-400 font-light mt-0.5">12h00 às 23h00</p>
                </div>
              </div>

              <div className="flex gap-2.5 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white uppercase tracking-wider">Domingo</p>
                  <p className="text-xs text-gray-400 font-light mt-0.5">12h00 às 17h00 · Segunda-feira: fechado</p>
                </div>
              </div>

              <div className="flex gap-2.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#E8590C] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-light">
                  {contactInfo.address.street}, {contactInfo.address.number} — {contactInfo.address.neighborhood}, São Paulo - SP
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-gray-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <p>© {currentYear} Tradição Churrascaria. Todos os direitos reservados.</p>
            <span className="hidden sm:inline text-gray-700">•</span>
            <button 
              onClick={onOpenAdmin}
              className="hover:text-[#E8590C] transition-colors font-semibold cursor-pointer underline decoration-dotted"
            >
              Área Administrativa
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>para São Paulo</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
