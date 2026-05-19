# CampusXchange - Quick Reference Guide

## 🎯 Quick Start (5 Minutes)

### Start Both Servers

**PowerShell Terminal 1:**
```powershell
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"
npm run server
# Wait for: "CampusXchange backend running on http://localhost:4000"
```

**PowerShell Terminal 2:**
```powershell
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"
npm run dev
# Wait for: "Local: http://localhost:5173"
```

### Open Browser
```
http://localhost:5173
```

---

## 👤 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@chitkara.edu.in | admin123 |
| Student 1 | rahul.sharma@chitkara.edu.in | student123 |
| Student 2 | priya.singh@chitkara.edu.in | student123 |
| Student 3 | arjun.kumar@chitkara.edu.in | student123 |
| Student 4 | sneha.patel@chitkara.edu.in | student123 |

---

## 🗂️ Main Navigation

```
┌─────────────────────────────────────────────┐
│  CampusXchange  🔍Search  📍City  🛍️Filter │
├─────────────────────────────────────────────┤
│ ❤️(wishlist)  💬(messages)  🔔(notif)  👤    │
│ 💳(listings)        ➕ SELL(button)         │
└─────────────────────────────────────────────┘

CATEGORIES: 📱Electronics  🚗Vehicles  🏠RealEstate  ...
```

---

## 📍 Site Map

```
HOME (/)
├── Browse Listings
├── Search & Filter
└── View Wishlist

LOGIN & REGISTER
├── /login
└── /register

PRODUCT DETAILS (/listing/:id)
├── View Product Info
├── See Seller Details
├── Add to Wishlist
└── Message Seller

POST AD (/post-ad) [Protected]
├── Fill Product Details
├── Upload Image
├── Set Price
└── Post Listing

PROFILE (/profile) [Protected]
├── View My Profile
├── My Ads
├── My Wishlist
├── Messages
└── Settings

ADMIN DASHBOARD (/admin) [Admin Only]
├── Dashboard (Stats)
├── Users Management
└── Listings Moderation
```

---

## 🎬 Feature Walkthrough

### 1️⃣ REGISTER NEW USER (2 min)
```
Click "Register" → Fill Form → Password ≥6 chars → Click Register
↓
Auto-logged in → Ready to browse & post
```

### 2️⃣ LOGIN (30 seconds)
```
Click "Login" → Enter Email & Password → Click Login
↓
Auto-redirected to home page
```

### 3️⃣ BROWSE PRODUCTS (1 min)
```
Home Page → Use 3 ways to find:

METHOD 1: Search
  Click search bar → Type "iPhone" → Press Enter → See results

METHOD 2: Filter by Category
  Click category in navbar → See products in that category

METHOD 3: Filter by City
  Click city dropdown → Select "Chandigarh" → See local products

Combine: Search + Category + City = Specific results
```

### 4️⃣ VIEW PRODUCT DETAILS (30 seconds)
```
Click any listing card → See:
  - Large product image
  - Full description
  - Seller information
  - Price and location
  - Action buttons (Wishlist, Message)
```

### 5️⃣ ADD TO WISHLIST (5 seconds)
```
On product detail page → Click ❤️ heart icon
↓
Notification: "Added to wishlist"
↓
View anytime: Click ❤️ in navbar
```

### 6️⃣ MESSAGE SELLER (30 seconds)
```
On product detail page → Click "💬 Message Seller"
↓
Type your message → Click Send
↓
Message sent instantly via Socket.io
↓
Seller sees notification (if online)
```

### 7️⃣ POST YOUR FIRST AD (3 min)
```
1. Click "SELL" button (top-right)
   ↓
2. Fill Product Form:
   - Title: "iPhone 14 Pro Max"
   - Description: "Excellent condition, 256GB"
   - Category: Electronics
   - Price: 65000
   - City: Chandigarh
   - Upload Image: Click upload area
   ↓
3. Click "Post Ad"
   ↓
4. Success! View in "My Ads"
```

### 8️⃣ VIEW YOUR LISTINGS (30 seconds)
```
Click profile icon (top-right) → Select "My Ads"
↓
See all your posted listings:
  - Status (Active/Inactive)
  - Views count
  - Edit/Delete options
  - Interested buyers list
```

