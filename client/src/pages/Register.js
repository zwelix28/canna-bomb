import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-start;
    padding-top: 20px;
  }
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
    max-width: 100%;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 8px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 6px;
    }
  }
  
  p {
    color: #64748b;
    font-size: 1rem;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 15px;
    border-radius: 6px;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e2e8f0;
  }
  
  span {
    background: white;
    padding: 0 16px;
    color: #64748b;
    font-size: 14px;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  
  p {
    color: #64748b;
    margin-bottom: 8px;
  }
  
  a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AgeWarning = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  
  p {
    color: #92400e;
    font-size: 14px;
    margin: 0;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 16px;
    
    p {
      font-size: 13px;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const provinces = [
    'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State', 
    'KwaZulu-Natal', 'North West', 'Gauteng', 'Mpumalanga', 'Limpopo'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Age validation
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 21 || (age === 21 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be 21 or older to register';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };
      
      const result = await register(userData);
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <h1>🌿 Canna Bomb</h1>
          <p>Create your account to start shopping</p>
        </Logo>
        
        <AgeWarning>
          <p>⚠️ You must be 21 or older to create an account and purchase cannabis products.</p>
        </AgeWarning>
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password *</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (e.g., 082 123 4567)"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="street">Street Address</Label>
            <Input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter your street address"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="province">Province</Label>
              <Select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code (e.g., 8000)"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="South Africa">South Africa</option>
                <option value="Botswana">Botswana</option>
                <option value="Namibia">Namibia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>
        
        <Divider>
          <span>Already have an account?</span>
        </Divider>
        
        <LoginLink>
          <p>Already registered?</p>
          <Link to="/login">Sign in to your account</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
