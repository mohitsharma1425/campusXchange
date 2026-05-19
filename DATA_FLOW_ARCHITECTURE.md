# CampusXchange - Data Flow & Architecture Guide

## 🏗️ System Architecture Overview

```
┌──────────────────┐
│   Browser/React  │  ← User interacts here
│  (Frontend)      │
└────────┬─────────┘
         │ HTTP/WebSocket (Port 5173)
         │
┌────────▼──────────────────────────┐
│   Express.js Server               │
│   (Backend API)                   │
│   Port: 4000                      │
│   ├─ Routes (/api/...)            │
│   ├─ Middleware (Auth, Validation)│
│   ├─ Controllers (Logic)          │
│   └─ Socket.io (Real-time)        │
└────────┬──────────────────────────┘
         │ MongoDB Protocol (Port 27017)
         │
┌────────▼──────────────────┐
│   MongoDB Database        │
│   Collections:            │
│   ├─ users               │
│   ├─ listings            │
│   └─ messages            │
└───────────────────────────┘
```

---

## 📊 User Registration Data Flow

### Step 1: User Fills Form (Frontend)
```
Browser → Form Input
├─ Name: "Sanjay Kumar"
├─ Email: "sanjay.kumar@chitkara.edu.in"
├─ Password: "MyPass123"
└─ City: "Chandigarh"

↓ User clicks "Register"
```

### Step 2: Form Validation (Frontend)
```
React validates BEFORE sending:
✓ Email format check (@chitkara.edu.in)
✓ Password length (min 6)
✓ Name not empty
✓ City selected

If invalid: Show error, don't send
If valid: Continue to server
```

### Step 3: Send to Backend (HTTP POST)
```
Frontend sends:
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Sanjay Kumar",
  "email": "sanjay.kumar@chitkara.edu.in",
  "password": "MyPass123",
  "city": "Chandigarh"
}
```

### Step 4: Backend Processing
```
Express Server receives request:

1. Input Validation Middleware
   ✓ Validate all fields present
   ✓ Validate email format
   ✓ Validate password length
   → If invalid: Return error 400

2. Check Email Doesn't Exist
   Query MongoDB: users.findOne({email: "sanjay.kumar@chitkara.edu.in"})
   → If exists: Return error 409 (Conflict)
   → If not exists: Continue

3. Hash Password with bcryptjs
   Original: "MyPass123"
   Hashed: "$2a$10$..." (10 salt rounds)
   
4. Create User Document
   {
     _id: ObjectId(...),
     name: "Sanjay Kumar",
     email: "sanjay.kumar@chitkara.edu.in",
     password: "$2a$10$...", ← hashed
     city: "Chandigarh",
     role: "user",
     isActive: true,
     isVerified: true,
     createdAt: 2026-04-27T10:30:00Z,
     updatedAt: 2026-04-27T10:30:00Z
   }

5. Save to MongoDB
   db.users.insertOne({...})
   → Success: User created

6. Generate JWT Token
   JWT contains:
   {
     userId: "65f1234567890abc",
     email: "sanjay.kumar@chitkara.edu.in",
     role: "user"
   }
   Signed with JWT_SECRET from .env

7. Send Response to Frontend
   HTTP 201 Created
   {
     message: "Registration successful",
     token: "eyJhbGc...", ← JWT token
     user: {
       id: "65f1234567890abc",
       name: "Sanjay Kumar",
       email: "sanjay.kumar@chitkara.edu.in",
       role: "user"
     }
   }
```

### Step 5: Frontend Receives Response
```
React App:

1. Check status code
   200-299 = Success
   4xx = Error
   5xx = Server error

2. If Success:
   ✓ Save JWT token to localStorage
   localStorage.setItem('token', 'eyJhbGc...')
   
   ✓ Save user info to Context/State
   setUser({
     id: "65f1234567890abc",
     name: "Sanjay Kumar",
     email: "sanjay.kumar@chitkara.edu.in"
   })
   
   ✓ Show success toast: "✅ Registration successful!"
   
   ✓ Auto-login user
   
   ✓ Redirect to home page

3. If Error:
   ✓ Show error message
   ✓ Don't save token
   ✓ Stay on registration page
```

