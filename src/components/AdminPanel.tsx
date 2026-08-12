import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Plus, Trash2, 
  Edit, Save, X, Check, PlusCircle, RotateCcw, FileText, LayoutDashboard, 
  Utensils, XCircle, Lock, Unlock, Percent, ArrowLeft, RefreshCw,
  Upload, MessageSquare, Folder, AlertCircle, ExternalLink, Star
} from 'lucide-react';
import { Dish, Reservation, Category, Review } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { 
  getDishes, 
  createDish, 
  updateDish, 
  deleteDish, 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getReservations, 
  updateReservationStatus, 
  deleteReservation, 
  getReviews, 
  createReview, 
  deleteReview, 
  uploadProductImage 
} from '../lib/supabaseService';

interface AdminPanelProps {
  dishes: Dish[];
  onUpdateDishes: (updated: Dish[]) => void;
  onClose: () => void;
}

interface Sale {
  id: string;
  date: string;
  dishId: string;
  dishName: string;
  category: string;
  price: number;
  quantity: number;
  paymentMethod: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';
}

export default function AdminPanel({ dishes, onUpdateDishes, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@tradicaochurrascaria.com.br');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tabs for admin navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pratos' | 'categorias' | 'reservas' | 'avaliacoes'>('dashboard');

  // Dynamic lists
  const [sales, setSales] = useState<Sale[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Loading states
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Status message state
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dish editing states
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [dishForm, setDishForm] = useState<Partial<Dish>>({
    name: '',
    description: '',
    price: 0,
    category: 'principais',
    image: '',
    tags: [],
    isHighlight: false
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Category editing states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    id: '',
    name: '',
    description: ''
  });

  // Sale creation states
  const [selectedDishId, setSelectedDishId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [salePayment, setSalePayment] = useState<Sale['paymentMethod']>('Pix');

  // Trigger feedback banner helper
  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Session storage and Supabase Auth check on mount
  useEffect(() => {
    const checkSession = async () => {
      const localActive = sessionStorage.getItem('opaio_admin_session') === 'active';
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setIsAuthenticated(true);
            sessionStorage.setItem('opaio_admin_session', 'active');
            return;
          }
        } catch (e) {
          console.warn('Supabase session check skipped or failed:', e);
        }
      }
      if (localActive) {
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, []);

  // Fetch all data when authenticated
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Categories
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      // 2. Fetch Dishes
      const dishesData = await getDishes();
      onUpdateDishes(dishesData);

      // 3. Fetch Reservations
      const reservationsData = await getReservations();
      setReservations(reservationsData);

      // 4. Fetch Reviews
      const reviewsData = await getReviews();
      setReviews(reviewsData);

      // 5. Load/seed mock sales from localstorage
      const savedSales = localStorage.getItem('opaio_sales');
      if (savedSales) {
        setSales(JSON.parse(savedSales));
      } else {
        const initialSales: Sale[] = [
          {
            id: 'sale_1',
            date: new Date(Date.now() - 3600000 * 2).toISOString(),
            dishId: 'picanha',
            dishName: 'Picanha Nobre na Brasa',
            category: 'principais',
            price: 98.00,
            quantity: 2,
            paymentMethod: 'Pix'
          },
          {
            id: 'sale_2',
            date: new Date(Date.now() - 3600000 * 5).toISOString(),
            dishId: 'costela',
            dishName: 'Costela Bovina 12 Horas',
            category: 'principais',
            price: 92.00,
            quantity: 1,
            paymentMethod: 'Cartão de Crédito'
          },
          {
            id: 'sale_3',
            date: new Date(Date.now() - 3600000 * 20).toISOString(),
            dishId: 'pao_alho',
            dishName: 'Pão de Alho na Brasa',
            category: 'porcoes',
            price: 24.00,
            quantity: 3,
            paymentMethod: 'Dinheiro'
          }
        ];
        localStorage.setItem('opaio_sales', JSON.stringify(initialSales));
        setSales(initialSales);
      }
    } catch (err: any) {
      console.error('Error loading panel data:', err);
      showFeedback('Erro ao sincronizar dados com o Supabase. Verifique suas tabelas.', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Real-time Reservations subscription helper
  useEffect(() => {
    if (isAuthenticated && isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('admin-reservations-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'pedidos_reserva' },
          () => {
            getReservations().then(data => setReservations(data));
            showFeedback('Novas atualizações de reserva recebidas em tempo real!', 'success');
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setLoginError('Por favor, preencha a senha.');
      return;
    }
    
    setLoading(true);
    setLoginError('');

    const envPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
    const demoPassword = envPassword || 'Tradicao2026';

    // 1. Immediate password authentication with the master admin password
    if (adminPassword === demoPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('opaio_admin_session', 'active');
      showFeedback('Conectado com sucesso com a senha administrativa!');
      setLoading(false);
      return;
    }

    // 2. Fallback to Supabase Auth using the predefined admin email and the typed password
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@tradicaochurrascaria.com.br',
          password: adminPassword
        });

        if (error) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed') || error.message.includes('User not found')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: 'admin@tradicaochurrascaria.com.br',
              password: adminPassword
            });

            if (signUpError) {
              throw new Error(signUpError.message);
            } else if (signUpData?.user && signUpData?.session) {
              setIsAuthenticated(true);
              sessionStorage.setItem('opaio_admin_session', 'active');
              showFeedback('Nova conta administrativa criada no Supabase e conectada!');
            } else {
              setLoginError('Senha incorreta.');
            }
          } else {
            throw error;
          }
        } else {
          setIsAuthenticated(true);
          sessionStorage.setItem('opaio_admin_session', 'active');
          showFeedback('Login efetuado via Supabase!');
        }
      } catch (err: any) {
        console.error('Supabase authentication error:', err);
        setLoginError('Senha incorreta.');
        setAdminPassword('');
      } finally {
        setLoading(false);
      }
    } else {
      setLoginError('Senha incorreta.');
      setAdminPassword('');
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('opaio_admin_session');
    setIsAuthenticated(false);
    onClose();
  };

  // Manual sale registration helper
  const handleRegisterSale = (e: React.FormEvent) => {
    e.preventDefault();
    const dish = dishes.find(d => d.id === selectedDishId);
    if (!dish) return;

    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      date: new Date().toISOString(),
      dishId: dish.id,
      dishName: dish.name,
      category: dish.category,
      price: dish.price,
      quantity: saleQty,
      paymentMethod: salePayment
    };

    const updated = [newSale, ...sales];
    setSales(updated);
    localStorage.setItem('opaio_sales', JSON.stringify(updated));
    setSelectedDishId('');
    setSaleQty(1);
    showFeedback('Lançamento registrado com sucesso!');
  };

  // Product Image File Upload Handler (Supabase Storage with fallback)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setDishForm(prev => ({ ...prev, image: publicUrl }));
      showFeedback('Imagem enviada e vinculada com sucesso!');
    } catch (err: any) {
      console.error('Upload failed:', err);
      showFeedback('Falha ao enviar imagem. Verifique o bucket "produtos".', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // --- PRODUCT / DISH ACTIONS ---
  const handleStartAddDish = () => {
    setEditingDish(null);
    setDishForm({
      id: `dish_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      category: categories[0]?.id || 'principais',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      tags: ['Rodízio'],
      isHighlight: false
    });
    setIsAddingDish(true);
  };

  const handleStartEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm(dish);
    setIsAddingDish(false);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price) {
      showFeedback('Por favor, preencha o nome e preço do prato.', 'error');
      return;
    }

    setLoading(true);
    try {
      const fullDish = dishForm as Dish;
      if (editingDish) {
        await updateDish(fullDish);
        showFeedback('Prato atualizado com sucesso!');
      } else {
        await createDish(fullDish);
        showFeedback('Prato cadastrado com sucesso!');
      }
      
      const refreshedDishes = await getDishes();
      onUpdateDishes(refreshedDishes);
      setEditingDish(null);
      setIsAddingDish(false);
    } catch (err: any) {
      console.error('Error saving dish:', err);
      showFeedback('Erro ao salvar prato.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDishItem = async (id: string) => {
    if (confirm('Deseja realmente remover este prato?')) {
      setLoading(true);
      try {
        await deleteDish(id);
        showFeedback('Prato excluído com sucesso!');
        const refreshedDishes = await getDishes();
        onUpdateDishes(refreshedDishes);
      } catch (err) {
        console.error(err);
        showFeedback('Erro ao excluir prato.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleStartAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      description: ''
    });
    setIsAddingCategory(true);
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm(cat);
    setIsAddingCategory(false);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.id || !categoryForm.name) {
      showFeedback('ID e Nome da categoria são obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    try {
      const fullCategory = categoryForm as Category;
      if (editingCategory) {
        await updateCategory(fullCategory);
        showFeedback('Categoria atualizada com sucesso!');
      } else {
        await createCategory(fullCategory);
        showFeedback('Categoria cadastrada com sucesso!');
      }

      const refreshed = await getCategories();
      setCategories(refreshed);
      setEditingCategory(null);
      setIsAddingCategory(false);
    } catch (err: any) {
      console.error(err);
      showFeedback('Erro ao salvar categoria.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategoryItem = async (id: string) => {
    const hasProducts = dishes.some(d => d.category === id);
    if (hasProducts) {
      alert('Não é possível remover uma categoria que possui pratos vinculados!');
      return;
    }

    if (confirm('Deseja realmente excluir esta categoria?')) {
      setLoading(true);
      try {
        await deleteCategory(id);
        showFeedback('Categoria excluída com sucesso!');
        const refreshed = await getCategories();
        setCategories(refreshed);
      } catch (err) {
        console.error(err);
        showFeedback('Erro ao excluir categoria.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- RESERVATION ACTIONS ---
  const handleToggleReservation = async (id: string, currentStatus: 'pending' | 'confirmed') => {
    const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
    try {
      await updateReservationStatus(id, newStatus);
      showFeedback(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'marcada como pendente'}!`);
      const refreshed = await getReservations();
      setReservations(refreshed);
    } catch (err) {
      console.error(err);
      showFeedback('Erro ao atualizar reserva.', 'error');
    }
  };

  const handleDeleteReservationItem = async (id: string) => {
    if (confirm('Deseja realmente cancelar esta reserva?')) {
      try {
        await deleteReservation(id);
        showFeedback('Reserva removida com sucesso!');
        const refreshed = await getReservations();
        setReservations(refreshed);
      } catch (err) {
        console.error(err);
        showFeedback('Erro ao remover reserva.', 'error');
      }
    }
  };

  const handleDeleteReviewItem = async (id: string) => {
    if (confirm('Deseja realmente excluir este depoimento?')) {
      try {
        await deleteReview(id);
        showFeedback('Avaliação excluída com sucesso!');
        const refreshed = await getReviews();
        setReviews(refreshed);
      } catch (err) {
        console.error(err);
        showFeedback('Erro ao excluir avaliação.', 'error');
      }
    }
  };

  // --- TAG HELPERS ---
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const currentTags = dishForm.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      setDishForm(prev => ({
        ...prev,
        tags: [...currentTags, newTagInput.trim()]
      }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (idxToRemove: number) => {
    const currentTags = dishForm.tags || [];
    setDishForm(prev => ({
      ...prev,
      tags: currentTags.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Calculations for dashboard
  const totalRevenue = sales.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSalesCount = sales.reduce((sum, item) => sum + item.quantity, 0);
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;
  const pendingReservations = reservations.filter(r => r.status === 'confirmed').length;

  return (
    <div className="fixed inset-0 z-[999] bg-churrasco-cream overflow-y-auto min-h-screen text-gray-800 flex flex-col font-sans">
      
      {/* 1. Security Authentication Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-[#121212]/95 z-[1000] flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-churrasco-cream p-8 max-w-md w-full border border-churrasco-brown/20 rounded-none shadow-2xl relative text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-churrasco-ember/10 flex items-center justify-center text-churrasco-ember mb-4">
              <Lock className="w-8 h-8" />
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-1">Acesso Administrativo</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold text-churrasco-brown">Tradição Churrascaria</p>
            
            {/* Connection Status Indicator */}
            <div className="mb-6 flex justify-center">
              {isSupabaseConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Conexão Supabase Pronta
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Modo Demonstração (Local)
                </span>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Senha de Acesso
                </label>
                <input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-churrasco-ember"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Insira a senha do administrador para acessar o painel de gerenciamento.
                </p>
                {loginError && (
                  <p className="text-red-600 text-xs font-semibold mt-2 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0" /> {loginError}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-3 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors text-center"
                >
                  Voltar ao Site
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 bg-churrasco-ember text-white font-bold text-xs uppercase tracking-wider hover:bg-[#E06000] disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Acessar Painel'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Main Admin Panel App */}
      <header className="bg-[#1A1A1A] text-white border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-churrasco-gold tracking-wide flex items-center gap-2">
                Tradição Churrascaria
                <span className="text-xs uppercase font-sans font-extrabold tracking-widest text-[#E8590C] bg-white/10 px-2.5 py-1">
                  Painel Admin
                </span>
              </h1>
              <p className="text-[10px] text-gray-400 font-sans tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
                <span>Gestão Inteira & Sincronização Supabase</span>
                <span>•</span>
                {isSupabaseConfigured ? (
                  <span className="text-green-400 font-semibold">Nuvem Supabase Ativa</span>
                ) : (
                  <span className="text-amber-400 font-semibold">Modo Offline (Local)</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="bg-red-700/10 hover:bg-red-700/20 text-red-400 border border-red-500/10 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Logout / Sair
            </button>
            <button
              onClick={onClose}
              className="bg-churrasco-ember hover:bg-[#E06000] text-white font-display text-xs font-bold uppercase tracking-wider px-4 py-2.5 flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification Feedback */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[2000] max-w-md w-full px-4 py-3 shadow-2xl flex items-center justify-between gap-3 text-xs font-bold border ${
              statusMessage.type === 'success' 
                ? 'bg-[#E3F2FD] text-blue-800 border-blue-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sub-header */}
      <div className="bg-white border-b border-gray-200 py-1.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-2 scrollbar-none py-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'pratos', label: 'Pratos/Produtos', icon: Utensils },
            { id: 'categorias', label: 'Categorias', icon: Folder },
            { id: 'reservas', label: 'Reservas', icon: Calendar },
            { id: 'avaliacoes', label: 'Avaliações', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingDish(null);
                  setIsAddingDish(false);
                  setEditingCategory(null);
                  setIsAddingCategory(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-churrasco-ember text-churrasco-ember font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {isLoadingData ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-10 h-10 animate-spin text-churrasco-ember mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Sincronizando com o Supabase...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 border border-gray-200 relative overflow-hidden shadow-sm">
                    <div className="text-gray-400 absolute right-4 top-4">
                      <DollarSign className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                      Faturamento Total
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
                      R$ {totalRevenue.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-churrasco-red font-bold block mt-2">
                      ▲ 100% Simulação Realista
                    </span>
                  </div>

                  <div className="bg-white p-6 border border-gray-200 relative overflow-hidden shadow-sm">
                    <div className="text-gray-400 absolute right-4 top-4">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                      Quantidade Vendida
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
                      {totalSalesCount} itens
                    </span>
                    <span className="text-xs text-gray-500 block mt-2">
                      Total de pedidos consolidados
                    </span>
                  </div>

                  <div className="bg-white p-6 border border-gray-200 relative overflow-hidden shadow-sm">
                    <div className="text-gray-400 absolute right-4 top-4">
                      <TrendingUp className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                      Ticket Médio
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
                      R$ {averageTicket.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-[#E8590C] font-bold block mt-2 font-mono">
                      Por pedido registrado
                    </span>
                  </div>

                  <div className="bg-white p-6 border border-gray-200 relative overflow-hidden shadow-sm">
                    <div className="text-gray-400 absolute right-4 top-4">
                      <Users className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                      Reservas Ativas
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
                      {reservations.length} agendamentos
                    </span>
                    <span className="text-xs text-[#2D5A27] font-bold block mt-2">
                      Total na agenda de reservas
                    </span>
                  </div>
                </div>

                {/* Main Sales Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white p-6 border border-gray-200 shadow-sm space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Lançar Nova Venda</h3>
                      <p className="text-xs text-gray-400">Adicione um pedido manualmente para atualizar as receitas</p>
                    </div>

                    <form onSubmit={handleRegisterSale} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Selecione o Prato/Bebida
                        </label>
                        <select
                          value={selectedDishId}
                          onChange={(e) => setSelectedDishId(e.target.value)}
                          required
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                        >
                          <option value="">-- Selecione o item --</option>
                          {dishes.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name} (R$ {d.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={saleQty}
                            onChange={(e) => setSaleQty(parseInt(e.target.value) || 1)}
                            className="w-full bg-white border border-gray-300 p-2 text-xs focus:outline-none focus:border-churrasco-ember"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                            Pagamento
                          </label>
                          <select
                            value={salePayment}
                            onChange={(e) => setSalePayment(e.target.value as any)}
                            className="w-full bg-white border border-gray-300 p-2 text-xs focus:outline-none focus:border-churrasco-ember"
                          >
                            <option value="Pix">Pix</option>
                            <option value="Cartão de Crédito">Crédito</option>
                            <option value="Cartão de Débito">Débito</option>
                            <option value="Dinheiro">Dinheiro</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedDishId}
                        className="w-full bg-churrasco-red text-white font-bold text-xs uppercase tracking-widest py-3 hover:bg-churrasco-red-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Registrar Lançamento
                      </button>
                    </form>
                  </div>

                  {/* Recent Sales List */}
                  <div className="lg:col-span-2 bg-white p-6 border border-gray-200 shadow-sm flex flex-col h-[520px]">
                    <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Fluxo de Vendas Recentes</h3>
                        <p className="text-xs text-gray-400">Histórico de vendas registradas localmente</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-churrasco-ember bg-churrasco-ember/10 px-2 py-0.5">
                        {sales.length} lançamentos
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                      {sales.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                          <span className="text-3xl">📥</span>
                          <p className="text-xs uppercase tracking-wider font-semibold mt-2">Nenhuma venda lançada</p>
                        </div>
                      ) : (
                        sales.map((sale) => (
                          <div 
                            key={sale.id} 
                            className="flex justify-between items-center p-3 border-l-4 border-l-churrasco-ember bg-gray-50 hover:bg-gray-100/70 transition-colors"
                          >
                            <div className="space-y-1">
                              <h4 className="font-sans font-bold text-sm text-[#1A1A1A]">{sale.dishName}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-medium">
                                <span className="uppercase tracking-wider px-1.5 py-0.5 bg-gray-200 text-gray-700">
                                  {sale.category}
                                </span>
                                <span>•</span>
                                <span>Qtd: {sale.quantity}x</span>
                                <span>•</span>
                                <span>{sale.paymentMethod}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-gray-900 block text-sm">
                                R$ {(sale.price * sale.quantity).toFixed(2).replace('.', ',')}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GERENCIAR CARDÁPIO (CRUD PRODUCTS) */}
            {activeTab === 'pratos' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Administrar Cardápio</h2>
                    <p className="text-xs text-gray-500">Adicione novos pratos, altere preços, descrições e faça upload de imagens para o Supabase Storage</p>
                  </div>
                  
                  {!isAddingDish && !editingDish && (
                    <button
                      onClick={handleStartAddDish}
                      className="bg-churrasco-ember hover:bg-[#E06000] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Prato</span>
                    </button>
                  )}
                </div>

                {isAddingDish || editingDish ? (
                  /* Create / Edit Form */
                  <div className="bg-white border border-gray-200 p-6 shadow-sm max-w-3xl mx-auto">
                    <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center">
                      <h3 className="font-serif font-bold text-lg text-gray-900">
                        {editingDish ? `Editar Prato: ${editingDish.name}` : 'Cadastrar Novo Prato'}
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingDish(null);
                          setIsAddingDish(false);
                        }}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveDish} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                            Nome do Prato *
                          </label>
                          <input
                            type="text"
                            required
                            value={dishForm.name}
                            onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                            placeholder="Ex: Picanha Suprema"
                            className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                              Preço (R$) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={dishForm.price || ''}
                              onChange={(e) => setDishForm({ ...dishForm, price: parseFloat(e.target.value) || 0 })}
                              placeholder="Ex: 68.00"
                              className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                              Categoria
                            </label>
                            <select
                              value={dishForm.category}
                              onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                              className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Descrição do Prato
                        </label>
                        <textarea
                          value={dishForm.description}
                          onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                          placeholder="Ex: Deliciosa carne de sol fatiada com queijo de coalho derretido. Acompanha mandioca frita. Serve 2 pessoas."
                          rows={3}
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                        />
                      </div>

                      {/* IMAGE STORAGE UPLOAD MODULE */}
                      <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-none">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                          Imagem do Produto (Upload para o Supabase Storage)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="md:col-span-1 flex justify-center">
                            <img 
                              src={dishForm.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'} 
                              alt="Preview" 
                              className="w-24 h-24 object-cover border border-gray-200 bg-white"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={dishForm.image || ''}
                                onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                                placeholder="Insira a URL da imagem diretamente"
                                className="flex-1 bg-white border border-gray-300 p-2 text-xs focus:outline-none focus:border-churrasco-ember"
                              />
                            </div>
                            <div className="relative">
                              <input 
                                type="file"
                                id="product-img-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                              />
                              <label 
                                htmlFor="product-img-upload"
                                className={`w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isUploading ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin text-churrasco-ember" />
                                    <span>Enviando para o Bucket do Supabase...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 text-churrasco-ember" />
                                    <span>Fazer Upload de Nova Imagem</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                            Destaque do Cardápio?
                          </label>
                          <div className="flex items-center space-x-2 mt-2">
                            <input
                              type="checkbox"
                              id="isHighlight"
                              checked={dishForm.isHighlight || false}
                              onChange={(e) => setDishForm({ ...dishForm, isHighlight: e.target.checked })}
                              className="h-4 w-4 text-churrasco-ember border-gray-300 focus:ring-churrasco-ember"
                            />
                            <label htmlFor="isHighlight" className="text-xs font-semibold text-gray-700 cursor-pointer">
                              Exibir este prato em Destaque na Página Principal
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Tag list */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Etiquetas / Tags
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(dishForm.tags || []).map((tag, idx) => (
                            <span key={idx} className="bg-churrasco-ember/10 text-churrasco-ember text-[10px] font-bold uppercase px-2.5 py-1 flex items-center space-x-1">
                              <span>{tag}</span>
                              <button type="button" onClick={() => handleRemoveTag(idx)} className="hover:text-red-600 text-gray-400">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="Ex: Serve 2 Pessoas, Rodízio"
                            className="bg-white border border-gray-300 p-2 text-xs flex-1 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2"
                          >
                            Inserir
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end border-t border-gray-100 pt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDish(null);
                            setIsAddingDish(false);
                          }}
                          className="py-2.5 px-5 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="py-2.5 px-6 bg-churrasco-red text-white font-bold text-xs uppercase tracking-wider hover:bg-churrasco-red-light transition-colors flex items-center gap-1.5"
                        >
                          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Salvar Prato</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Products Table View */
                  <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Prato / Bebida</th>
                            <th className="py-4 px-6">Categoria</th>
                            <th className="py-4 px-6">Preço</th>
                            <th className="py-4 px-6 text-center">Destaque</th>
                            <th className="py-4 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {dishes.map((dish) => (
                            <tr key={dish.id} className="hover:bg-gray-50/75 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={dish.image} 
                                    alt={dish.name} 
                                    className="w-10 h-10 object-cover border border-gray-200 bg-gray-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <span className="font-bold text-[#1A1A1A] block text-sm">{dish.name}</span>
                                    <span className="text-gray-400 text-[10px] block line-clamp-1 max-w-sm">
                                      {dish.description}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 uppercase font-bold tracking-wider text-[10px] text-gray-400">
                                {categories.find(c => c.id === dish.category)?.name || dish.category}
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-gray-900">
                                R$ {dish.price.toFixed(2).replace('.', ',')}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {dish.isHighlight ? (
                                  <span className="inline-block bg-[#E8590C]/15 text-[#E8590C] font-sans font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                                    Sim
                                  </span>
                                ) : (
                                  <span className="inline-block bg-gray-100 text-gray-400 font-sans font-medium text-[9px] uppercase tracking-wider px-2 py-0.5">
                                    Não
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleStartEditDish(dish)}
                                    className="p-2 border border-gray-200 hover:border-churrasco-ember text-gray-500 hover:text-churrasco-ember transition-all"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDishItem(dish.id)}
                                    className="p-2 border border-gray-200 hover:border-red-600 text-gray-500 hover:text-red-600 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: GERENCIAR CATEGORIAS (CRUD CATEGORIES) */}
            {activeTab === 'categorias' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Gerenciar Categorias</h2>
                    <p className="text-xs text-gray-500">Organize as divisões do cardápio cadastrando, editando ou removendo categorias</p>
                  </div>
                  
                  {!isAddingCategory && !editingCategory && (
                    <button
                      onClick={handleStartAddCategory}
                      className="bg-churrasco-ember hover:bg-[#E06000] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Categoria</span>
                    </button>
                  )}
                </div>

                {isAddingCategory || editingCategory ? (
                  /* Categories Form Layout */
                  <div className="bg-white border border-gray-200 p-6 shadow-sm max-w-xl mx-auto">
                    <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center">
                      <h3 className="font-serif font-bold text-lg text-gray-900">
                        {editingCategory ? `Editar Categoria: ${editingCategory.name}` : 'Cadastrar Nova Categoria'}
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingCategory(null);
                          setIsAddingCategory(false);
                        }}
                        className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Código Identificador (ID / Slug) *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!!editingCategory}
                          value={categoryForm.id}
                          onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                          placeholder="Ex: entradas, acompanhamentos (sem espaços ou acentos)"
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Nome da Categoria *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="Ex: Entradas & Porções"
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Descrição
                        </label>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Breve resumo da categoria..."
                          rows={3}
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs focus:outline-none focus:border-churrasco-ember"
                        />
                      </div>

                      <div className="flex gap-3 justify-end border-t border-gray-100 pt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(null);
                            setIsAddingCategory(false);
                          }}
                          className="py-2.5 px-5 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="py-2.5 px-6 bg-churrasco-red text-white font-bold text-xs uppercase tracking-wider hover:bg-churrasco-red-light transition-colors flex items-center gap-1.5"
                        >
                          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Salvar Categoria</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Categories Table View */
                  <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">ID / Slug</th>
                            <th className="py-4 px-6">Nome</th>
                            <th className="py-4 px-6">Descrição</th>
                            <th className="py-4 px-6 text-center">Itens Relacionados</th>
                            <th className="py-4 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {categories.map((cat) => {
                            const relatedProductsCount = dishes.filter(d => d.category === cat.id).length;
                            return (
                              <tr key={cat.id} className="hover:bg-gray-50/75 transition-colors">
                                <td className="py-4 px-6 font-mono font-bold text-[#E8590C]">
                                  {cat.id}
                                </td>
                                <td className="py-4 px-6 font-bold text-gray-900 text-sm">
                                  {cat.name}
                                </td>
                                <td className="py-4 px-6 text-gray-500 max-w-sm truncate" title={cat.description}>
                                  {cat.description || <span className="italic text-gray-300">Sem descrição</span>}
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-gray-700">
                                  {relatedProductsCount} pratos
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleStartEditCategory(cat)}
                                      className="p-2 border border-gray-200 hover:border-churrasco-ember text-gray-500 hover:text-churrasco-ember transition-all"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategoryItem(cat.id)}
                                      className="p-2 border border-gray-200 hover:border-red-600 text-gray-500 hover:text-red-600 transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: RESERVAS VIEW */}
            {activeTab === 'reservas' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Agenda de Reservas</h2>
                  <p className="text-xs text-gray-500">
                    Visualize as solicitações de reservas em tempo real sincronizadas do Supabase. Você pode confirmar ou excluir agendamentos diretamente.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  {reservations.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <span className="text-4xl">📭</span>
                      <p className="text-sm font-bold uppercase tracking-wider mt-3">Nenhuma reserva registrada</p>
                      <p className="text-xs text-gray-500 mt-1">Os agendamentos efetuados pelos clientes aparecerão aqui.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Código / Nome</th>
                            <th className="py-4 px-6">Contato</th>
                            <th className="py-4 px-6">Pessoas</th>
                            <th className="py-4 px-6">Data & Hora</th>
                            <th className="py-4 px-6">Observações</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {reservations.map((res) => {
                            let displayDate = res.date;
                            if (res.date && res.date.includes('-')) {
                              const [y, m, d] = res.date.split('-');
                              displayDate = `${d}/${m}/${y}`;
                            }

                            return (
                              <tr key={res.id} className="hover:bg-gray-50/75 transition-colors">
                                <td className="py-4 px-6">
                                  <span className="font-mono font-black text-churrasco-ember block text-xs">{res.code}</span>
                                  <span className="font-bold text-gray-900 text-sm block">{res.name}</span>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{res.phone}</td>
                                <td className="py-4 px-6 font-bold text-gray-900 text-sm">{res.guests} pessoas</td>
                                <td className="py-4 px-6">
                                  <span className="font-semibold block">{displayDate}</span>
                                  <span className="text-gray-400 text-[10px] block font-medium">às {res.time}</span>
                                </td>
                                <td className="py-4 px-6 text-gray-500 text-[11px] max-w-xs truncate" title={res.notes}>
                                  {res.notes || <span className="text-gray-300 italic">Sem observações</span>}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => handleToggleReservation(res.id, res.status)}
                                    className={`font-sans font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-none border transition-colors ${
                                      res.status === 'confirmed'
                                        ? 'bg-churrasco-red/10 border-churrasco-red/20 text-churrasco-red'
                                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600'
                                    }`}
                                  >
                                    {res.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                                  </button>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleToggleReservation(res.id, res.status)}
                                      className={`p-2 border border-gray-200 hover:bg-gray-50 transition-all ${
                                        res.status === 'confirmed' ? 'text-yellow-600' : 'text-churrasco-red'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReservationItem(res.id)}
                                      className="p-2 border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: AVALIAÇÕES VIEW */}
            {activeTab === 'avaliacoes' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Depoimentos de Clientes</h2>
                  <p className="text-xs text-gray-500">Visualize as avaliações que os clientes submeteram pelo formulário do site.</p>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                  {reviews.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <span className="text-4xl">💬</span>
                      <p className="text-sm font-bold uppercase tracking-wider mt-3">Nenhuma avaliação encontrada</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Cliente</th>
                            <th className="py-4 px-6">Comentário</th>
                            <th className="py-4 px-6 text-center">Nota</th>
                            <th className="py-4 px-6">Data</th>
                            <th className="py-4 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {reviews.map((rev) => (
                            <tr key={rev.id} className="hover:bg-gray-50/75 transition-colors">
                              <td className="py-4 px-6 font-bold text-gray-900 text-sm">
                                {rev.author}
                              </td>
                              <td className="py-4 px-6 text-gray-600 max-w-lg leading-relaxed whitespace-pre-line">
                                "{rev.text}"
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-0.5 text-amber-500">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-400 font-medium">
                                {rev.date}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteReviewItem(rev.id)}
                                  className="p-2 border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all inline-flex items-center justify-center"
                                  title="Remover avaliação"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-400 shrink-0">
        <p>© 2026 Tradição Churrascaria. Painel administrativo conectado de ponta a ponta com o Supabase.</p>
      </footer>
    </div>
  );
}
