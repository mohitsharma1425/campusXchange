import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, MapPin, ChevronDown, Heart, Bell, Plus,
  Menu, X, LogOut, User, MessageSquare, Settings,
  TrendingUp, Clock, Star, ChevronRight, Home,
  Package, Bookmark, HelpCircle, Shield
} from 'lucide-react';
import { useApp, CATEGORIES } from '../context/AppContext';

const TRENDING = ['iPhone 15','Honda City','2BHK Flat','Royal Enfield','MacBook','PS5','Sofa Set'];

export default function Navbar() {
  const {
    user, logout, searchQuery, setSearchQuery,
    wishlist, unreadCount, markAllRead, notifications,
    selectedCity, setSelectedCity, CITIES, showToast,
    filteredListings,
  } = useApp();

  const [searchFocus, setSearchFocus] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [cityOpen,    setCityOpen]    = useState(false);
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const [megaMenu,    setMegaMenu]    = useState(false);

  const searchRef  = useRef();
  const profileRef = useRef();
  const notifRef   = useRef();
  const navigate   = useNavigate();
  const location   = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if(profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if(notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return ()=>document.removeEventListener('mousedown', handler);
  },[]);

  // suggestions from listings
  const suggestions = searchQuery.length > 1
    ? [...new Set(filteredListings.slice(0,5).map(l=>l.title))].slice(0,5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchFocus(false);
    navigate('/');
  };

  const pickSuggestion = (s) => {
    setSearchQuery(s);
    setSearchFocus(false);
    navigate('/');
  };

  return (
    <>
      <nav style={nav.root}>
        <div className="container" style={nav.inner}>
          {/* Logo */}
          <Link to="/" style={nav.logo}>
            <span style={nav.logoTxt}>CampusXchange</span>
          </Link>

          {/* City Selector */}
          <div style={{position:'relative'}} ref={notifRef}>
            <button style={nav.cityBtn} onClick={()=>setCityOpen(o=>!o)}>
              <MapPin size={13} color="#FFD95A"/>
              <span style={nav.cityLabel}>{selectedCity==='all'?'All India':selectedCity}</span>
              <ChevronDown size={12} color="#aaa"/>
            </button>
            {cityOpen && (
              <div className="dropdown" style={{top:'110%',left:0,width:220,maxHeight:300,overflowY:'auto'}}>
                <div style={{padding:'8px 4px'}}>
                  <button style={nav.cityItem} onClick={()=>{setSelectedCity('all');setCityOpen(false);}}>
                    🌍 All India
                  </button>
                  {CITIES.map(c=>(
                    <button key={c} style={{...nav.cityItem,...(selectedCity===c?{background:'#FFFBEB',fontWeight:700}:{})}}
                      onClick={()=>{setSelectedCity(c);setCityOpen(false);}}>
                      📍 {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={nav.searchWrap} ref={searchRef}>
            <div style={{...nav.searchBox,...(searchFocus?{outline:'2px solid #FFD95A'}:{})}}>
              <Search size={17} color="#9CA3AF" style={{flexShrink:0,marginLeft:14}}/>
              <input
                type="text"
                placeholder="Search for mobiles, cars, bikes..."
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                onFocus={()=>setSearchFocus(true)}
                onBlur={()=>setTimeout(()=>setSearchFocus(false),150)}
                style={nav.searchInput}
              />
              {searchQuery && (
                <button type="button" onClick={()=>setSearchQuery('')} style={{padding:'0 10px',color:'#9CA3AF'}}>
                  <X size={14}/>
                </button>
              )}
              <button type="submit" style={nav.searchBtn}>
                <Search size={16} color="#002F34"/>
                <span className="hide-mobile">Search</span>
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {searchFocus && (
              <div style={nav.autocomplete}>
                {searchQuery.length<2 ? (
                  <>
                    <div style={nav.autoSection}>TRENDING SEARCHES</div>
                    {TRENDING.map(t=>(
                      <button key={t} style={nav.autoItem} onMouseDown={()=>pickSuggestion(t)}>
                        <TrendingUp size={13} color="#FFD95A"/>
                        {t}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <div style={nav.autoSection}>SUGGESTIONS</div>
                    {suggestions.map(s=>(
                      <button key={s} style={nav.autoItem} onMouseDown={()=>pickSuggestion(s)}>
                        <Search size={13} color="#9CA3AF"/>
                        {s}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </form>

          {/* Right Actions */}
          <div style={nav.actions}>
            {/* Wishlist */}
            <Link to="/wishlist" style={nav.iconWrap} title="Wishlist">
              <Heart size={20} color={wishlist.length?'#ef4444':'#ccc'}
                fill={wishlist.length?'#ef4444':'none'}/>
              {wishlist.length>0 && <span style={nav.badge}>{wishlist.length}</span>}
            </Link>

            {/* Messages */}
            {user && (
              <Link to="/messages" style={nav.iconWrap} title="Messages">
                <MessageSquare size={20} color="#ccc"/>
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <div style={{position:'relative'}} ref={notifRef}>
                <button style={nav.iconWrap} title="Notifications"
                  onClick={()=>{setNotifOpen(o=>!o);markAllRead();}}>
                  <Bell size={20} color="#ccc"/>
                  {unreadCount>0 && <span style={{...nav.badge,background:'#ef4444'}}>{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div className="dropdown" style={{top:'120%',right:0,width:320}}>
                    <div style={{padding:'14px 16px',borderBottom:'1px solid #f0f0f0',fontWeight:700,fontSize:15}}>
                      Notifications
                    </div>
                    {notifications.map(n=>(
                      <div key={n.id} style={{...nav.notifItem,...(!n.read?{background:'#FFFBEB'}:{})}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:n.read?'#e5e7eb':'#FFD95A',flexShrink:0,marginTop:5}}/>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,color:'#1a1a1a',lineHeight:1.4}}>{n.text}</p>
                          <p style={{fontSize:11,color:'#9CA3AF',marginTop:3}}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {user ? (
              <div style={{position:'relative'}} ref={profileRef}>
                <button style={nav.profileBtn} onClick={()=>setProfileOpen(o=>!o)}>
                  <div className="avatar avatar-sm" style={{fontSize:13}}>{user.name.charAt(0)}</div>
                  <span className="hide-mobile" style={{color:'#e0e0e0',fontSize:13,fontWeight:600,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} color="#aaa"/>
                </button>
                {profileOpen && (
                  <div className="dropdown" style={{top:'120%',right:0,width:220}}>
                    <div style={{padding:'14px 16px',borderBottom:'1px solid #f0f0f0'}}>
                      <p style={{fontWeight:700,fontSize:14,color:'#1a1a1a'}}>{user.name}</p>
                      <p style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>{user.email}</p>
                    </div>
                    {[
                      {icon:<User size={14}/>, label:'My Profile',   to:'/profile'},
                      {icon:<Package size={14}/>, label:'My Ads',    to:'/my-ads'},
                      {icon:<Bookmark size={14}/>,label:'Wishlist',  to:'/wishlist'},
                      {icon:<MessageSquare size={14}/>,label:'Messages',to:'/messages'},
                      {icon:<Settings size={14}/>,label:'Settings',  to:'/settings'},
                      ...(['admin', 'moderator'].includes(user.role) ? [{icon:<Shield size={14}/>, label:'Admin Panel', to:'/admin'}] : []),
                    ].map(item=>(
                      <Link key={item.label} to={item.to} style={nav.ddItem}
                        onClick={()=>setProfileOpen(false)}>
                        {item.icon}{item.label}
                      </Link>
                    ))}
                    <div className="divider"/>
                    <button style={{...nav.ddItem,color:'#ef4444',width:'100%',textAlign:'left'}}
                      onClick={()=>{logout();setProfileOpen(false);}}>
                      <LogOut size={14}/> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{display:'flex',gap:8}}>
                <Link to="/login" style={{color:'#FFD95A',fontWeight:700,fontSize:14,padding:'8px 14px'}}>Login</Link>
                <Link to="/register" style={{color:'#ccc',fontWeight:500,fontSize:14,padding:'8px 14px'}} className="hide-mobile">Register</Link>
              </div>
            )}

            {/* Sell Button */}
            <Link to="/post-ad" style={nav.sellBtn}>
              <Plus size={15} strokeWidth={2.5}/>
              <span>SELL</span>
            </Link>
          </div>
        </div>

        {/* Category Bar */}
        <div style={nav.catBar}>
          <div className="container" style={nav.catBarInner}>
            <Link to="/" style={{...nav.catLink,...(location.pathname==='/'&&!location.search?{color:'#FFD95A',fontWeight:700}:{})}}>
              <Home size={13}/> Home
            </Link>
            {CATEGORIES.slice(0,9).map(cat=>(
              <Link key={cat.id} to={`/?cat=${cat.id}`} style={nav.catLink}>
                {cat.icon} {cat.label}
              </Link>
            ))}
            <button style={{...nav.catLink,display:'flex',alignItems:'center',gap:4}}
              onClick={()=>setMegaMenu(o=>!o)}>
              More <ChevronDown size={12}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu Overlay */}
      {megaMenu && (
        <div style={nav.megaOverlay} onClick={()=>setMegaMenu(false)}>
          <div style={nav.megaMenu} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:1}}>All Categories</h3>
              <button onClick={()=>setMegaMenu(false)}><X size={20}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
              {CATEGORIES.map(cat=>(
                <Link key={cat.id} to={`/?cat=${cat.id}`}
                  style={nav.megaCat} onClick={()=>setMegaMenu(false)}>
                  <span style={{fontSize:28}}>{cat.icon}</span>
                  <span style={{fontSize:13,fontWeight:600,color:'#1a1a1a',textAlign:'center'}}>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const nav = {
  root: { background:'#002F34', position:'sticky', top:0, zIndex:200, boxShadow:'0 2px 20px rgba(0,0,0,.25)' },
  inner: { display:'flex', alignItems:'center', gap:12, height:66, position:'relative' },
  logo: { flexShrink:0 },
  logoTxt: { fontFamily:'Bebas Neue,sans-serif', fontSize:36, color:'#FFD95A', letterSpacing:2, lineHeight:1 },
  cityBtn: { display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:8,
    background:'rgba(255,255,255,.07)', cursor:'pointer', flexShrink:0 },
  cityLabel: { color:'#e0e0e0', fontSize:12, fontWeight:500, whiteSpace:'nowrap', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis' },
  cityItem: { display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, color:'#374151',
    background:'none', cursor:'pointer', borderRadius:6, transition:'background .15s' },
  searchWrap: { flex:1, maxWidth:540, position:'relative' },
  searchBox: { display:'flex', alignItems:'center', borderRadius:10, overflow:'hidden',
    background:'white', transition:'outline .2s' },
  searchInput: { flex:1, padding:'10px 8px', border:'none', outline:'none', fontSize:14, color:'#1a1a1a' },
  searchBtn: { display:'flex', alignItems:'center', gap:6, padding:'10px 16px',
    background:'#FFD95A', border:'none', cursor:'pointer', fontWeight:700, fontSize:13,
    color:'#002F34', flexShrink:0, whiteSpace:'nowrap' },
  autocomplete: { position:'absolute', top:'calc(100% + 8px)', left:0, right:0,
    background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,.15)',
    border:'1px solid #f0f0f0', zIndex:300, overflow:'hidden' },
  autoSection: { padding:'10px 14px 6px', fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:1 },
  autoItem: { display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px',
    fontSize:13, color:'#1a1a1a', background:'none', cursor:'pointer', textAlign:'left',
    transition:'background .15s' },
  actions: { display:'flex', alignItems:'center', gap:6, flexShrink:0 },
  iconWrap: { position:'relative', padding:9, display:'flex', alignItems:'center', justifyContent:'center',
    borderRadius:8, cursor:'pointer', transition:'background .2s' },
  badge: { position:'absolute', top:5, right:5, width:17, height:17, borderRadius:'50%',
    background:'#FFD95A', color:'#002F34', fontSize:9, fontWeight:800,
    display:'flex', alignItems:'center', justifyContent:'center',
    animation:'badgeBounce .3s ease' },
  profileBtn: { display:'flex', alignItems:'center', gap:7, padding:'6px 10px',
    borderRadius:8, background:'rgba(255,255,255,.07)', cursor:'pointer' },
  ddItem: { display:'flex', alignItems:'center', gap:9, padding:'10px 16px',
    fontSize:13, color:'#374151', cursor:'pointer', transition:'background .15s',
    textDecoration:'none' },
  notifItem: { display:'flex', gap:10, padding:'12px 16px', borderBottom:'1px solid #f9fafb',
    transition:'background .15s', cursor:'pointer' },
  sellBtn: { display:'flex', alignItems:'center', gap:5, padding:'9px 18px',
    background:'#FFD95A', color:'#002F34', borderRadius:8, fontWeight:800,
    fontSize:12, letterSpacing:.5, transition:'all .2s', flexShrink:0 },
  catBar: { background:'rgba(0,0,0,.25)', borderTop:'1px solid rgba(255,255,255,.06)' },
  catBarInner: { display:'flex', gap:2, overflowX:'auto', height:42, alignItems:'center',
    scrollbarWidth:'none' },
  catLink: { display:'flex', alignItems:'center', gap:5, padding:'5px 12px',
    color:'rgba(255,255,255,.65)', fontSize:12.5, fontWeight:500,
    whiteSpace:'nowrap', borderRadius:6, transition:'all .2s', flexShrink:0,
    textDecoration:'none' },
  megaOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:400,
    display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:110 },
  megaMenu: { background:'white', borderRadius:20, padding:28, width:'90%', maxWidth:720,
    boxShadow:'0 20px 60px rgba(0,0,0,.2)', animation:'fadeUp .3s ease' },
  megaCat: { display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 12px',
    borderRadius:12, border:'2px solid #f0f0f0', cursor:'pointer', transition:'all .2s',
    textDecoration:'none' },
};
