import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar    from './components/Navbar';
import Toast     from './components/Toast';
import ListingCard from './components/ListingCard';
import Home         from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import PostAd       from './pages/PostAd';
import Admin        from './pages/Admin';
import { Login, Register }  from './pages/Auth';
import { Wishlist, Messages, Profile, Footer } from './components/Extra';
import './index.css';

const globalStyle = `
  /* ── Nav hover effects ── */
  nav a:hover { color: #FFD95A !important; }
  nav a.sell-active, nav a[href="/post-ad"]:hover { opacity: .88; }

  /* ── Listing card hover ── */
  .listing-card:hover { transform: translateY(-5px) !important; box-shadow: 0 10px 36px rgba(0,0,0,.14) !important; }
  .listing-card:hover .card-img { transform: scale(1.07) !important; }

  /* ── Button states ── */
  .btn-primary:hover  { background: #e6c000 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,217,90,.35) !important; }
  .btn-dark:hover     { background: #004d55 !important; transform: translateY(-1px); }
  .btn-outline:hover  { background: #002F34 !important; color: #fff !important; }

  /* ── Form focus glow ── */
  .form-input:focus { border-color: #002F34 !important; box-shadow: 0 0 0 3px rgba(0,47,52,.09) !important; }

  /* ── Category bar hover ── */
  nav .cat-link:hover { color: #FFD95A !important; background: rgba(255,255,255,.1); }

  /* ── Mega cat hover ── */
  [style*="megaCat"]:hover, a[style*="flexDirection: column"]:hover {
    border-color: #002F34 !important; background: #FFFBEB !important; transform: translateY(-2px);
  }

  /* ── Dropdown item hover ── */
  a[style*="ddItem"]:hover, button[style*="ddItem"]:hover { background: #f9fafb !important; }

  /* ── Autocomplete item hover ── */
  button[style*="autoItem"]:hover { background: #f9fafb !important; }

  /* ── City item hover ── */
  button[style*="cityItem"]:hover { background: #FFFBEB !important; }

  /* ── Social btn hover ── */
  button[style*="socialBtn"]:hover { border-color: #002F34 !important; background: #f9fafb !important; }

  /* ── Tab hover ── */
  button.tab:not(.active):hover { color: #002F34 !important; }

  /* ── Footer link hover ── */
  footer a:hover { color: #FFD95A !important; }

  /* ── Notif item hover ── */
  div[style*="notifItem"]:hover { background: #FFFBEB !important; }

  /* ── Chat msg input ── */
  .form-input { transition: border-color .2s, box-shadow .2s; }

  /* ── Mobile responsive ── */
  @media (max-width: 900px) {
    div[style*="heroLayout"] { grid-template-columns: 1fr !important; }
    div[style*="heroBanners"] { display: none !important; }
    div[style*="det.layout"] { grid-template-columns: 1fr !important; }
    div[style*="width:316px"] { width: 100% !important; position: static !important; }
    div[style*="gridTemplateColumns: '280px"] { grid-template-columns: 1fr !important; }
    div[style*="gridTemplateColumns: '300px"] { grid-template-columns: 1fr !important; }
    div[style*="trustRow"] { grid-template-columns: 1fr 1fr !important; }
    div[style*="auth.card"] { flex-direction: column !important; }
    div[style*="auth.left"] { width: 100% !important; }
  }

  @keyframes badgeBounce {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes heartPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

function RequireAuth({ children }) {
  const { user, authChecked } = useApp();
  if (!authChecked) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function RequireRole({ roles, children }) {
  const { user, authChecked } = useApp();
  if (!authChecked) return null;
  return user && roles.includes(user.role) ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <style>{globalStyle}</style>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
          <Navbar/>
          <Toast/>
          <main style={{ flex:1 }}>
            <Routes>
              <Route path="/"           element={<Home/>}/>
              <Route path="/listing/:id" element={<ProductDetail/>}/>
              <Route path="/login"       element={<Login/>}/>
              <Route path="/register"    element={<Register/>}/>
              <Route path="/post-ad"     element={<RequireAuth><PostAd/></RequireAuth>} />
              <Route path="/admin"       element={<RequireRole roles={['admin', 'moderator']}><Admin/></RequireRole>} />
              <Route path="/wishlist"    element={<RequireAuth><Wishlist/></RequireAuth>} />
              <Route path="/messages"    element={<RequireAuth><Messages/></RequireAuth>} />
              <Route path="/profile"     element={<RequireAuth><Profile/></RequireAuth>} />
              <Route path="/my-ads"      element={<RequireAuth><Profile/></RequireAuth>} />
              <Route path="/settings"    element={<RequireAuth><Profile/></RequireAuth>} />
              <Route path="*"           element={<Navigate to="/"/>}/>
            </Routes>
          </main>
          <Footer/>
        </div>
      </Router>
    </AppProvider>
  );
}
