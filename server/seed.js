const mongoose = require('mongoose');
const { User, Listing } = require('./models');
const { CATEGORIES } = require('./data');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@chitkara.edu.in',
      password: 'admin123',
      role: 'admin',
      city: 'Chandigarh',
      isVerified: true,
    });
    await adminUser.save();
    console.log('Admin user created');

    const moderatorUser = new User({
      name: 'Moderator User',
      email: 'moderator@chitkara.edu.in',
      password: 'moderator123',
      role: 'moderator',
      city: 'Chandigarh',
      isVerified: true,
    });
    await moderatorUser.save();
    console.log('Moderator user created');

    // Create sample students
    const students = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@chitkara.edu.in', city: 'Chandigarh', phone: '9876543210' },
      { name: 'Priya Singh', email: 'priya.singh@chitkara.edu.in', city: 'Baddi', phone: '9876543211' },
      { name: 'Arjun Kumar', email: 'arjun.kumar@chitkara.edu.in', city: 'Rajpura', phone: '9876543212' },
      { name: 'Sneha Patel', email: 'sneha.patel@chitkara.edu.in', city: 'Solan', phone: '9876543213' },
      { name: 'Vikram Gupta', email: 'vikram.gupta@chitkara.edu.in', city: 'Chandigarh', phone: '9876543214' },
    ];

    const createdStudents = [];
    for (const student of students) {
      const user = new User({
        ...student,
        password: 'student123',
        isVerified: true,
      });
      await user.save();
      createdStudents.push(user);
    }
    console.log('Sample students created');

    // Create sample listings
    const sampleListings = [
      {
        categoryId: 'electronics',
        title: 'MacBook Air M2 2023',
        price: 85000,
        condition: 'Like New',
        city: 'Chandigarh',
        description: 'Selling my MacBook Air M2 with 8GB RAM and 256GB SSD. Barely used, comes with original box and charger.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'],
      },
      {
        categoryId: 'books',
        title: 'Engineering Mathematics Textbook',
        price: 450,
        condition: 'Good',
        city: 'Baddi',
        description: 'Complete engineering mathematics book for first year. Well maintained with minimal highlighting.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'],
      },
      {
        categoryId: 'stationery',
        title: 'Campus Planner 2025',
        price: 350,
        condition: 'Like New',
        city: 'Rajpura',
        description: 'Brand new campus planner for 2025. Perfect for organizing your academic year.',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80'],
      },
      {
        categoryId: 'sports',
        title: 'Badminton Racket Yonex',
        price: 2200,
        condition: 'Excellent',
        city: 'Solan',
        description: 'Professional badminton racket in excellent condition. Used for campus tournaments.',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80'],
      },
      {
        categoryId: 'fashion',
        title: 'College Hoodie Size M',
        price: 900,
        condition: 'Good',
        city: 'Chandigarh',
        description: 'Comfortable college hoodie, perfect for campus wear. Size medium, fits well.',
        image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67ddbf?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1521335629791-ce4aec67ddbf?w=500&q=80'],
      },
    ];

    for (const listing of sampleListings) {
      const category = CATEGORIES.find(c => c.id === listing.categoryId);
      const randomStudent = createdStudents[Math.floor(Math.random() * createdStudents.length)];

      const newListing = new Listing({
        ...listing,
        categoryLabel: category.label,
        location: `${listing.city}, India`,
        seller: randomStudent._id,
        sellerEmail: randomStudent.email,
        verified: randomStudent.isVerified,
        status: 'active',
        isApproved: true,
      });

      await newListing.save();
    }
    console.log('Sample listings created');

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@chitkara.edu.in / admin123');
    console.log('Moderator login: moderator@chitkara.edu.in / moderator123');
    console.log('Student login: any student email / student123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedData();
});
