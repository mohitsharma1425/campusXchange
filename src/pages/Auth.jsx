import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

function InputField({ icon: Icon, error, trailingEl, label, ...props }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <div style={{position:'relative',display:'flex',alignItems:'center'}}>
        {Icon && <Icon size={16} color="#9CA3AF" style={{position:'absolute',left:14,flexShrink:0,pointerEvents:'none'}}/>}
        <input {...props}
          className={`form-input ${error?'error':''}`}
          style={{width:'100%',paddingLeft:Icon?42:16,...props.style}}/>
        {trailingEl}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

const fieldStep = {
  name: 0,
  email: 0,
  phone: 0,
  password: 1,
  confirmPw: 1,
  city: 2,
};

const validationDetailsToErrors = (details = []) => {
  return details.reduce((acc, detail) => {
    const field = detail.path === 'confirmPassword' ? 'confirmPw' : detail.path;
    if (field && !acc[field]) acc[field] = detail.msg;
    return acc;
  }, {});
};

function FormAlert({ children }) {
  if (!children) return null;
  return <div style={auth.alert}>{children}</div>;
}

/* ─── LOGIN ─────────────────────────────────────────────────── */
export function Login() {
  const { login } = useApp();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [form, setForm]       = useState({ email:'', password:'' });
  const [errors, setErrors]   = useState({});

  const up = (k,v) => {
    setForm(p=>({...p,[k]:v}));
    setErrors(p=>({...p,[k]:undefined,general:undefined}));
  };

  const validate = () => {
    const e={};
    const email = form.email.trim().toLowerCase();
    if(!email) {
      e.email='Email is required';
    } else if(!email.includes('@') || !email.endsWith('@chitkara.edu.in')) {
      e.email='Use your @chitkara.edu.in email';
    }
    if(!form.password) e.password='Password is required';
    else if(form.password.length<6) e.password='Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      const fieldErrors = validationDetailsToErrors(error.details);
      setErrors({
        ...fieldErrors,
        general: Object.keys(fieldErrors).length ? 'Please fix the highlighted fields.' : (error.message || 'Login failed'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={auth.page}>
      <div style={auth.card}>
        {/* Left panel */}
        <div style={auth.left}>
          <span style={auth.leftLogo}>CampusXchange</span>
          <h2 style={auth.leftTitle}>Your Campus Exchange<br/>for Chitkara Students.</h2>
          <p style={auth.leftSub}>Login with your @chitkara.edu.in account to exchange campus essentials.</p>
          <div style={auth.features}>
            {['Post unlimited free ads','Chat directly with buyers','Get notified instantly','Safe & secure platform'].map(f=>(
              <div key={f} style={auth.featureRow}>
                <div style={auth.featureCheck}><Check size={11} strokeWidth={3}/></div>
                <span style={{fontSize:13,color:'rgba(255,255,255,.8)'}}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{position:'absolute',bottom:24,right:24,fontSize:100,opacity:.08,fontFamily:'Bebas Neue,sans-serif',letterSpacing:2}}>CampusXchange</div>
        </div>

        {/* Right panel */}
        <div style={auth.right}>
          <div style={{marginBottom:6}}>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:1,color:'#002F34'}}>Welcome Back 👋</h2>
            <p style={{color:'#9CA3AF',fontSize:14,marginTop:4}}>Login with your @chitkara.edu.in email</p>
          </div>

          {/* Tab */}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
            <FormAlert>{errors.general}</FormAlert>
            <>
              <InputField icon={Mail} label="Email Address" type="email" placeholder="you@chitkara.edu.in"
                value={form.email} onChange={e=>up('email',e.target.value)} error={errors.email}/>
              <InputField icon={Lock} label="Password" type={showPw?'text':'password'} placeholder="••••••••"
                value={form.password} onChange={e=>up('password',e.target.value)} error={errors.password}
                trailingEl={
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    style={{position:'absolute',right:12,background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',display:'flex'}}>
                    {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                }/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'#6B7280',cursor:'pointer'}}>
                  <input type="checkbox" style={{accentColor:'#002F34'}}/> Remember me
                </label>
                <Link to="/forgot-password" style={{fontSize:13,color:'#002F34',fontWeight:700}}>Forgot password?</Link>
              </div>
            </>

            <button type="submit" className="btn btn-dark btn-full btn-lg" disabled={loading}>
              {loading ? <span style={{width:20,height:20,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
                : <><span>Login</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:20}}>
            Don't have an account?{' '}
            <Link to="/register" style={{color:'#002F34',fontWeight:700}}>Register Free →</Link>
          </p>

          <p style={{textAlign:'center',fontSize:11,color:'#9CA3AF',marginTop:12}}>
            By continuing you agree to our{' '}
            <Link to="/" style={{color:'#002F34'}}>Terms</Link> &{' '}
            <Link to="/" style={{color:'#002F34'}}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── REGISTER ───────────────────────────────────────────────── */
export function Register() {
  const { register } = useApp();
  const navigate     = useNavigate();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', confirmPw:'', city:'', userType:'buyer' });
  const [errors, setErrors]   = useState({});

  const up = (k,v) => {
    setForm(p=>({...p,[k]:v}));
    setErrors(p=>({...p,[k]:undefined,general:undefined}));
  };

  const validateStep = () => {
    const e={};
    if(step===0){
      const email = form.email.trim().toLowerCase();
      const phone = form.phone.replace(/\D/g, '');
      if(!form.name.trim())                   e.name='Name is required';
      if(!email) e.email='Email is required';
      else if(!email.includes('@') || !email.endsWith('@chitkara.edu.in')) e.email='Use your @chitkara.edu.in email';
      if(!phone) e.phone='Phone number is required';
      else if(!/^[6-9]\d{9}$/.test(phone)) e.phone='Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9';
    }
    if(step===1){
      if(!form.password) e.password='Password is required';
      else if(form.password.length<6)    e.password='Min 6 characters';
      if(form.password!==form.confirmPw) e.confirmPw='Passwords do not match';
    }
    return e;
  };

  const handleNext = async () => {
    const e=validateStep();
    if(Object.keys(e).length){ setErrors(e); return; }
    setErrors({});
    if(step<2) setStep(s=>s+1);
    else {
      setLoading(true);
      try {
        await register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.replace(/\D/g, '').slice(-10),
          ...(form.city && { city: form.city }),
        });
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        const fieldErrors = validationDetailsToErrors(error.details);
        const firstField = Object.keys(fieldErrors)[0];
        if (firstField && typeof fieldStep[firstField] === 'number') {
          setStep(fieldStep[firstField]);
        }
        setErrors({
          ...fieldErrors,
          general: Object.keys(fieldErrors).length ? 'Please fix the highlighted fields.' : (error.message || 'Registration failed'),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const STEPS = ['Personal Info','Security','Preferences'];

  return (
    <div style={auth.page}>
      <div style={{...auth.card,maxWidth:560}}>
        {/* Left small panel */}
        <div style={{...auth.left,display:'flex',flexDirection:'column',justifyContent:'center',padding:'32px 28px'}}>
          <span style={auth.leftLogo}>CampusXchange</span>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',color:'white',fontSize:26,letterSpacing:1,marginTop:16,lineHeight:1.2}}>
            Start Sharing Campus<br/>Essentials Today
          </h2>
          <p style={{color:'rgba(255,255,255,.6)',fontSize:13,marginTop:10}}>Free for Chitkara students with @chitkara.edu.in login.</p>

          {/* Progress */}
          <div style={{marginTop:32,display:'flex',flexDirection:'column',gap:12}}>
            {STEPS.map((s,i)=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,
                  background:i<step?'#22c55e':i===step?'#FFD95A':'rgba(255,255,255,.2)',
                  color:i<=step?'#002F34':'rgba(255,255,255,.5)'}}>
                  {i<step?<Check size={12} strokeWidth={3}/>:i+1}
                </div>
                <span style={{fontSize:13,color:i<=step?'white':'rgba(255,255,255,.4)',fontWeight:i===step?700:400}}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={auth.right}>
          {step>0 && (
            <button onClick={()=>setStep(s=>s-1)} style={{display:'flex',alignItems:'center',gap:5,color:'#9CA3AF',fontSize:13,fontWeight:600,marginBottom:16,background:'none',border:'none',cursor:'pointer'}}>
              <ChevronLeft size={15}/> Back
            </button>
          )}

          <div style={{marginBottom:22}}>
            <p style={{fontSize:12,fontWeight:700,color:'#9CA3AF',letterSpacing:.8,textTransform:'uppercase'}}>Step {step+1} of 3</p>
            <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:26,letterSpacing:1,color:'#002F34',marginTop:4}}>
              {STEPS[step]}
            </h2>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <FormAlert>{errors.general}</FormAlert>
            {step===0 && (
              <>
                <InputField icon={User} label="Full Name *" type="text" placeholder="Rahul Sharma"
                  value={form.name} onChange={e=>up('name',e.target.value)} error={errors.name}/>
                <InputField icon={Mail} label="Email Address *" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e=>up('email',e.target.value)} error={errors.email}/>
                <InputField icon={Phone} label="Phone Number *" type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e=>up('phone',e.target.value)} error={errors.phone}/>
              </>
            )}
            {step===1 && (
              <>
                <InputField icon={Lock} label="Create Password *" type={showPw?'text':'password'} placeholder="Min 6 characters"
                  value={form.password} onChange={e=>up('password',e.target.value)} error={errors.password}
                  trailingEl={<button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:12,background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',display:'flex'}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>}/>
                <InputField icon={Lock} label="Confirm Password *" type="password" placeholder="Re-enter password"
                  value={form.confirmPw} onChange={e=>up('confirmPw',e.target.value)} error={errors.confirmPw}/>

                {/* Password strength */}
                {form.password.length>0 && (
                  <div>
                    <div style={{display:'flex',gap:4}}>
                      {[1,2,3,4].map(i=>(
                        <div key={i} style={{flex:1,height:4,borderRadius:99,background:
                          form.password.length>=i*3?['#ef4444','#f97316','#FFD95A','#22c55e'][i-1]:'#e5e7eb',transition:'background .3s'}}/>
                      ))}
                    </div>
                    <p style={{fontSize:12,color:'#9CA3AF',marginTop:5}}>
                      {form.password.length<6?'Too short':form.password.length<9?'Fair':form.password.length<12?'Good':'Strong'} password
                    </p>
                  </div>
                )}
              </>
            )}
            {step===2 && (
              <>
                <div className="form-field">
                  <label className="form-label">I want to…</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[['buyer','🛍️ Buy Things'],['seller','📢 Sell Things']].map(([v,l])=>(
                      <button key={v} type="button" onClick={()=>up('userType',v)}
                        style={{padding:'14px',borderRadius:10,border:`2px solid ${form.userType===v?'#002F34':'#e5e7eb'}`,
                          background:form.userType===v?'#002F34':'white',color:form.userType===v?'white':'#374151',
                          fontWeight:700,fontSize:14,cursor:'pointer',transition:'all .2s'}}>
                        {l}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={()=>up('userType','both')}
                    style={{padding:'12px',borderRadius:10,border:`2px solid ${form.userType==='both'?'#002F34':'#e5e7eb'}`,
                      background:form.userType==='both'?'#002F34':'white',color:form.userType==='both'?'white':'#374151',
                      fontWeight:700,fontSize:14,cursor:'pointer',transition:'all .2s',marginTop:8}}>
                    🤝 Both Buy & Sell
                  </button>
                </div>
                <div className="form-field">
                  <label className="form-label">Your City</label>
                  <select value={form.city} onChange={e=>up('city',e.target.value)} className="form-input">
                    <option value="">Select your city</option>
                    {['Chandigarh','Baddi','Rajpura','Solan'].map(c=>(
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={{background:'#FFFBEB',borderRadius:10,padding:'12px 14px',border:'1px solid #FDE68A',fontSize:12,color:'#92400E'}}>
                  ✅ By registering, you agree to use CampusXchange for student exchanges only.
                </div>
              </>
            )}

            <button type="button" className="btn btn-dark btn-full btn-lg" onClick={handleNext} disabled={loading}>
              {loading
                ? <span style={{width:20,height:20,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
                : <>{step===2?'Create Account 🎉':'Continue'} <ArrowRight size={16}/></>
              }
            </button>
          </div>

          {step===0 && (
            <>
              <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:16}}>
                Already have an account?{' '}
                <Link to="/login" style={{color:'#002F34',fontWeight:700}}>Login →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const auth = {
  page: { minHeight:'calc(100vh - 108px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 20px', background:'#f2f2f2' },
  card: { display:'flex', borderRadius:24, overflow:'hidden', boxShadow:'0 24px 72px rgba(0,0,0,.15)', maxWidth:860, width:'100%', background:'white' },
  left: { width:280, background:'linear-gradient(165deg,#002F34 0%,#004d55 60%,#006870 100%)', padding:'36px 28px', position:'relative', overflow:'hidden', flexShrink:0 },
  leftLogo: { display:'inline-block', fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(30px,4.5vw,44px)', color:'#FFD95A', letterSpacing:2, lineHeight:1, margin:-10 },
  leftTitle: { fontFamily:'Bebas Neue,sans-serif', color:'white', fontSize:'clamp(18px,2.2vw,28px)', letterSpacing:1, marginTop:12, lineHeight:1.15 },
  leftSub: { color:'rgba(255,255,255,.55)', fontSize:13, marginTop:10 },
  features: { marginTop:28, display:'flex', flexDirection:'column', gap:12 },
  featureRow: { display:'flex', alignItems:'center', gap:10 },
  featureCheck: { width:22, height:22, borderRadius:'50%', background:'#FFD95A', display:'flex', alignItems:'center', justifyContent:'center', color:'#002F34', flexShrink:0 },
  right: { flex:1, padding:'40px 36px', display:'flex', flexDirection:'column', overflowY:'auto' },
  alert: { background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', borderRadius:8, padding:'10px 12px', fontSize:13, fontWeight:600, lineHeight:1.4 },
  dividerRow: { display:'flex', alignItems:'center', gap:12, margin:'18px 0' },
  divLine: { flex:1, height:1, background:'#e5e7eb' },
  socialBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', background:'white', color:'#374151', transition:'all .2s' },
};
