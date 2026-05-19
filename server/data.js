const CATEGORIES = [
  { id:'electronics', label:'Electronics', icon:'📱', sub:['Laptops','Phones','Headphones','Chargers','Accessories'] },
  { id:'books',       label:'Books',       icon:'📚', sub:['Textbooks','Notes','Reference','Journals','Study Guides'] },
  { id:'stationery',  label:'Stationery',  icon:'✏️', sub:['Notebooks','Pens','Backpacks','Planners','Lab Supplies'] },
  { id:'sports',      label:'Sports',       icon:'🏀', sub:['Gym Gear','Balls','Fitness','Yoga','Cycling'] },
  { id:'fashion',     label:'Fashion',      icon:'👕', sub:['T-Shirts','Hoodies','College Wear','Shoes','Accessories'] },
];

const LISTINGS = [
  {
    id: 1,
    categoryId: 'electronics',
    categoryLabel: 'Electronics',
    title: 'MacBook Air M2 2023',
    price: 85000,
    condition: 'Like New',
    city: 'Chandigarh',
    location: 'Chandigarh, India',
    description: 'Campus-ready MacBook Air in excellent condition with charger and sleeve.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'],
    seller: 'Simran K.',
    sellerEmail: 'simran.k@chitkara.edu.in',
    verified: true,
    postedAgo: 2,
  },
  {
    id: 2,
    categoryId: 'books',
    categoryLabel: 'Books',
    title: 'Engineering Mathematics Volume I',
    price: 450,
    condition: 'Good',
    city: 'Baddi',
    location: 'Baddi, India',
    description: 'Complete syllabus book with notes and highlighted sections.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'],
    seller: 'Arjun T.',
    sellerEmail: 'arjun.t@chitkara.edu.in',
    verified: true,
    postedAgo: 4,
  },
  {
    id: 3,
    categoryId: 'stationery',
    categoryLabel: 'Stationery',
    title: 'Premium Notebooks Set',
    price: 350,
    condition: 'Like New',
    city: 'Rajpura',
    location: 'Rajpura, India',
    description: 'Pack of 5 college notebooks with reinforced covers and good paper quality.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80'],
    seller: 'Neha P.',
    sellerEmail: 'neha.p@chitkara.edu.in',
    verified: false,
    postedAgo: 1,
  },
];

const USERS = [
  {
    id: 1,
    name: 'Test Student',
    email: 'student@chitkara.edu.in',
    password: 'password123',
    city: 'Chandigarh',
  },
];

module.exports = { CATEGORIES, LISTINGS, USERS };
