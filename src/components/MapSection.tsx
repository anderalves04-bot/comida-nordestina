/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Navigation, Car, Info, Map } from 'lucide-react';
import { contactInfo } from '../data';

export default function MapSection() {
  const addressQuery = encodeURIComponent(
    `${contactInfo.address.street}, ${contactInfo.address.number} - ${contactInfo.address.neighborhood}, ${contactInfo.address.city} - ${contactInfo.address.state}`
  );
  
  // Real embedded map using Google Maps free embed service (centered on Pinheiros)
  const mapIframeUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`;
  const wazeUrl = `https://waze.com/ul?ll=-23.5670,-46.6890&navigate=yes&q=${addressQuery}`;

  return (
    <section id="localizacao" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
            Nossa Localização
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4">
            Venha Nos Visitar
          </h2>
          <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
            Estamos localizados no coração de Pinheiros, Zona Oeste de São Paulo. Um local de fácil acesso com estacionamento e segurança.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Address Details & Transportation cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Core Card */}
            <div className="bg-white p-8 rounded-none border border-black/10 shadow-none">
              <div className="p-3 bg-[#E8590C]/10 text-[#E8590C] rounded-none w-fit mb-6">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Nosso Endereço</h3>
              <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4">
                {contactInfo.address.street}, {contactInfo.address.number} <br />
                {contactInfo.address.neighborhood} — {contactInfo.address.city} - {contactInfo.address.state} <br />
                CEP: {contactInfo.address.zipCode}
              </p>
              
              {/* Reference point */}
              <div className="flex gap-2.5 bg-[#FAF3E7] p-3 rounded-none border border-black/5 text-xs text-gray-500 font-sans mt-6">
                <Info className="w-4 h-4 text-churrasco-gold flex-shrink-0 mt-0.5" />
                <span>Próximo à Estação de Metrô Faria Lima e a poucos minutos da Avenida Rebouças.</span>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="bg-white p-8 rounded-none border border-black/5 flex-grow shadow-none">
              <h4 className="font-sans font-bold uppercase tracking-wider text-gray-800 text-xs mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-churrasco-red" />
                Como Chegar
              </h4>
              <p className="text-gray-500 text-xs font-sans mb-6">
                Clique nos botões abaixo para abrir a rota em seu aplicativo de GPS favorito e navegar com tranquilidade:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-black/5 border border-black/10 text-gray-700 font-sans font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-none transition-all text-center"
                >
                  <Map className="w-4 h-4 text-[#E8590C]" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-black/5 border border-black/10 text-gray-700 font-sans font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-none transition-all text-center"
                >
                  <Car className="w-4 h-4 text-[#33CCFF]" />
                  <span>Waze</span>
                </a>
              </div>
            </div>

          </div>

          {/* Fully Interactive Live Iframe Map */}
          <div className="lg:col-span-7 rounded-none overflow-hidden border border-black/10 shadow-none min-h-[400px] relative p-1 bg-white">
            <iframe
              title="Mapa de localização Tradição Churrascaria"
              src={mapIframeUrl}
              className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
