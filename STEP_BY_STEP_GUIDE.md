# CampusXchange - Step-by-Step Walkthrough

## 🎬 COMPLETE JOURNEY IN 15 MINUTES

---

## PART 1: SETUP & START (2 minutes)

### Step 1: Open Terminal 1
```powershell
# Navigate to project
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"

# Start backend
npm run server

# Expected Output:
# > campus-exchange@2.0.0 server
# > node server/index.js
# CampusXchange backend running on http://localhost:4000
# MongoDB Connected: localhost
```

**✅ When you see "MongoDB Connected", backend is ready**

---

### Step 2: Open Terminal 2 (While Terminal 1 running)
```powershell
# Navigate to project
cd "c:\Users\mohit sharma\Desktop\backend 3\campusxchange_vite_converted"

# Start frontend
npm run dev

# Expected Output:
# > campus-exchange@2.0.0 dev
# > vite
# VITE v5.x.x ready in xxx ms
# ➜  Local:   http://localhost:5173
```

**✅ Copy the Local URL (http://localhost:5173 or 5174, 5175...)**

---

### Step 3: Open Browser
```
Paste URL: http://localhost:5173 (or the port shown)
```

**You'll see:** Home page with navbar, search bar, and category navigation

---

## PART 2: EXPLORE AS VISITOR (2 minutes)

### What You See On Home Page

```
TOP NAVBAR:
┌─────────────────────────────────────────────────────────┐
│ CampusXchange  [Search Bar]  [City Dropdown]            │
│                                            ❤️ 💬 🔔 👤 ➕SELL │
└─────────────────────────────────────────────────────────┘

CATEGORY BAR:
📱 Electronics | 🚗 Vehicles | 🏠 RealEstate | 📚 Books | 🛋️ Furniture

FEATURED LISTINGS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ iPhone14 │  │  Honda   │  │ MacBook  │  │  PS5     │
│ ₹65,000  │  │ ₹800k    │  │ ₹120k    │  │ ₹50k     │
│ Chd.  ❤️  │  │ Baddi ❤️ │  │ Chd.  ❤️  │  │ Raj. ❤️  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### Browse Without Login

1. **View all listings** - Just refresh page, they load automatically
2. **Click any product** - See full details
3. **Search for items** - Type "iPhone" in search bar
4. **Filter by category** - Click "📱 Electronics"
5. **Filter by city** - Click city dropdown → Select "Chandigarh"
6. **❌ BUT**: Can't message seller, add to wishlist, or post ads (Need login)

---

## PART 3: REGISTER NEW ACCOUNT (1 minute)

### Step 1: Click "Register"
```
Top navbar → Right side → Click "Register"
```

**Page changes to Registration Form:**

```
┌─────────────────────────────────────┐
│     Join CampusXchange Today         │
├─────────────────────────────────────┤
│                                     │
│  Name: [________________]           │
│                                     │
│  Email: [________________]          │
│         (must be @chitkara.edu.in)  │
│                                     │
│  Password: [________________]       │
│           (min 6 characters)        │
│                                     │
│  City: [Chandigarh ▼]               │
│                                     │
│  [        Register       ]          │
│                                     │
│  Already registered? Login           │
└─────────────────────────────────────┘
```

### Step 2: Fill Registration Form

```
EXAMPLE VALUES:
┌─────────────────────────────────────┐
│ Name:     Sanjay Kumar              │
│ Email:    sanjay.kumar@chitkara.edu.in
│ Password: MyPass123                 │
│ City:     Chandigarh                │
│ [✓] Register                        │
└─────────────────────────────────────┘
```

### Step 3: Click Register

**What Happens:**
1. Email validated (must be @chitkara.edu.in)
2. Password checked (min 6 chars)
3. Account created in MongoDB
4. JWT token generated
5. Auto-logged in
6. Redirected to Home Page

**Success Message:** "✅ Registration successful! Welcome to CampusXchange"

---

## PART 4: LOGIN (30 seconds)

### For Existing Users: Click Login

```
┌─────────────────────────────────────┐
│     Welcome Back to CampusXchange   │
├─────────────────────────────────────┤
│                                     │
│  Email: [________________]          │
│                                     │
│  Password: [________________]       │
│                                     │
│  [        Login       ]             │
│  [    or Register     ]             │
│                                     │
└─────────────────────────────────────┘

EXAMPLE:
Email:    admin@chitkara.edu.in
Password: admin123
```

**Result:** Logged in → Redirected to Home Page

---

## PART 5: BROWSE PRODUCTS (2 minutes)

### Method 1: Search

```
1. Click search bar at top
2. Type: "iPhone"
3. See suggestions while typing:
   - iPhone 14 Pro Max
   - iPhone 13
   - iPhone 12

4. Press Enter
5. See all matching products
```

**Results Page Shows:**
```
Found 12 products matching "iPhone"

┌──────────┐  ┌──────────┐  ┌──────────┐
│ iPhone14 │  │ iPhone13 │  │ iPhone12 │
│ ₹65,000  │  │ ₹50,000  │  │ ₹35,000  │
│Chandigarh│  │  Baddi   │  │ Solan    │
│ Rahul ❤️ │  │ Priya ❤️ │  │ Arjun ❤️ │
└──────────┘  └──────────┘  └──────────┘
```

### Method 2: Use Categories

```
1. In navbar, click "📱 Electronics"
2. See all electronics products
3. Sort by:
   - Price (Low to High)
   - Newest First
   - Most Viewed
```

### Method 3: Filter by City

```
1. Click city dropdown (top-left)
2. Select your city:
   - Chandigarh
   - Baddi
   - Rajpura
   - Solan
   - All India
   
3. See only products from that city
```

### Method 4: Combine All

```
Search "bike" + Filter "Vehicles" + City "Chandigarh"
= Only bikes in Chandigarh
```

---

## PART 6: VIEW PRODUCT DETAILS (1 minute)

### Click Any Product Card

```
Click "iPhone 14 Pro Max" card
↓
Page shows:

┌────────────────────────────────────┐
│           iPhone 14 Pro Max        │
│         (Large Product Image)      │
│         [❤️ Add to Wishlist]       │
│                                    │
│ Price: ₹65,000                     │
│ Condition: Like New                │
│ Posted: 2 days ago                 │
│ Location: Chandigarh               │
│                                    │
│ Description:                       │
│ "Excellent condition, 256GB Space  │
│  storage. Only 2 months old.       │
│  Never dropped. All accessories    │
│  included. Box and charger."       │
│                                    │
│ ┌─────────────────────────────┐   │
│ │ Seller: Rahul Sharma        │   │
│ │ Email: rahul@chitkara.edu.in│   │
│ │ Rating: ⭐⭐⭐⭐⭐ (4.5/5)  │   │
│ │ Member Since: Jan 2024      │   │
│ │                             │   │
│ │ [💬 Message Seller]         │   │
│ │ [☎️  Call Seller (soon)]    │   │
│ └─────────────────────────────┘   │
│                                    │
│ Other Listings by Rahul:           │
│ - iPhone 13 (₹50k)                 │
│ - iPad Air (₹60k)                  │
└────────────────────────────────────┘
```

---

## PART 7: ADD TO WISHLIST (5 seconds)

### Click ❤️ Heart Icon

```
On product detail page:
Click [❤️ Add to Wishlist]
↓
Heart becomes RED ❤️
↓
Notification: "✅ Added to wishlist"
↓
View anytime: Click ❤️ (45) in navbar
```

**Wishlist Popup Shows:**
```
┌─────────────────────────────────┐
│         Your Wishlist (45)      │
├─────────────────────────────────┤
│                                 │
│ iPhone 14 Pro Max  ₹65,000   ❤️ │
│ MacBook Pro        ₹120,000  ❤️ │
│ Honda City         ₹800,000  ❤️ │
│ PS5                ₹50,000   ❤️ │
│ Sofa Set           ₹25,000   ❤️ │
│                                 │
│ [Sort by Price] [Filter]        │
│ [Clear All] [Share Wishlist]    │
│                                 │
└─────────────────────────────────┘
```

---

## PART 8: MESSAGE SELLER (30 seconds)

### Click Message Button

```
On product detail page:
Click [💬 Message Seller]
↓
Chat window opens:

┌──────────────────────────────────┐
│ Chat with Rahul Sharma           │
├──────────────────────────────────┤
│ About: iPhone 14 Pro Max         │
│                                  │
│ ────────────────────────────────│
│                                  │
│ (Chat messages appear here)      │
│                                  │
│ ────────────────────────────────│
│                                  │
│ [Type your message...]           │
│ [Send Button]                    │
│                                  │
└──────────────────────────────────┘
```

### Send Message

```
TYPE: "Is this still available?"
CLICK: [Send]
↓
Message appears immediately
↓
Seller gets notification (if online)
↓
Seller replies
↓
You see reply in real-time (Socket.io)
```

---

## PART 9: POST YOUR FIRST AD (2 minutes)

### Click "SELL" Button

```
Top navbar (right side):
Click [➕ SELL]
↓
Requires login (will redirect if not logged in)
↓
Ad posting form opens
```

### Fill Product Details

```
┌────────────────────────────────┐
│    Post Your Product           │
├────────────────────────────────┤
│                                │
│ Product Title:                 │
│ [My iPhone 13 for sale    ]    │
│                                │
│ Category:                      │
│ [Electronics ▼]               │
│                                │
│ Condition:                     │
│ [Like New ▼]                   │
│                                │
│ Description:                   │
│ [Excellent condition, 256GB... │
│  All accessories included...  ]│
│                                │
│ Price: ₹[50000]                │
│                                │
│ City: [Chandigarh ▼]           │
│                                │
│ Upload Image:                  │
│ [📁 Choose File] or [Drag]     │
│ Preview: [Image Thumbnail]     │
│                                │
│ [✓ Active] [○ Draft]           │
│                                │
│ [  Post Ad  ]                  │
│                                │
└────────────────────────────────┘
```

### Fill Example Data

```
EXAMPLE PRODUCT:
├─ Title: "Canon DSLR Camera EOS 600D"
├─ Category: Electronics
├─ Condition: Good
├─ Price: ₹35,000
├─ Description: "Perfect for photography students.
│               Works great, minor scratches only"
├─ City: Chandigarh
├─ Image: [Upload photo.jpg]
└─ Status: Active ✓
```

### Click "Post Ad"

**What Happens:**
1. Form validated
2. Image uploaded to `/uploads` folder
3. Listing saved to MongoDB
4. New listing ID generated
5. Success message: "✅ Ad posted successfully! 🚀"
6. Redirected to home page
7. Your new product appears first in search

---

## PART 10: MANAGE YOUR LISTINGS (1 minute)

### View "My Ads"

```
Click Profile Icon (top-right)
↓
Click "My Ads"
↓
Page shows all your listings:

┌────────────────────────────────────┐
│          My Advertisements         │
├────────────────────────────────────┤
│ Total Posted: 5 | Active: 4        │
│                                    │
│ 1. Canon DSLR ₹35,000              │
│    Status: 🟢 Active               │
│    Posted: 2 hours ago             │
│    Views: 23                       │
│    [Edit] [Deactivate] [Delete]   │
│                                    │
│ 2. iPhone 13 ₹50,000               │
│    Status: 🟢 Active               │
│    Posted: 5 days ago              │
│    Views: 156                      │
│    Interested: 3 buyers            │
│    [Edit] [Deactivate] [Delete]   │
│                                    │
│ 3. MacBook ₹120,000                │
│    Status: 🔴 Inactive             │
│    Posted: 1 week ago              │
│    [Activate] [Delete]             │
│                                    │
└────────────────────────────────────┘
```

### Edit Listing

```
Click [Edit] on any listing
↓
Update: Title, Price, Description, Category
↓
Click [Save Changes]
↓
Listing updated in real-time
↓
Buyers see updated info immediately
```

### Deactivate Listing

```
Click [Deactivate] on listing
↓
Product hidden from search results
↓
Buyers can't find it
↓
But you can reactivate anytime
```

### Delete Listing

```
Click [Delete] on listing
↓
"Are you sure?" confirmation
↓
Click [Confirm Delete]
↓
Product permanently removed
↓
Cannot undo (use deactivate to keep)
```

---

## PART 11: ADMIN DASHBOARD (2 minutes)

### Login as Admin

```
Click "Login" → Enter:
Email:    admin@chitkara.edu.in
Password: admin123
↓
Click "Login"
↓
Redirected to home page
↓
Notice: "Admin" link appears in navbar!
```

### Access Admin Panel

```
Click "Admin" in navbar
↓
Page shows: Admin Dashboard
```

### Dashboard Overview

```
┌─────────────────────────────────────────┐
│          Admin Dashboard                │
├─────────────────────────────────────────┤
│                                         │
│ [Dashboard] [Users] [Listings]         │
│                                         │
│ STATISTICS:                             │
│ ┌────────┐  ┌────────┐                 │
│ │ Users  │  │ Active │                 │
│ │  157   │  │ Users  │                 │
│ │        │  │  142   │                 │
│ └────────┘  └────────┘                 │
│ ┌────────┐  ┌────────┐                 │
│ │Listings│  │ Active │                 │
│ │  1,203 │  │Listings│                 │
│ │        │  │  987   │                 │
│ └────────┘  └────────┘                 │
│                                         │
│ RECENT USERS:                           │
│ 1. Sanjay Kumar (sanjay@chitkara)      │
│    Joined: Today                        │
│                                         │
│ 2. Priya Singh (priya@chitkara)        │
│    Joined: 3 days ago                  │
│                                         │
│ RECENT LISTINGS:                        │
│ 1. MacBook Pro - ₹120,000              │
│    Posted: 2 hours ago                 │
│                                         │
│ 2. Honda City - ₹800,000               │
│    Posted: 1 day ago                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## PART 12: MANAGE USERS (Admin Only)

### Click "Users" Tab

```
Click "Users" tab
↓
Page shows all users table:

┌───────────────────────────────────────────┐
│         User Management                   │
│ Search: [__________________] 🔍           │
├───────────────────────────────────────────┤
│ Name        │ Email          │Status│Action
│─────────────┼────────────────┼──────┼──────
│ Rahul Sh.   │rahul@chitkara  │ 🟢  │ [!]
│ Priya Singh │priya@chitkara  │ 🟢  │ [!]
│ Arjun Kumar │arjun@chitkara  │ 🟢  │ [!]
│ Sneha Patel │sneha@chitkara  │ 🔴  │ [!]
│ Vikram G.   │vikram@chitkara │ 🟢  │ [!]
│                                         │
│ Page 1 of 8  [< 1 2 3 ... >]            │
└───────────────────────────────────────────┘
```

### Search for User

```
Type in search: "priya"
↓
Results filter instantly:
- Priya Singh (priya@chitkara.edu.in)
```

### Deactivate User

```
Find user row: "Sneha Patel"
Click [⚙️ Actions]
↓
Menu shows:
├─ [🔴 Deactivate User]
├─ [🗑️  Delete User]
└─ [✏️  Edit]

Click [Deactivate User]
↓
Confirmation: "Are you sure?"
Click [Confirm]
↓
User status changes: 🟢 → 🔴
↓
Sneha can't login anymore
(But account still exists)
```

### Delete User

```
Click [⚙️ Actions]
Click [🗑️ Delete User]
↓
Confirmation: "Delete permanently?"
Click [Confirm]
↓
User completely removed from database
↓
All their listings deleted too
```

---

## PART 13: MODERATE LISTINGS (Admin Only)

### Click "Listings" Tab

```
Click "Listings" tab
↓
Page shows all listings:

┌─────────────────────────────────────┐
│      Listing Moderation             │
│ Search: [__________________] 🔍     │
├─────────────────────────────────────┤
│ Title    │Seller │ Status │ Action  │
│──────────┼───────┼────────┼─────────│
│ iPhone14 │Rahul  │  🟢   │ [!]     │
│ Canon DS │Sanjay │  🟢   │ [!]     │
│ MacBook  │Priya  │  🟡   │ [!]     │
│ Honda    │Arjun  │  🔴   │ [!]     │
│ PS5      │Sneha  │  🟢   │ [!]     │
│                                     │
│ Page 1 of 61  [< 1 2 3 ... >]       │
└─────────────────────────────────────┘

🟢 = Active (visible to buyers)
🟡 = Pending (awaiting approval)
🔴 = Inactive (hidden from buyers)
```

### Search Listings

```
Type in search: "iphone"
↓
Results:
- iPhone 14 Pro Max
- iPhone 13
- iPhone 12

Shows all iphone listings
```

### Deactivate Inappropriate Listing

```
Find: "Suspicious Product - ₹5"
Status: 🟢 Active
Click [⚙️ Actions]
↓
Menu:
├─ [🔴 Deactivate]
├─ [🗑️  Delete]
├─ [✏️  Edit]
└─ [📝 Reason]

Click [Deactivate]
↓
Status changes: 🟢 → 🔴
↓
Hidden from all buyers
↓
Seller gets notification
```

### Delete Inappropriate Content

```
Find: "Adult Content Product"
Click [⚙️ Actions]
Click [🗑️ Delete]
↓
Confirmation: "Delete permanently?"
Click [Confirm Delete]
↓
Product completely removed
↓
Cannot be recovered
```

---

## PART 14: REAL-TIME MESSAGING (Multi-user)

### Test Messaging

**User A (Terminal 1) - Rahul:**
```
1. Login: rahul.sharma@chitkara.edu.in / student123
2. Click someone else's product
3. Click [💬 Message Seller]
4. Type: "Is this available?"
5. Click [Send]
```

**User B (Incognito - New Browser Tab) - Priya:**
```
1. Login: priya.singh@chitkara.edu.in / student123
2. Click [💬 Messages] icon
3. See Rahul's message instantly!
4. Type reply: "Yes, available!"
5. Click [Send]
```

**Back to User A (First tab):**
```
Priya's reply appears in real-time!
No need to refresh!
(Socket.io magic ✨)
```

---

## PART 15: TESTING COMPLETE! 🎉

### You've Learned:
✅ Register & Login
✅ Browse Products
✅ Search & Filter
✅ View Product Details
✅ Add to Wishlist
✅ Message Sellers
✅ Post Advertisements
✅ Manage Your Listings
✅ Admin Dashboard
✅ Manage Users
✅ Moderate Listings
✅ Real-time Messaging

### Next Steps:
1. **Explore More**: Try all features with different accounts
2. **Test Edge Cases**: Try invalid inputs, error scenarios
3. **Performance**: Post 100+ listings, see how system scales
4. **Security**: Try unauthorized access, see protection
5. **Production**: Deploy to cloud when ready

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Server won't start | Check ports 4000, MongoDB running |
| Can't login | Verify @chitkara.edu.in email |
| No image upload | Check file size < 5MB, try JPG |
| Messages not real-time | Refresh page, check browser console |
| Admin panel blank | Must be logged in as admin role |

---

**🎓 Congratulations! You now fully understand CampusXchange!**
