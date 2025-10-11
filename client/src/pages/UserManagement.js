import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import {
  RiSearchLine,
  RiUserAddLine,
  RiEditLine,
  RiLockPasswordLine,
  RiDeleteBinLine
} from 'react-icons/ri';

const UserManagementContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const UserManagementContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const UserManagementHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const AddUserButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
`;

const UserName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

const UserEmail = styled.p`
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 8px;
  font-weight: 400;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  background: ${props => props.role === 'admin' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
  color: ${props => props.role === 'admin' ? '#a78bfa' : '#34d399'};
  border: 1px solid ${props => props.role === 'admin' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
`;

const UserActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  ${props => {
    switch(props.variant) {
      case 'edit':
        return `
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
          
          &:hover {
            background: rgba(59, 130, 246, 0.25);
            transform: translateY(-1px);
          }
        `;
      case 'password':
        return `
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          
          &:hover {
            background: rgba(245, 158, 11, 0.25);
            transform: translateY(-1px);
          }
        `;
      case 'delete':
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          
          &:hover {
            background: rgba(239, 68, 68, 0.25);
            transform: translateY(-1px);
          }
          
          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
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
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 28px;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
  
  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
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
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin: 40px 0;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.3);
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
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
        ...formData,
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
            <SearchIcon>
              <RiSearchLine />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <AddUserButton onClick={() => openModal('create')}>
            <RiUserAddLine />
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
                    <RiEditLine /> Edit
                  </ActionButton>
                  
                  <ActionButton 
                    variant="password" 
                    onClick={() => openModal('password', user)}
                  >
                    <RiLockPasswordLine /> Pass
                  </ActionButton>
                  
                  <ActionButton 
                    variant="delete" 
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={user._id === currentUser?._id}
                  >
                    <RiDeleteBinLine /> Del
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
