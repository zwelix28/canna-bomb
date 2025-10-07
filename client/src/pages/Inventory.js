import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../utils/axios';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const InventoryContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const InventoryContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const InventoryHeader = styled.div`
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

const AddProductButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ProductCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  position: relative;
  padding: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
  display: block;
  transition: transform 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.016);
  }
  
  &[src=""], &:not([src]) {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 12px;
    
    &::after {
      content: "No Image";
    }
  }
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const ProductCategory = styled.span`
  color: #34d399;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
`;

const ProductDescription = styled.p`
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Price = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const SalePrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #fca5a5;
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  text-decoration: line-through;
`;

const SaleBadge = styled.div`
  background: #ef4444;
  color: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
`;

const FeaturedBadge = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  margin-left: 6px;
`;

const StockInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
`;

const StockLabel = styled.span`
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
`;

const StockQuantity = styled.span`
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
`;

const StockStatus = styled.span`
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  
  &.in-stock {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
  }
  
  &.low-stock {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
  }
  
  &.out-of-stock {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.edit {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }
  
  &.stock {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }
  
  &.sale {
    background: linear-gradient(135deg, #ef4444 0%, #fca5a5 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  }
  
  &.delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #94a3b8;
  
  &:hover {
    color: #e2e8f0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #94a3b8;
  font-size: 12px;
`;

const FormInput = styled.input`
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  font-size: 14px;
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
`;

const FormTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
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
`;

const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #10b981;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  margin: 0;
`;

const FileUploadContainer = styled.div`
  border: 2px dashed rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: rgba(255,255,255,0.04);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.08);
  }
  
  &.dragover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.08);
  }
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: block;
  cursor: pointer;
  color: #94a3b8;
  font-size: 12px;
  
  &:hover {
    color: #10b981;
  }
`;

const FileUploadText = styled.div`
  margin-bottom: 8px;
  font-weight: 500;
`;

const FileUploadSubtext = styled.div`
  font-size: 10px;
  color: #64748b;
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
`;

const ImagePreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    background: #64748b;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: rgba(100, 116, 139, 0.8);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(100, 116, 139, 1);
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
`;

const Inventory = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const { showSuccess, showError } = useNotification();
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    thcContent: '',
    cbdContent: '',
    weight: '',
    weightUnit: 'g',
    strain: '',
    effects: '',
    flavors: '',
    stockQuantity: '',
    images: '',
    tags: '',
    isFeatured: false
  });

  const categories = [
    'flower', 'edibles', 'concentrates', 'topicals', 'vapes', 'accessories'
  ];

  const weightUnits = ['g', 'mg', 'ml', 'oz'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products/admin/all');
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to fetch products', 'Error');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openAddModal = () => {
    setModalMode('add');
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      salePrice: '',
      thcContent: '',
      cbdContent: '',
      weight: '',
      weightUnit: 'g',
      strain: '',
      effects: '',
      flavors: '',
      stockQuantity: '',
      images: '',
      tags: '',
      isFeatured: false
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice || '',
      thcContent: product.thcContent || '',
      cbdContent: product.cbdContent || '',
      weight: product.weight,
      weightUnit: product.weightUnit,
      strain: product.strain || '',
      effects: product.effects ? product.effects.join(', ') : '',
      flavors: product.flavors ? product.flavors.join(', ') : '',
      stockQuantity: product.stockQuantity,
      images: product.images ? product.images.join(', ') : '',
      tags: product.tags ? product.tags.join(', ') : '',
      isFeatured: product.isFeatured || false
    });
    setShowModal(true);
  };

  const openStockModal = (product) => {
    setModalMode('stock');
    setEditingProduct(product);
    setFormData({
      stockQuantity: product.stockQuantity
    });
    setShowModal(true);
  };

  const openSaleModal = (product) => {
    setModalMode('sale');
    setEditingProduct(product);
    setFormData({
      price: product.price,
      salePrice: product.salePrice || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({});
    setUploadedFiles([]);
    setIsDragOver(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      showError('Please select only image files', 'Invalid File Type');
      return;
    }
    
    if (imageFiles.length > 5) {
      showError('Maximum 5 images allowed', 'Too Many Files');
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      if (modalMode === 'add') {
        const formDataToSend = new FormData();
        
        // Add form fields
        Object.keys(formData).forEach(key => {
          if (key !== 'images') {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Ensure isFeatured is always sent (FormData might not include false values)
        formDataToSend.append('isFeatured', formData.isFeatured ? 'true' : 'false');
        
        // Add uploaded files
        uploadedFiles.forEach(file => {
          formDataToSend.append('images', file);
        });
        
        // Add existing image URLs if any
        if (formData.images) {
          const existingImages = formData.images.split(',').map(i => i.trim()).filter(i => i);
          existingImages.forEach(url => {
            formDataToSend.append('images', url);
          });
        }
        
        await api.post('/api/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess('Product added successfully!', 'Product Added');
      } else if (modalMode === 'edit') {
        const formDataToSend = new FormData();
        
        // Add form fields
        Object.keys(formData).forEach(key => {
          if (key !== 'images') {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Ensure isFeatured is always sent (FormData might not include false values)
        formDataToSend.append('isFeatured', formData.isFeatured ? 'true' : 'false');
        
        // Add uploaded files
        uploadedFiles.forEach(file => {
          formDataToSend.append('images', file);
        });
        
        // Add existing image URLs as a separate field
        if (formData.images) {
          formDataToSend.append('existingImages', formData.images);
        }
        
        await api.put(`/api/products/${editingProduct._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess('Product updated successfully!', 'Product Updated');
      } else if (modalMode === 'stock') {
        await api.put(`/api/products/${editingProduct._id}`, {
          stockQuantity: parseInt(formData.stockQuantity)
        });
        showSuccess('Stock updated successfully!', 'Stock Updated');
      } else if (modalMode === 'sale') {
        await api.put(`/api/products/${editingProduct._id}`, {
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined
        });
        showSuccess('Sale price updated successfully!', 'Price Updated');
      }
      
      closeModal();
      fetchProducts();
      
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      showError(message, 'Error');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productId}`);
        showSuccess('Product deleted successfully!', 'Product Deleted');
        fetchProducts();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete product';
        showError(message, 'Error');
      }
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'out-of-stock', text: 'Out of Stock' };
    if (quantity <= 10) return { status: 'low-stock', text: 'Low Stock' };
    return { status: 'in-stock', text: 'In Stock' };
  };

  if (!user || user.role !== 'admin') {
    return (
      <InventoryContainer>
        <InventoryContent>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1>Access Denied</h1>
            <p>You must be an administrator to access this page.</p>
          </div>
        </InventoryContent>
      </InventoryContainer>
    );
  }

  if (loading) {
    return (
      <InventoryContainer>
        <LoadingSpinner>Loading inventory...</LoadingSpinner>
      </InventoryContainer>
    );
  }

  return (
    <InventoryContainer>
      <InventoryContent>
        <InventoryHeader>
          <Title>Inventory Management</Title>
          <div style={{ marginTop: '16px' }}>
            <AddProductButton onClick={openAddModal}>
              + Add New Product
            </AddProductButton>
          </div>
        </InventoryHeader>

        {products.length === 0 ? (
          <NoProducts>
            <h3>No products found</h3>
            <p>Start by adding your first product to the inventory</p>
          </NoProducts>
        ) : (
          <InventoryGrid>
            {products.map(product => {
              const stockStatus = getStockStatus(product.stockQuantity);
              const isOnSale = product.salePrice && product.salePrice < product.price;
              
              return (
                <ProductCard key={product._id}>
                  <ProductImage 
                    src={product.images[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  
                  <ProductName>{product.name}</ProductName>
                  <ProductCategory>{product.category}</ProductCategory>
                  
                  <ProductDescription>{product.description}</ProductDescription>
                  
                  <PriceSection>
                    {isOnSale ? (
                      <>
                        <SalePrice>R{product.salePrice.toFixed(2)}</SalePrice>
                        <OriginalPrice>R{product.price.toFixed(2)}</OriginalPrice>
                        <SaleBadge>
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </SaleBadge>
                        {product.isFeatured && <FeaturedBadge>FEATURED</FeaturedBadge>}
                      </>
                    ) : (
                      <>
                        <Price>R{product.price.toFixed(2)}</Price>
                        {product.isFeatured && <FeaturedBadge>FEATURED</FeaturedBadge>}
                      </>
                    )}
                  </PriceSection>
                  
                  <StockInfo>
                    <div>
                      <StockLabel>Stock:</StockLabel>
                      <StockQuantity>{product.stockQuantity}</StockQuantity>
                    </div>
                    <StockStatus className={stockStatus.status}>
                      {stockStatus.text}
                    </StockStatus>
                  </StockInfo>
                  
                  <ActionButtons>
                    <ActionButton 
                      className="edit" 
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton 
                      className="stock" 
                      onClick={() => openStockModal(product)}
                    >
                      Stock
                    </ActionButton>
                    <ActionButton 
                      className="sale" 
                      onClick={() => openSaleModal(product)}
                    >
                      Sale
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </ActionButton>
                  </ActionButtons>
                </ProductCard>
              );
            })}
          </InventoryGrid>
        )}

        {showModal && (
          <Modal onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  {modalMode === 'add' && 'Add New Product'}
                  {modalMode === 'edit' && 'Edit Product'}
                  {modalMode === 'stock' && 'Update Stock'}
                  {modalMode === 'sale' && 'Update Sale Price'}
                </ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                {modalMode === 'add' && (
                  <>
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Product Name *</FormLabel>
                        <FormInput
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Category *</FormLabel>
                        <FormSelect
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                    </FormRow>

                    <FormGroup>
                      <FormLabel>Description *</FormLabel>
                      <FormTextarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Brand *</FormLabel>
                        <FormInput
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Price *</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Sale Price</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="salePrice"
                          value={formData.salePrice}
                          onChange={handleInputChange}
                          placeholder="Leave empty for no sale"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormInput
                          type="number"
                          name="stockQuantity"
                          value={formData.stockQuantity}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Weight *</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Weight Unit *</FormLabel>
                        <FormSelect
                          name="weightUnit"
                          value={formData.weightUnit}
                          onChange={handleInputChange}
                          required
                        >
                          {weightUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>THC Content (%)</FormLabel>
                        <FormInput
                          type="number"
                          step="0.1"
                          name="thcContent"
                          value={formData.thcContent}
                          onChange={handleInputChange}
                          placeholder="e.g., 18.5"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>CBD Content</FormLabel>
                        <FormInput
                          type="number"
                          step="0.1"
                          name="cbdContent"
                          value={formData.cbdContent}
                          onChange={handleInputChange}
                          placeholder="e.g., 0.8 or 25"
                        />
                      </FormGroup>
                    </FormRow>

                    <FormGroup>
                      <FormLabel>Strain</FormLabel>
                      <FormInput
                        type="text"
                        name="strain"
                        value={formData.strain}
                        onChange={handleInputChange}
                        placeholder="e.g., Blue Dream, OG Kush"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Effects (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="effects"
                        value={formData.effects}
                        onChange={handleInputChange}
                        placeholder="e.g., Euphoric, Creative, Relaxed"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Flavors (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="flavors"
                        value={formData.flavors}
                        onChange={handleInputChange}
                        placeholder="e.g., Berry, Vanilla, Sweet"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Image URLs (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., hybrid, premium, daytime"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Product Images</FormLabel>
                      <FileUploadContainer 
                        className={isDragOver ? 'dragover' : ''}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FileUploadInput
                          type="file"
                          id="imageUpload"
                          multiple
                          accept="image/*"
                          onChange={handleFileInputChange}
                        />
                        <FileUploadLabel htmlFor="imageUpload">
                          <FileUploadText>
                            📷 Upload Images or Drag & Drop
                          </FileUploadText>
                          <FileUploadSubtext>
                            PNG, JPG, JPEG up to 5MB each (max 5 images)
                          </FileUploadSubtext>
                        </FileUploadLabel>
                      </FileUploadContainer>
                      
                      {uploadedFiles.length > 0 && (
                        <ImagePreviewContainer>
                          {uploadedFiles.map((file, index) => (
                            <ImagePreview key={index}>
                              <ImagePreviewImg
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                              />
                              <RemoveImageButton onClick={() => removeImage(index)}>
                                ×
                              </RemoveImageButton>
                            </ImagePreview>
                          ))}
                        </ImagePreviewContainer>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Image URLs (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </FormGroup>

                    <FormGroup>
                      <CheckboxContainer>
                        <CheckboxInput
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                        />
                        <CheckboxLabel htmlFor="isFeatured">
                          Feature this product on the home page
                        </CheckboxLabel>
                      </CheckboxContainer>
                    </FormGroup>
                  </>
                )}

                {modalMode === 'edit' && (
                  <>
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Product Name *</FormLabel>
                        <FormInput
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Category *</FormLabel>
                        <FormSelect
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                    </FormRow>

                    <FormGroup>
                      <FormLabel>Description *</FormLabel>
                      <FormTextarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Brand *</FormLabel>
                        <FormInput
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Price *</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Sale Price</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="salePrice"
                          value={formData.salePrice}
                          onChange={handleInputChange}
                          placeholder="Leave empty for no sale"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormInput
                          type="number"
                          name="stockQuantity"
                          value={formData.stockQuantity}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>Weight *</FormLabel>
                        <FormInput
                          type="number"
                          step="0.01"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Weight Unit *</FormLabel>
                        <FormSelect
                          name="weightUnit"
                          value={formData.weightUnit}
                          onChange={handleInputChange}
                          required
                        >
                          {weightUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <FormLabel>THC Content (%)</FormLabel>
                        <FormInput
                          type="number"
                          step="0.1"
                          name="thcContent"
                          value={formData.thcContent}
                          onChange={handleInputChange}
                          placeholder="e.g., 18.5"
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>CBD Content</FormLabel>
                        <FormInput
                          type="number"
                          step="0.1"
                          name="cbdContent"
                          value={formData.cbdContent}
                          onChange={handleInputChange}
                          placeholder="e.g., 0.8 or 25"
                        />
                      </FormGroup>
                    </FormRow>

                    <FormGroup>
                      <FormLabel>Strain</FormLabel>
                      <FormInput
                        type="text"
                        name="strain"
                        value={formData.strain}
                        onChange={handleInputChange}
                        placeholder="e.g., Blue Dream, OG Kush"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Effects (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="effects"
                        value={formData.effects}
                        onChange={handleInputChange}
                        placeholder="e.g., Euphoric, Creative, Relaxed"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Flavors (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="flavors"
                        value={formData.flavors}
                        onChange={handleInputChange}
                        placeholder="e.g., Berry, Vanilla, Sweet"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Image URLs (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., hybrid, premium, daytime"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Product Images</FormLabel>
                      <FileUploadContainer 
                        className={isDragOver ? 'dragover' : ''}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FileUploadInput
                          type="file"
                          id="imageUploadEdit"
                          multiple
                          accept="image/*"
                          onChange={handleFileInputChange}
                        />
                        <FileUploadLabel htmlFor="imageUploadEdit">
                          <FileUploadText>
                            📷 Upload Images or Drag & Drop
                          </FileUploadText>
                          <FileUploadSubtext>
                            PNG, JPG, JPEG up to 5MB each (max 5 images)
                          </FileUploadSubtext>
                        </FileUploadLabel>
                      </FileUploadContainer>
                      
                      {uploadedFiles.length > 0 && (
                        <ImagePreviewContainer>
                          {uploadedFiles.map((file, index) => (
                            <ImagePreview key={index}>
                              <ImagePreviewImg
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                              />
                              <RemoveImageButton onClick={() => removeImage(index)}>
                                ×
                              </RemoveImageButton>
                            </ImagePreview>
                          ))}
                        </ImagePreviewContainer>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Image URLs (comma-separated)</FormLabel>
                      <FormInput
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </FormGroup>

                    <FormGroup>
                      <CheckboxContainer>
                        <CheckboxInput
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                        />
                        <CheckboxLabel htmlFor="isFeatured">
                          Feature this product on the home page
                        </CheckboxLabel>
                      </CheckboxContainer>
                    </FormGroup>
                  </>
                )}

                {modalMode === 'stock' && (
                  <FormGroup>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormInput
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                )}

                {modalMode === 'sale' && (
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Regular Price *</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Sale Price</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        placeholder="Leave empty to remove sale"
                      />
                    </FormGroup>
                  </FormRow>
                )}

                <FormActions>
                  <CancelButton type="button" onClick={closeModal}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    {modalMode === 'add' && 'Add Product'}
                    {modalMode === 'edit' && 'Update Product'}
                    {modalMode === 'stock' && 'Update Stock'}
                    {modalMode === 'sale' && 'Update Sale'}
                  </SubmitButton>
                </FormActions>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </InventoryContent>
    </InventoryContainer>
  );
};

export default Inventory;
