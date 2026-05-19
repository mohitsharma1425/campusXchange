import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, Share2, Flag, ChevronLeft, Phone,
  MessageCircle, Shield, CheckCircle, Eye, Clock, Tag,
  Star, Zap, ChevronRight, ChevronDown, Send, X,
  AlertTriangle, ExternalLink, Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../lib/api';
import ListingCard from '../components/ListingCard';

export default function ProductDetail() {
  const { id } = useParams();
  const {
    wishlist,
    toggleWishlist,
    user,
    listings,
    conversations,
    startConversation,
    replyToConversation,
    showToast,
    addRecentlyViewed,
  } = useApp();
  const navigate = useNavigate();

  const [activeImg, setActiveImg]   = useState(0);
  const [showPhone, setShowPhone]   = useState(false);
  const [chatOpen, setChatOpen]     = useState(false);
  const [msgText, setMsgText]       = useState('Hi, is this still available?');
  const [reportOpen, setReportOpen] = useState(false);
  const [offerOpen, setOfferOpen]   = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [shareOpen, setShareOpen]   = useState(false);
  const [tab, setTab]               = useState('desc'); // desc | seller | safety
  const [detailListing, setDetailListing] = useState(null);

  const listing = detailListing || listings.find(l=>l.id===id);

  useEffect(()=>{ if(listing) addRecentlyViewed(listing); },[listing]);

  useEffect(() => {
    let ignore = false;

    const loadListingDetail = async () => {
      try {
        const response = await fetch(apiUrl(`/listings/${id}`));
        if (!response.ok) return;

        const data = await response.json();
        if (!ignore) {
          setDetailListing({ ...data, id: data._id });
        }
      } catch (error) {
        console.error('Error loading listing detail:', error);
      }
    };

    loadListingDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  if(!listing) return (
    <div style={{textAlign:'center',padding:'100px 20px'}}>
      <div style={{fontSize:72}}>😕</div>
      <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,marginTop:16,letterSpacing:1}}>Listing Not Found</h2>
      <p style={{color:'#9CA3AF',marginTop:8}}>This ad may have been removed or expired</p>
      <Link to="/" className="btn btn-dark" style={{marginTop:24,display:'inline-flex'}}>← Back to Home</Link>
    </div>
  );

  const isWished  = wishlist.includes(listing.id);
  const images    = listing.images?.length ? listing.images : [listing.image];
  const related   = listings.filter(l=>l.categoryId===listing.categoryId&&l.id!==listing.id).slice(0,6);
  const sellerPhone = String(listing.seller?.phone || listing.sellerPhone || '').trim();
  const sellerId = String(listing.seller?._id || listing.seller || '');
  const isOwnListing = user && sellerId === String(user.id);
  const listingConversation = conversations.find(c => String(c.listing?._id || c.listing) === String(listing.id));
  const chatMsgs = listingConversation?.messages || [];

  const handleSend = async () => {
    if(!msgText.trim()) return;
    if(!user) { navigate('/login'); return; }
    if(isOwnListing) {
      showToast('Buyers will message you from their accounts', 'info');
      navigate('/messages');
      return;
    }

    try {
      if (listingConversation) {
        await replyToConversation(listingConversation._id, msgText);
      } else {
        await startConversation(listing.id, msgText);
      }
      setMsgText('');
    } catch (error) {
      console.error('Message error:', error);
    }
  };

  const handleOffer = () => {
    if(!user){ navigate('/login'); return; }
    if(!offerPrice) return;
    showToast(`Offer of ₹${Number(offerPrice).toLocaleString()} sent to seller!`,'success');
    setOfferOpen(false);
  };

  const handleShare = (method) => {
    showToast(`Shared via ${method}!`,'success');
    setShareOpen(false);
  };

  const handlePhone = () => {
    if(!user){ navigate('/login'); return; }
    if(!sellerPhone) {
      showToast('Seller has not added a phone number yet', 'info');
      return;
    }
    setShowPhone(true);
  };

  const handleWhatsapp = () => {
    if(!user){ navigate('/login'); return; }
    if(!sellerPhone) {
      showToast('Seller has not added a phone number yet', 'info');
      return;
    }

    const digits = sellerPhone.replace(/\D/g, '');
    const phoneWithCountryCode = digits.length === 10 ? `91${digits}` : digits;
    const message = encodeURIComponent(`Hi, I am interested in your CampusXchange listing: ${listing.title}`);
    window.open(`https://wa.me/${phoneWithCountryCode}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{background:'#f2f2f2',minHeight:'100vh'}}>
      <div className="container" style={{paddingTop:20,paddingBottom:48}}>

        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <button onClick={()=>navigate(-1)}
            style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',background:'white',borderRadius:8,fontSize:13,fontWeight:600,color:'#374151',boxShadow:'0 1px 4px rgba(0,0,0,.07)'}}>
            <ChevronLeft size={15}/> Back
          </button>
          <span style={{color:'#9CA3AF',fontSize:13}}>
            Home / {listing.categoryLabel} / {listing.title.slice(0,35)}...
          </span>
        </div>

        <div style={det.layout}>
          {/* ── LEFT ── */}
          <div style={{display:'flex',flexDirection:'column',gap:16,minWidth:0}}>

            {/* Image Gallery */}
            <div style={det.galleryCard}>
              <div style={det.mainImgWrap}>
                <img
                  src={images[activeImg]||listing.image}
                  alt={listing.title}
                  style={det.mainImg}
                  onError={e=>{e.target.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80';}}
                />
                {listing.featured && <span style={det.featBadge}>⭐ FEATURED</span>}
                {listing.boosted  && <span style={det.boostBadge}><Zap size={11}/> BOOSTED</span>}

                {/* Image nav arrows */}
                {images.length>1 && (
                  <>
                    <button style={{...det.imgArrow,left:12}} onClick={()=>setActiveImg(i=>(i-1+images.length)%images.length)}>
                      <ChevronLeft size={18}/>
                    </button>
                    <button style={{...det.imgArrow,right:12}} onClick={()=>setActiveImg(i=>(i+1)%images.length)}>
                      <ChevronRight size={18}/>
                    </button>
                  </>
                )}

                {/* Top-right actions */}
                <div style={{position:'absolute',top:14,right:14,display:'flex',gap:8}}>
                  <button style={det.imgActionBtn} onClick={()=>toggleWishlist(listing.id)} title="Wishlist">
                    <Heart size={17} fill={isWished?'#ef4444':'none'} color={isWished?'#ef4444':'#374151'}/>
                  </button>
                  <button style={det.imgActionBtn} onClick={()=>setShareOpen(true)} title="Share">
                    <Share2 size={17} color="#374151"/>
                  </button>
                </div>

                {/* Image count */}
                {images.length>1 && (
                  <span style={{position:'absolute',bottom:14,left:14,background:'rgba(0,0,0,.6)',color:'white',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:99}}>
                    {activeImg+1}/{images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length>1 && (
                <div style={{display:'flex',gap:8,padding:'10px 14px'}}>
                  {images.map((img,i)=>(
                    <button key={i} onClick={()=>setActiveImg(i)}
                      style={{width:70,height:54,borderRadius:8,overflow:'hidden',border:`2px solid ${i===activeImg?'#FFD95A':'transparent'}`,flexShrink:0,cursor:'pointer'}}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Card */}
            <div className="card" style={{padding:24}}>
              {/* Price + title */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
                <div>
                  <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:34,color:'#002F34',letterSpacing:1}}>
                    {listing.price===0 ? 'Free / Contact' : `₹${listing.price.toLocaleString('en-IN')}`}
                    {listing.isPriceNegotiable && listing.price>0 && (
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 10px',background:'#DCFCE7',color:'#166534',borderRadius:99,marginLeft:12,fontFamily:'Plus Jakarta Sans,sans-serif'}}>Negotiable</span>
                    )}
                  </div>
                  <h1 style={{fontSize:20,fontWeight:700,color:'#1a1a1a',marginTop:6,lineHeight:1.3}}>{listing.title}</h1>
                </div>
                {listing.isPriceNegotiable && listing.price>0 && (
                  <button className="btn btn-outline btn-sm" onClick={()=>{ if(!user){navigate('/login');return;} setOfferOpen(true); }}>
                    Make Offer
                  </button>
                )}
              </div>

              {/* Tags row */}
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:14}}>
                {listing.condition!=='N/A' && (
                  <span className="badge badge-green"><Tag size={11}/>{listing.condition}</span>
                )}
                <span className="badge badge-gray"><Eye size={11}/>{listing.views} views</span>
                <span className="badge badge-gray"><Clock size={11}/>
                  {listing.postedAgo===0?'Today':listing.postedAgo===1?'Yesterday':`${listing.postedAgo} days ago`}
                </span>
                <span className="badge badge-gray"><MapPin size={11}/>{listing.city}</span>
                {listing.verified && <span className="badge badge-blue"><Shield size={11}/>Verified</span>}
                {listing.featured && <span className="badge badge-yellow"><Star size={11}/>Featured</span>}
              </div>

              {/* Tabs */}
              <div style={{marginTop:22}}>
                <div style={{display:'flex',gap:0,borderBottom:'2px solid #f0f0f0',marginBottom:18}}>
                  {[['desc','Description'],['details','Details'],['safety','Safety Tips']].map(([k,l])=>(
                    <button key={k} onClick={()=>setTab(k)}
                      style={{padding:'10px 18px',fontWeight:600,fontSize:14,
                        color:tab===k?'#002F34':'#9CA3AF',
                        borderBottom:tab===k?'2px solid #002F34':'2px solid transparent',
                        marginBottom:-2,transition:'all .2s',background:'none'}}>
                      {l}
                    </button>
                  ))}
                </div>

                {tab==='desc' && (
                  <p style={{fontSize:14,color:'#4B5563',lineHeight:1.8}}>{listing.description}</p>
                )}
                {tab==='details' && (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    {[
                      ['Category',listing.categoryLabel],
                      ['Sub-type',listing.sub||'—'],
                      ['Condition',listing.condition],
                      ['Location',listing.location],
                      ['Posted',listing.postedAgo===0?'Today':`${listing.postedAgo}d ago`],
                      ['Views',listing.views],
                      ['Ad ID',`#${listing.id}`],
                      ['Verified',listing.verified?'Yes':'No'],
                    ].map(([k,v])=>(
                      <div key={k} style={{background:'#f9fafb',borderRadius:10,padding:'12px 14px'}}>
                        <p style={{fontSize:11,color:'#9CA3AF',fontWeight:700,textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>{k}</p>
                        <p style={{fontSize:14,color:'#1a1a1a',fontWeight:600}}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {tab==='safety' && (
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {[
                      ['✅','Meet in safe public places like malls or police stations'],
                      ['💰','Never pay in advance or transfer money without seeing the item'],
                      ['🔍','Inspect the item thoroughly before buying'],
                      ['📋','Check the seller\'s verification status and reviews'],
                      ['🚫','Beware of deals that seem too good to be true'],
                      ['📞','Use in-app chat rather than sharing personal details'],
                    ].map(([e,t])=>(
                      <div key={t} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 14px',background:'#f9fafb',borderRadius:10}}>
                        <span style={{fontSize:18,flexShrink:0}}>{e}</span>
                        <p style={{fontSize:13,color:'#4B5563',lineHeight:1.5}}>{t}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Related Listings */}
            {related.length>0 && (
              <div>
                <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:1,marginBottom:14}}>
                  Similar Listings
                </h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}} className="stagger">
                  {related.map((l,i)=><ListingCard key={l.id} listing={l} index={i}/>)}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div style={{width:316,flexShrink:0,display:'flex',flexDirection:'column',gap:14,position:'sticky',top:130,alignSelf:'flex-start'}}>

            {/* Price + Contact */}
            <div className="card" style={{padding:22}}>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,color:'#002F34',letterSpacing:1}}>
                {listing.price===0?'Free / Contact':`₹${listing.price.toLocaleString('en-IN')}`}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,color:'#6B7280',fontSize:13,marginTop:6,marginBottom:18}}>
                <MapPin size={14} color='#22c55e'/>{listing.location}
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <button className="btn btn-dark btn-full btn-lg" onClick={handlePhone}>
                  <Phone size={16}/>
                  {showPhone ? sellerPhone : 'Show Phone Number'}
                </button>
                <button className="btn btn-full btn-lg" style={{background:'#25D366',color:'white'}}
                  onClick={handleWhatsapp}>
                  💬 Open WhatsApp
                </button>
                <button className="btn btn-outline btn-full" onClick={()=>{ if(!user){navigate('/login');return;} setChatOpen(o=>!o); }}>
                  <MessageCircle size={16}/> Message in App
                </button>
                {listing.isPriceNegotiable && listing.price>0 && (
                  <button className="btn btn-full" style={{background:'#FFFBEB',color:'#92400E',border:'1px solid #FDE68A'}}
                    onClick={()=>{ if(!user){navigate('/login');return;} setOfferOpen(true); }}>
                    💰 Make an Offer
                  </button>
                )}
              </div>

              {/* In-app chat */}
              {chatOpen && user && (
                <div style={{marginTop:16,borderTop:'1px solid #f0f0f0',paddingTop:14}}>
                  <div style={{maxHeight:160,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,marginBottom:10}}>
                    {chatMsgs.length===0 && (
                      <div style={{textAlign:'center',color:'#9CA3AF',fontSize:12,padding:'12px 0'}}>
                        {isOwnListing ? 'Buyer conversations appear on the Messages page.' : 'Start a private buyer-seller conversation.'}
                      </div>
                    )}
                    {chatMsgs.map((m,i)=>(
                      <div key={i} style={{
                        alignSelf:String(m.sender)===String(user.id)?'flex-end':'flex-start',
                        background:String(m.sender)===String(user.id)?'#002F34':'#f3f4f6',
                        color:String(m.sender)===String(user.id)?'white':'#1a1a1a',
                        padding:'8px 12px',borderRadius:12,fontSize:12,maxWidth:'85%',
                      }}>
                        <p>{m.text}</p>
                        <p style={{fontSize:10,opacity:.6,marginTop:3,textAlign:'right'}}>
                          {new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <input value={msgText} onChange={e=>setMsgText(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&handleSend()}
                      placeholder={isOwnListing ? 'Open Messages to reply to buyers' : 'Type a message...'}
                      disabled={isOwnListing}
                      className="form-input" style={{flex:1,padding:'9px 12px',fontSize:13}}/>
                    <button onClick={handleSend} style={{padding:'9px 12px',background:'#002F34',color:'white',borderRadius:8,border:'none',cursor:'pointer',display:'flex',alignItems:'center'}}>
                      <Send size={15}/>
                    </button>
                  </div>
                  {/* Quick replies */}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                    {['Is it available?','What\'s the lowest price?','Can I visit today?'].map(q=>(
                      <button key={q} onClick={()=>setMsgText(q)}
                        style={{fontSize:11,padding:'4px 10px',background:'#f3f4f6',borderRadius:99,color:'#374151',border:'none',cursor:'pointer'}}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Card */}
            <div className="card" style={{padding:20}}>
              <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.8,marginBottom:14}}>
                Seller Information
              </p>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div className="avatar avatar-md">{listing.seller?.name?.charAt(0) || 'S'}</div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:15,color:'#1a1a1a'}}>{listing.seller?.name || 'Unknown Seller'}</p>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                    {listing.seller?.isVerified && <><CheckCircle size={12} color="#22c55e"/><span style={{fontSize:11,color:'#22c55e',fontWeight:600}}>Verified</span></>}
                  </div>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'#f9fafb',borderRadius:10,overflow:'hidden',marginTop:14}}>
                {[
                  ['3','Ads'],
                  ['4.8★','Rating'],
                  ['2 years','Member'],
                ].map(([v,l])=>(
                  <div key={l} style={{textAlign:'center',padding:'10px 4px',borderRight:'1px solid #e5e7eb'}}>
                    <p style={{fontWeight:800,fontSize:15,color:'#1a1a1a'}}>{v}</p>
                    <p style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Star rating visual */}
              <div style={{display:'flex',alignItems:'center',gap:4,marginTop:12}}>
                {[1,2,3,4,5].map(s=>(
                  <Star key={s} size={14}
                    fill={s<=5?'#FFD95A':'none'}
                    color={s<=5?'#FFD95A':'#d1d5db'}/>
                ))}
                <span style={{fontSize:12,color:'#6B7280',marginLeft:4}}>4.8/5</span>
              </div>

              <button className="btn btn-ghost btn-full" style={{marginTop:12,fontSize:13,border:'1px solid #e5e7eb',borderRadius:8}}>
                View All Seller Ads →
              </button>
            </div>

            {/* Safety Notice */}
            <div style={{background:'#EFF6FF',borderRadius:14,padding:16,display:'flex',gap:10,border:'1px solid #BFDBFE'}}>
              <Shield size={18} color="#3B82F6" style={{flexShrink:0,marginTop:2}}/>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:'#1E40AF'}}>Safety Reminder</p>
                <p style={{fontSize:12,color:'#3B82F6',lineHeight:1.5,marginTop:3}}>
                  Never pay without inspecting the item. Meet in a safe public place.
                </p>
              </div>
            </div>

            {/* Report */}
            <button style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,color:'#9CA3AF',fontSize:12,padding:'8px',cursor:'pointer',background:'none',border:'none'}}
              onClick={()=>setReportOpen(true)}>
              <Flag size={13}/> Report this Ad
            </button>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* Offer Modal */}
      {offerOpen && (
        <div className="modal-overlay" onClick={()=>setOfferOpen(false)}>
          <div className="modal" style={{maxWidth:380,padding:28}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:1}}>Make an Offer</h3>
              <button onClick={()=>setOfferOpen(false)}><X size={20}/></button>
            </div>
            <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>
              Seller's price: <strong>₹{listing.price.toLocaleString()}</strong>
            </p>
            <div className="form-field">
              <label className="form-label">Your Offer Price (₹)</label>
              <input type="number" placeholder="Enter your offer" value={offerPrice}
                onChange={e=>setOfferPrice(e.target.value)} className="form-input"/>
            </div>
            <div style={{display:'flex',gap:10,marginTop:20}}>
              <button className="btn btn-ghost btn-full" style={{border:'1px solid #e5e7eb'}} onClick={()=>setOfferOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-full" onClick={handleOffer}>Send Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="modal-overlay" onClick={()=>setReportOpen(false)}>
          <div className="modal" style={{maxWidth:400,padding:28}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:1,color:'#ef4444'}}>Report Ad</h3>
              <button onClick={()=>setReportOpen(false)}><X size={20}/></button>
            </div>
            <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>Why are you reporting this ad?</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {['Scam/Fraud','Misleading info','Wrong category','Spam','Offensive content','Other'].map(r=>(
                <label key={r} style={{display:'flex',alignItems:'center',gap:10,padding:'10px',background:'#f9fafb',borderRadius:8,cursor:'pointer'}}>
                  <input type="radio" name="report" style={{accentColor:'#ef4444'}}/> {r}
                </label>
              ))}
            </div>
            <button className="btn btn-danger btn-full" style={{marginTop:20}}
              onClick={()=>{ showToast('Report submitted. We\'ll review it shortly.','info'); setReportOpen(false); }}>
              Submit Report
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <div className="modal-overlay" onClick={()=>setShareOpen(false)}>
          <div className="modal" style={{maxWidth:360,padding:28}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:1}}>Share Listing</h3>
              <button onClick={()=>setShareOpen(false)}><X size={20}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
              {[['WhatsApp','💬'],['Facebook','📘'],['Twitter','🐦'],['Telegram','✈️'],['Email','📧'],['Copy Link','🔗']].map(([n,e])=>(
                <button key={n} onClick={()=>handleShare(n)}
                  style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'14px 8px',background:'#f9fafb',borderRadius:10,border:'1px solid #e5e7eb',cursor:'pointer',transition:'all .2s'}}>
                  <span style={{fontSize:24}}>{e}</span>
                  <span style={{fontSize:11,fontWeight:600,color:'#374151'}}>{n}</span>
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:8,background:'#f9fafb',borderRadius:8,padding:'10px 12px',alignItems:'center'}}>
              <span style={{fontSize:12,color:'#6B7280',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                https://campusxchange.in/listing/{listing.id}
              </span>
              <button onClick={()=>{ showToast('Link copied!','success'); setShareOpen(false); }}
                style={{display:'flex',alignItems:'center',gap:4,padding:'5px 10px',background:'#002F34',color:'white',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',border:'none',flexShrink:0}}>
                <Copy size={12}/> Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const det = {
  layout: { display:'grid', gridTemplateColumns:'1fr 316px', gap:20, alignItems:'flex-start' },
  galleryCard: { background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,.07)' },
  mainImgWrap: { position:'relative', height:400, overflow:'hidden' },
  mainImg: { width:'100%', height:'100%', objectFit:'cover' },
  featBadge: { position:'absolute', top:14, left:14, background:'#FFD95A', color:'#002F34', fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:99 },
  boostBadge: { position:'absolute', top:14, left:14, background:'#7C3AED', color:'white', fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:99, display:'flex', alignItems:'center', gap:4 },
  imgArrow: { position:'absolute', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.88)', border:'none', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,.15)', backdropFilter:'blur(4px)' },
  imgActionBtn: { background:'rgba(255,255,255,.9)', border:'none', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,.12)', backdropFilter:'blur(4px)', transition:'all .2s' },
};
