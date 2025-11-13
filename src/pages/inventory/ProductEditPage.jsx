import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Loader2,
  ArrowLeft,
  Save,
  X,
  Plus,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { ToastContainer } from '../../components/ui/Toast';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  
  // Master data states
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [purities, setPurities] = useState([]);
  
  // Custom fields
  const [customFields, setCustomFields] = useState([]);
  
  // Image upload states
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const { error, success, toasts, removeToast } = useToast();

  // Extract backend message helper
  const extractBackendMessage = (response, defaultMessage) => {
    if (!response) return defaultMessage;
    
    if (typeof response === 'string') return response;
    
    if (response.message) return String(response.message);
    if (response.Message) return String(response.Message);
    if (response.data?.message) return String(response.data.message);
    if (response.data?.Message) return String(response.data.Message);
    if (response.error) return String(response.error);
    if (response.Error) return String(response.Error);
    if (response.data?.error) return String(response.data.error);
    if (response.data?.Error) return String(response.data.Error);
    
    return defaultMessage;
  };

  // Load product and master data
  useEffect(() => {
    if (productId) {
      loadProductData();
      loadMasterData();
    }
  }, [productId]);

  // Load product data
  const loadProductData = async () => {
    if (!productId) {
      error('Product ID is missing');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);
      
      // Initialize form data - convert numbers to strings for form inputs
      const initialFormData = {
        productName: productData.productName || '',
        categoryId: productData.categoryId != null ? String(productData.categoryId) : '',
        branchId: productData.branchId != null ? String(productData.branchId) : '',
        counterId: productData.counterId != null ? String(productData.counterId) : '',
        designId: productData.designId != null ? String(productData.designId) : '',
        purityId: productData.purityId != null ? String(productData.purityId) : '',
        grossWeight: productData.grossWeight != null ? String(productData.grossWeight) : '',
        netWeight: productData.netWeight != null ? String(productData.netWeight) : '',
        stoneWeight: productData.stoneWeight != null ? String(productData.stoneWeight) : '',
        diamondHeight: productData.diamondHeight != null ? String(productData.diamondHeight) : '',
        size: productData.size != null ? String(productData.size) : '',
        boxDetails: productData.boxDetails || '',
        stoneAmount: productData.stoneAmount != null ? String(productData.stoneAmount) : '',
        diamondAmount: productData.diamondAmount != null ? String(productData.diamondAmount) : '',
        hallmarkAmount: productData.hallmarkAmount != null ? String(productData.hallmarkAmount) : '',
        makingPerGram: productData.makingPerGram != null ? String(productData.makingPerGram) : '',
        makingPercentage: productData.makingPercentage != null ? String(productData.makingPercentage) : '',
        makingFixedAmount: productData.makingFixedAmount != null ? String(productData.makingFixedAmount) : '',
        mrp: productData.mrp != null ? String(productData.mrp) : '',
        status: productData.status || 'Active',
      };
      
      setFormData(initialFormData);
      // Deep clone and ensure all values are strings for comparison
      const clonedData = JSON.parse(JSON.stringify(initialFormData));
      // Ensure ID fields are strings in original data too
      ['categoryId', 'branchId', 'counterId', 'designId', 'purityId'].forEach(idKey => {
        if (clonedData[idKey] != null) {
          clonedData[idKey] = String(clonedData[idKey]);
        }
      });
      setOriginalData(clonedData);
      
      // Initialize custom fields
      if (productData.customFields) {
        if (Array.isArray(productData.customFields)) {
          setCustomFields(productData.customFields.map((field, index) => ({
            id: index,
            fieldName: field.fieldName || '',
            fieldValue: field.fieldValue || '',
          })));
        } else if (typeof productData.customFields === 'object') {
          setCustomFields(Object.entries(productData.customFields).map(([key, value], index) => ({
            id: index,
            fieldName: key,
            fieldValue: String(value),
          })));
        }
      }
    } catch (err) {
      console.error('Error loading product details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load product details';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load master data
  const loadMasterData = async () => {
    try {
      const [
        categoriesRes,
        branchesRes,
        countersRes,
        designsRes,
        puritiesRes,
      ] = await Promise.all([
        apiService.getCategories(),
        apiService.getBranches(),
        apiService.getCounters(),
        apiService.getDesigns(),
        apiService.getPurities(),
      ]);

      setCategories(categoriesRes.data || categoriesRes || []);
      setBranches(branchesRes.data || branchesRes || []);
      setCounters(countersRes.data || countersRes || []);
      setDesigns(designsRes.data || designsRes || []);
      setPurities(puritiesRes.data || puritiesRes || []);
    } catch (err) {
      console.error('Error loading master data:', err);
      error('Failed to load master data');
    }
  };

  // Handle form field change
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle custom field change
  const handleCustomFieldChange = (id, field, value) => {
    setCustomFields(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Add custom field
  const addCustomField = () => {
    setCustomFields(prev => [...prev, {
      id: Date.now(),
      fieldName: '',
      fieldValue: '',
    }]);
  };

  // Remove custom field
  const removeCustomField = (id) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  // Normalize value for comparison - handle numbers and strings
  const normalizeValue = (value) => {
    if (value === null || value === undefined || value === '') return '';
    // Convert to string and trim for comparison
    return String(value).trim();
  };

  // Normalize ID value for comparison - handle both string and number IDs
  const normalizeIdValue = (value) => {
    if (value === null || value === undefined || value === '') return '';
    // Convert to string, remove any whitespace
    const str = String(value).trim();
    // If it's a valid number string, return it as is for comparison
    return str;
  };

  // Get only changed fields
  const getChangedFields = () => {
    const changed = {};
    
    // Check regular fields
    Object.keys(formData).forEach(key => {
      // Special handling for ID fields
      if (['categoryId', 'branchId', 'counterId', 'designId', 'purityId'].includes(key)) {
        const currentValue = normalizeIdValue(formData[key]);
        const originalValue = normalizeIdValue(originalData[key]);
        
        // Compare as strings but convert to number when adding to changed
        if (currentValue !== originalValue) {
          if (currentValue === '') {
            changed[key] = null;
          } else {
            const numValue = parseInt(currentValue, 10);
            changed[key] = isNaN(numValue) ? null : numValue;
          }
        }
      } else {
        // For non-ID fields
        const currentValue = normalizeValue(formData[key]);
        const originalValue = normalizeValue(originalData[key]);
        
        // Compare normalized values
        if (currentValue !== originalValue) {
          // Convert empty strings to null for numeric fields
          if (['grossWeight', 'netWeight', 'stoneWeight', 'diamondHeight', 'size', 
               'stoneAmount', 'diamondAmount', 'hallmarkAmount', 'makingPerGram', 
               'makingPercentage', 'makingFixedAmount', 'mrp'].includes(key)) {
            if (currentValue === '') {
              changed[key] = null;
            } else {
              const numValue = parseFloat(currentValue);
              changed[key] = isNaN(numValue) ? null : numValue;
            }
          } else {
            // String fields
            changed[key] = currentValue === '' ? null : currentValue;
          }
        }
      }
    });
    
    // Check custom fields
    const originalCustomFields = product?.customFields || {};
    let originalCustomObj = {};
    
    if (Array.isArray(originalCustomFields)) {
      originalCustomObj = originalCustomFields.reduce((acc, field) => {
        if (field.fieldName) {
          acc[field.fieldName] = String(field.fieldValue || '');
        }
        return acc;
      }, {});
    } else if (typeof originalCustomFields === 'object' && originalCustomFields !== null) {
      Object.entries(originalCustomFields).forEach(([key, value]) => {
        originalCustomObj[key] = String(value || '');
      });
    }
    
    const currentCustomObj = customFields.reduce((acc, field) => {
      if (field.fieldName && field.fieldValue) {
        acc[field.fieldName] = String(field.fieldValue).trim();
      }
      return acc;
    }, {});
    
    // Check if custom fields changed
    const allCustomKeys = new Set([
      ...Object.keys(originalCustomObj),
      ...Object.keys(currentCustomObj),
    ]);
    
    let hasChanges = false;
    const changedCustomFields = {};
    
    allCustomKeys.forEach(key => {
      const originalVal = String(originalCustomObj[key] || '').trim();
      const currentVal = String(currentCustomObj[key] || '').trim();
      
      if (originalVal !== currentVal) {
        hasChanges = true;
        changedCustomFields[key] = currentVal || '';
      }
    });
    
    if (hasChanges) {
      changed.customFields = changedCustomFields;
    }
    
    return changed;
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setNewImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, {
          file,
          preview: reader.result,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productId) {
      error('Product ID is missing');
      return;
    }
    
    const changedFields = getChangedFields();
    const hasImageChanges = newImages.length > 0;
    
    if (Object.keys(changedFields).length === 0 && !hasImageChanges) {
      success('No changes detected');
      return;
    }
    
    try {
      setSaving(true);
      
      // If there are images, use the with-images endpoint
      if (hasImageChanges) {
        const formData = new FormData();
        
        // Add all changed product fields to FormData
        Object.keys(changedFields).forEach(key => {
          const value = changedFields[key];
          
          // Handle ID fields - convert to number
          if (['categoryId', 'branchId', 'counterId', 'designId', 'purityId'].includes(key)) {
            if (value !== null && value !== '') {
              const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
              if (!isNaN(numValue)) {
                formData.append(key, numValue.toString());
              }
            }
          } else if (key === 'customFields') {
            // Skip customFields for now - handle separately if needed
            // formData.append(key, JSON.stringify(value));
          } else {
            // Add other fields
            if (value !== null && value !== undefined) {
              formData.append(key, value.toString());
            }
          }
        });
        
        // Add custom fields if changed
        if (changedFields.customFields) {
          Object.entries(changedFields.customFields).forEach(([fieldName, fieldValue]) => {
            formData.append(`customFields[${fieldName}]`, fieldValue);
          });
        }
        
        // Add new images
        newImages.forEach((file, index) => {
          formData.append('newImages', file, file.name);
          formData.append(`ImagesToAdd[${index}].ImageType`, index === 0 ? 'Primary' : 'Secondary');
          formData.append(`ImagesToAdd[${index}].DisplayOrder`, (index + 1).toString());
        });
        
        // Log FormData for debugging
        console.log('Updating product with images. FormData contents:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, `File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        }
        
        const response = await apiService.updateProductWithImages(productId, formData);
        
        console.log('Update response:', response);
        
        const message = extractBackendMessage(response, 'Product updated successfully');
        success(message);
      } else {
        // No images, use regular update endpoint
        const payload = { ...changedFields };
        ['categoryId', 'branchId', 'counterId', 'designId', 'purityId'].forEach(idKey => {
          if (payload.hasOwnProperty(idKey)) {
            if (payload[idKey] === null || payload[idKey] === '') {
              payload[idKey] = null;
            } else {
              const numValue = typeof payload[idKey] === 'string' 
                ? parseInt(payload[idKey], 10) 
                : payload[idKey];
              payload[idKey] = isNaN(numValue) ? null : numValue;
            }
          }
        });
        
        console.log('Updating product with payload:', payload);
        
        const response = await apiService.updateProduct(productId, payload);
        
        console.log('Update response:', response);
        
        const message = extractBackendMessage(response, 'Product updated successfully');
        success(message);
      }
      
      // Navigate back to product view after a short delay
      setTimeout(() => {
        navigate(`/inventory/product/${productId}`);
      }, 1000);
    } catch (err) {
      console.error('Error updating product:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      let errorMessage = 'Failed to update product. Please try again.';
      
      if (err.response?.data) {
        const responseData = err.response.data;
        if (responseData.message) {
          errorMessage = String(responseData.message);
        } else if (responseData.Message) {
          errorMessage = String(responseData.Message);
        } else if (responseData.error) {
          errorMessage = String(responseData.error);
        } else if (responseData.Error) {
          errorMessage = String(responseData.Error);
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (Array.isArray(responseData) && responseData.length > 0) {
          errorMessage = String(responseData[0]);
        }
      } else if (err.response?.message) {
        errorMessage = String(err.response.message);
      } else if (err.message) {
        errorMessage = String(err.message);
      }
      
      error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading product data...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full space-y-6 p-6">
          <Card className="w-full">
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Product not found
              </p>
              <button
                onClick={() => navigate('/inventory/product-list')}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Product List</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              <span>Edit Product</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Update product information
            </p>
          </div>
          <button
            onClick={() => navigate(`/inventory/product/${productId}`)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 rounded-lg font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/20 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="w-full">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Item Code - Read Only */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Item Code (Read Only)
                    </label>
                    <input
                      type="text"
                      value={product.itemCode || '-'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  {/* RFID Code - Read Only */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      RFID Code (Read Only)
                    </label>
                    <input
                      type="text"
                      value={product.rfidCode || '-'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Select
                      label="Category"
                      value={formData.categoryId?.toString() || ''}
                      onChange={(value) => handleFieldChange('categoryId', parseInt(value) || '')}
                      placeholder="Select category"
                      searchable={true}
                      options={categories.map(cat => ({
                        value: cat.id?.toString() || cat.categoryId?.toString() || '',
                        label: cat.categoryName || cat.name || '',
                      }))}
                    />
                  </div>

                  {/* Product Name */}
                  <div>
                    <Input
                      label="Product Name"
                      type="text"
                      value={formData.productName || ''}
                      onChange={(e) => handleFieldChange('productName', e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Branch */}
                  <div>
                    <Select
                      label="Branch"
                      value={formData.branchId?.toString() || ''}
                      onChange={(value) => handleFieldChange('branchId', parseInt(value) || '')}
                      placeholder="Select branch"
                      searchable={true}
                      options={branches.map(branch => ({
                        value: branch.id?.toString() || branch.branchId?.toString() || '',
                        label: branch.branchName || branch.name || '',
                      }))}
                    />
                  </div>

                  {/* Counter */}
                  <div>
                    <Select
                      label="Counter"
                      value={formData.counterId?.toString() || ''}
                      onChange={(value) => handleFieldChange('counterId', parseInt(value) || '')}
                      placeholder="Select counter"
                      searchable={true}
                      options={counters.map(counter => ({
                        value: counter.id?.toString() || counter.counterId?.toString() || '',
                        label: counter.counterName || counter.name || '',
                      }))}
                    />
                  </div>

                  {/* Design */}
                  <div>
                    <Select
                      label="Design"
                      value={formData.designId?.toString() || ''}
                      onChange={(value) => handleFieldChange('designId', parseInt(value) || '')}
                      placeholder="Select design"
                      searchable={true}
                      options={designs.map(design => ({
                        value: design.id?.toString() || design.designId?.toString() || '',
                        label: design.designName || design.name || '',
                      }))}
                    />
                  </div>

                  {/* Purity */}
                  <div>
                    <Select
                      label="Purity"
                      value={formData.purityId?.toString() || ''}
                      onChange={(value) => handleFieldChange('purityId', parseInt(value) || '')}
                      placeholder="Select purity"
                      searchable={true}
                      options={purities.map(purity => ({
                        value: purity.id?.toString() || purity.purityId?.toString() || '',
                        label: purity.purityName || purity.name || '',
                      }))}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'Active'}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Weight & Dimensions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Weight & Dimensions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Gross Weight (g)"
                    type="number"
                    step="0.01"
                    value={formData.grossWeight || ''}
                    onChange={(e) => handleFieldChange('grossWeight', e.target.value)}
                    placeholder="Enter gross weight"
                  />
                  <Input
                    label="Net Weight (g)"
                    type="number"
                    step="0.01"
                    value={formData.netWeight || ''}
                    onChange={(e) => handleFieldChange('netWeight', e.target.value)}
                    placeholder="Enter net weight"
                  />
                  <Input
                    label="Stone Weight (g)"
                    type="number"
                    step="0.01"
                    value={formData.stoneWeight || ''}
                    onChange={(e) => handleFieldChange('stoneWeight', e.target.value)}
                    placeholder="Enter stone weight"
                  />
                  <Input
                    label="Diamond Height (mm)"
                    type="number"
                    step="0.01"
                    value={formData.diamondHeight || ''}
                    onChange={(e) => handleFieldChange('diamondHeight', e.target.value)}
                    placeholder="Enter diamond height"
                  />
                  <Input
                    label="Size"
                    type="number"
                    step="0.1"
                    value={formData.size || ''}
                    onChange={(e) => handleFieldChange('size', e.target.value)}
                    placeholder="Enter size"
                  />
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Input
                      label="Box Details"
                      type="text"
                      value={formData.boxDetails || ''}
                      onChange={(e) => handleFieldChange('boxDetails', e.target.value)}
                      placeholder="Enter box details"
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Pricing Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Pricing Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Stone Amount (₹)"
                    type="number"
                    step="0.01"
                    value={formData.stoneAmount || ''}
                    onChange={(e) => handleFieldChange('stoneAmount', e.target.value)}
                    placeholder="Enter stone amount"
                  />
                  <Input
                    label="Diamond Amount (₹)"
                    type="number"
                    step="0.01"
                    value={formData.diamondAmount || ''}
                    onChange={(e) => handleFieldChange('diamondAmount', e.target.value)}
                    placeholder="Enter diamond amount"
                  />
                  <Input
                    label="Hallmark Amount (₹)"
                    type="number"
                    step="0.01"
                    value={formData.hallmarkAmount || ''}
                    onChange={(e) => handleFieldChange('hallmarkAmount', e.target.value)}
                    placeholder="Enter hallmark amount"
                  />
                  <Input
                    label="Making per Gram (₹)"
                    type="number"
                    step="0.01"
                    value={formData.makingPerGram || ''}
                    onChange={(e) => handleFieldChange('makingPerGram', e.target.value)}
                    placeholder="Enter making per gram"
                  />
                  <Input
                    label="Making Percentage (%)"
                    type="number"
                    step="0.01"
                    value={formData.makingPercentage || ''}
                    onChange={(e) => handleFieldChange('makingPercentage', e.target.value)}
                    placeholder="Enter making percentage"
                  />
                  <Input
                    label="Making Fixed Amount (₹)"
                    type="number"
                    step="0.01"
                    value={formData.makingFixedAmount || ''}
                    onChange={(e) => handleFieldChange('makingFixedAmount', e.target.value)}
                    placeholder="Enter making fixed amount"
                  />
                  <Input
                    label="MRP (₹)"
                    type="number"
                    step="0.01"
                    value={formData.mrp || ''}
                    onChange={(e) => handleFieldChange('mrp', e.target.value)}
                    placeholder="Enter MRP"
                    required
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Custom Fields */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Custom Fields
                  </h2>
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Field</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {customFields.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No custom fields. Click "Add Field" to add one.
                    </p>
                  ) : (
                    customFields.map((field) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            label="Field Name"
                            type="text"
                            value={field.fieldName}
                            onChange={(e) => handleCustomFieldChange(field.id, 'fieldName', e.target.value)}
                            placeholder="Enter field name"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            label="Field Value"
                            type="text"
                            value={field.fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.id, 'fieldValue', e.target.value)}
                            placeholder="Enter field value"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mb-0.5"
                          title="Remove field"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Image Upload Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Product Images
                </h2>
                <div className="space-y-4">
                  {/* Image Upload Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload New Images
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Select Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Maximum 5MB per image. Multiple images allowed.
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                            <img
                              src={preview.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                              {preview.file.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Current Product Image Info */}
                  {product?.imageUrl && newImages.length === 0 && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-800 dark:text-blue-300">
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                        Current product image will be replaced when you upload new images.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/inventory/product/${productId}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default ProductEditPage;

