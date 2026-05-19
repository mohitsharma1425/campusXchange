const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('./database');
const { User, Listing, Conversation } = require('./models');
const { CATEGORIES } = require('./data');
const {
  ROLES,
  authenticateToken,
  requireAdmin,
  requireModerator,
  generateToken,
  canManageListing,
  toSafeUser,
  ensureAdminCanChangeUser,
} = require('./middleware/auth');
const { validate, userValidation, listingValidation } = require('./middleware/validation');
const { errorHandler, notFound, asyncHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
        if (origin === allowedOrigin || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

connectDB();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('_id isActive');
    if (!user || !user.isActive) {
      return next(new Error('Invalid user'));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
});

const emitConversationUpdate = (conversation) => {
  const payload = { conversation };
  io.to(`user:${conversation.buyer._id.toString()}`).emit('conversation:updated', payload);
  io.to(`user:${conversation.seller._id.toString()}`).emit('conversation:updated', payload);
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Allow localhost on any port in development, or specific URL in production
const corsOptions = {
  origin: (origin, callback) => {
    if (isProduction) {
      // In production, only allow the specified CLIENT_URL
      const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
      if (origin === allowedOrigin || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow any localhost origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});
app.use('/api/', limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts. Please wait a few minutes before trying again.',
    });
  },
});
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

app.get('/api/listings', asyncHandler(async (req, res) => {
  const { categoryId, city, q, page = 1, limit = 12, sort = 'newest' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let query = { status: 'active', isApproved: true };

  if (categoryId) {
    query.categoryId = categoryId;
  }
  if (city) {
    query.city = city;
  }
  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [
      { title: regex },
      { description: regex },
      { categoryLabel: regex }
    ];
  }

  let sortOption = { createdAt: -1 }; // newest first
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'price-low') sortOption = { price: 1 };
  if (sort === 'price-high') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { views: -1 };

  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('seller', 'name email isVerified')
    .sort(sortOption)
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  res.json({
    listings,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    }
  });
}));

app.get('/api/listings/:id', asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate('seller', 'name email phone isVerified profileImage')
    .populate('favorites', 'name');

  if (!listing || listing.status !== 'active') {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Increment view count
  await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.json(listing);
}));

app.post('/api/auth/register', validate(userValidation.register), asyncHandler(async (req, res) => {
  const { name, email, password, city, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = new User({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    city: city || 'Chandigarh',
    phone: phone || '',
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: toSafeUser(user),
  });
}));

app.post('/api/auth/login', validate(userValidation.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(401).json({ error: 'Account is deactivated' });
  }

  if (user.isLocked) {
    return res.status(423).json({ error: 'Account is temporarily locked due to too many failed login attempts' });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    await user.incLoginAttempts();
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  await user.resetLoginAttempts();
  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: toSafeUser(user),
  });
}));

app.get('/api/auth/me', authenticateToken, asyncHandler(async (req, res) => {
  res.json({ user: toSafeUser(req.user) });
}));

app.put('/api/auth/profile', authenticateToken, validate(userValidation.updateProfile), asyncHandler(async (req, res) => {
  const { name, city, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name && { name: name.trim() }),
      ...(city && { city }),
      ...(phone && { phone }),
      updatedAt: new Date(),
    },
    { new: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: toSafeUser(user),
  });
}));

app.post('/api/auth/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Current password and new password (min 6 chars) are required' });
  }

  const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  req.user.password = newPassword;
  await req.user.save();

  res.json({ message: 'Password changed successfully' });
}));

app.post('/api/listings', authenticateToken, validate(listingValidation.create), asyncHandler(async (req, res) => {
  const { categoryId, title, description, price, condition, city, image, images } = req.body;

  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) {
    return res.status(400).json({ error: 'Invalid categoryId' });
  }

  const newListing = new Listing({
    categoryId,
    categoryLabel: category.label,
    title: title.trim(),
    price: Number(price) || 0,
    condition: condition || 'Good',
    city,
    location: `${city}, India`,
    description: description.trim(),
    image: image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80',
    images: images || [image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80'],
    seller: req.user._id,
    sellerEmail: req.user.email,
    verified: req.user.isVerified,
    status: 'active',
    isApproved: true,
  });

  await newListing.save();

  // Populate seller info
  await newListing.populate('seller', 'name email');

  res.status(201).json(newListing);
}));

app.get('/api/my/listings', authenticateToken, asyncHandler(async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id })
    .populate('seller', 'name email isVerified')
    .sort({ createdAt: -1 });

  res.json({ listings });
}));

app.put('/api/listings/:id', authenticateToken, validate(listingValidation.update), asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (!canManageListing(req.user, listing)) {
    return res.status(403).json({ error: 'You can only update your own listings' });
  }

  const {
    categoryId,
    title,
    description,
    price,
    condition,
    city,
    image,
    images,
    status,
    isApproved,
  } = req.body;

  if (categoryId) {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
    listing.categoryId = categoryId;
    listing.categoryLabel = category.label;
  }

  if (title) listing.title = title.trim();
  if (description) listing.description = description.trim();
  if (typeof price !== 'undefined') listing.price = Number(price) || 0;
  if (condition) listing.condition = condition;
  if (city) {
    listing.city = city;
    listing.location = `${city}, India`;
  }
  if (image) listing.image = image;
  if (Array.isArray(images)) listing.images = images;

  if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.MODERATOR) {
    if (status) listing.status = status;
    if (typeof isApproved === 'boolean') listing.isApproved = isApproved;
  } else if (status && ['active', 'sold', 'inactive'].includes(status)) {
    listing.status = status;
  }

  listing.updatedAt = new Date();
  await listing.save();
  await listing.populate('seller', 'name email isVerified');

  res.json({ message: 'Listing updated successfully', listing });
}));

