# CampusXchange - Complete User Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally
- Port 4000 and 5173+ available

### Starting the Application

**Terminal 1 - Start Backend Server:**
```bash
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"
npm run server
```
Expected output: `CampusXchange backend running on http://localhost:4000`

**Terminal 2 - Start Frontend:**
```bash
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"
npm run dev
```
Expected output: `Local: http://localhost:5173` (or next available port)

**Access the site:** Open `http://localhost:5173` in your browser

---

## 📱 User Flow & Features

### 1. REGISTRATION & LOGIN

#### **Registration (New User)**

**Step 1:** Click "Register" in top navigation
- Fill in:
  - **Name**: Your full name
  - **Email**: Must be `@chitkara.edu.in` email
  - **Password**: Minimum 6 characters (recommended 8+)
  - **City**: Select from dropdown (Chandigarh, Baddi, Rajpura, Solan, etc.)
- Click "Register"
- You'll be logged in automatically

#### **Login (Existing User)**

**Step 1:** Click "Login" in top navigation
- Enter:
  - **Email**: Your registered email
  - **Password**: Your account password
- Click "Login"

#### **Pre-seeded Demo Accounts:**
- **Admin**: `admin@chitkara.edu.in` / `admin123`
- **Students**: `rahul.sharma@chitkara.edu.in` / `student123`
- **Students**: `priya.singh@chitkara.edu.in` / `student123`
- **Students**: `arjun.kumar@chitkara.edu.in` / `student123`

---

### 2. BROWSING LISTINGS (Home Page)

#### **Features:**

**🔍 Search Bar**
- Type product name (e.g., "iPhone 15", "Honda City", "PS5")
- See trending suggestions while typing
- Press Enter or click Search button

**📍 City Selector**
- Click city dropdown top-left
- Select specific city or "All India"
- Filters listings by location

**📂 Category Navigation**
- Below navbar: Click category icons to filter
- Categories: Electronics, Vehicles, Real Estate, etc.
- Each category shows only relevant products

**💳 Listing Cards Display:**
- **Product Image**: Clickable
- **Title**: Product name
- **Price**: ₹ amount
- **Location**: City name
- **Seller**: Name and rating
- **Wishlist Heart**: Click to save to wishlist
- **View Details**: Click card to see full details

---

### 3. PRODUCT DETAILS PAGE

**Click any listing card to view:**

**Left Side - Product Info:**
- Large product image
- Product title and price
- Category and condition
- Full description
- Location and posted date

**Right Side - Seller Info:**
- Seller name and profile
- Contact information
- Seller's other listings

**Action Buttons:**
- **❤️ Add to Wishlist**: Save product
- **💬 Message Seller**: Send message (chat)
- **📞 Contact**: Call/WhatsApp (if configured)

---

### 4. POSTING AN AD (SELL SOMETHING)

#### **Step 1: Click "SELL" Button**
- Top-right corner (requires login)
- Redirects to Ad posting form

#### **Step 2: Fill Product Details**

**Product Information:**
- **Title**: Product name (e.g., "iPhone 14 Pro Max")
- **Description**: Full details, condition, features
- **Category**: Select from dropdown (Electronics, Vehicles, etc.)
- **Condition**: New / Like New / Good / Fair

**Pricing & Location:**
- **Price**: ₹ amount (numeric only)
- **City**: Auto-filled from your profile, but can change
- **Location Detail**: Street/Area name

**Upload Image:**
- Click upload area or browse
- Supported: JPG, PNG, JPEG
- Image auto-optimized for web

**Posting Options:**
- ✅ **Active**: Immediately visible to buyers
- ⏱️ **Draft**: Save for later

#### **Step 3: Submit**
- Review all details
- Click "Post Ad"
- Success message: "Ad posted successfully! 🚀"
- Redirected to home page

#### **Step 4: Track Your Listings**
- Click profile icon → "My Ads"
- View all your active listings
- Edit or delete listings
- See interested buyers

---

### 5. WISHLIST MANAGEMENT

#### **Adding to Wishlist:**
- Click ❤️ on any listing card
- Heart turns red when added
- Notification: "Added to wishlist"

#### **Viewing Wishlist:**
- Click 💕 icon in top navbar (shows count)
- View all saved products
- Remove from wishlist anytime
- Share wishlist with friends

#### **Wishlist Features:**
- See all prices at a glance
- Sort by price (low to high)
- Filter by category
- Remove all at once

---

### 6. MESSAGING SYSTEM

#### **Send Message to Seller:**
- Visit any product detail page
- Click "💬 Message Seller" button
- Type your message
- Message sent immediately