---

## 🔐 Login Data Flow

### Step 1: User Enters Credentials
```
Browser Form:
├─ Email: "sanjay.kumar@chitkara.edu.in"
└─ Password: "MyPass123"

↓ User clicks "Login"
```

### Step 2: Send to Backend
```
POST http://localhost:4000/api/auth/login

{
  "email": "sanjay.kumar@chitkara.edu.in",
  "password": "MyPass123"
}
```

### Step 3: Backend Authentication
```
Express Server:

1. Find User in Database
   db.users.findOne({email: "sanjay.kumar@chitkara.edu.in"})
   
   Result:
   {
     _id: ObjectId,
     name: "Sanjay Kumar",
     email: "sanjay.kumar@chitkara.edu.in",
     password: "$2a$10$...", ← hashed password
     role: "user",
     isActive: true
   }

2. Compare Passwords
   Plain: "MyPass123"
   Hashed in DB: "$2a$10$..."
   
   Use bcryptjs.compare()
   bcrypt.compare("MyPass123", "$2a$10$...")
   → Returns: true or false

3. If Match:
   ✓ Check if user is active (isActive: true)
   ✓ Generate JWT token
   ✓ Send token to frontend

4. If No Match:
   ✗ Return error: "Invalid credentials"
   ✗ Log attempt for security
   ✗ No token sent
```

### Step 4: Frontend Stores Token
```
Success Response:
{
  token: "eyJhbGc...",
  user: {
    id: "65f1234567890abc",
    name: "Sanjay Kumar"
  }
}

React saves:
localStorage.setItem('token', 'eyJhbGc...')
setState(user: {...})
Navigate to home page
```

---

## 📤 Posting a Product (Advanced Flow)

### Step 1: User Fills Form & Uploads Image

```
Frontend Form:
├─ Title: "iPhone 14 Pro Max"
├─ Description: "Excellent condition"
├─ Category: "electronics"
├─ Price: 65000
├─ City: "Chandigarh"
├─ Image: [file.jpg] ← uploaded by user
└─ Status: "active"

↓ User clicks "Post Ad"
```

### Step 2: Image Processing

```
Frontend (JavaScript):

1. Image received from input
   File object: {
     name: "photo.jpg",
     size: 2456789, ← bytes
     type: "image/jpeg"
   }

2. Validate image
   ✓ File size < 5MB (5242880 bytes)
   ✓ Type is image/* (jpg, png, jpeg)
   
   If invalid: Show error

3. Create FormData (for multipart upload)
   formData = new FormData()
   formData.append('title', 'iPhone 14 Pro Max')
   formData.append('description', '...')
   formData.append('price', 65000)
   formData.append('image', file.jpg)
   ... other fields
```

### Step 3: Send to Backend

```
Frontend sends:
POST http://localhost:4000/api/listings
Headers:
  Authorization: Bearer eyJhbGc... ← JWT token
Content-Type: multipart/form-data

Body (FormData):
  title: "iPhone 14 Pro Max"
  description: "Excellent condition"
  price: 65000
  city: "Chandigarh"
  image: [file bytes]
  ... and so on
```

### Step 4: Backend Processes Image (Multer)

```
Express Server receives:

1. Middleware: authenticateToken
   ✓ Extract JWT from Authorization header
   ✓ Verify JWT signature
   ✓ Extract userId from JWT
   ✓ Attach user to request object
   → If invalid: Return 401 Unauthorized

2. Middleware: Multer (Image Upload)
   ✓ Receive image file
   ✓ Validate file size < 5MB
   ✓ Validate MIME type (image/jpeg, image/png)
   ✓ Save to disk: /uploads/[unique-name].jpg
   
   Generated filename: "img_1619876543_abc123.jpg"
   File saved to: "c:/...project/uploads/img_1619876543_abc123.jpg"
   
   req.file = {
     filename: "img_1619876543_abc123.jpg",
     path: "/uploads/img_1619876543_abc123.jpg",
     size: 2456789
   }

3. Input Validation
   ✓ Title: non-empty string
   ✓ Description: non-empty string
   ✓ Price: positive number
   ✓ Category: valid category from list
   ✓ City: valid city from list
   
   If validation fails: Delete uploaded image, return error
```

