import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
  padding: 24px 20px;
  
  @media (max-width: 768px) {
    padding: 16px 14px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const LoginCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  padding: 28px 22px;
  width: 100%;
  max-width: 420px;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 12px;
    max-width: 100%;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 1.6rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
      margin-bottom: 6px;
    }
  }
  
  p {
    color: #94a3b8;
    font-size: 0.95rem;
    
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
  
  &::placeholder { color: #64748b; }
  
  &:focus {
    outline: none;
    border-color: rgba(16,185,129,0.4);
    background: rgba(16,185,129,0.08);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.18);
  }
  
  &.error {
    border-color: rgba(239,68,68,0.6);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 18px rgba(16,185,129,0.3);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(16,185,129,0.35);
  }
  
  &:disabled {
    background: #64748b;
    cursor: not-allowed;
    transform: none;
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
    background: rgba(255,255,255,0.12);
  }
  
  span {
    background: transparent;
    padding: 0 16px;
    color: #94a3b8;
    font-size: 13px;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;
  
  p {
    color: #94a3b8;
    margin-bottom: 8px;
  }
  
  a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      color: #34d399;
    }
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  
  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      color: #e2e8f0;
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Navigate based on user role - the RoleBasedHome component will handle the redirect
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>🌿 Canna Bomb</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </Logo>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
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
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
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
          
          <ForgotPassword>
            <a href="#forgot-password">Forgot your password?</a>
          </ForgotPassword>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>
        
        <Divider>
          <span>New to Canna Bomb?</span>
        </Divider>
        
        <RegisterLink>
          <p>Don't have an account?</p>
          <Link to="/register">Create an account</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