### 9️⃣ MANAGE PROFILE (1 min)
```
Click profile icon → Select "My Profile"
↓
View:
  - Your information
  - Listings posted
  - Seller rating
  - Reviews
↓
Click "Edit" → Update name/city/phone → Save
```

### 🔟 ADMIN ACTIONS (2 min)
```
Login as admin → Click "Admin" in navbar
↓
DASHBOARD TAB:
  - See platform statistics
  - View recent users & listings

USERS TAB:
  - Search for user
  - Click user → Activate/Deactivate/Delete

LISTINGS TAB:
  - Search for product
  - Click listing → Activate/Deactivate/Delete
```

---

## 🔑 Important Features by Role

### 👤 Regular User Can:
- ✅ Register & Login
- ✅ Browse all listings
- ✅ Search & filter products
- ✅ Add to wishlist
- ✅ Message sellers
- ✅ Post own listings
- ✅ View profile
- ✅ Edit profile
- ❌ Access admin panel

### 🔐 Admin User Can:
- ✅ Everything regular user can do PLUS:
- ✅ View dashboard statistics
- ✅ Manage all users (activate/deactivate/delete)
- ✅ Moderate all listings (approve/reject/delete)
- ✅ Search & filter users
- ✅ Search & filter listings
- ✅ View platform analytics

---

## 📊 Data Types & Validation

### Email
```
✅ Valid: student@chitkara.edu.in
❌ Invalid: student@gmail.com (must be @chitkara.edu.in)
❌ Invalid: invalid-email (no @)
```

### Password
```
✅ Valid: MyPass123 (8+ chars recommended)
✅ Valid: short123 (min 6 chars)
❌ Invalid: 123 (less than 6 chars)
```

### Price
```
✅ Valid: 15000
✅ Valid: 1500.50
❌ Invalid: Rs. 15000 (no text allowed)
❌ Invalid: -5000 (no negative)
```

### Image
```
✅ Valid: photo.jpg, image.png, pic.jpeg
❌ Invalid: photo.bmp, image.gif
❌ Invalid: file.pdf (not supported)
Size limit: 5MB max
```

### City
```
Dropdown list includes:
- Chandigarh (HQ)
- Baddi
- Rajpura
- Solan
- (All India for national listings)
```

---

## 🚨 Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email" | Not @chitkara.edu.in | Use Chitkara student email |
| "Email already exists" | Account created | Click Login, or use different email |
| "Weak password" | Less than 6 chars | Use 8+ character password |
| "Cannot find user" | Wrong email/password | Check spelling & try again |
| "Image upload failed" | File too large | Use image < 5MB |
| "Permission denied" | Not admin | Login as admin to access |
| "Product not found" | Listing deleted | Go back to home page |
| "Server error" | Backend down | Start backend with `npm run server` |

---

## 💾 Database Reset (If Needed)

### Seed Fresh Data
```powershell
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted\server"
node seed.js
```

Output:
```
✅ Database seeded successfully!
Admin login: admin@chitkara.edu.in / admin123
Student login: any student email / student123
```

### What Gets Seeded:
- 1 Admin account
- 5 Student accounts
- 50+ Sample listings
- Sample data across all categories

---

## 🔄 Common Workflows

### WORKFLOW 1: Browse & Buy
```
1. Register/Login
2. Browse products (search, filter, category)
3. Click product → View details
4. Message seller asking questions
5. Negotiate & arrange
6. Complete transaction offline
```

### WORKFLOW 2: Sell Your Item
```
1. Login
2. Click "SELL"
3. Upload product photo
4. Fill details (title, price, description)
5. Click "Post Ad"
6. Wait for buyer messages
7. Message with interested buyers
8. Agree on price & meetup
9. Manage listing (view, edit, delete)
```

### WORKFLOW 3: Admin Moderating
```
1. Login as admin
2. Check Dashboard for overview
3. Go to Users tab → Search suspicious account
4. Deactivate if needed (prevents login)
5. Go to Listings tab → Find inappropriate content
6. Delete harmful listings
7. Check stats to verify changes
```