### Step 5: Save to Database

```
Backend:

1. Create Listing Document
   {
     _id: ObjectId(...),
     title: "iPhone 14 Pro Max",
     description: "Excellent condition",
     category: "electronics",
     categoryLabel: "Electronics",
     price: 65000,
     city: "Chandigarh",
     image: "/uploads/img_1619876543_abc123.jpg",
     seller: {
       _id: "65f1234567890abc",
       name: "Sanjay Kumar",
       email: "sanjay.kumar@chitkara.edu.in"
     },
     status: "active",
     views: 0,
     createdAt: 2026-04-27T10:35:00Z,
     updatedAt: 2026-04-27T10:35:00Z
   }

2. Insert into MongoDB
   db.listings.insertOne({...})
   → Returns: inserted ObjectId

3. Populate seller data (using MongoDB populate)
   Fetch full seller details from users collection
   Attach to listing response
```

### Step 6: Send Response to Frontend

```
Backend Response:
HTTP 201 Created

{
  _id: "65f1234567890xyz",
  title: "iPhone 14 Pro Max",
  price: 65000,
  image: "/uploads/img_1619876543_abc123.jpg",
  seller: {
    name: "Sanjay Kumar",
    email: "sanjay.kumar@chitkara.edu.in"
  },
  status: "active",
  createdAt: "2026-04-27T10:35:00Z"
}
```

### Step 7: Frontend Updates UI

```
React:

1. Receive response
   ✓ Status 201 = Success

2. Show success toast
   "✅ Ad posted successfully! 🚀"

3. Update global state
   setListings([newListing, ...previousListings])

4. Navigate to home page
   Router.push('/')

5. New listing appears at top of listings!
```

---

## 🔍 Search & Filter Data Flow

### Step 1: User Performs Search

```
Frontend:
User types "iPhone" in search bar
↓
React updates state: searchQuery = "iPhone"
↓
onChange event triggered
```

### Step 2: Send Search Request

```
Frontend sends:
GET http://localhost:4000/api/listings?search=iPhone&category=electronics&city=Chandigarh

Query Parameters:
├─ search: "iPhone"
├─ category: "electronics"
├─ city: "Chandigarh"
└─ page: 1 (pagination)
```

### Step 3: Backend Filters

```
Backend:

1. Build MongoDB Query
   query = {
     status: "active", ← only active listings
     title: { $regex: "iPhone", $options: "i" }, ← case-insensitive
     category: "electronics",
     city: "Chandigarh"
   }

2. Execute Query
   db.listings
     .find(query)
     .skip(0) ← pagination
     .limit(20) ← 20 per page
     .populate('seller') ← get seller details
     .sort({ createdAt: -1 }) ← newest first

3. Count Total Results
   db.listings.countDocuments(query)
   → Returns: 47 total matches

4. Response Data
   {
     listings: [
       {
         _id: "...",
         title: "iPhone 14 Pro Max",
         price: 65000,
         image: "/uploads/...",
         seller: {...}
       },
       { ... 19 more ...}
     ],
     pagination: {
       page: 1,
       limit: 20,
       total: 47,
       pages: 3
     }
   }
```

### Step 4: Frontend Renders Results

```
React:
1. Receive 20 listings
2. State: listings = [20 listings]
3. Map over array:
   listings.map(listing => (
     <ListingCard listing={listing} />
   ))
4. Display cards in grid
5. Show pagination: "Page 1 of 3"
```

---

## 💬 Real-Time Messaging (Socket.io)

### Step 1: User A Sends Message

