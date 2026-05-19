import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ListingCard from './ListingCard';

export function Wishlist() {
  const { wishlist, toggleWishlist, listings } = useApp();
  const wished = listings.filter(l => wishlist.includes(l.id));

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 30, letterSpacing: 1, color: '#002F34' }}>
            My Wishlist
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 2 }}>{wished.length} saved items</p>
        </div>

        {wished.length > 0 && (
          <button
            className="btn btn-ghost"
            style={{ border: '1px solid #e5e7eb', fontSize: 13, color: '#ef4444' }}
            onClick={() => wished.forEach(l => toggleWishlist(l.id))}
          >
            Clear All
          </button>
        )}
      </div>

      {wished.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 20 }}>
          <div style={{ fontSize: 72 }}>♡</div>
          <h3 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 26, marginTop: 16 }}>Wishlist is Empty</h3>
          <p style={{ color: '#9CA3AF', marginTop: 8 }}>Save items you love for later</p>

          <Link to="/" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
            Browse Listings <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {wished.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Messages() {
  const { conversations, replyToConversation, loadConversations, user } = useApp();
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadConversations?.().catch(error => {
      console.error('Error loading messages:', error);
    });
  }, [loadConversations]);

  const activeConversation = active
    ? conversations.find(c => c._id === active)
    : conversations[0] || null;
  const selectedConversationId = active || activeConversation?._id || null;
  const activeListing = activeConversation?.listing || null;
  const activeMsgs = activeConversation?.messages || [];
  const activeOtherUser = activeConversation
    ? (String(activeConversation.buyer?._id) === String(user?.id) ? activeConversation.seller : activeConversation.buyer)
    : null;

  const send = async () => {
    if (!msg.trim() || !activeConversation) return;

    try {
      const updated = await replyToConversation(activeConversation._id, msg);
      setActive(updated._id);
      setMsg('');
    } catch (error) {
      console.error('Message send error:', error);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <h1 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 30, marginBottom: 22 }}>Messages</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, height: 560 }}>
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #eee', fontWeight: 700 }}>
            Buyer-Seller Chats ({conversations.length})
          </div>

          {conversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
              No buyer-seller conversations yet.
            </div>
          ) : (
            conversations.map((conversation) => {
              const l = conversation.listing;
              const otherUser = String(conversation.buyer?._id) === String(user?.id) ? conversation.seller : conversation.buyer;
              const lastMsg = conversation.messages?.[conversation.messages.length - 1];

              return (
                <button
                  key={conversation._id}
                  onClick={() => setActive(conversation._id)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 16px',
                    width: '100%',
                    textAlign: 'left',
                    background: selectedConversationId === conversation._id ? '#FFFBEB' : 'white',
                    border: 'none',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer'
                  }}
                >
                  <img src={l?.image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l?.title || 'Listing'}
                    </p>
                    <p style={{ fontSize: 12, color: '#6B7280' }}>{otherUser?.name || 'Campus user'}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {activeConversation && activeListing ? (
          <div style={{ background: 'white', borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
              <img src={activeListing.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
              <div>
                <p style={{ fontWeight: 700 }}>{activeListing.title}</p>
                <p style={{ fontSize: 12, color: '#6B7280' }}>
                  Chat with {activeOtherUser?.name || 'Campus user'} · Rs {activeListing.price}
                </p>
              </div>
            </div>

            <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#f9fafb' }}>
              {activeMsgs.map((m, i) => {
                const mine = String(m.sender?._id || m.sender) === String(user?.id);

                return (
                  <div key={m._id || i} style={{ marginBottom: 10, textAlign: mine ? 'right' : 'left' }}>
                    <span style={{
                      background: mine ? '#002F34' : 'white',
                      color: mine ? 'white' : 'black',
                      padding: '8px 12px',
                      borderRadius: 10,
                      display: 'inline-block',
                      maxWidth: '75%'
                    }}>
                      {m.text}
                    </span>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>
                      {new Date(m.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: 10 }}
              />

              <button
                onClick={send}
                style={{ background: '#002F34', color: 'white', padding: '10px 16px', border: 'none', borderRadius: 6 }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: 16 }}>
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Profile() {
  const { user, logout, listings } = useApp();
  const navigate = useNavigate();

  const myAds = user
    ? listings.filter(l => String(l.seller?._id || l.seller) === String(user.id)).slice(0, 6)
    : [];

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h2>Please Login</h2>
        <Link to="/login" className="btn btn-dark">Login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div style={{paddingTop:40}}>
          <div className="card" style={{ padding: 24, textAlign: 'left'}}>
            <div className="avatar avatar-xl">{user.name.charAt(0)}</div>
            <h3>{user.name}</h3>
            <p style={{fontSize: 12}}>{user.email}</p>
          </div>

          <div className="card" style={{ padding: 16, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/messages">Messages</Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div>
          <h3>My Ads</h3>

          {myAds.length === 0 ? (
            <p>No ads posted yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginTop: 14 }}>
              {myAds.map((l, i) => (
                <ListingCard key={l.id} listing={l} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: '#002F34', color: 'white', padding: 40 }}>
      <div className="container">
        <h2 style={{ fontSize: 32 }}>campusXchange</h2>
        <p>India's #1 local marketplace</p>
        <p style={{ marginTop: 20 }}>The Ultimate Campus Resource.</p>
      </div>
    </footer>
  );
}
