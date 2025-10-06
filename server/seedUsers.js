const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
  {
    email: 'admin@cannabomb.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    phone: '+1-555-0001',
    address: {
      street: '123 Admin Street',
      city: 'Cannabis City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    isVerified: true,
    role: 'admin'
  },
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    phone: '+1-555-0002',
    address: {
      street: '456 Main Street',
      city: 'Cannabis City',
      state: 'CA',
      zipCode: '90211',
      country: 'USA'
    },
    isVerified: true,
    role: 'user'
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-08-22',
    phone: '+1-555-0003',
    address: {
      street: '789 Oak Avenue',
      city: 'Cannabis City',
      state: 'CA',
      zipCode: '90212',
      country: 'USA'
    },
    isVerified: true,
    role: 'user'
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    dateOfBirth: '1988-12-10',
    phone: '+1-555-0004',
    address: {
      street: '321 Pine Road',
      city: 'Cannabis City',
      state: 'CA',
      zipCode: '90213',
      country: 'USA'
    },
    isVerified: true,
    role: 'user'
  },
  {
    email: 'sarah.wilson@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    dateOfBirth: '1995-03-28',
    phone: '+1-555-0005',
    address: {
      street: '654 Elm Street',
      city: 'Cannabis City',
      state: 'CA',
      zipCode: '90214',
      country: 'USA'
    },
    isVerified: true,
    role: 'user'
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB (fallback to local URI if not provided)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canna-bomb');
    console.log('Connected to MongoDB');

    // Clear existing users (except keep admin accounts)
    const existingUsers = await User.find({ role: { $ne: 'admin' } });
    if (existingUsers.length > 0) {
      await User.deleteMany({ role: { $ne: 'admin' } });
      console.log(`Cleared ${existingUsers.length} existing non-admin users`);
    }

    // Check if admin user exists, if not create it
    const adminExists = await User.findOne({ email: 'admin@cannabomb.com' });
    const adminData = demoUsers.find(user => user.role === 'admin');
    if (!adminExists) {
      // Create admin WITHOUT pre-hashing; let model pre-save hash it once
      const adminUser = new User({
        ...adminData,
        password: adminData.password
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      // Ensure known admin password is set correctly (avoid double-hash issue)
      adminExists.password = adminData.password;
      await adminExists.save();
      console.log('Admin user already exists - password reset to default');
    }

    // Hash passwords and create users (excluding admin)
    const nonAdminUsers = demoUsers.filter(user => user.role !== 'admin');
    const hashedUsers = await Promise.all(
      nonAdminUsers.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const result = await User.insertMany(hashedUsers);
    console.log(`Successfully seeded ${result.length} demo users`);

    // Display user credentials
    console.log('\n=== Demo User Accounts ===');
    console.log('You can use these accounts to test the login process:\n');
    
    demoUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    console.log('\n✅ User seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding function
seedUsers();