```
Frontend (User A):
1. Type message: "Is this available?"
2. Click Send
3. Emit Socket event:
   socket.emit('sendMessage', {
     recipientId: "65f1234567890def",
     productId: "65f1234567890xyz",
     message: "Is this available?"
   })
```

### Step 2: Backend Receives (Socket Listener)

```
Backend (Socket.io):

1. Listen for 'sendMessage' event
   io.on('connection', (socket) => {
     socket.on('sendMessage', (data) => {
       console.log("Message received:", data)
     })
   })

2. Validate Data
   ✓ Sender authenticated
   ✓ Recipient exists
   ✓ Message not empty

3. Save to MongoDB (optional)
   db.messages.insertOne({
     from: "65f1234567890abc",
     to: "65f1234567890def",
     productId: "65f1234567890xyz",
     message: "Is this available?",
     timestamp: 2026-04-27T10:40:00Z
   })

4. Broadcast to Recipient
   Find recipient's socket connection
   io.to(recipientSocket).emit('receiveMessage', {
     from: "Sanjay Kumar",
     message: "Is this available?",
     timestamp: "10:40 AM"
   })
```

### Step 3: User B Receives (Real-time)

```
Frontend (User B):
1. Socket listener receives event
   socket.on('receiveMessage', (data) => {
     console.log("New message:", data)
   })

2. Update state
   setMessages([...messages, newMessage])

3. UI Updates INSTANTLY
   New message appears in chat window
   No page refresh needed!
   No polling!
```

### Step 4: User B Replies

```
Same process in reverse:
User B types reply → Socket emits → Backend broadcasts → User A receives instantly
```

---

## 🔑 JWT Token Flow (Authentication)

### Token Creation (Login/Register)

```
Backend:
1. After verifying credentials:
   jwt.sign(
     payload = {
       userId: "65f1234567890abc",
       email: "sanjay@chitkara.edu.in",
       role: "user"
     },
     secret = process.env.JWT_SECRET,
     options = {
       expiresIn: "7d"
     }
   )
   → Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

2. Send token to frontend
```

### Token Storage (Frontend)

```
React:
localStorage.setItem('token', 'eyJhbGc...')

Now token stored in browser:
├─ Survives page refresh
├─ Accessible to fetch requests
└─ Sent with every API call
```

### Token Usage (API Requests)

```
Frontend (Every protected request):

fetch('http://localhost:4000/api/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` ← JWT token sent here
  },
  body: JSON.stringify(...)
})
```

### Token Verification (Backend)

```
Backend (Middleware):

1. Extract token from Authorization header
   authHeader = "Bearer eyJhbGc..."
   token = "eyJhbGc..."

2. Verify JWT signature
   jwt.verify(
     token,
     JWT_SECRET
   )
   → If valid: Decode payload
   → If invalid: Return 401 Unauthorized

3. Extract user info from payload
   {
     userId: "65f1234567890abc",
     email: "sanjay@chitkara.edu.in",
     role: "user"
   }

4. Attach to request
   req.user = {
     userId: "65f1234567890abc",
     role: "user"
   }

5. Continue to route handler
   Route handler can now access req.user
```

---

## 🛡️ Security & Validation Flow

### Input Validation

```
Frontend Validation:
Email → /^[^\s@]+@chitkara\.edu\.in$/
Password → length >= 6
Price → /^\d+(\.\d{2})?$/
Phone → /^\d{10}$/ (if provided)

Backend Validation:
express-validator middleware:

app.post('/api/listings', [
  body('title').trim().notEmpty(),
  body('price').isNumeric(),
  body('email').isEmail().matches(/@chitkara\.edu\.in$/),
  body('image').custom(validateImageFile)
])

If validation fails: Return 422 Unprocessable Entity
If validation passes: Continue to handler
```

### Password Security

```
Plain password: "MyPass123"
↓
bcryptjs.hash("MyPass123", 10 salt rounds)
↓
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E50Dmk0m"
↓
Stored in MongoDB (never store plain password!)
↓
When user logs in:
bcryptjs.compare("MyPass123", "$2a$10$...")
↓
Returns: true (password matches)
```

### Authorization (Role-based Access)

```
Backend Middleware:

