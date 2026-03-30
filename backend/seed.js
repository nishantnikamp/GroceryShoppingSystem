import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Seed Users (Add only if not existing)
    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@freshdrop.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'John Customer',
        email: 'customer@freshdrop.com',
        password: 'customer123',
        role: 'customer',
      },
    ];

    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`User ${u.email} created.`);
      }
    }

    // Seed Products (Add only if not existing)
    const defaultProducts = [
      {
        name: 'Organic Avocados',
        price: 4.99,
        category: 'Produce',
        stock: 120,
        description: 'Perfectly ripe, creamy organic avocados.',
        imageUrl: 'https://www.orgpick.com/cdn/shop/products/Organic_Avocado_3dfa8f81-f467-43a9-9f9e-cda5a12fac32.jpg?v=1545393208'
      },
      {
        name: 'Artisan Sourdough',
        price: 6.50,
        category: 'Bakery',
        stock: 45,
        description: 'Freshly baked sourdough bread with a crispy crust.',
        imageUrl: 'https://wildthistlekitchen.com/wp-content/uploads/2025/02/Artisan-Sourdough-Bread-Recipe-1-4.jpg'
      },
      {
        name: 'Almond Milk',
        price: 3.99,
        category: 'Dairy',
        stock: 85,
        description: 'Unsweetened almond milk, calcium-enriched.',
        imageUrl: 'https://images.pexels.com/photos/17272972/pexels-photo-17272972.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Premium Espresso',
        price: 14.99,
        category: 'Pantry',
        stock: 60,
        description: 'Dark roast whole bean espresso.',
        imageUrl: 'https://images.pexels.com/photos/17697557/pexels-photo-17697557.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Free-range Eggs',
        price: 5.49,
        category: 'Dairy',
        stock: 30,
        description: 'One dozen large organic free-range eggs.',
        imageUrl: 'https://images.pexels.com/photos/32405067/pexels-photo-32405067.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Wild Caught Salmon',
        price: 18.99,
        category: 'Meat & Seafood',
        stock: 25,
        description: 'Fresh Alaskan Sockeye Salmon fillets.',
        imageUrl: 'https://www.bigsams.in/wp-content/uploads/2024/07/wild_alaskan_salmon.jpg'
      }
    ];

    for (const p of defaultProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`Product ${p.name} created.`);
      }
    }

    console.log('Database Seeding Check Completed! 🚀');
    console.log('Database Seeding Completed! 🚀');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
