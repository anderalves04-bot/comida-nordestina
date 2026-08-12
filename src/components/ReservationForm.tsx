/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Phone, User, CheckCircle2, Copy, Send, HelpCircle } from 'lucide-react';
import { contactInfo } from '../data';
import { Reservation } from '../types';
import { createReservation } from '../lib/supabaseService';

export default function ReservationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-formatting phone input like (XX) XXXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      const ddd = cleaned.substring(0, 2);
      const rest = cleaned.substring(2);
      if (rest.length > 5) {
        formatted = `(${ddd}) ${rest.substring(0, 5)}-${rest.substring(5, 9)}`;
      } else {
        formatted = `(${ddd}) ${rest}`;
      }
    }
    setPhone(formatted.substring(0, 15));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) return;

    setLoading(true);

    try {
      const code = `TC-${Math.floor(1000 + Math.random() * 9000)}`;
      const reservation: Omit<Reservation, 'id'> = {
        code,
        name: name.trim(),
        phone: phone.trim(),
        guests,
        date,
        time,
        notes: notes.trim(),
        status: 'pending'
      };

      const savedRes = await createReservation(reservation);
      setSuccessReservation(savedRes);
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReservationCode = () => {
    if (!successReservation) return;
    navigator.clipboard.writeText(successReservation.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareLink = () => {
    if (!successReservation) return '#';
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = successReservation.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const text = encodeURIComponent(
      `Olá! Gostaria de confirmar minha reserva na Tradição Churrascaria.\n\n` +
      `📌 *DADOS DA RESERVA:*\n` +
      `• *Código:* ${successReservation.code}\n` +
      `• *Nome:* ${successReservation.name}\n` +
      `• *Telefone:* ${successReservation.phone}\n` +
      `• *Pessoas:* ${successReservation.guests} pessoas\n` +
      `• *Data:* ${formattedDate}\n` +
      `• *Horário:* ${successReservation.time}\n` +
      (successReservation.notes ? `• *Observações:* ${successReservation.notes}\n` : '') +
      `\nAguardo a confirmação de vocês! Obrigado.`
    );
    return `https://wa.me/${contactInfo.whatsapp}?text=${text}`;
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setGuests(2);
    setDate('');
    setTime('');
    setNotes('');
    setSuccessReservation(null);
  };

  const timeSlots = [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  // Get tomorrow's date for default minimum date selection
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <section id="reservas" className="py-20 sm:py-28 bg-[#FAF3E7] overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#E8590C] uppercase mb-3 block">
            Garanta Sua Mesa
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4">
            Reserva Online Prática
          </h2>
          <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
            Evite filas e garanta seu espaço na nossa disputada área verde ou salão principal. Complete o formulário abaixo e receba seu código instantâneo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-none border border-black/10 shadow-none overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Quick notes sidebar info */}
            <div className="md:col-span-4 bg-[#E8590C] p-8 sm:p-10 text-white flex flex-col justify-between rounded-none">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-6 text-[#C9A227]">Informações Importantes</h3>
                <ul className="space-y-4 font-sans text-xs font-light text-white/95 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span><strong>Tolerância:</strong> Mantemos sua mesa por até 15 minutos do horário agendado.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span><strong>Dias de Funcionamento:</strong> Terça a Domingo. Fechado às Segundas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span><strong>Área Verde:</strong> Sujeito a disponibilidade climática e ordem de chegada.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span><strong>Grupos grandes:</strong> Acima de 10 pessoas, pedimos contato direto no WhatsApp.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-[10px] text-white/80 uppercase font-sans tracking-widest mb-2">Dúvidas?</p>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-widest text-[#C9A227] hover:underline"
                >
                  Falar no WhatsApp
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Core Form Area */}
            <div className="md:col-span-8 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {successReservation ? (
                  /* Success Feedback Page */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6 flex flex-col items-center justify-center h-full"
                  >
                    <div className="bg-churrasco-red/10 text-churrasco-red p-4 rounded-none mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-gray-900 mb-2">Reserva Confirmada!</h3>
                    <p className="text-xs text-gray-500 font-sans max-w-md mb-8 leading-relaxed">
                      Sua mesa foi reservada na Tradição Churrascaria. Anote o código e envie no nosso WhatsApp para agilizar o atendimento.
                    </p>

                    {/* Booking Ticket */}
                    <div className="bg-[#FAF3E7] border border-black/10 rounded-none p-6 mb-8 w-full max-w-md text-left shadow-none relative">
                      <div className="flex justify-between items-center pb-4 border-b border-black/5 mb-4">
                        <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest">Código da Reserva</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-lg text-[#E8590C]">{successReservation.code}</span>
                          <button
                            onClick={copyReservationCode}
                            className="p-1 hover:bg-black/5 rounded-none text-gray-500 transition-colors"
                            title="Copiar código"
                          >
                            {copied ? <span className="text-[10px] text-churrasco-red font-bold uppercase tracking-wider">Copiado!</span> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs font-sans">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Cliente</p>
                          <p className="font-semibold text-[#1A1A1A]">{successReservation.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Telefone</p>
                          <p className="font-semibold text-[#1A1A1A]">{successReservation.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Data e Horário</p>
                          <p className="font-semibold text-[#1A1A1A]">
                            {successReservation.date.split('-').reverse().join('/')} às {successReservation.time}h
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Convidados</p>
                          <p className="font-semibold text-[#1A1A1A]">{successReservation.guests} pessoas</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                      <a
                        href={getWhatsAppShareLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-grow flex items-center justify-center space-x-2 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-sans font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-none shadow-none transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar via WhatsApp</span>
                      </a>
                      <button
                        onClick={resetForm}
                        className="border border-black/10 hover:bg-black/5 text-gray-600 font-sans font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-none transition-colors"
                      >
                        Nova Reserva
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Reservation Form */
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {/* Name and Phone Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#E8590C]" />
                          <span>Nome Completo *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: André Alves"
                          className="w-full bg-[#FAF3E7] border border-black/10 focus:border-[#E8590C] focus:ring-0 rounded-none px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-[#E8590C]" />
                          <span>Telefone (WhatsApp) *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="Ex: (11) 99887-7788"
                          className="w-full bg-[#FAF3E7] border border-black/10 focus:border-[#E8590C] focus:ring-0 rounded-none px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Guest Counter */}
                    <div>
                      <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#E8590C]" />
                        <span>Quantidade de Pessoas *</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuests(num)}
                            className={`w-11 h-11 rounded-none text-xs font-bold transition-all ${
                              guests === num
                                ? 'bg-[#E8590C] text-white shadow-none'
                                : 'bg-[#FAF3E7] text-gray-700 border border-black/10 hover:bg-black/5'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#E8590C]" />
                          <span>Escolha a Data *</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={getMinDate()}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#FAF3E7] border border-black/10 focus:border-[#E8590C] focus:ring-0 rounded-none px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none transition-all cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#E8590C]" />
                          <span>Escolha o Horário *</span>
                        </label>
                        <select
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-[#FAF3E7] border border-black/10 focus:border-[#E8590C] focus:ring-0 rounded-none px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="">Selecione...</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}h
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#E8590C]" />
                        <span>Pedidos Especiais ou Observações (Opcional)</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Preciso de cadeirinha para bebê, aniversário, preferência por mesa na área externa..."
                        rows={3}
                        className="w-full bg-[#FAF3E7] border border-black/10 focus:border-[#E8590C] focus:ring-0 rounded-none px-4 py-3.5 text-sm text-[#1A1A1A] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Booking Trigger */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#E8590C] hover:bg-churrasco-red text-white font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Confirmando sua reserva...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Solicitar Confirmar Mesa</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
