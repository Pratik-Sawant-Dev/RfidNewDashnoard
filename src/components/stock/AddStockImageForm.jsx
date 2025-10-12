import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ToastContainer } from '../ui/Toast';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';

const AddStockImageForm = () => {
  const [formData, setFormData] = useState({
    itemCode: '',
    categoryName: '',
    branchName: '',
    counterName: '',
    productName: '',
    designName: '',
    purityName: '',
    rfidCode: '',
    grossWeight: '',
    netWeight: '',
    stoneWeight: '',
    diamondHeight: '',
    boxDetails: '',
    size: '',
    stoneAmount: '',
    diamondAmount: '',
    hallmarkAmount: '',
    makingPerGram: '',
    makingPercentage: '',
    makingFixedAmount: '',
    mrp: '',
    status: 'Active',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toasts, success, error, removeToast } = useToast();

  // Master data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [purities, setPurities] = useState([]);
  const [boxes, setBoxes] = useState([]);

  // Load master data on component mount
  useEffect(() => {
    loadMasterData();
  }, []);

  // Load master data from APIs
  const loadMasterData = async () => {
    try {
      const [
        categoriesRes,
        productsRes,
        branchesRes,
        countersRes,
        designsRes,
        puritiesRes,
        boxesRes,
      ] = await Promise.all([
        apiService.getCategories(),
        apiService.getProducts(),
        apiService.getBranches(),
        apiService.getCounters(),
        apiService.getDesigns(),
        apiService.getPurities(),
        apiService.getBoxes(),
      ]);

      setCategories(categoriesRes.data || categoriesRes || []);
      setProducts(productsRes.data || productsRes || []);
      setBranches(branchesRes.data || branchesRes || []);
      setCounters(countersRes.data || countersRes || []);
      setDesigns(designsRes.data || designsRes || []);
      setPurities(puritiesRes.data || puritiesRes || []);
      setBoxes(boxesRes.data || boxesRes || []);
      
    } catch (error) {
      console.error("Error loading master data:", error);
      error("Failed to load master data. Please refresh the page.");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      if (!validImageTypes.includes(file.type)) {
        error(`${file.name} is not a valid image format`);
        return false;
      }
      // Check file size
      if (file.size > maxSize) {
        error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['itemCode', 'categoryName', 'productName', 'branchName', 'counterName', 'designName', 'purityName', 'rfidCode', 'grossWeight', 'netWeight', 'makingPerGram'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      error(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (images.length === 0) {
      error('Please select at least one image');
      return;
    }

    setLoading(true);
    
    try {
      // Create new FormData instance for multipart upload
      const formDataInstance = new FormData();
      
      // Add all product fields with proper validation
      const productFields = {
        itemCode: formData.itemCode,
        categoryName: formData.categoryName,
        branchName: formData.branchName,
        counterName: formData.counterName,
        productName: formData.productName,
        designName: formData.designName,
        purityName: formData.purityName,
        rfidCode: formData.rfidCode,
        grossWeight: formData.grossWeight,
        netWeight: formData.netWeight,
        stoneWeight: formData.stoneWeight || '',
        diamondHeight: formData.diamondHeight || '',
        boxDetails: formData.boxDetails || '',
        size: formData.size || '',
        stoneAmount: formData.stoneAmount || '',
        diamondAmount: formData.diamondAmount || '',
        hallmarkAmount: formData.hallmarkAmount || '',
        makingPerGram: formData.makingPerGram,
        makingPercentage: formData.makingPercentage || '',
        makingFixedAmount: formData.makingFixedAmount || '',
        mrp: formData.mrp || '',
        status: formData.status || 'Active'
      };

      // Append all product fields to FormData
      Object.entries(productFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataInstance.append(key, value.toString());
        }
      });
      
      // Add image files and their metadata
      images.forEach((image, index) => {
        // Add the actual file - use 'images' as the key for files
        formDataInstance.append('images', image.file, image.file.name);
        
        // Add metadata for each image with proper indexing
        formDataInstance.append(`Images[${index}].ImageType`, index === 0 ? 'Primary' : 'Secondary');
        formDataInstance.append(`Images[${index}].DisplayOrder`, (index + 1).toString());
      });

      // Debug: Log FormData contents
      console.log('=== FormData Debug Information ===');
      console.log('Total images to upload:', images.length);
      console.log('Product data fields:', Object.keys(productFields).length);
      console.log('FormData instance created:', formDataInstance instanceof FormData);
      
      // Validate FormData structure
      let fileCount = 0;
      let metadataCount = 0;
      
      // Log FormData entries for debugging
      console.log('FormData entries:');
      for (let [key, value] of formDataInstance.entries()) {
        if (value instanceof File) {
          fileCount++;
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          if (key.includes('Images[') && (key.includes('ImageType') || key.includes('DisplayOrder'))) {
            metadataCount++;
          }
          console.log(`${key}:`, value);
        }
      }
      
      console.log(`Validation: ${fileCount} files, ${metadataCount} image metadata entries`);
      
      // Additional validation
      if (fileCount !== images.length) {
        throw new Error(`File count mismatch: expected ${images.length}, found ${fileCount}`);
      }

      const response = await apiService.createProductWithImages(formDataInstance);
      console.log('API Response:', response);
      
      // Success toast
      success('Product saved successfully!');
      
      // Reset form
      setFormData({
        itemCode: '',
        categoryName: '',
        branchName: '',
        counterName: '',
        productName: '',
        designName: '',
        purityName: '',
        rfidCode: '',
        grossWeight: '',
        netWeight: '',
        stoneWeight: '',
        diamondHeight: '',
        boxDetails: '',
        size: '',
        stoneAmount: '',
        diamondAmount: '',
        hallmarkAmount: '',
        makingPerGram: '',
        makingPercentage: '',
        makingFixedAmount: '',
        mrp: '',
        status: 'Active',
      });
      setImages([]);
      
    } catch (err) {
      console.error('Error creating product with images:', err);
      
      // Error toast
      let errorMessage = 'Failed to save product';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Product Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Item Code"
                value={formData.itemCode}
                onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
                placeholder="Enter item code"
                required
              />
              <Select
                label="Product Name"
                value={formData.productName}
                onChange={(value) => setFormData({...formData, productName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={products
                  .filter((product) => product)
                  .map((product) => {
                    const name =
                      typeof product === "object"
                        ? product.productName
                        : product;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Select
                label="Category"
                value={formData.categoryName}
                onChange={(value) => setFormData({...formData, categoryName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={categories
                  .filter((category) => category)
                  .map((category) => {
                    const name =
                      typeof category === "object"
                        ? category.categoryName
                        : category;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Select
                label="Branch"
                value={formData.branchName}
                onChange={(value) => setFormData({...formData, branchName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={branches
                  .filter((branch) => branch)
                  .map((branch) => {
                    const name =
                      typeof branch === "object" ? branch.branchName : branch;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Select
                label="Counter"
                value={formData.counterName}
                onChange={(value) => setFormData({...formData, counterName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={counters
                  .filter((counter) => counter)
                  .map((counter) => {
                    const name =
                      typeof counter === "object"
                        ? counter.counterName
                        : counter;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Select
                label="Design"
                value={formData.designName}
                onChange={(value) => setFormData({...formData, designName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={designs
                  .filter((design) => design)
                  .map((design) => {
                    const name =
                      typeof design === "object" ? design.designName : design;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Select
                label="Purity"
                value={formData.purityName}
                onChange={(value) => setFormData({...formData, purityName: value})}
                placeholder="Select or type..."
                searchable={true}
                required
                options={purities
                  .filter((purity) => purity)
                  .map((purity) => {
                    const name =
                      typeof purity === "object" ? purity.purityName : purity;
                    return { value: name || "", label: name || "" };
                  })}
              />
              <Input
                label="RFID Code"
                value={formData.rfidCode}
                onChange={(e) => setFormData({...formData, rfidCode: e.target.value})}
                placeholder="Enter RFID code"
                required
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(value) => setFormData({...formData, status: value})}
                placeholder="Select status"
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>

          {/* Weight and Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Gross Weight (g)"
              type="number"
              step="0.01"
              value={formData.grossWeight}
              onChange={(e) => setFormData({...formData, grossWeight: e.target.value})}
              placeholder="0.00"
              required
            />
            <Input
              label="Net Weight (g)"
              type="number"
              step="0.01"
              value={formData.netWeight}
              onChange={(e) => setFormData({...formData, netWeight: e.target.value})}
              placeholder="0.00"
              required
            />
            <Input
              label="Stone Weight (g)"
              type="number"
              step="0.01"
              value={formData.stoneWeight}
              onChange={(e) => setFormData({...formData, stoneWeight: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Diamond Height (mm)"
              type="number"
              step="0.01"
              value={formData.diamondHeight}
              onChange={(e) => setFormData({...formData, diamondHeight: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Size"
              type="number"
              step="0.1"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              placeholder="0.0"
            />
            <Input
              label="Stone Amount (₹)"
              type="number"
              step="0.01"
              value={formData.stoneAmount}
              onChange={(e) => setFormData({...formData, stoneAmount: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Diamond Amount (₹)"
              type="number"
              step="0.01"
              value={formData.diamondAmount}
              onChange={(e) => setFormData({...formData, diamondAmount: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Hallmark Amount (₹)"
              type="number"
              step="0.01"
              value={formData.hallmarkAmount}
              onChange={(e) => setFormData({...formData, hallmarkAmount: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Making/g (₹)"
              type="number"
              step="0.01"
              value={formData.makingPerGram}
              onChange={(e) => setFormData({...formData, makingPerGram: e.target.value})}
              placeholder="0.00"
              required
            />
            <Input
              label="Making % (%)"
              type="number"
              step="0.01"
              value={formData.makingPercentage}
              onChange={(e) => setFormData({...formData, makingPercentage: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Making Fixed (₹)"
              type="number"
              step="0.01"
              value={formData.makingFixedAmount}
              onChange={(e) => setFormData({...formData, makingFixedAmount: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="MRP (₹)"
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => setFormData({...formData, mrp: e.target.value})}
              placeholder="0.00"
            />
            <Select
              label="Box Details"
              value={formData.boxDetails}
              onChange={(value) => setFormData({...formData, boxDetails: value})}
              placeholder="Select or type..."
              searchable={true}
              options={boxes
                .filter((box) => box)
                .map((box) => {
                  const name =
                    typeof box === "object" ? box.boxName || box.boxDetails : box;
                  return { value: name || "", label: name || "" };
                })}
            />
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, JPEG, GIF, WEBP up to 10MB
              </p>
              {images.length > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ {images.length} image{images.length > 1 ? 's' : ''} ready to upload
                </p>
              )}
            </div>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Images ({images.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  itemCode: '',
                  categoryName: '',
                  branchName: '',
                  counterName: '',
                  productName: '',
                  designName: '',
                  purityName: '',
                  rfidCode: '',
                  grossWeight: '',
                  netWeight: '',
                  stoneWeight: '',
                  diamondHeight: '',
                  boxDetails: '',
                  size: '',
                  stoneAmount: '',
                  diamondAmount: '',
                  hallmarkAmount: '',
                  makingPerGram: '',
                  makingPercentage: '',
                  makingFixedAmount: '',
                  mrp: '',
                  status: 'Active',
                });
                setImages([]);
              }}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={loading || images.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="flex items-start space-x-3">
          <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Image Upload Guidelines
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Upload high-quality images for better product display</li>
              <li>• Supported formats: JPG, PNG, JPEG, GIF, WEBP</li>
              <li>• Maximum file size: 10MB per image</li>
              <li>• You can upload multiple images at once</li>
              <li>• First image will be set as Primary, others as Secondary</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AddStockImageForm;

