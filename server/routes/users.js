const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { adminAuth } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('=== FETCHING USERS ===');
    
    const users = await User.find({}).select('-password');
    console.log(`Found ${users.length} users`);
    
    res.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
});

// Get single user (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user',
      error: error.message 
    });
  }
});

// Create new user (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('=== CREATING USER ===');
    console.log('Request body:', req.body);
    
    const { firstName, lastName, email, password, role, phone, dateOfBirth } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'First name, last name, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone: phone || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      isVerified: true // Admin-created users are automatically verified
    });
    
    await user.save();
    
    console.log('User created successfully:', user.email);
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create user',
      error: error.message 
    });
  }
});

// Update user (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    console.log('=== UPDATING USER ===');
    console.log('User ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    const { firstName, lastName, email, role, phone, dateOfBirth } = req.body;
    
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email already exists' 
        });
      }
    }
    
    // Update user fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('User updated successfully:', updatedUser.email);
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ 
      message: 'Failed to update user',
      error: error.message 
    });
  }
});

// Change user password (Admin only)
router.put('/:id/password', adminAuth, async (req, res) => {
  try {
    console.log('=== CHANGING USER PASSWORD ===');
    console.log('User ID:', req.params.id);
    
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        message: 'Password is required' 
      });
    }
    
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update password
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    
    console.log('Password changed successfully for user:', user.email);
    
    res.json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      message: 'Failed to change password',
      error: error.message 
    });
  }
});

// Delete user (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    console.log('=== DELETING USER ===');
    console.log('User ID:', req.params.id);
    
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ 
        message: 'You cannot delete your own account' 
      });
    }
    
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    console.log('User deleted successfully:', user.email);
    
    res.json({
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    console.log('=== FETCHING USER STATISTICS ===');
    
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const stats = {
      totalUsers,
      adminUsers,
      regularUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      recentUsers
    };
    
    console.log('User statistics:', stats);
    
    res.json(stats);
    
  } catch (error) {
    console.error('User statistics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user statistics',
      error: error.message 
    });
  }
});

// Bulk operations (Admin only)
router.post('/bulk', adminAuth, async (req, res) => {
  try {
    console.log('=== BULK USER OPERATION ===');
    console.log('Operation:', req.body.operation);
    
    const { operation, userIds, data } = req.body;
    
    if (!operation || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ 
        message: 'Operation, userIds array, and data are required' 
      });
    }
    
    let result;
    
    switch (operation) {
      case 'delete':
        // Prevent bulk deletion of admin accounts
        const adminUsers = await User.find({ _id: { $in: userIds }, role: 'admin' });
        if (adminUsers.length > 0) {
          return res.status(400).json({ 
            message: 'Cannot delete admin accounts in bulk' 
          });
        }
        
        result = await User.deleteMany({ _id: { $in: userIds } });
        break;
        
      case 'updateRole':
        if (!data.role) {
          return res.status(400).json({ 
            message: 'Role is required for bulk role update' 
          });
        }
        
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { role: data.role }
        );
        break;
        
      case 'verify':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { isVerified: true }
        );
        break;
        
      default:
        return res.status(400).json({ 
          message: 'Invalid operation' 
        });
    }
    
    console.log('Bulk operation completed:', result);
    
    res.json({
      message: `Bulk ${operation} completed successfully`,
      modifiedCount: result.modifiedCount || result.deletedCount
    });
    
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ 
      message: 'Failed to perform bulk operation',
      error: error.message 
    });
  }
});

module.exports = router;
