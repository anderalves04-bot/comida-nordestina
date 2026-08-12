/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dish, Review, ContactInfo } from './types';

export const contactInfo: ContactInfo = {
  phone: '(11) 3055-7788',
  whatsapp: '5511998877788',
  whatsappFormatted: '(11) 99887-7788',
  email: 'contato@tradicaochurrascaria.com.br',
  address: {
    street: 'Rua dos Pinheiros',
    number: '500',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '05422-000'
  },
  openingHours: {
    weekday: 'Terça a Sábado: 12h às 23h',
    weekend: 'Domingo: 12h às 17h',
    holiday: 'Segunda-feira: fechado'
  }
};

export const dishes: Dish[] = [
  {
    id: 'picanha',
    name: 'Picanha Nobre na Brasa',
    description: 'Corte nobre selecionado, grelhado lentamente na brasa de carvão até o ponto perfeito, com a capa de gordura crocante que preserva toda a suculência da carne.',
    price: 98.00,
    category: 'principais',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600',
    tags: ['Especialidade', 'Mais Pedido', 'Rodízio'],
    isHighlight: true
  },
  {
    id: 'fraldinha',
    name: 'Fraldinha na Brasa',
    description: 'Fraldinha macia grelhada em fogo baixo e constante, finalizada com flor de sal grosso. Um clássico do churrasco gaúcho que nunca sai de moda.',
    price: 84.00,
    category: 'principais',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600',
    tags: ['Tradicional', 'Grelhado', 'Rodízio'],
    isHighlight: true
  },
  {
    id: 'costela',
    name: 'Costela Bovina 12 Horas',
    description: 'Costela bovina assada lentamente por 12 horas em fogo de chão até desmanchar, finalizada na brasa para um leve tostado por fora e maciez total por dentro.',
    price: 92.00,
    category: 'principais',
    image: 'https://images.unsplash.com/photo-1607116667981-27c1084c4726?auto=format&fit=crop&q=80&w=600',
    tags: ['Lento na Brasa', 'Sucesso', 'Serve 2 Pessoas'],
    isHighlight: true
  },
  {
    id: 'cupim',
    name: 'Cupim Desfiado',
    description: 'Cupim cozido lentamente até desfiar com um garfo, levemente selado na brasa para dar sabor defumado. Uma iguaria macia e cheia de personalidade.',
    price: 79.00,
    category: 'principais',
    image: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&q=80&w=600',
    tags: ['Desfiado', 'Defumado', 'Rodízio'],
    isHighlight: true
  },
  {
    id: 'alcatra',
    name: 'Alcatra ao Alho',
    description: 'Alcatra fatiada, temperada com alho laminado dourado na manteiga e grelhada no ponto ideal. Sabor marcante e textura macia em cada garfada.',
    price: 82.00,
    category: 'principais',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=600',
    tags: ['Sabor Intenso', 'Grelhado', 'Rodízio'],
    isHighlight: true
  },
  {
    id: 'buffet_saladas',
    name: 'Buffet de Saladas & Acompanhamentos',
    description: 'Buffet completo à vontade com saladas frescas da estação, legumes grelhados, arroz, farofa crocante, vinagrete da casa e mandioca frita.',
    price: 54.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600',
    tags: ['À Vontade', 'Fresquinho', 'Vegetariano']
  },
  {
    id: 'pao_alho',
    name: 'Pão de Alho na Brasa',
    description: 'Pão de alho artesanal, tostado na brasa até dourar, com manteiga de alho derretida e finalizado com ervas frescas picadas.',
    price: 24.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Petisco', 'Aromático', 'Serve 2 Pessoas']
  },
  {
    id: 'petit_gateau',
    name: 'Petit Gâteau',
    description: 'Bolinho quente de chocolate meio amargo com recheio cremoso que escorre ao primeiro corte, acompanhado de sorvete de creme e calda de frutas vermelhas.',
    price: 28.00,
    category: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    tags: ['Clássico', 'Quente com Gelado'],
    isHighlight: true
  },
  {
    id: 'abacaxi_grelhado',
    name: 'Abacaxi Grelhado ao Vinho',
    description: 'Fatias de abacaxi grelhadas na brasa com canela e uma redução leve de vinho tinto, finalizadas com sorvete de creme. Um fechamento leve e refrescante.',
    price: 22.00,
    category: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&q=80&w=600',
    tags: ['Refrescante', 'Grelhado']
  },
  {
    id: 'pudim_leite',
    name: 'Pudim de Leite Condensado',
    description: 'Pudim cremoso e sem furinhos, feito com leite condensado e calda de caramelo artesanal. A sobremesa clássica brasileira que fecha bem qualquer rodízio.',
    price: 18.00,
    category: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    tags: ['Artesanal']
  },
  {
    id: 'suco_laranja',
    name: 'Suco Natural de Laranja',
    description: 'Suco de laranja espremido na hora, gelado e sem adição de açúcar. Refrescância pura para acompanhar o rodízio.',
    price: 13.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    tags: ['Natural', 'Sem Açúcar']
  },
  {
    id: 'caipirinha_casa',
    name: 'Caipirinha da Casa',
    description: 'Cachaça artesanal envelhecida, limão taiti e açúcar de cana, servida bem gelada em copo de vidro grosso. A companhia perfeita para a carne na brasa.',
    price: 26.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    tags: ['Alcoólico', 'Clássico']
  }
];

