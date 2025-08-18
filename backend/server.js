const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  image: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  subtotal: { type: Number },
  shipping: { type: Number },
  tax: { type: Number },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  date: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  paymentMethod: { type: String },
  billingAddress: { type: Object }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: email === 'admin@example.com' ? 'admin' : 'user'
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token, 
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Error signing in' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      name: user.name, 
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Order Routes
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerEmail: req.user.email
    };
    console.log('Order data received:', JSON.stringify(orderData, null, 2));
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`Validation error for ${key}:`, err.errors[key].message);
      });
    }
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('items.productId');
    } else {
      orders = await Order.find({ customerEmail: req.user.email }).populate('items.productId');
    }
    res.json(orders);
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// User Routes (Admin only)
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Seed initial data
const seedData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        { name: "Men's Jacket", price: 99.99, category: "men", description: "Stylish winter jacket for men" },
        { name: "Women's Dress", price: 79.99, category: "women", description: "Elegant evening dress" },
        { name: "Kids' Hoodie", price: 49.99, category: "kids", description: "Comfortable hoodie for children" },
        { name: "Men's Sneakers", price: 129.99, category: "men", description: "Premium athletic shoes" },
        { name: "Women's Handbag", price: 199.99, category: "accessories", description: "Designer leather handbag" },
        { name: "Kids' T-Shirt", price: 24.99, category: "kids", description: "Colorful cotton t-shirt" }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('Sample products seeded successfully');
    }

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@example.com' });
     if (!adminExists) {
       const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
       const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
       console.log(`Admin user created: admin@example.com / ${adminPassword}`);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedData();
});
