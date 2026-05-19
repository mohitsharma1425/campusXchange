import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';

/* ─── API CONFIG ────────────────────────────────────────────────────── */
// Use proxy in development, direct API in production
const API_BASE = import.meta.env.DEV ? '/api' : `${window.location.protocol}//${window.location.hostname}:4000/api`;

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const error = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : { error: await response.text().catch(() => '') };

    console.error('API Error:', error); // Log full error details
    if (error.details) {
      console.error('Validation Details:', error.details); // Log validation details
      console.error('Validation Details JSON:', JSON.stringify(error.details, null, 2)); // Stringify for clarity
    }

    const details = Array.isArray(error.details) ? error.details : [];
    const apiError = new Error(details[0]?.msg || error.error || error.message || `Request failed with status ${response.status}`);
    apiError.status = response.status;
    apiError.details = details;
    throw apiError;
  }

  return response.json();
};

export const CATEGORIES = [
  { id:'electronics', label:'Electronics', icon:'📱', sub:['Laptops','Phones','Headphones','Chargers','Accessories'] },
  { id:'books',       label:'Books',       icon:'📚', sub:['Textbooks','Notes','Reference','Journals','Study Guides'] },
  { id:'stationery',  label:'Stationery',  icon:'✏️', sub:['Notebooks','Pens','Backpacks','Planners','Lab Supplies'] },
  { id:'sports',      label:'Sports',       icon:'🏀', sub:['Gym Gear','Balls','Fitness','Yoga','Cycling'] },
  { id:'fashion',     label:'Fashion',      icon:'👕', sub:['T-Shirts','Hoodies','College Wear','Shoes','Accessories'] },
];

const CITIES = ['Chandigarh','Baddi','Rajpura','Solan'];

const upsertConversation = (conversation) => (current) => {
  const others = current.filter(c => c._id !== conversation._id);
  return [conversation, ...others].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
};

/* ─── CONTEXT ──────────────────────────────────────────────────────── */
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user,         setUser]         = useState(null);
  const [authChecked,  setAuthChecked]  = useState(false);
  const [listings,     setListings]     = useState([]);
  const [categories,   setCategories]   = useState(CATEGORIES);
  const [wishlist,     setWishlist]     = useState([]);
  const [recentlyViewed,setRecentlyViewed] = useState([]);
  const [conversations,setConversations] = useState([]);
  const [notifications,setNotifications]= useState([
    { id:1, text:'Your ad "iPhone 15" got 24 new views!', read:false, time:'2h ago' },
    { id:2, text:'Rahul S. sent you a message', read:false, time:'5h ago' },
    { id:3, text:'Price drop alert on your wishlist item', read:true,  time:'1d ago' },
  ]);
  const [toasts,       setToasts]       = useState([]);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [selectedCat,  setSelectedCat]  = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange,   setPriceRange]   = useState([0,2000000]);
  const [sortBy,       setSortBy]       = useState('newest');
  const [condition,    setCondition]    = useState('all');
  const [viewMode,     setViewMode]     = useState('grid');

  // Fetch categories and listings from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchListings = async () => {
      try {
        const response = await fetch(`${API_BASE}/listings`);
        if (response.ok) {
          const data = await response.json();
          // Map _id to id for easier access in components
          const mappedListings = (data.listings || []).map(l => ({
            ...l,
            id: l._id
          }));
          setListings(mappedListings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchCategories();
    fetchListings();
  }, []);

  /* Toast system */
  const showToast = useCallback((text, type='info') => {
    const id = Date.now();
    setToasts(p=>[...p,{id,text,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
  },[]);

  /* Wishlist */
  const toggleWishlist = useCallback((id) => {
    setWishlist(p => {
      const has = p.includes(id);
      showToast(has ? 'Removed from wishlist' : 'Added to wishlist ❤️', has?'info':'success');
      return has ? p.filter(x=>x!==id) : [...p,id];
    });
  },[showToast]);

  /* Auth */
  const login = useCallback(async (credentials) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      localStorage.setItem('token', data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
      return data.user;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthChecked(true);
    showToast('Logged out successfully');
  }, [showToast]);

  const register = useCallback(async (userData) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      localStorage.setItem('token', data.token);
      setUser(data.user);
      showToast(`Account created! Welcome ${data.user.name} 🎉`, 'success');
      return data.user;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      apiRequest('/auth/me')
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  /* Recently viewed */
  const addRecentlyViewed = useCallback((listing)=>{
    setRecentlyViewed(p=>{
      const filtered = p.filter(l=>l.id!==listing.id);
      return [listing,...filtered].slice(0,8);
    });
  },[]);

  /* Chat */
  const loadConversations = useCallback(async () => {
    const data = await apiRequest('/conversations');
    setConversations(data.conversations || []);
    return data.conversations || [];
  }, []);

  const startConversation = useCallback(async (listingId, text) => {
    try {
      const data = await apiRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify({ listingId, text }),
      });

      setConversations(upsertConversation(data.conversation));
      showToast('Message sent to seller', 'success');
      return data.conversation;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const replyToConversation = useCallback(async (conversationId, text) => {
    try {
      const data = await apiRequest(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });

      setConversations(upsertConversation(data.conversation));
      return data.conversation;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  useEffect(() => {
    if (!authChecked || !user) {
      setConversations([]);
      return;
    }

    loadConversations().catch(error => {
      console.error('Error loading conversations:', error);
    });
  }, [authChecked, user, loadConversations]);

  useEffect(() => {
    if (!authChecked || !user) return undefined;

    const token = localStorage.getItem('token');
    if (!token) return undefined;

    const socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('conversation:updated', ({ conversation }) => {
      if (conversation) {
        setConversations(upsertConversation(conversation));
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [authChecked, user]);

  /* Post ad */
  const postAd = useCallback(async (formData) => {
    try {
      const newAd = await apiRequest('/listings', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Map _id to id for consistency
      const mappedAd = { ...newAd, id: newAd._id };
      setListings(p => [mappedAd, ...p]);
      showToast('Ad posted successfully! 🚀', 'success');
      return mappedAd;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  /* Notifications */
  const markAllRead = useCallback(()=>{
    setNotifications(p=>p.map(n=>({...n,read:true})));
  },[]);

  /* Filtered listings */
  const filteredListings = listings.filter(l => {
    if(selectedCat !== 'all' && l.categoryId !== selectedCat) return false;
    if(selectedCity !== 'all' && l.city !== selectedCity) return false;
    if(condition !== 'all' && l.condition !== condition) return false;
    if(l.price>0 && (l.price<priceRange[0] || l.price>priceRange[1])) return false;
    if(searchQuery) {
      const q = searchQuery.toLowerCase();
      if(!l.title.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q) && !l.categoryLabel.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a,b)=>{
    if(sortBy==='price-asc')  return a.price-b.price;
    if(sortBy==='price-desc') return b.price-a.price;
    if(sortBy==='featured')   return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const unreadCount = notifications.filter(n=>!n.read).length;

  return (
    <Ctx.Provider value={{
      user, login, logout, register,
      authChecked,
      listings, filteredListings, postAd,
      categories,
      wishlist, toggleWishlist,
      recentlyViewed, addRecentlyViewed,
      conversations, loadConversations, startConversation, replyToConversation,
      notifications, unreadCount, markAllRead,
      toasts,showToast,
      searchQuery, setSearchQuery,
      selectedCat, setSelectedCat,
      selectedCity, setSelectedCity,
      priceRange, setPriceRange,
      sortBy, setSortBy,
      condition, setCondition,
      viewMode, setViewMode,
      CITIES,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
