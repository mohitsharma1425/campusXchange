import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal, Grid3X3, List, ChevronRight, X,
  TrendingUp, Sparkles, Zap, Shield, Star, ArrowRight,
  RefreshCw, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ListingCard, { ListingCardSkeleton } from '../components/ListingCard';

const BANNERS = [
  { bg:'linear-gradient(135deg,#002F34 0%,#004d55 100%)', tag:'� STUDY MATERIALS', title:'Textbooks & Notes\nfor Every Semester', cat:'books', emoji:'📚' },
  { bg:'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)', tag:'💻 CAMPUS GEAR', title:'Laptops & Gadgets\nfor Students', cat:'electronics', emoji:'💻' },
  { bg:'linear-gradient(135deg,#EA580C 0%,#F59E0B 100%)', tag:'🏀 CAMPUS LIFE', title:'Sports Gear &\nCampus Essentials', cat:'sports', emoji:'🏀' },
];

export default function Home() {
  const {
    filteredListings, selectedCat, setSelectedCat,
    selectedCity, priceRange, setPriceRange,
    sortBy, setSortBy, condition, setCondition,
    viewMode, setViewMode, searchQuery, setSearchQuery,
    CITIES, setSelectedCity, categories,
  } = useApp();

  const [searchParams] = useSearchParams();
  const [loading, setLoading]       = useState(true);
  const [showFilter,setShowFilter]  = useState(false);
  const [page, setPage]             = useState(1);
  const [activeBanner,setBanner]    = useState(0);
  const PER_PAGE = 12;

  // Apply URL category param
  useEffect(()=>{
    const cat = searchParams.get('cat');
    if(cat) setSelectedCat(cat);
  },[searchParams]);

  // Simulate loading
  useEffect(()=>{
    setLoading(true);
    const t = setTimeout(()=>setLoading(false),700);
    return()=>clearTimeout(t);
  },[selectedCat, searchQuery]);

  // Banner auto-rotate
  useEffect(()=>{
    const t = setInterval(()=>setBanner(b=>(b+1)%BANNERS.length),4000);
    return()=>clearInterval(t);
  },[]);

  const paged = filteredListings.slice(0, page*PER_PAGE);
  const hasMore = paged.length < filteredListings.length;

  const resetFilters = () => {
    setSelectedCat('all'); setCondition('all'); setSelectedCity('all');
    setPriceRange([0,2000000]); setSortBy('newest'); setSearchQuery('');
  };

  const activeFilters = [
    selectedCat!=='all' && categories.find(c=>c.id===selectedCat)?.label,
    selectedCity!=='all' && selectedCity,
    condition!=='all' && condition,
    (priceRange[0]>0||priceRange[1]<2000000) && `₹${(priceRange[0]/1000).toFixed(0)}K–₹${(priceRange[1]/1000).toFixed(0)}K`,
  ].filter(Boolean);

  return (
    <div style={{minHeight:'100vh'}}>
      {/* ── HERO ── */}
      <div style={home.hero}>
        <div className="container" style={{position:'relative',zIndex:2}}>
          <div style={home.heroLayout}>
            {/* Left text */}
            <div style={home.heroText}>
              <div style={home.heroPill}><Sparkles size={13}/> Chitkara Campus Exchange</div>
              <h1 style={home.heroH1}>Buy & Sell<br/>Campus Essentials</h1>
              <p style={home.heroSub}>Student-only listings · Study materials, gadgets, sports gear · Free for Chitkara</p>
              <div style={home.heroStats}>
                {[['5Cr+','Active Users'],['2Cr+','Live Ads'],['500+','Cities'],['4.8★','Rating']].map(([n,l])=>(
                  <div key={l} style={home.heroStat}>
                    <span style={home.heroStatN}>{n}</span>
                    <span style={home.heroStatL}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:12,marginTop:24,flexWrap:'wrap'}}>
                <Link to="/post-ad" className="btn btn-primary btn-lg">
                  <Zap size={16}/> Post FREE Ad
                </Link>
                <Link to="/?cat=all" className="btn" style={{background:'rgba(255,255,255,.12)',color:'white',padding:'14px 24px',fontSize:15,fontWeight:600,borderRadius:8}}>
                  Browse Listings
                </Link>
              </div>
            </div>

            {/* Right banner rotator */}
            <div style={home.heroBanners}>
              {BANNERS.map((b,i)=>(
                <div key={i} style={{
                  ...home.heroBanner,
                  background:b.bg,
                  opacity:activeBanner===i?1:0,
                  transform:activeBanner===i?'scale(1)':'scale(.95)',
                  position: i===0?'relative':'absolute',
                  inset:0,
                  transition:'all .6s ease',
                  zIndex:activeBanner===i?2:1,
                }}>
                  <span style={{fontSize:10,fontWeight:800,letterSpacing:1,color:'#FFD95A'}}>{b.tag}</span>
                  <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:34,color:'white',lineHeight:1.1,marginTop:6,whiteSpace:'pre-line'}}>{b.title}</h3>
                  <button style={home.bannerBtn} onClick={()=>setSelectedCat(b.cat)}>Explore Now →</button>
                  <span style={{position:'absolute',bottom:20,right:20,fontSize:64,opacity:.2}}>{b.emoji}</span>
                </div>
              ))}
              {/* Dots */}
              <div style={{position:'absolute',bottom:14,left:0,right:0,display:'flex',justifyContent:'center',gap:6,zIndex:10}}>
                {BANNERS.map((_,i)=>(
                  <button key={i} onClick={()=>setBanner(i)}
                    style={{width:i===activeBanner?20:7,height:7,borderRadius:99,background:i===activeBanner?'#FFD95A':'rgba(255,255,255,.4)',border:'none',cursor:'pointer',transition:'all .3s'}}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div style={home.wave}/>
      </div>

      {/* ── CATEGORIES SCROLL ── */}
      <div style={{background:'white',borderBottom:'1px solid #f0f0f0',overflowX:'auto',scrollbarWidth:'none'}}>
        <div className="container" style={{display:'flex',gap:8,padding:'14px 20px',scrollbarWidth:'none'}}>
          <button
            style={{...home.catChip,...(selectedCat==='all'?home.catChipActive:{})}}
            onClick={()=>setSelectedCat('all')}>
            🌐 All
          </button>
          {categories.map(c=>(
            <button key={c.id}
              style={{...home.catChip,...(selectedCat===c.id?home.catChipActive:{})}}
              onClick={()=>setSelectedCat(c.id)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container" style={{paddingTop:24,paddingBottom:48}}>
        {/* Active filter chips */}
        {activeFilters.length>0 && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
            <span style={{fontSize:13,color:'#9CA3AF',fontWeight:500}}>Active filters:</span>
            {activeFilters.map(f=>(
              <span key={f} style={home.filterChip}>{f}</span>
            ))}
            <button onClick={resetFilters} style={{fontSize:12,color:'#ef4444',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>
              <RefreshCw size={12}/> Clear all
            </button>
          </div>
        )}

        <div style={home.layout}>
          {/* ── SIDEBAR ── */}
          <aside style={{...home.sidebar, display: showFilter ? 'flex' : 'none', flexDirection:'column', gap:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:1}}>Filters</h3>
              <button onClick={resetFilters} style={{fontSize:12,color:'#ef4444',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>
                <RefreshCw size={12}/> Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <p style={home.filterLabel}>Category</p>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <label style={home.radioLabel}>
                  <input type="radio" name="cat" checked={selectedCat==='all'} onChange={()=>setSelectedCat('all')} style={{accentColor:'#002F34'}}/>
                  All Categories
                </label>
                {categories.map(c=>(
                  <label key={c.id} style={home.radioLabel}>
                    <input type="radio" name="cat" checked={selectedCat===c.id} onChange={()=>setSelectedCat(c.id)} style={{accentColor:'#002F34'}}/>
                    {c.icon} {c.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="divider"/>

            {/* City */}
            <div>
              <p style={home.filterLabel}>City</p>
              <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)} className="form-input" style={{padding:'9px 12px'}}>
                <option value="all">All India</option>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="divider"/>

            {/* Price Range */}
            <div>
              <p style={home.filterLabel}>Price Range</p>
              <div style={home.priceInputs}>
                <input type="number" placeholder="Min" value={priceRange[0]||''} onChange={e=>setPriceRange([+e.target.value,priceRange[1]])}
                  className="form-input" style={home.priceInput}/>
                <input type="number" placeholder="Max" value={priceRange[1]||''} onChange={e=>setPriceRange([priceRange[0],+e.target.value])}
                  className="form-input" style={home.priceInput}/>
              </div>
              <input type="range" min={0} max={2000000} step={10000} value={priceRange[1]}
                onChange={e=>setPriceRange([priceRange[0],+e.target.value])}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#9CA3AF',marginTop:4}}>
                <span>₹0</span><span>₹{(priceRange[1]/1000).toFixed(0)}K</span>
              </div>
            </div>

            <div className="divider"/>

            {/* Condition */}
            <div>
              <p style={home.filterLabel}>Condition</p>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {['all','Like New','Excellent','Good','Fair'].map(c=>(
                  <label key={c} style={home.radioLabel}>
                    <input type="radio" name="cond" checked={condition===c} onChange={()=>setCondition(c)} style={{accentColor:'#002F34'}}/>
                    {c==='all'?'Any Condition':c}
                  </label>
                ))}
              </div>
            </div>

            <div className="divider"/>

            {/* Type */}
            <div>
              <p style={home.filterLabel}>Listing Type</p>
              {['All','Featured Only','Verified Sellers'].map(t=>(
                <label key={t} style={{...home.radioLabel,marginBottom:6}}>
                  <input type="checkbox" style={{accentColor:'#002F34'}}/> {t}
                </label>
              ))}
            </div>
          </aside>

          {/* ── LISTINGS ── */}
          <div style={{flex:1,minWidth:0}}>
            {/* Toolbar */}
            <div style={home.toolbar}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button
                  style={{...home.filterToggle,...(showFilter?{background:'#002F34',color:'white'}:{})}}
                  onClick={()=>setShowFilter(f=>!f)}>
                  <Filter size={15}/> Filters {showFilter?'▴':'▾'}
                </button>
                <span style={{fontSize:13,color:'#9CA3AF'}}>
                  <strong style={{color:'#1a1a1a'}}>{filteredListings.length}</strong> results
                  {searchQuery && <> for "<em>{searchQuery}</em>"</>}
                </span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={home.sortSelect}>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="featured">Featured</option>
                </select>
                <div style={{display:'flex',border:'1.5px solid #e5e7eb',borderRadius:8,overflow:'hidden'}}>
                  {[['grid',<Grid3X3 size={15}/>],['list',<List size={15}/>]].map(([m,icon])=>(
                    <button key={m} onClick={()=>setViewMode(m)}
                      style={{padding:'7px 10px',background:viewMode===m?'#002F34':'white',color:viewMode===m?'white':'#9CA3AF',transition:'all .2s',display:'flex',alignItems:'center'}}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Row */}
            {selectedCat==='all' && !searchQuery && (
              <div style={{marginBottom:24}}>
                <div style={home.sectionHead}>
                  <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:1}}>⚡ Featured Listings</span>
                  <Link to="/?sort=featured" style={home.seeAll}>See All <ChevronRight size={14}/></Link>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:14}} className="stagger">
                  {filteredListings.filter(l=>l.featured).slice(0,4).map((l,i)=>(
                    <ListingCard key={l.id} listing={l} index={i}/>
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid/List */}
            {loading ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:14}}>
                {Array(8).fill(0).map((_,i)=><ListingCardSkeleton key={i}/>)}
              </div>
            ) : filteredListings.length===0 ? (
              <div style={home.empty}>
                <div style={{fontSize:72}}>🔍</div>
                <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:26,letterSpacing:1,marginTop:16}}>No Listings Found</h3>
                <p style={{color:'#9CA3AF',marginTop:8,fontSize:15}}>Try changing your filters or search query</p>
                <button className="btn btn-primary" style={{marginTop:24}} onClick={resetFilters}>
                  <RefreshCw size={15}/> Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={viewMode==='grid'
                  ? {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:14}
                  : {display:'flex',flexDirection:'column',gap:12}
                } className="stagger">
                  {paged.map((l,i)=>(
                    <ListingCard key={l.id} listing={l} index={i} compact={viewMode==='list'}/>
                  ))}
                </div>

                {hasMore && (
                  <div style={{textAlign:'center',marginTop:32}}>
                    <button className="btn btn-outline btn-lg" onClick={()=>setPage(p=>p+1)}>
                      Load More Listings <ArrowRight size={16}/>
                    </button>
                    <p style={{color:'#9CA3AF',fontSize:13,marginTop:8}}>
                      Showing {paged.length} of {filteredListings.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div style={home.trustRow}>
          {[
            ['🔒','Safe Payments','100% secure transactions'],
            ['🛡️','Buyer Protection','Verified listings & sellers'],
            ['📞','24/7 Support','Always here to help you'],
            ['✅','Free to List','No hidden charges ever'],
          ].map(([e,t,s])=>(
            <div key={t} style={home.trustCard}>
              <span style={{fontSize:32}}>{e}</span>
              <div>
                <p style={{fontWeight:700,fontSize:14,color:'#1a1a1a'}}>{t}</p>
                <p style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>{s}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SELL CTA ── */}
        <div style={home.cta}>
          <div>
            <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:30,letterSpacing:1,color:'#002F34'}}>
              Have Something to Sell?
            </h3>
            <p style={{color:'#002F34',opacity:.65,fontSize:15,marginTop:4}}>
              Post your ad for FREE and connect with millions of buyers instantly
            </p>
          </div>
          <Link to="/post-ad" className="btn btn-dark btn-lg">
            Post FREE Ad Now <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

const home = {
  hero: {
    background:'linear-gradient(160deg,#002F34 0%,#004d55 55%,#006870 100%)',
    paddingTop:36, paddingBottom:70, position:'relative', overflow:'hidden',
  },
  wave: {
    position:'absolute', bottom:-2, left:0, right:0, height:50,
    background:'#f2f2f2',
    clipPath:'ellipse(60% 100% at 50% 100%)',
  },
  heroLayout: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' },
  heroText: {},
  heroPill: { display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,217,90,.15)',
    color:'#FFD95A', padding:'6px 14px', borderRadius:99, fontSize:12, fontWeight:700,
    letterSpacing:.5, marginBottom:16 },
  heroH1: { fontFamily:'Bebas Neue,sans-serif', fontSize:52, color:'white', letterSpacing:2, lineHeight:1.05 },
  heroSub: { color:'rgba(255,255,255,.65)', fontSize:16, marginTop:10 },
  heroStats: { display:'flex', gap:24, marginTop:20, flexWrap:'wrap' },
  heroStat: { display:'flex', flexDirection:'column' },
  heroStatN: { fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:'#FFD95A', letterSpacing:1 },
  heroStatL: { color:'rgba(255,255,255,.55)', fontSize:11, marginTop:1 },
  heroBanners: { position:'relative', height:220, borderRadius:20, overflow:'hidden' },
  heroBanner: { position:'absolute', inset:0, padding:'28px 24px', display:'flex',
    flexDirection:'column', justifyContent:'flex-start', borderRadius:20 },
  bannerBtn: { marginTop:16, background:'#FFD95A', color:'#002F34', border:'none',
    padding:'9px 18px', borderRadius:8, fontWeight:800, fontSize:13, cursor:'pointer',
    width:'fit-content' },
  catChip: { display:'flex', alignItems:'center', gap:6, padding:'7px 16px',
    borderRadius:99, fontSize:13, fontWeight:600, border:'1.5px solid #e5e7eb',
    background:'white', color:'#374151', cursor:'pointer', transition:'all .2s',
    whiteSpace:'nowrap', flexShrink:0 },
  catChipActive: { background:'#002F34', color:'white', borderColor:'#002F34' },
  layout: { display:'flex', gap:24, alignItems:'flex-start' },
  sidebar: { width:240, boxSizing:'border-box', flexShrink:0, background:'white', borderRadius:16, padding:'20px',
    boxShadow:'0 1px 6px rgba(0,0,0,.07)', position:'sticky', top:120 },
  filterLabel: { fontSize:12, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase',
    letterSpacing:.8, marginBottom:10 },
  radioLabel: { display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#374151',
    cursor:'pointer', padding:'3px 0' },
  priceInputs: { display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:8, marginBottom:10 },
  priceInput: { padding:'8px 10px', minWidth:0, width:'100%', boxSizing:'border-box', fontSize:13 },
  toolbar: { display:'flex', justifyContent:'space-between', alignItems:'center',
    marginBottom:18, flexWrap:'wrap', gap:10 },
  filterToggle: { display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
    border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:13, fontWeight:600,
    cursor:'pointer', transition:'all .2s', background:'white', color:'#374151' },
  sortSelect: { padding:'8px 12px', border:'1.5px solid #e5e7eb', borderRadius:8,
    fontSize:13, color:'#374151', background:'white', cursor:'pointer', outline:'none' },
  sectionHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  seeAll: { display:'flex', alignItems:'center', gap:2, color:'#002F34', fontWeight:700, fontSize:13 },
  filterChip: { padding:'4px 12px', background:'#FFFBEB', color:'#92400E', fontSize:12,
    fontWeight:600, borderRadius:99, border:'1px solid #FDE68A' },
  empty: { textAlign:'center', padding:'80px 20px', background:'white', borderRadius:20,
    boxShadow:'0 1px 6px rgba(0,0,0,.07)' },
  trustRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginTop:36 },
  trustCard: { background:'white', borderRadius:14, padding:'18px', display:'flex',
    alignItems:'center', gap:14, boxShadow:'0 1px 6px rgba(0,0,0,.07)' },
  cta: { background:'linear-gradient(135deg,#FFD95A,#ffc107)', borderRadius:20,
    padding:'32px 36px', marginTop:28, display:'flex', justifyContent:'space-between',
    alignItems:'center', gap:20, flexWrap:'wrap' },
};