app.delete('/api/listings/:id', authenticateToken, asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (!canManageListing(req.user, listing)) {
    return res.status(403).json({ error: 'You can only delete your own listings' });
  }

  await listing.deleteOne();
  await Conversation.deleteMany({ listing: req.params.id });
  res.json({ message: 'Listing deleted successfully' });
}));

const populateConversationQuery = (query) => query
  .populate('listing', 'title price image status')
  .populate('buyer', 'name email profileImage')
  .populate('seller', 'name email profileImage');

const populateConversationDoc = (conversation) => conversation.populate([
  { path: 'listing', select: 'title price image status' },
  { path: 'buyer', select: 'name email profileImage' },
  { path: 'seller', select: 'name email profileImage' },
]);

const canAccessConversation = (conversation, userId) => {
  return conversation.buyer._id.toString() === userId.toString()
    || conversation.seller._id.toString() === userId.toString();
};

app.get('/api/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const conversations = await populateConversationQuery(
    Conversation.find({
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id },
      ],
    })
  ).sort({ lastMessageAt: -1 });

  res.json({ conversations });
}));

app.post('/api/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const { listingId, text } = req.body;
  const messageText = String(text || '').trim();

  if (!listingId || !messageText) {
    return res.status(400).json({ error: 'Listing and message are required' });
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.seller.toString() === req.user._id.toString()) {
    return res.status(400).json({ error: 'You cannot start a conversation with yourself' });
  }

  const now = new Date();
  const conversation = await Conversation.findOneAndUpdate(
    {
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller,
    },
    {
      $setOnInsert: {
        listing: listing._id,
        buyer: req.user._id,
        seller: listing.seller,
        createdAt: now,
      },
      $push: {
        messages: {
          sender: req.user._id,
          text: messageText,
          createdAt: now,
        },
      },
      $set: {
        lastMessageAt: now,
        updatedAt: now,
      },
    },
    { new: true, upsert: true }
  );

  await populateConversationDoc(conversation);
  emitConversationUpdate(conversation);
  res.status(201).json({ conversation });
}));

app.post('/api/conversations/:id/messages', authenticateToken, asyncHandler(async (req, res) => {
  const messageText = String(req.body.text || '').trim();
  if (!messageText) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const conversation = await populateConversationQuery(Conversation.findById(req.params.id));
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  if (!canAccessConversation(conversation, req.user._id)) {
    return res.status(403).json({ error: 'You do not have access to this conversation' });
  }

  conversation.messages.push({
    sender: req.user._id,
    text: messageText,
    createdAt: new Date(),
  });
  conversation.lastMessageAt = new Date();
  conversation.updatedAt = new Date();
  await conversation.save();
  await populateConversationDoc(conversation);
  emitConversationUpdate(conversation);

  res.status(201).json({ conversation });
}));

// Admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, status } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }
  if (role) query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  res.json({
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    }
  });
}));

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, validate(userValidation.adminUpdate), asyncHandler(async (req, res) => {
  const { role, isActive, isVerified } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updates = {
    ...(role && { role }),
    ...(typeof isActive === 'boolean' && { isActive }),
    ...(typeof isVerified === 'boolean' && { isVerified }),
  };
  const permission = await ensureAdminCanChangeUser(req.user, user, updates);
  if (!permission.allowed) {
    return res.status(403).json({ error: permission.error });
  }

  Object.assign(user, updates, { updatedAt: new Date() });
  await user.save();

  res.json({ message: 'User updated successfully', user: toSafeUser(user) });
}));

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(403).json({ error: 'You cannot delete your own account' });
  }

  if (user.role === ROLES.ADMIN) {
    const activeAdminCount = await User.countDocuments({
      role: ROLES.ADMIN,
      isActive: true,
      _id: { $ne: user._id },
    });

    if (activeAdminCount < 1) {
      return res.status(403).json({ error: 'At least one active admin must remain' });
    }
  }

  // Also delete user's listings
  await Listing.deleteMany({ seller: req.params.id });
  await Conversation.deleteMany({
    $or: [
      { buyer: req.params.id },
      { seller: req.params.id },
    ],
  });
  await user.deleteOne();

  res.json({ message: 'User and their listings deleted successfully' });
}));

app.get('/api/admin/listings', authenticateToken, requireModerator, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, categoryId, search } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let query = {};
  if (status) query.status = status;
  if (categoryId) query.categoryId = categoryId;
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('seller', 'name email')
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  res.json({
    listings,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    }
  });
}));

app.put('/api/admin/listings/:id', authenticateToken, requireModerator, validate(listingValidation.update), asyncHandler(async (req, res) => {
  const { status, isApproved } = req.body;

  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      ...(status && { status }),
      ...(typeof isApproved === 'boolean' && { isApproved }),
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('seller', 'name email');

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.json({ message: 'Listing updated successfully', listing });
}));

app.delete('/api/admin/listings/:id', authenticateToken, requireModerator, asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  await Conversation.deleteMany({ listing: req.params.id });
  res.json({ message: 'Listing deleted successfully' });
}));

app.get('/api/admin/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalListings,
    activeListings,
    pendingListings,
    recentUsers,
    recentListings,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Listing.countDocuments(),
    Listing.countDocuments({ status: 'active' }),
    Listing.countDocuments({ status: 'pending' }),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
    Listing.find().sort({ createdAt: -1 }).limit(5).populate('seller', 'name'),
  ]);

  res.json({
    stats: {
      totalUsers,
      activeUsers,
      totalListings,
      activeListings,
      pendingListings,
    },
    recent: {
      users: recentUsers,
      listings: recentListings,
    }
  });
}));

// File upload route
app.post('/api/upload', authenticateToken, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
}));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`CampusXchange backend running on http://localhost:${PORT}`);
});