// Only admins can access
app.get('/api/admin/stats', 
  authenticateToken, ← checks JWT is valid
  requireAdmin, ← checks role === 'admin'
  handler
)

Admin check:
if (req.user.role !== 'admin') {
  return res.status(403).send('Forbidden')
}
```

---

## 📊 Database Schema Relationships

### User Collection
```javascript
{
  _id: ObjectId("65f1..."), ← Primary Key
  name: String,
  email: String (unique index),
  password: String (hashed),
  role: String, ← "user" or "admin"
  city: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Listing Collection
```javascript
{
  _id: ObjectId("65f2..."), ← Primary Key
  title: String,
  description: String,
  category: String,
  price: Number,
  city: String,
  image: String (file path),
  seller: {
    _id: ObjectId("65f1...") ← Foreign Key reference to User
    name: String,
    email: String
  },
  status: String, ← "active" or "inactive"
  createdAt: Date,
  updatedAt: Date
}
```

### Relationship Diagram
```
User (1)
  ↓
  ↕ (One-to-Many)
  ↓
Listing (Many)

One User can post Many Listings
One Listing belongs to One User

Example:
User: Sanjay Kumar
├─ Listing: iPhone 14 (₹65k)
├─ Listing: MacBook (₹120k)
├─ Listing: Canon DSLR (₹35k)
└─ Listing: Sofa Set (₹25k)
```

---

## 🔄 Admin Moderation Data Flow

### Step 1: Admin Views Users

```
Frontend:
Click "Admin" → "Users" tab
↓
Send request:
GET http://localhost:4000/api/admin/users?page=1&limit=20

Backend:
1. Verify admin role (middleware)
2. Query users collection:
   db.users
     .find({})
     .skip(0)
     .limit(20)
     .sort({ createdAt: -1 })
3. Return paginated user list
```

### Step 2: Admin Deactivates User

```
Frontend:
Click [Deactivate] on user
↓
Send request:
PUT http://localhost:4000/api/admin/users/65f1...
{
  isActive: false
}

Backend:
1. Verify admin role
2. Update user document:
   db.users.updateOne(
     { _id: ObjectId("65f1...") },
     { $set: { isActive: false } }
   )
3. Return updated user
   
Frontend:
Show success: "✅ User deactivated"
Update UI: Status changes to 🔴

Result:
User cannot login anymore!
(If they try, backend checks isActive:false)
```

### Step 3: Admin Deletes Listing

```
Frontend:
Click [Delete] on listing
↓
Send request:
DELETE http://localhost:4000/api/admin/listings/65f2...

Backend:
1. Verify admin role
2. Find listing
3. Delete associated image file:
   fs.unlink("/uploads/img_...")
4. Delete from database:
   db.listings.deleteOne({ _id: ObjectId("65f2...") })
5. Return success

Frontend:
Remove from table
Show: "✅ Listing deleted"

Result:
Product completely removed!
Buyers can't find it!
```

---

## 📈 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ USER ACTION                                                  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND VALIDATION                                         │
│ (Check format, type, required fields)                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ HTTP REQUEST TO BACKEND                                     │
│ (With JWT token in Authorization header)                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND AUTHENTICATION                                      │
│ (Verify JWT token, extract user info)                      │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND AUTHORIZATION                                       │
│ (Check role: admin, user, etc.)                            │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND VALIDATION                                          │
│ (Validate input data, file types, sizes)                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE OPERATION                                          │
│ (INSERT, UPDATE, DELETE, SELECT)                           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ SEND RESPONSE TO FRONTEND                                   │
│ (JSON with status, data, errors)                           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND UPDATE UI                                          │
│ (Update state, show notifications, navigate)               │
└─────────────────────────────────────────────────────────────┘
```

---

**Version**: 2.0.0
**Last Updated**: April 2026
