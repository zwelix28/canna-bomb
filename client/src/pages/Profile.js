import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import api from '../utils/axios';
import NotificationSettings from '../components/NotificationSettings';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const ProfileContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
`;

const ProfileCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 12px;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const UserEmail = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.15);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StatNumber = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
`;

const FormSection = styled.div`
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.1);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;


const Button = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
    width: 100%;
  }
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  margin-top: 12px;

  &:hover {
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa'
    },
    dateOfBirth: '',
    preferences: {
      notifications: true,
      marketing: false,
      newsletter: true
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          province: user.address?.province || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'South Africa'
        },
        dateOfBirth: user.dateOfBirth || '',
        preferences: {
          notifications: user.preferences?.notifications !== false,
          marketing: user.preferences?.marketing || false,
          newsletter: user.preferences?.newsletter !== false
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/api/auth/profile', formData);
      updateUser(response.data);
      showSuccess('Profile updated successfully!', 'Profile Updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.', 'Update Failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const passwordData = {
        currentPassword: e.target.currentPassword.value,
        newPassword: e.target.newPassword.value,
        confirmPassword: e.target.confirmPassword.value
      };

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showError('New passwords do not match', 'Password Mismatch');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        showError('Password must be at least 6 characters long', 'Invalid Password');
        return;
      }

      await api.put('/api/auth/password', passwordData);
      showSuccess('Password updated successfully!', 'Password Updated');
      e.target.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      const message = error.response?.data?.message || 'Failed to update password. Please try again.';
      showError(message, 'Password Update Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete('/api/auth/account');
      showSuccess('Account deleted successfully', 'Account Deleted');
      // The AuthContext will handle logout
    } catch (error) {
      console.error('Error deleting account:', error);
      showError('Failed to delete account. Please try again.', 'Delete Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Please log in to view your profile</h2>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <ProfileTitle>Profile Management</ProfileTitle>
        </ProfileHeader>

        <ProfileGrid>
          {/* Profile Overview */}
          <ProfileCard>
            <AvatarSection>
              <Avatar>
                {getInitials(formData.firstName, formData.lastName)}
              </Avatar>
              <UserName>{formData.firstName} {formData.lastName}</UserName>
              <UserEmail>{formData.email}</UserEmail>
              <UserRole>{user.role}</UserRole>
            </AvatarSection>

            <QuickStats>
              <StatItem>
                <StatNumber>{user.orders?.length || 0}</StatNumber>
                <StatLabel>Orders</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{user.memberSince ? new Date(user.memberSince).getFullYear() : '2024'}</StatNumber>
                <StatLabel>Member Since</StatLabel>
              </StatItem>
            </QuickStats>
          </ProfileCard>

          {/* Profile Settings */}
          <ProfileCard>
            <FormSection>
              <SectionTitle>Personal Information</SectionTitle>
              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 XX XXX XXXX"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <Button type="submit" disabled={loading}>
                  {loading && <LoadingSpinner />}
                  Update Profile
                </Button>
              </Form>
            </FormSection>
          </ProfileCard>
        </ProfileGrid>

        {/* Address Information */}
        <ProfileCard>
          <FormSection>
            <SectionTitle>Address Information</SectionTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="address.street">Street Address</Label>
                <Input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Cape Town"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address.province">Province</Label>
                  <Select
                    id="address.province"
                    name="address.province"
                    value={formData.address.province}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Province</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="North West">North West</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Limpopo">Limpopo</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="address.postalCode">Postal Code</Label>
                  <Input
                    type="text"
                    id="address.postalCode"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="8000"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address.country">Country</Label>
                  <Input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    disabled
                  />
                </FormGroup>
              </FormRow>

              <Button type="submit" disabled={loading}>
                {loading && <LoadingSpinner />}
                Update Address
              </Button>
            </Form>
          </FormSection>
        </ProfileCard>

        {/* Password Change */}
        <ProfileCard>
          <FormSection>
            <SectionTitle>Change Password</SectionTitle>
            <Form onSubmit={handlePasswordChange}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength="6"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength="6"
                  />
                </FormGroup>
              </FormRow>

              <Button type="submit" disabled={loading}>
                {loading && <LoadingSpinner />}
                Change Password
              </Button>
            </Form>
          </FormSection>
        </ProfileCard>

        {/* Preferences */}
        <ProfileCard>
          <FormSection>
            <SectionTitle>Preferences</SectionTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleInputChange}
                  />
                  <span>Email notifications for orders and updates</span>
                </label>
              </FormGroup>

              <FormGroup>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="preferences.marketing"
                    checked={formData.preferences.marketing}
                    onChange={handleInputChange}
                  />
                  <span>Marketing emails and promotional offers</span>
                </label>
              </FormGroup>

              <FormGroup>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleInputChange}
                  />
                  <span>Newsletter and product updates</span>
                </label>
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading && <LoadingSpinner />}
                Update Preferences
              </Button>
            </Form>
          </FormSection>
        </ProfileCard>

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Danger Zone */}
        <ProfileCard>
          <FormSection>
            <SectionTitle style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Danger Zone</SectionTitle>
            <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <DangerButton onClick={handleDeleteAccount} disabled={loading}>
              {loading && <LoadingSpinner />}
              Delete Account
            </DangerButton>
          </FormSection>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;