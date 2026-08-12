import { supabase, isSupabaseConfigured } from './supabase';
import { Dish, Category, Reservation, Review } from '../types';
import { defaultReviews, dishes as initialDishes } from '../data';

// --- FALLBACK/MOCK DATABASE FOR OFFLINE DEVELOPMENT MODE ---
const defaultCategories: Category[] = [
  { id: 'principais', name: 'Carnes Nobres', description: 'Os melhores cortes grelhados na brasa para o seu rodízio' },
  { id: 'porcoes', name: 'Buffet & Acompanhamentos', description: 'Saladas, acompanhamentos e petiscos para compartilhar' },
  { id: 'sobremesas', name: 'Sobremesas', description: 'O doce fechamento perfeito depois do rodízio' },
  { id: 'bebidas', name: 'Vinhos & Bebidas', description: 'Sucos, cervejas, vinhos e caipirinhas artesanais' }
];

// Load local helper functions
const getLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      const seen = new Set();
      return parsed.filter((item: any) => {
        if (item && typeof item === 'object' && 'id' in item) {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
        }
        return true;
      }) as any;
    }
    return parsed;
  } catch (e) {
    return defaultValue;
  }
};

const saveLocalData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- SERVICES EXPORTS ---

// 1. CATEGORIES SERVICE
export const getCategories = async (): Promise<Category[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');
      if (error) {
        console.warn('Categories query error, falling back to local data:', error.message);
        return getLocalData<Category[]>('tc_categories', defaultCategories);
      }
      const list = data || [];
      const seen = new Set();
      return list.filter((c: any) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
    } catch (e: any) {
      console.warn('Failed to fetch categories from Supabase, falling back to local data:', e?.message || e);
      return getLocalData<Category[]>('tc_categories', defaultCategories);
    }
  } else {
    return getLocalData<Category[]>('tc_categories', defaultCategories);
  }
};

export const createCategory = async (category: Omit<Category, 'criado_em'>): Promise<Category> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categorias')
      .insert([category])
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const categories = getLocalData<Category[]>('tc_categories', defaultCategories);
    const newCategory = { ...category };
    const updated = [...categories, newCategory];
    saveLocalData('tc_categories', updated);
    return newCategory;
  }
};

export const updateCategory = async (category: Category): Promise<Category> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categorias')
      .update({ nome: category.name, descricao: category.description })
      .eq('id', category.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const categories = getLocalData<Category[]>('tc_categories', defaultCategories);
    const updated = categories.map(c => c.id === category.id ? category : c);
    saveLocalData('tc_categories', updated);
    return category;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } else {
    const categories = getLocalData<Category[]>('tc_categories', defaultCategories);
    const updated = categories.filter(c => c.id !== id);
    saveLocalData('tc_categories', updated);
  }
};


