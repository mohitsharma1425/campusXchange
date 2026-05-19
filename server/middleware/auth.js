const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ROLES = Object.freeze({
  STUDENT: 'student',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
});

const ROLE_VALUES = Object.values(ROLES);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to access this resource' });
    }
    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(ROLES.ADMIN);

// Middleware to check if user is moderator or admin
const requireModerator = requireRole(ROLES.MODERATOR, ROLES.ADMIN);

const isElevatedRole = (role) => role === ROLES.ADMIN || role === ROLES.MODERATOR;

const isValidRole = (role) => ROLE_VALUES.includes(role);

const canManageListing = (user, listing) => {
  if (!user || !listing) return false;
  if (isElevatedRole(user.role)) return true;

  const sellerId = listing.seller?._id || listing.seller;
  return sellerId && sellerId.toString() === user._id.toString();
};

const canManageUser = (actor, targetUser) => {
  if (!actor || !targetUser) return false;
  if (actor.role === ROLES.ADMIN) return true;
  return actor._id.toString() === targetUser._id.toString();
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  city: user.city,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  isActive: user.isActive,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
});

const ensureAdminCanChangeUser = async (actor, targetUser, updates) => {
  if (!actor || actor.role !== ROLES.ADMIN) {
    return { allowed: false, error: 'Admin access required' };
  }

  if (targetUser._id.toString() === actor._id.toString()) {
    if (updates.role && updates.role !== ROLES.ADMIN) {
      return { allowed: false, error: 'You cannot remove your own admin role' };
    }
    if (updates.isActive === false) {
      return { allowed: false, error: 'You cannot deactivate your own account' };
    }
  }

  if (targetUser.role === ROLES.ADMIN && ((updates.role && updates.role !== ROLES.ADMIN) || updates.isActive === false)) {
    const activeAdminCount = await User.countDocuments({
      role: ROLES.ADMIN,
      isActive: true,
      _id: { $ne: targetUser._id },
    });

    if (activeAdminCount < 1) {
      return { allowed: false, error: 'At least one active admin must remain' };
    }
  }

  return { allowed: true };
};

// Middleware to check if user is the requested account or admin
const requireSelfOrAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role !== 'admin' && req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  ROLES,
  ROLE_VALUES,
  generateToken,
  authenticateToken,
  requireRole,
  requireAdmin,
  requireModerator,
  requireSelfOrAdmin,
  requireOwnershipOrAdmin,
  isElevatedRole,
  isValidRole,
  canManageListing,
  canManageUser,
  toSafeUser,
  ensureAdminCanChangeUser,
};
