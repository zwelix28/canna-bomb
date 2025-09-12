import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const UserManagementContainer = styled.div`
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
    z-index: 2;
  }
`;

const UserManagementContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 60px 32px;
  position: relative;
  z-index: 3;
`;

const UserManagementHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 30%, #34d399 60%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  letter-spacing: -1px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 3px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.2rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  letter-spacing: 0.3px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.2rem;
`;

const AddUserButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 12px 40px rgba(16, 185, 129, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const UserEmail = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
  background: ${props => props.role === 'admin' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
  color: ${props => props.role === 'admin' ? '#a78bfa' : '#34d399'};
  border: 1px solid ${props => props.role === 'admin' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  ${props => {
    switch(props.variant) {
      case 'edit':
        return `
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
          
          &:hover {
            background: rgba(59, 130, 246, 0.25);
            transform: translateY(-2px);
          }
        `;
      case 'password':
        return `
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          
          &:hover {
            background: rgba(245, 158, 11, 0.25);
            transform: translateY(-2px);
          }
        `;
      case 'delete':
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          
          &:hover {
            background: rgba(239, 68, 68, 0.25);
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
          border: 1px solid rgba(100, 116, 139, 0.3);
        `;
    }
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  option {
    background: #1e293b;
    color: #ffffff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }
      `;
    } else {
      return `
        background: rgba(100, 116, 139, 0.15);
        color: #94a3b8;
        border: 1px solid rgba(100, 116, 139, 0.3);
        
        &:hover {
          background: rgba(100, 116, 139, 0.25);
        }
      `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
  font-size: 1.2rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 40px 0;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(10px);
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.3);
  backdrop-filter: blur(10px);
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Users fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      setSuccess('User created successfully!');
      setShowModal(false);
      resetForm();
      fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Create user error:', error);
      setError(error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      setSuccess('User updated successfully!');
      setShowModal(false);
      resetForm();
      fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Update user error:', error);
      setError(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${selectedUser._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: formData.password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      setSuccess('Password changed successfully!');
      setShowModal(false);
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Change password error:', error);
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      setSuccess('User deleted successfully!');
      fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Delete user error:', error);
      setError(error.message);
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    
    if (type === 'create') {
      resetForm();
    } else if (type === 'edit' && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      });
    } else if (type === 'password' && user) {
      setFormData({
        password: ''
      });
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      dateOfBirth: ''
    });
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <UserManagementContainer>
        <UserManagementContent>
          <LoadingSpinner>Loading users...</LoadingSpinner>
        </UserManagementContent>
      </UserManagementContainer>
    );
  }

  return (
    <UserManagementContainer>
      <UserManagementContent>
        <UserManagementHeader>
          <Title>User Management</Title>
          <Subtitle>Manage user accounts and permissions</Subtitle>
        </UserManagementHeader>

        {success && (
          <SuccessMessage>
            {success}
          </SuccessMessage>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <ActionBar>
          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <AddUserButton onClick={() => openModal('create')}>
            <span>➕</span>
            Add New User
          </AddUserButton>
        </ActionBar>

        {filteredUsers.length === 0 ? (
          <EmptyState>
            {searchTerm ? 'No users found matching your search.' : 'No users found. Create your first user account.'}
          </EmptyState>
        ) : (
          <UsersGrid>
            {filteredUsers.map((user) => (
              <UserCard key={user._id}>
                <UserAvatar>
                  {getUserInitials(user.firstName, user.lastName)}
                </UserAvatar>
                
                <UserName>
                  {user.firstName} {user.lastName}
                </UserName>
                
                <UserEmail>{user.email}</UserEmail>
                
                <UserRole role={user.role}>
                  {user.role}
                </UserRole>
                
                <UserActions>
                  <ActionButton 
                    variant="edit" 
                    onClick={() => openModal('edit', user)}
                  >
                    Edit
                  </ActionButton>
                  
                  <ActionButton 
                    variant="password" 
                    onClick={() => openModal('password', user)}
                  >
                    Password
                  </ActionButton>
                  
                  <ActionButton 
                    variant="delete" 
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={user._id === currentUser?._id} // Prevent deleting own account
                  >
                    Delete
                  </ActionButton>
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>
        )}

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>
                {modalType === 'create' && 'Create New User'}
                {modalType === 'edit' && 'Edit User'}
                {modalType === 'password' && 'Change Password'}
              </ModalTitle>
              
              <form onSubmit={
                modalType === 'create' ? handleCreateUser :
                modalType === 'edit' ? handleUpdateUser :
                handleChangePassword
              }>
                {modalType !== 'password' && (
                  <>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        placeholder="Enter first name"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        placeholder="Enter last name"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        placeholder="Enter email address"
                      />
                    </FormGroup>
                    
                    {modalType === 'create' && (
                      <FormGroup>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          placeholder="Enter password"
                        />
                      </FormGroup>
                    )}
                    
                    <FormGroup>
                      <Label>Role</Label>
                      <Select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      />
                    </FormGroup>
                  </>
                )}
                
                {modalType === 'password' && (
                  <FormGroup>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      placeholder="Enter new password"
                    />
                  </FormGroup>
                )}
                
                <ModalActions>
                  <ModalButton 
                    type="button" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </ModalButton>
                  
                  <ModalButton 
                    type="submit" 
                    variant="primary"
                  >
                    {modalType === 'create' && 'Create User'}
                    {modalType === 'edit' && 'Update User'}
                    {modalType === 'password' && 'Change Password'}
                  </ModalButton>
                </ModalActions>
              </form>
            </ModalContent>
          </Modal>
        )}
      </UserManagementContent>
    </UserManagementContainer>
  );
};

export default UserManagement;
