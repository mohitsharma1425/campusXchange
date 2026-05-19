import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Eye, Star, Zap, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

/* Skeleton Loader */
export function ListingCardSkeleton() {
  return (
    <div style={{background:'white',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
      <div className="skeleton" style={{height:180}}/>
      <div style={{padding:14,display:'flex',flexDirection:'column',gap:8}}>
        <div className="skeleton" style={{height:20,width:'60%'}}/>
        <div className="skeleton" style={{height:14,width:'90%'}}/>
        <div className="skeleton" style={{height:12,width:'70%'}}/>
      </div>
    </div>
  );
}

export default function ListingCard({ listing, index=0, compact=false }) {
  const { wishlist, toggleWishlist } = useApp();
  const isWished = wishlist.includes(listing.id);
  const [imgErr, setImgErr]   = useState(false);
  const [heartAnim,setHeart]  = useState(false);

  const handleHeart = (e) => {
    e.preventDefault(); e.stopPropagation();
    setHeart(true);
    setTimeout(()=>setHeart(false),300);
    toggleWishlist(listing.id);
  };

  const priceLabel = listing.price===0
    ? <span style={{color:'#22c55e',fontWeight:800}}>Free / Contact</span>
    : `₹${listing.price.toLocaleString('en-IN')}`;

  return (
    <div
      className="listing-card anim-fadeUp"
      style={{
        ...card.root,
        ...(compact ? {display:'flex',gap:0} : {}),
        animationDelay:`${index*.07}s`,
      }}
    >
      <Link to={`/listing/${listing.id}`} style={{textDecoration:'none',color:'inherit',display:'flex',flexDirection:compact?'row':'column',flex:1}}>
        {/* Image */}
        <div style={{...card.imgWrap,...(compact?{width:140,flexShrink:0}:{height:185})}}>
          <img
            src={imgErr ? 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80' : listing.image}
            alt={listing.title}
            className="card-img"
            style={card.img}
            onError={()=>setImgErr(true)}
            loading="lazy"
          />
          {/* Badges */}
          {listing.featured && (
            <span style={card.featBadge}>⭐ FEATURED</span>
          )}
          {listing.boosted && (
            <span style={card.boostBadge}><Zap size={10}/> BOOST</span>
          )}
          <span style={card.catBadge}>{listing.categoryLabel}</span>
        </div>

        {/* Content */}
        <div style={{...card.content,...(compact?{flex:1}:{})}}>
          <div style={card.price}>
            {listing.price===0
              ? <span style={{color:'#22c55e',fontWeight:800,fontSize:compact?17:20}}>Free / Contact</span>
              : <span style={{fontSize:compact?17:21}}>₹{listing.price.toLocaleString('en-IN')}</span>
            }
            {listing.isPriceNegotiable && listing.price>0 && (
              <span style={card.nego}>Negotiable</span>
            )}
          </div>

          <p style={{...card.title,...(compact?{fontSize:13,WebkitLineClamp:1}:{})}}>{listing.title}</p>

          {!compact && (
            <div style={card.pills}>
              {listing.condition !== 'N/A' && (
                <span style={card.pill}>{listing.condition}</span>
              )}
              {listing.verified && (
                <span style={{...card.pill,background:'#DBEAFE',color:'#1E40AF'}}>
                  <Shield size={10}/> Verified
                </span>
              )}
            </div>
          )}

          <div style={card.footer}>
            <div style={card.location}>
              <MapPin size={11} color="#9CA3AF"/>
              <span>{listing.city}</span>
            </div>
            <div style={card.meta}>
              <Eye size={10} color="#9CA3AF"/>
              <span>{listing.views}</span>
              <span style={{color:'#e5e7eb'}}>•</span>
              <Clock size={10} color="#9CA3AF"/>
              <span>{listing.postedAgo===0?'Today':`${listing.postedAgo}d`}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        style={{
          ...card.heart,
          ...(isWished ? {background:'#FFF1F2'} : {}),
          ...(heartAnim ? {animation:'heartPop .3s ease'} : {}),
        }}
        onClick={handleHeart}
        title={isWished?'Remove from wishlist':'Add to wishlist'}
      >
        <Heart
          size={15}
          fill={isWished?'#ef4444':'none'}
          color={isWished?'#ef4444':'#9CA3AF'}
          style={{transition:'all .2s'}}
        />
      </button>
    </div>
  );
}

const card = {
  root: {
    background:'white', borderRadius:14,
    overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,.07)',
    position:'relative', cursor:'pointer',
  },
  imgWrap: { position:'relative', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  featBadge: {
    position:'absolute', top:10, left:10,
    background:'#FFD95A', color:'#002F34',
    fontSize:10, fontWeight:800, padding:'3px 9px',
    borderRadius:99, letterSpacing:.4,
  },
  boostBadge: {
    position:'absolute', top:10, left:10,
    background:'#7C3AED', color:'white',
    fontSize:10, fontWeight:800, padding:'3px 9px',
    borderRadius:99, display:'flex', alignItems:'center', gap:3,
  },
  catBadge: {
    position:'absolute', bottom:10, right:10,
    background:'rgba(0,0,0,.62)', color:'white',
    fontSize:10, fontWeight:600, padding:'3px 9px',
    borderRadius:99, backdropFilter:'blur(4px)',
  },
  content: { padding:'12px 14px 14px' },
  price: {
    fontFamily:'Bebas Neue,sans-serif', fontSize:21,
    color:'#002F34', display:'flex', alignItems:'baseline', gap:7,
    letterSpacing:.5,
  },
  nego: {
    fontSize:10, fontWeight:700, padding:'2px 7px',
    background:'#DCFCE7', color:'#166534', borderRadius:99,
  },
  title: {
    fontSize:13, color:'#374151', marginTop:4, fontWeight:500,
    display:'-webkit-box', WebkitLineClamp:2,
    WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.45,
  },
  pills: { display:'flex', flexWrap:'wrap', gap:5, marginTop:8 },
  pill: {
    display:'inline-flex', alignItems:'center', gap:3,
    fontSize:10, fontWeight:600, padding:'2px 8px',
    background:'#F3F4F6', color:'#4B5563', borderRadius:99,
  },
  footer: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 },
  location: { display:'flex', alignItems:'center', gap:3, color:'#9CA3AF', fontSize:11.5 },
  meta: { display:'flex', alignItems:'center', gap:3, color:'#9CA3AF', fontSize:10.5 },
  heart: {
    position:'absolute', top:10, right:10,
    background:'rgba(255,255,255,.92)', border:'none',
    borderRadius:'50%', width:32, height:32,
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.14)',
    backdropFilter:'blur(4px)', transition:'background .2s',
  },
};
