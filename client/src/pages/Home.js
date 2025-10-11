import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(1200px 400px at 10% -20%, rgba(16, 185, 129, 0.12), transparent 60%),
    linear-gradient(180deg, #0b1222 0%, #0f172a 35%, #1b2540 65%, #f8fafc 100%);
`;

const HeroSection = styled.section`
  background:
    radial-gradient(1200px 400px at 0% -10%, rgba(16,185,129,0.18), transparent 60%),
    linear-gradient(135deg, #0b1222 0%, #101a2e 50%, #0e2e25 75%, #0b3a2d 85%, #10b981 100%);
  color: white;
  padding: 36px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.12)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.12)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.06)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.06)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.06)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    padding: 24px 0;
  }
  
  @media (max-width: 480px) {
    padding: 20px 0;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #e7fff5 25%, #baf7dc 45%, #6ee7b7 70%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 20%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%);
    filter: blur(8px);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 32px;
  opacity: 0.95;
  line-height: 1.5;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #e7fff5 100%);
  color: #0a1426;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.28);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.35);
    background: linear-gradient(135deg, #f8fafc 0%, #ebfaf4 60%, #d6ffe9 100%);
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 6px;
  }
`;

const Section = styled.section`
  padding: 100px 0;
  position: relative;
  background:
    radial-gradient(800px 200px at 100% 0%, rgba(16,185,129,0.12), transparent 60%),
    rgba(248, 250, 252, 0.95);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
  
  @media (max-width: 480px) {
    padding: 60px 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #0a1426 0%, #0f172a 20%, #10b981 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Fallback for browsers that don't support background-clip */
  @supports not (-webkit-background-clip: text) {
    color: #0f172a;
    background: none;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #475569;
  margin-bottom: 80px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 500;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  z-index: 10;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 50px;
  }
`;


const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 30px;
  max-width: 1050px;
  margin: 0 auto;
  padding: 0 14px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 10px;
  }
`;

const CategoryCard = styled(Link)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 36px 18px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.18);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(52, 211, 153, 0.09) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(16, 185, 129, 0.18);
    border-color: rgba(16, 185, 129, 0.35);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 24px 12px;
    border-radius: 10px;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(16, 185, 129, 0.15);
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px 10px;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
    }
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.64rem;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  
  ${CategoryCard}:hover & {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 12px;
    
    ${CategoryCard}:hover & {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
    
    ${CategoryCard}:hover & {
      transform: scale(1.03);
    }
  }
`;

const CategoryName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0f172a;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;

const CategoryDescription = styled.p`
  color: #64748b;
  line-height: 1.5;
  font-size: 0.75rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    line-height: 1.3;
  }
`;

const StatsSection = styled.section`
  background:
    radial-gradient(1000px 300px at 0% 0%, rgba(16,185,129,0.14), transparent 55%),
    linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
  padding: 50px 0;
  position: relative;
  
  /* Hide Why Choose section on mobile */
  @media (max-width: 768px) {
    display: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(16,185,129,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    padding: 30px 0;
  }
  
  @media (max-width: 480px) {
    padding: 20px 0;
  }
`;

const StatsTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Fallback for browsers that don't support background-clip */
  @supports not (-webkit-background-clip: text) {
    color: #ffffff;
    background: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 12px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const StatsNumber = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #e7fff5 0%, #baf7dc 35%, #6ee7b7 70%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  color: #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Home = () => {

  const categories = [
    {
      name: 'Flower',
      icon: '🌸',
      description: 'Premium cannabis flower strains',
      path: '/products?category=flower'
    },
    {
      name: 'Edibles',
      icon: '🍪',
      description: 'Delicious cannabis-infused treats',
      path: '/products?category=edibles'
    },
    {
      name: 'Vapes',
      icon: '💨',
      description: 'Discrete vaping solutions',
      path: '/products?category=vapes'
    },
    {
      name: 'Accessories',
      icon: '🛠️',
      description: 'Essential cannabis tools and gear',
      path: '/products?category=accessories'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Premium Cannabis Experience</HeroTitle>
          <HeroSubtitle>
            Discover the finest selection of cannabis products with uncompromising quality, 
            expert curation, and exceptional service. Elevate your wellness journey with Canna Bomb.
          </HeroSubtitle>
          <HeroButton to="/products">Explore Collection</HeroButton>
        </HeroContent>
      </HeroSection>


      <Section>
        <SectionTitle>Shop by Category</SectionTitle>
        <SectionSubtitle>
          Explore our diverse range of cannabis products
        </SectionSubtitle>
        <CategoriesGrid>
          {categories.map(category => (
            <CategoryCard key={category.name} to={category.path}>
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
              <CategoryDescription>{category.description}</CategoryDescription>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>

      <StatsSection>
        <StatsTitle>Why Choose Canna Bomb?</StatsTitle>
        <StatsGrid>
          <StatItem>
            <StatsNumber>1000+</StatsNumber>
            <StatLabel>Happy Customers</StatLabel>
          </StatItem>
          <StatItem>
            <StatsNumber>50+</StatsNumber>
            <StatLabel>Premium Brands</StatLabel>
          </StatItem>
          <StatItem>
            <StatsNumber>24/7</StatsNumber>
            <StatLabel>Customer Support</StatLabel>
          </StatItem>
          <StatItem>
            <StatsNumber>100%</StatsNumber>
            <StatLabel>Quality Guaranteed</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;