// 2. PRODUCTS / DISHES SERVICE
export const getDishes = async (): Promise<Dish[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          name:nome,
          description:descricao,
          price:preco,
          image:imagem_url,
          category:categoria_id,
          isHighlight:destaque
        `)
        .order('nome');
      if (error) {
        console.warn('Dishes query error, falling back to initial dishes:', error.message);
        return getLocalData<Dish[]>('tc_dishes', initialDishes);
      }
      
      // Format response to fit frontend Dish schema
      const formatted = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: Number(p.price),
        image: p.image || 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600',
        category: p.category || 'principais',
        isHighlight: !!p.isHighlight,
        tags: p.category === 'principais' ? ['Rodízio'] : [] // auto-generate standard tags
      }));

      const seen = new Set();
      return formatted.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch (e: any) {
      console.warn('Failed to fetch dishes from Supabase, falling back to initial dishes:', e?.message || e);
      return getLocalData<Dish[]>('tc_dishes', initialDishes);
    }
  } else {
    return getLocalData<Dish[]>('tc_dishes', initialDishes);
  }
};

export const createDish = async (dish: Dish): Promise<Dish> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        id: dish.id,
        nome: dish.name,
        descricao: dish.description,
        preco: dish.price,
        imagem_url: dish.image,
        categoria_id: dish.category,
        destaque: !!dish.isHighlight
      }])
      .select()
      .single();
    if (error) throw error;
    return dish;
  } else {
    const dishes = getLocalData<Dish[]>('tc_dishes', initialDishes);
    const updated = [...dishes, dish];
    saveLocalData('tc_dishes', updated);
    return dish;
  }
};

export const updateDish = async (dish: Dish): Promise<Dish> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('produtos')
      .update({
        nome: dish.name,
        descricao: dish.description,
        preco: dish.price,
        imagem_url: dish.image,
        categoria_id: dish.category,
        destaque: !!dish.isHighlight
      })
      .eq('id', dish.id);
    if (error) throw error;
    return dish;
  } else {
    const dishes = getLocalData<Dish[]>('tc_dishes', initialDishes);
    const updated = dishes.map(d => d.id === dish.id ? dish : d);
    saveLocalData('tc_dishes', updated);
    return dish;
  }
};

export const deleteDish = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } else {
    const dishes = getLocalData<Dish[]>('tc_dishes', initialDishes);
    const updated = dishes.filter(d => d.id !== id);
    saveLocalData('tc_dishes', updated);
  }
};


// 3. RESERVATIONS SERVICE
export const getReservations = async (): Promise<Reservation[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pedidos_reserva')
        .select(`
          id,
          code,
          name:nome_cliente,
          phone:telefone,
          guests:quantidade_pessoas,
          date:data_reserva,
          time:horario,
          notes:observacoes,
          status
        `)
        .order('criado_em', { ascending: false });
      if (error) {
        console.warn('Reservations query error, falling back to local reservations:', error.message);
        return getLocalData<Reservation[]>('tc_reservations', []);
      }
      const formatted = (data || []).map((r: any) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        phone: r.phone,
        guests: Number(r.guests),
        date: r.date,
        time: r.time,
        notes: r.notes || '',
        status: r.status as 'pending' | 'confirmed'
      }));

      const seen = new Set();
      return formatted.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch (e: any) {
      console.warn('Failed to fetch reservations from Supabase, falling back to local reservations:', e?.message || e);
      return getLocalData<Reservation[]>('tc_reservations', []);
    }
  } else {
    return getLocalData<Reservation[]>('tc_reservations', []);
  }
};

export const createReservation = async (res: Omit<Reservation, 'id'>): Promise<Reservation> => {
  const newId = `res_${Date.now()}`;
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('pedidos_reserva')
      .insert([{
        code: res.code,
        nome_cliente: res.name,
        telefone: res.phone,
        quantidade_pessoas: res.guests,
        data_reserva: res.date,
        horario: res.time,
        observacoes: res.notes,
        status: res.status
      }])
      .select()
      .single();
    if (error) throw error;
    return { ...res, id: data.id };
  } else {
    const list = getLocalData<Reservation[]>('tc_reservations', []);
    const fullRes: Reservation = { ...res, id: newId };
    list.push(fullRes);
    saveLocalData('tc_reservations', list);
    return fullRes;
  }
};

export const updateReservationStatus = async (id: string, status: 'pending' | 'confirmed'): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('pedidos_reserva')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  } else {
    const list = getLocalData<Reservation[]>('tc_reservations', []);
    const updated = list.map(r => r.id === id ? { ...r, status } : r);
    saveLocalData('tc_reservations', updated);
  }
};

export const deleteReservation = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('pedidos_reserva')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } else {
    const list = getLocalData<Reservation[]>('tc_reservations', []);
    const updated = list.filter(r => r.id !== id);
    saveLocalData('tc_reservations', updated);
  }
};


// 4. REVIEWS SERVICE
export const getReviews = async (): Promise<Review[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          author:nome_cliente,
          text:comentario,
          rating:nota,
          date:criado_em
        `)
        .order('criado_em', { ascending: false });
      if (error) {
        console.warn('Reviews query error, falling back to default reviews:', error.message);
        return getLocalData<Review[]>('tc_reviews', defaultReviews);
      }
      const formatted = (data || []).map((r: any) => ({
        id: r.id,
        author: r.author,
        text: r.text,
        rating: Number(r.rating),
        date: new Date(r.date).toISOString().split('T')[0],
        location: 'São Paulo, SP' // default location for display
      }));

      const seen = new Set();
      return formatted.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch (e: any) {
      console.warn('Failed to fetch reviews from Supabase, falling back to default reviews:', e?.message || e);
      return getLocalData<Review[]>('tc_reviews', defaultReviews);
    }
  } else {
    return getLocalData<Review[]>('tc_reviews', defaultReviews);
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const dateStr = new Date().toISOString().split('T')[0];
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert([{
        nome_cliente: review.author,
        comentario: review.text,
        nota: review.rating
      }])
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      author: data.nome_cliente,
      text: data.comentario,
      rating: Number(data.nota),
      date: new Date(data.criado_em).toISOString().split('T')[0],
      location: review.location || 'São Paulo, SP'
    };
  } else {
    const list = getLocalData<Review[]>('tc_reviews', defaultReviews);
    const newReview: Review = {
      ...review,
      id: `rev_user_${Date.now()}`,
      date: dateStr,
      location: review.location || 'São Paulo, SP'
    };
    const updated = [newReview, ...list];
    saveLocalData('tc_reviews', updated);
    return newReview;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } else {
    const list = getLocalData<Review[]>('tc_reviews', defaultReviews);
    const updated = list.filter(r => r.id !== id);
    saveLocalData('tc_reviews', updated);
  }
};


// 5. IMAGE UPLOAD SERVICE (Supabase Storage)
export const uploadProductImage = async (file: File): Promise<string> => {
  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${fileExt}`;
    const filePath = `product_images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('produtos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('produtos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } else {
    // Local fallback: read file as local Data URL (Base64 string) so it renders correctly in mock mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};
