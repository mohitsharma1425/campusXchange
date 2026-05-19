import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Upload, X, MapPin, Check, ChevronRight,
  Info, Star, Zap, ArrowRight, Tag, DollarSign,
  FileText, CheckCircle, Eye, Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const STEPS = [
  { label:'Category',  icon:<Tag size={16}/> },
  { label:'Details',   icon:<FileText size={16}/> },
  { label:'Photos',    icon:<Camera size={16}/> },
  { label:'Review',    icon:<Eye size={16}/> },
];

export default function PostAd() {
  const { user, postAd, showToast, categories } = useApp();
  const navigate = useNavigate();
  const [step,     setStep]    = useState(0);
  const [done,     setDone]    = useState(false);
  const [postedAd, setPosted]  = useState(null);
  const [dragging, setDragging]= useState(false);
  const [images,   setImages]  = useState([]);
  const [form,     setForm]    = useState({
    categoryId:'', subCategory:'', title:'', description:'',
    price:'', isPriceNegotiable:false, condition:'Good',
    city:'', location:'', phone:'', boost:false,
  });
  const [errors, setErrors] = useState({});

  const up = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e={};
    if(step===0 && !form.categoryId) e.categoryId='Select a category';
    if(step===1){
      if(!form.title.trim() || form.title.length<10) e.title='Title must be at least 10 characters';
      if(!form.description.trim() || form.description.length<20) e.description='Description must be at least 20 characters';
      if(!form.city) e.city='Select your city';
    }
    return e;
  };

  const handleNext = () => {
    const e=validate();
    if(Object.keys(e).length){ setErrors(e); return; }
    setErrors({});
    if(step<STEPS.length-1) setStep(s=>s+1);
    else {
      // Prepare data matching backend schema
      const adData = {
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        categoryId: form.categoryId,
        city: form.city,
        location: form.location || `${form.city}, India`,
        condition: form.condition,
        image: images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
        images: images.length ? images : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'],
      };
      
      // Add optional fields only if they have values
      if (form.subCategory) adData.subCategory = form.subCategory;
      if (form.phone) adData.phone = form.phone;
      if (form.isPriceNegotiable) adData.isPriceNegotiable = form.isPriceNegotiable;
      if (form.boost) {
        adData.featured = true;
        adData.boosted = true;
      }
      
      console.log('Posting ad with data:', adData); // Debug log
      
      postAd(adData).then(ad => {
        setPosted(ad);
        setDone(true);
      }).catch(err => {
        console.error('Post ad error:', err);
        showToast(err.message || 'Failed to post ad', 'error');
      });
    }
  };

  // Drag & Drop image
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    files.slice(0,8-images.length).forEach(f=>{
      const r=new FileReader();
      r.onload=ev=>setImages(p=>[...p,ev.target.result].slice(0,8));
      r.readAsDataURL(f);
    });
  },[images]);

  const selectedCat = categories.find(c=>c.id===form.categoryId);

  if(!user) return (
    <div style={{textAlign:'center',padding:'90px 20px'}}>
      <div style={{fontSize:72}}>🔐</div>
      <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:1,marginTop:16}}>Login to Post on CampusXchange</h2>
      <p style={{color:'#9CA3AF',marginTop:8,fontSize:15}}>You need a CampusXchange account to post campus items</p>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:24}}>
        <Link to="/login" className="btn btn-dark btn-lg">Login</Link>
        <Link to="/register" className="btn btn-primary btn-lg">Register Free</Link>
      </div>
    </div>
  );

  if(done) return (
    <div style={{textAlign:'center',padding:'80px 20px',maxWidth:480,margin:'0 auto'}}>
      <div style={{width:88,height:88,borderRadius:'50%',background:'#DCFCE7',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',fontSize:40}}>
        🎉
      </div>
      <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:34,letterSpacing:1,marginTop:20,color:'#002F34'}}>
        Ad Posted Successfully!
      </h2>
      <p style={{color:'#6B7280',marginTop:8,fontSize:15,lineHeight:1.6}}>
        Your ad is now live and visible to millions of buyers across India
      </p>
      {postedAd && (
        <div style={{marginTop:24,background:'white',borderRadius:16,padding:20,boxShadow:'0 4px 20px rgba(0,0,0,.08)',textAlign:'left'}}>
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            <div style={{width:64,height:64,borderRadius:10,overflow:'hidden',flexShrink:0,background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>
              {images[0] ? <img src={images[0]} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/> : '📦'}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:15,color:'#1a1a1a'}}>{form.title}</p>
              <p style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,color:'#002F34',marginTop:2,letterSpacing:.5}}>
                {form.price?`₹${Number(form.price).toLocaleString()}`:'Free'}
              </p>
            </div>
          </div>
        </div>
      )}
      <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:28,flexWrap:'wrap'}}>
        <Link to="/" className="btn btn-dark btn-lg">View All Listings</Link>
        <button className="btn btn-primary btn-lg" onClick={()=>{setDone(false);setStep(0);setImages([]);setForm({categoryId:'',subCategory:'',title:'',description:'',price:'',isPriceNegotiable:false,condition:'Good',city:'',location:'',phone:'',boost:false});}}>
          Post Another Ad
        </button>
      </div>
    </div>
  );

  return (
    <div style={{background:'#f2f2f2',minHeight:'calc(100vh - 108px)',paddingBottom:60}}>
      <div className="container" style={{paddingTop:24,maxWidth:800}}>

        {/* Header */}
        <div style={{marginBottom:24}}>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:1,color:'#002F34'}}>
            Post Your Ad — It's FREE!
          </h1>
          <p style={{color:'#9CA3AF',fontSize:14,marginTop:4}}>Reach millions of buyers across India</p>
        </div>

        {/* Stepper */}
        <div style={{display:'flex',alignItems:'center',marginBottom:28,gap:0}}>
          {STEPS.map((s,i)=>(
            <React.Fragment key={s.label}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flexShrink:0}}>
                <div className={`step-circle ${i<step?'done':i===step?'active':''}`}>
                  {i<step?<Check size={15} strokeWidth={2.5}/>:i===step?s.icon:i+1}
                </div>
                <span style={{fontSize:11,fontWeight:600,color:i<=step?'#002F34':'#9CA3AF',whiteSpace:'nowrap'}}>{s.label}</span>
              </div>
              {i<STEPS.length-1 && <div className={`step-line ${i<step?'done':''}`} style={{margin:'0 8px',marginBottom:20}}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Step Cards */}
        <div className="card anim-fadeIn" style={{padding:28,marginBottom:16}}>

          {/* ── STEP 0: Category ── */}
          {step===0 && (
            <div>
              <h2 style={pad.stepTitle}>What are you selling?</h2>
              <p style={pad.stepSub}>Choose the most relevant category for your item</p>
              {errors.categoryId && <p className="form-error" style={{marginBottom:14}}>{errors.categoryId}</p>}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}}>
                {categories.map(cat=>(
                  <button key={cat.id} type="button"
                    style={{...pad.catBtn,...(form.categoryId===cat.id?pad.catBtnActive:{})}}
                    onClick={()=>{ up('categoryId',cat.id); up('subCategory',''); }}>
                    {form.categoryId===cat.id && <div style={pad.catCheck}><Check size={13} strokeWidth={2.5}/></div>}
                    <span style={{fontSize:30}}>{cat.icon}</span>
                    <span style={{fontSize:12,fontWeight:700,color:form.categoryId===cat.id?'#002F34':'#374151',textAlign:'center'}}>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-category */}
              {selectedCat && (
                <div style={{marginTop:20}}>
                  <p style={pad.filterLabel}>Sub-Category</p>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {selectedCat.sub.map(s=>(
                      <button key={s} type="button"
                        style={{...pad.subBtn,...(form.subCategory===s?pad.subBtnActive:{})}}
                        onClick={()=>up('subCategory',s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: Details ── */}
          {step===1 && (
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              <h2 style={pad.stepTitle}>Ad Details</h2>
              <p style={pad.stepSub}>Fill in the details to attract the right buyers</p>

              <div className="form-field">
                <label className="form-label">Ad Title * <span style={{color:'#9CA3AF',fontWeight:400}}>(Be specific)</span></label>
                <input type="text" placeholder="e.g. iPhone 15 Pro Max 256GB Space Black - Excellent Condition"
                  value={form.title} onChange={e=>up('title',e.target.value)}
                  className={`form-input ${errors.title?'error':''}`} maxLength={70}/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  {errors.title?<span className="form-error">{errors.title}</span>:<span/>}
                  <span style={{fontSize:11,color:'#9CA3AF'}}>{form.title.length}/70</span>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="form-field">
                  <label className="form-label">Price (₹)</label>
                  <div style={{position:'relative'}}>
                    <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',fontWeight:700}}>₹</span>
                    <input type="number" placeholder="0" value={form.price} onChange={e=>up('price',e.target.value)}
                      className="form-input" style={{paddingLeft:28}}/>
                  </div>
                  <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#374151',cursor:'pointer',marginTop:6}}>
                    <label className="toggle" style={{flexShrink:0}}>
                      <input type="checkbox" checked={form.isPriceNegotiable} onChange={e=>up('isPriceNegotiable',e.target.checked)}/>
                      <span className="toggle-slider"/>
                    </label>
                    Price is Negotiable
                  </label>
                </div>

                <div className="form-field">
                  <label className="form-label">Condition *</label>
                  <select value={form.condition} onChange={e=>up('condition',e.target.value)} className="form-input">
                    {['Like New','Excellent','Good','Fair','For Parts'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="form-field">
                  <label className="form-label">City *</label>
                  <select value={form.city} onChange={e=>{ up('city',e.target.value); up('location',e.target.value+', India'); }}
                    className={`form-input ${errors.city?'error':''}`}>
                    <option value="">Select City</option>
                    {['Chandigarh','Baddi','Rajpura','Solan'].map(c=><option key={c}>{c}</option>)}
                  </select>
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-field">
                  <label className="form-label">Phone (for buyers)</label>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e=>up('phone',e.target.value)} className="form-input"/>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Description * <span style={{color:'#9CA3AF',fontWeight:400}}>(Mention brand, model, age, defects)</span></label>
                <textarea rows={5} placeholder="Describe your item in detail..."
                  value={form.description} onChange={e=>up('description',e.target.value)}
                  className={`form-input ${errors.description?'error':''}`} style={{resize:'vertical',minHeight:120}}
                  maxLength={4096}/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  {errors.description?<span className="form-error">{errors.description}</span>:<span/>}
                  <span style={{fontSize:11,color:'#9CA3AF'}}>{form.description.length}/4096</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Photos ── */}
          {step===2 && (
            <div>
              <h2 style={pad.stepTitle}>Add Photos</h2>
              <p style={pad.stepSub}>Ads with photos get <strong>10x</strong> more responses. First photo = cover image.</p>

              {/* Drop zone */}
              <div
                onDragOver={e=>{e.preventDefault();setDragging(true);}}
                onDragLeave={()=>setDragging(false)}
                onDrop={onDrop}
                style={{...pad.dropzone,...(dragging?{borderColor:'#002F34',background:'#FFFBEB'}:{})}}>
                <input type="file" accept="image/*" multiple onChange={onDrop} style={{display:'none'}} id="img-input"/>
                <Camera size={40} color={dragging?'#002F34':'#9CA3AF'}/>
                <p style={{fontWeight:700,fontSize:15,color:dragging?'#002F34':'#374151',marginTop:12}}>
                  {dragging?'Drop here!':'Click or drag to upload photos'}
                </p>
                <p style={{fontSize:13,color:'#9CA3AF',marginTop:4}}>PNG, JPG up to 5MB · Max 8 photos</p>
                <label htmlFor="img-input" className="btn btn-outline" style={{marginTop:16,cursor:'pointer'}}>
                  <Upload size={15}/> Browse Files
                </label>
              </div>

              {/* Preview grid */}
              {images.length>0 && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:16}}>
                  {images.map((img,i)=>(
                    <div key={i} style={{position:'relative',height:100,borderRadius:10,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.1)'}}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      {i===0 && (
                        <span style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(0,0,0,.65)',color:'white',fontSize:10,fontWeight:700,textAlign:'center',padding:4}}>
                          COVER
                        </span>
                      )}
                      <button onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))}
                        style={{position:'absolute',top:5,right:5,background:'rgba(0,0,0,.65)',border:'none',borderRadius:'50%',width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
                        <X size={12}/>
                      </button>
                    </div>
                  ))}
                  {images.length<8 && (
                    <label htmlFor="img-input" style={{height:100,borderRadius:10,border:'2px dashed #e5e7eb',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',gap:6,background:'#f9fafb'}}>
                      <Upload size={18} color="#9CA3AF"/>
                      <span style={{fontSize:11,color:'#9CA3AF'}}>Add More</span>
                    </label>
                  )}
                </div>
              )}

              {/* Tips */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:16}}>
                {['Take photos in good lighting','Show all sides of the item','Capture any defects clearly','Include accessories/box'].map(tip=>(
                  <div key={tip} style={{display:'flex',gap:8,alignItems:'center',padding:'8px 10px',background:'#f9fafb',borderRadius:8}}>
                    <Info size={13} color='#3B82F6' style={{flexShrink:0}}/>
                    <span style={{fontSize:12,color:'#6B7280'}}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Review ── */}
          {step===3 && (
            <div>
              <h2 style={pad.stepTitle}>Review & Post</h2>
              <p style={pad.stepSub}>Check everything before going live</p>

              {/* Preview card */}
              <div style={{border:'2px solid #e5e7eb',borderRadius:16,overflow:'hidden',marginBottom:24}}>
                {images[0] && <img src={images[0]} alt="" style={{width:'100%',height:220,objectFit:'cover'}}/>}
                <div style={{padding:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:10}}>
                    <div>
                      <span style={{fontSize:10,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:.8}}>
                        {selectedCat?.label} {form.subCategory&&`· ${form.subCategory}`}
                      </span>
                      <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:.5,marginTop:4,color:'#1a1a1a'}}>{form.title||'Untitled Ad'}</h3>
                    </div>
                    <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:26,color:'#002F34',letterSpacing:1}}>
                      {form.price?`₹${Number(form.price).toLocaleString()}`:'Free / Contact'}
                    </div>
                  </div>
                  <p style={{fontSize:13,color:'#6B7280',marginTop:10,lineHeight:1.6}}>{form.description.slice(0,150)}{form.description.length>150?'...':''}</p>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
                    {form.condition&&<span className="badge badge-green">{form.condition}</span>}
                    {form.city&&<span className="badge badge-gray"><MapPin size={10}/>{form.city}</span>}
                    {form.isPriceNegotiable&&<span className="badge badge-yellow">Negotiable</span>}
                  </div>
                </div>
              </div>

              {/* Summary table */}
              <div style={{borderRadius:12,overflow:'hidden',border:'1px solid #e5e7eb',marginBottom:20}}>
                {[
                  ['Category',`${selectedCat?.icon||''} ${selectedCat?.label||'—'}`],
                  ['Sub-type', form.subCategory||'—'],
                  ['Price',    form.price?`₹${Number(form.price).toLocaleString()}`:'Free'],
                  ['Negotiable',form.isPriceNegotiable?'Yes':'No'],
                  ['Condition',form.condition],
                  ['City',     form.city||'—'],
                  ['Photos',   `${images.length} uploaded`],
                ].map(([k,v],i)=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'11px 16px',background:i%2===0?'white':'#f9fafb',alignItems:'center'}}>
                    <span style={{fontSize:13,color:'#6B7280'}}>{k}</span>
                    <span style={{fontSize:13,fontWeight:700,color:'#1a1a1a'}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Boost option */}
              <div style={{background:form.boost?'linear-gradient(135deg,#7C3AED,#5B21B6)':'#f9fafb',
                borderRadius:14,padding:'18px 20px',border:`2px solid ${form.boost?'#7C3AED':'#e5e7eb'}`,
                display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,transition:'all .3s'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <Zap size={18} color={form.boost?'#FFD95A':'#7C3AED'}/>
                    <p style={{fontWeight:800,fontSize:15,color:form.boost?'white':'#1a1a1a'}}>Boost This Ad</p>
                  </div>
                  <p style={{fontSize:12,color:form.boost?'rgba(255,255,255,.75)':'#9CA3AF',marginTop:4}}>
                    Get 5x more visibility · Appear at top · Featured badge
                  </p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.boost} onChange={e=>up('boost',e.target.checked)}/>
                  <span className="toggle-slider"/>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          {step>0
            ? <button className="btn btn-ghost btn-lg" style={{border:'1.5px solid #e5e7eb'}} onClick={()=>setStep(s=>s-1)}>← Back</button>
            : <div/>
          }
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            {step<STEPS.length-1 && (
              <span style={{fontSize:13,color:'#9CA3AF'}}>{step+1} of {STEPS.length}</span>
            )}
            <button
              className={`btn btn-dark btn-lg ${step===0&&!form.categoryId?'':''}` }
              onClick={handleNext}
              disabled={step===0&&!form.categoryId}
            >
              {step===STEPS.length-1 ? (
                <><Zap size={16}/> Post Ad Now!</>
              ) : (
                <>Next: {STEPS[step+1]?.label} <ArrowRight size={16}/></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const pad = {
  stepTitle: { fontFamily:'Bebas Neue,sans-serif', fontSize:24, letterSpacing:1, color:'#002F34', marginBottom:4 },
  stepSub:   { color:'#9CA3AF', fontSize:14, marginBottom:22 },
  filterLabel:{ fontSize:12, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:.8, marginBottom:10 },
  catBtn: { display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 8px',
    borderRadius:14, border:'2px solid #e5e7eb', cursor:'pointer', background:'white',
    transition:'all .2s', position:'relative' },
  catBtnActive: { border:'2px solid #002F34', background:'#FFFBEB' },
  catCheck: { position:'absolute', top:8, right:8, width:20, height:20, borderRadius:'50%',
    background:'#22c55e', color:'white', display:'flex', alignItems:'center', justifyContent:'center' },
  subBtn: { padding:'7px 16px', borderRadius:99, border:'1.5px solid #e5e7eb',
    fontSize:13, fontWeight:600, cursor:'pointer', background:'white', color:'#374151',
    transition:'all .2s' },
  subBtnActive: { background:'#002F34', color:'white', borderColor:'#002F34' },
  dropzone: { border:'2px dashed #e5e7eb', borderRadius:14, padding:'48px 24px',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    textAlign:'center', cursor:'pointer', transition:'all .2s', background:'#f9fafb' },
};