### WORKFLOW 4: Multi-user Interaction
```
User A (Seller):
  Posts a laptop for ₹50,000

User B (Buyer 1):
  Searches "laptop" → Finds User A's ad
  Clicks ❤️ to save
  Messages: "What's the condition?"

User C (Buyer 2):
  Searches "laptop" → Finds User A's ad
  Messages: "Are you open to negotiation?"

User A receives 2 messages:
  Replies to both
  Agrees price with User B
  Marks listing as sold (deactivates)
```

---

## 🎨 UI Elements Explained

### Navbar
- **Left**: Logo "CampusXchange"
- **Center-Left**: City selector (📍 dropdown)
- **Center**: Search bar (🔍)
- **Center-Right**: Categories bar (Electronics, Vehicles, etc.)
- **Right**: Icons (❤️ 💬 🔔) + Profile + SELL button

### Listing Card
```
┌─────────────────────┐
│   [Image] ❤️       │  ← Product photo + wishlist
│                     │
│ iPhone 14 Pro Max   │  ← Title
│ ₹65,000             │  ← Price
│ Chandigarh          │  ← City
│ Rahul Sharma ⭐4.5  │  ← Seller + Rating
└─────────────────────┘
```

### Product Detail Page
```
LEFT SIDE (70%)      │ RIGHT SIDE (30%)
─────────────────────┼──────────────────
[Large Image]        │ Seller Info
Title                │ - Name
Price                │ - Email
Description          │ - Phone
Condition            │ - Listings
Location             │ 
Posted Date          │ Action Buttons:
                     │ - ❤️ Wishlist
                     │ - 💬 Message
```

---

## 📱 Mobile Responsive

- **Desktop (>1200px)**: Full layout
- **Tablet (768-1200px)**: 2-column grid
- **Mobile (<768px)**: 1-column, stack vertically

---

## ⚡ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search bar |
| `Enter` | Submit search |
| `Esc` | Close dropdowns |
| `Tab` | Navigate form fields |

---

## 📞 Support & Testing

### Test Scenarios

**Scenario 1: New User Journey (5 min)**
1. Register: `newstudent@chitkara.edu.in`
2. Browse homepage
3. Post a product
4. Go to "My Ads"

**Scenario 2: Buying Journey (3 min)**
1. Login: `rahul.sharma@chitkara.edu.in`
2. Search for "iPhone"
3. Add to wishlist
4. Message seller

**Scenario 3: Admin Actions (3 min)**
1. Login: `admin@chitkara.edu.in`
2. Go to Admin Dashboard
3. View statistics
4. Find a user & deactivate
5. Find a listing & deactivate

### Troubleshooting

**Problem: Page blank**
- Check browser console (F12)
- Ensure both npm run server & npm run dev running
- Clear browser cache (Ctrl+Shift+Del)

**Problem: Can't login**
- Verify email format (@chitkara.edu.in)
- Check password (case-sensitive)
- Ensure MongoDB running

**Problem: Images not uploading**
- Check file size < 5MB
- Try JPG or PNG format
- Check /uploads folder exists

**Problem: Messages not working**
- Refresh page
- Check Socket.io connected in browser console
- Both users must be on same tab

---

## 🎓 Learning Path

**Day 1: User Features**
- Register & Login (10 min)
- Browse products (10 min)
- Post your first ad (15 min)
- Send message to seller (5 min)

**Day 2: Admin Features**
- Login as admin (2 min)
- Explore dashboard (5 min)
- Manage users (10 min)
- Moderate listings (10 min)

**Day 3: Advanced**
- Test multiple accounts
- Try real-time messaging
- Explore edge cases
- Read database schema

---

## 🚀 Production Checklist

Before deploying:
- [ ] Change JWT_SECRET in .env
- [ ] Use cloud MongoDB (MongoDB Atlas)
- [ ] Enable HTTPS
- [ ] Configure email notifications
- [ ] Set up backups
- [ ] Add rate limiting
- [ ] Configure CORS for production
- [ ] Test all features thoroughly
- [ ] Set up monitoring
- [ ] Plan scaling strategy

---

**Last Updated**: April 2026
**Status**: Production Ready ✅