#### **View Your Messages:**
- Click 💬 icon in navbar
- See conversation history
- Message counter shows unread count
- Reply to seller's messages

#### **Message Features:**
- Real-time updates (Socket.io)
- Timestamp on each message
- Seller name visible
- Product reference shown

---

### 7. PROFILE MANAGEMENT

#### **Access Profile:**
- Click your avatar/name (top-right)
- Select "My Profile"

#### **Profile Page Shows:**
- Your name and email
- Joined date
- Total listings posted
- Seller rating (if available)
- Your reviews from buyers

#### **Edit Profile:**
- Click "Edit Profile" button
- Update name, city, phone
- Change profile picture
- Save changes

#### **Change Password:**
- Go to Settings
- Enter current password
- Enter new password (2x)
- Click "Update Password"

---

### 8. NOTIFICATIONS

#### **Notification Types:**
- 🔔 Someone interested in your listing
- 💬 New message from buyer
- ✅ Your listing got reviewed
- 🚨 Your listing was reported

#### **Notification Bell Icon:**
- Top navbar shows unread count (red badge)
- Click bell to see all notifications
- Mark as read automatically
- Click notification to view details

---

### 9. ADMIN DASHBOARD

### Access Admin Panel

**Only for Admins:**
- Login with: `admin@chitkara.edu.in` / `admin123`
- After login, click "Admin" in navbar
- Or navigate to: `http://localhost:5173/admin`

### Admin Dashboard Tabs

#### **Dashboard Tab (Overview)**

**Statistics:**
- **Total Users**: Count of all registered users
- **Active Users**: Users who posted listings in last 30 days
- **Total Listings**: All products on platform
- **Active Listings**: Currently available products

**Recent Users:**
- List of 5 most recently registered users
- Shows: Name, Email, Join Date
- Quick user verification available

**Recent Listings:**
- List of 5 newest products posted
- Shows: Product image, Title, Seller name
- Quick moderation options

#### **Users Tab (User Management)**

**User List:**
- Paginated table (20 users per page)
- Columns: Name, Email, Role, Status, Join Date
- Search by name or email

**User Actions:**
- **Activate**: Re-enable deactivated user
- **Deactivate**: Ban or suspend user account
- **Delete**: Permanently remove user

**User Status Indicators:**
- 🟢 Green: Active user
- 🔴 Red: Inactive/Banned user
- 👑 Purple badge: Admin user

**Search & Filter:**
- Type name or email
- Auto-filters results
- Real-time search

#### **Listings Tab (Moderation)**

**Listing List:**
- Paginated table (20 listings per page)
- Columns: Title, Seller, Status, Price, Actions
- Product image thumbnails

**Listing Statuses:**
- 🟢 **Active**: Live on marketplace
- 🟡 **Pending**: Awaiting approval
- 🔴 **Inactive**: Hidden from buyers

**Moderation Actions:**
- **Activate**: Make listing visible
- **Deactivate**: Hide from buyers
- **Delete**: Remove permanently

**Reason Codes (Optional):**
- Inappropriate content
- Suspicious pricing
- Duplicate listing
- Contact details exposed

**Search & Filter:**
- Search by product title
- Filter by seller
- Filter by status
- Filter by category

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CampusXchange Flow                       │
└─────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ↓
   Name, Email (@chitkara.edu.in), Password, City
   ↓
   Stored in MongoDB → JWT Token Generated
   ↓
   Auto-logged in

2. BROWSING PRODUCTS
   ↓
   Filter by: Category, City, Search Term
   ↓
   Database Query → 20 results paginated
   ↓
   Display listing cards

3. VIEWING PRODUCT DETAILS
   ↓
   Get product ID from URL
   ↓
   Query database → Fetch full product details + seller info
   ↓
   Display on product detail page

4. POSTING AN AD
   ↓
   Fill form → Upload image (Multer) → Save to /uploads folder
   ↓
   Create Listing object with seller ID reference
   ↓
   Save to MongoDB
   ↓
   Return success message

5. MESSAGING
   ↓
   User A sends message
   ↓
   Socket.io broadcasts to User B (real-time)
   ↓
   Stored in MongoDB for history

6. ADMIN MODERATION
   ↓
   Admin login with role='admin'
   ↓
   Query: All users, All listings
   ↓
   Perform action: Activate/Deactivate/Delete
   ↓
   Update database
   ↓
   Changes reflected immediately
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@chitkara.edu.in",
  password: "hashed_password_bcrypt",
  city: "Chandigarh",
  phone: "+91-9876543210",
  role: "user", // or "admin"
  isActive: true,
  isVerified: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Listings Collection
