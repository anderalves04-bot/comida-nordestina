/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Dynamic or 'principais' | 'porcoes' | 'sobremesas' | 'bebidas'
  image: string;
  tags?: string[];
  isHighlight?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}


export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  avatar?: string;
  location?: string;
}

export interface Reservation {
  id: string;
  code: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed';
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  whatsappFormatted: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  openingHours: {
    weekday: string;
    weekend: string;
    holiday?: string;
  };
}