export const defaultReviews: Review[] = [
  {
    id: 'rev1',
    author: 'Fernando Ribeiro',
    text: 'Rodízio impecável! A picanha estava no ponto exato e os garçons passam com frequência oferecendo os cortes. Um dos melhores churrascos que já comi em São Paulo.',
    rating: 5,
    date: '2026-07-22',
    location: 'São Paulo, SP'
  },
  {
    id: 'rev2',
    author: 'Camila Nogueira',
    text: 'O buffet de saladas é surpreendentemente variado e fresquinho, e o atendimento é muito atencioso do início ao fim. Voltaremos com certeza!',
    rating: 5,
    date: '2026-07-15',
    location: 'Pinheiros, São Paulo'
  },
  {
    id: 'rev3',
    author: 'Eduardo Matos',
    text: 'Ambiente agradável e custo-benefício muito bom para a região de Pinheiros. A costela de 12 horas desmancha na boca, recomendo demais.',
    rating: 4.5,
    date: '2026-07-08',
    location: 'São Paulo, SP'
  },
  {
    id: 'rev4',
    author: 'Beatriz Andrade',
    text: 'Fomos comemorar um aniversário e a experiência foi excelente. A carta de vinhos tem boas opções e o petit gâteau é de outro nível.',
    rating: 5,
    date: '2026-06-30',
    location: 'Vila Madalena, São Paulo'
  },
  {
    id: 'rev5',
    author: 'Rafael Tavares',
    text: 'Já é a terceira vez que venho e a qualidade da carne se mantém sempre consistente. A fraldinha e a alcatra são meus cortes favoritos.',
    rating: 4.8,
    date: '2026-06-21',
    location: 'São Paulo, SP'
  },
  {
    id: 'rev6',
    author: 'Juliana Prado',
    text: 'Ambiente aconchegante, ótimo para reunir a família no fim de semana. As crianças adoraram o abacaxi grelhado de sobremesa!',
    rating: 5,
    date: '2026-06-10',
    location: 'Butantã, São Paulo'
  }
];

export const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    title: 'Nosso Salão Principal',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
    title: 'Varanda Externa',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80&w=800',
    title: 'Ambiente Aconchegante',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    title: 'Mesa Posta para o Rodízio',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    title: 'Área Externa',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800',
    title: 'Interior da Casa',
    category: 'ambiente'
  },
  {
    src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800',
    title: 'Corte na Brasa',
    category: 'culinaria'
  },
  {
    src: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=800',
    title: 'Buffet de Saladas',
    category: 'culinaria'
  },
  {
    src: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    title: 'Drinks & Caipirinhas',
    category: 'bebidas'
  }
];