```javascript
{
  _id: ObjectId,
  title: "iPhone 14 Pro Max",
  description: "Like new condition, 256GB",
  category: "electronics",
  categoryLabel: "Electronics",
  condition: "like-new",
  price: 65000,
  image: "/uploads/image_xyz.jpg",
  seller: {
    _id: ObjectId,
    name: "Rahul Sharma",
    email: "rahul@chitkara.edu.in"
  },
  city: "Chandigarh",
  status: "active", // "active" or "inactive"
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## 🔐 Security Features

### Authentication
- **JWT Token**: Stored in localStorage
- **Token Expiry**: Configured in .env
- **Password**: Hashed with bcryptjs (10 salt rounds)

### Authorization
- **Role-based Access**: User vs Admin
- **Protected Routes**: Can't access admin without admin role
- **Middleware Check**: Every request validates JWT

### Input Validation
- **Email**: Must contain @chitkara.edu.in
- **Password**: Min 6 characters
- **Price**: Numeric only
- **File Upload**: Size and type restrictions

### Rate Limiting
- **API Endpoints**: Max 100 requests per 15 minutes
- **Login**: Max 5 attempts per hour
- **File Upload**: Max 5MB per file

---

## 🐛 Common Issues & Solutions

### Issue: "Page won't load"
**Solution:** 
- Check backend: `npm run server` running on 4000
- Check frontend: `npm run dev` running on 5173+
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Can't login"
**Solution:**
- Verify email is correct format (@chitkara.edu.in)
- Check MongoDB is running
- Try admin account: `admin@chitkara.edu.in` / `admin123`

### Issue: "Image upload fails"
**Solution:**
- Ensure `/uploads` folder exists
- Check file size < 5MB
- Try JPG or PNG format
- Refresh page and retry

### Issue: "Admin page inaccessible"
**Solution:**
- Must be logged in as admin
- Check user role in database
- Login as: `admin@chitkara.edu.in` / `admin123`
- Verify JWT token in localStorage

### Issue: "Messages not appearing"
**Solution:**
- Refresh page
- Check browser console for errors
- Ensure Socket.io connected
- Both users must be online

---

## 🛠️ API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (protected)
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (protected)

### Admin Routes
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/listings` - List all listings (paginated)
- `PUT /api/admin/users/:id` - Modify user
- `PUT /api/admin/listings/:id` - Modify listing
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/listings/:id` - Delete listing

---

## 📱 Testing Scenarios

### Scenario 1: New User Buying
1. Open `http://localhost:5173`
2. Click Register
3. Enter: `test@chitkara.edu.in` / `TestPass123` / Chandigarh
4. Browse products using search/categories
5. Click ❤️ to add to wishlist
6. View messages from sellers

### Scenario 2: Seller Posting Product
1. Login as student: `rahul.sharma@chitkara.edu.in` / `student123`
2. Click "SELL" button
3. Fill: Title, Description, Price ₹15000, Upload Image
4. Click "Post Ad"
5. Go to "My Ads" to see your listing

### Scenario 3: Admin Moderation
1. Login as admin: `admin@chitkara.edu.in` / `admin123`
2. Click "Admin" in navbar
3. View Dashboard → see statistics
4. Go to Users tab → find user → Deactivate/Delete
5. Go to Listings tab → find product → Deactivate/Delete
6. Check Dashboard for updated counts

### Scenario 4: Real-time Messaging
1. Open 2 browser windows (incognito mode)
2. Login with different users in each
3. In Window 1: View a product
4. Click "Message Seller"
5. In Window 2: Check Messages inbox
6. Reply to message
7. See real-time updates in Window 1

---

## 🚀 Performance Tips

- **Image Optimization**: Uploaded images auto-resized
- **Pagination**: Only 20 items loaded per page
- **Lazy Loading**: Images load as you scroll
- **Caching**: Recent searches cached locally
- **Database Indexes**: Queries optimized with indexes

---

## 📞 Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/campusxchange
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

# Email (for future)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 📈 Next Steps to Deploy

1. **Set Production Environment:**
   - Change `NODE_ENV=production`
   - Update `JWT_SECRET` with strong key
   - Use cloud MongoDB (MongoDB Atlas)

2. **Configure Hosting:**
   - Frontend: Vercel, Netlify
   - Backend: Heroku, Render, Railway

3. **Set CORS Properly:**
   - Update `CLIENT_URL` to production domain
   - Add SSL certificates

4. **Email Notifications:**
   - Configure SMTP settings
   - Send confirmation emails

5. **Scaling:**
   - Add caching (Redis)
   - CDN for images
   - Load balancing

---

## 📚 Technology Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet + CORS + Rate Limiting

---

**Version**: 2.0.0 Production Ready
**Last Updated**: April 2026
