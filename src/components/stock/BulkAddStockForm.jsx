import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, MapPin, Save, X, Eye, Image as ImageIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';

// Field definitions for mapping
const EXPECTED_FIELDS = [
  { key: 'itemCode', label: 'Item Code', required: true },
  { key: 'categoryName', label: 'Category Name', required: true },
  { key: 'branchName', label: 'Branch Name', required: true },
  { key: 'counterName', label: 'Counter Name', required: true },
  { key: 'productName', label: 'Product Name', required: true },
  { key: 'designName', label: 'Design Name', required: true },
  { key: 'purityName', label: 'Purity Name', required: true },
  { key: 'rfidCode', label: 'RFID Code', required: true },
  { key: 'grossWeight', label: 'Gross Weight', required: true },
  { key: 'netWeight', label: 'Net Weight', required: true },
  { key: 'stoneWeight', label: 'Stone Weight', required: false },
  { key: 'diamondHeight', label: 'Diamond Height', required: false },
  { key: 'boxDetails', label: 'Box Details', required: false },
  { key: 'size', label: 'Size', required: false },
  { key: 'stoneAmount', label: 'Stone Amount', required: false },
  { key: 'diamondAmount', label: 'Diamond Amount', required: false },
  { key: 'hallmarkAmount', label: 'Hallmark Amount', required: false },
  { key: 'makingPerGram', label: 'Making Per Gram', required: false },
  { key: 'makingPercentage', label: 'Making Percentage', required: false },
  { key: 'makingFixedAmount', label: 'Making Fixed Amount', required: false },
  { key: 'mrp', label: 'MRP', required: true },
  { key: 'status', label: 'Status', required: false },
];

const BulkAddStockForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [fieldMapping, setFieldMapping] = useState({});
  const [mappedProducts, setMappedProducts] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [productImages, setProductImages] = useState({}); // Store images for each product by itemCode
  const [imageDragActive, setImageDragActive] = useState(false);
  
  const { success, error } = useToast();

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Check file type
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileType)) {
      error('Please upload a valid Excel or CSV file');
      return;
    }
    setFile(selectedFile);
    setUploadResult(null);
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          error('Excel file must have at least a header row and one data row');
          return;
        }
        
        // First row is headers
        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
        
        setExcelHeaders(headers);
        setExcelData(rows);
        
        // Auto-map fields based on similar names
        const autoMapping = {};
        headers.forEach((header, index) => {
          const normalizedHeader = String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
          const matchedField = EXPECTED_FIELDS.find(field => {
            const normalizedField = field.key.toLowerCase();
            const normalizedLabel = field.label.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedField === normalizedHeader || normalizedLabel === normalizedHeader;
          });
          if (matchedField) {
            autoMapping[matchedField.key] = index;
          }
        });
        
        setFieldMapping(autoMapping);
        setShowMappingModal(true);
        success(`Excel file parsed successfully! Found ${rows.length} rows`);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        error('Failed to parse Excel file');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleMappingChange = (fieldKey, headerIndex) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: headerIndex === '' ? undefined : parseInt(headerIndex)
    }));
  };

  const applyMapping = () => {
    // Validate required fields are mapped
    const missingFields = EXPECTED_FIELDS.filter(field => 
      field.required && fieldMapping[field.key] === undefined
    );
    
    if (missingFields.length > 0) {
      error(`Please map these required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    // Map the data
    const products = excelData.map((row, index) => {
      const product = {};
      EXPECTED_FIELDS.forEach(field => {
        const headerIndex = fieldMapping[field.key];
        if (headerIndex !== undefined) {
          let value = row[headerIndex];
          
          // Convert numeric fields with proper type handling
          if (['grossWeight', 'netWeight', 'stoneWeight', 'diamondHeight', 
               'stoneAmount', 'diamondAmount', 'hallmarkAmount', 'makingPerGram', 
               'makingPercentage', 'makingFixedAmount', 'mrp'].includes(field.key)) {
            // For these fields, convert to number or null if empty
            value = (value && !isNaN(value)) ? parseFloat(value) : null;
          } else if (field.key === 'size') {
            // Size should be integer or null
            value = (value && !isNaN(value)) ? parseInt(value) : null;
          } else {
            // For text fields, convert to string or use default
            value = value ? String(value).trim() : '';
          }
          
          product[field.key] = value;
        } else if (field.key === 'status') {
          product[field.key] = 'Active';
        } else {
          // Set default values for unmapped optional fields
          product[field.key] = '';
        }
      });
      return product;
    });
    
    setMappedProducts(products);
    setShowMappingModal(false);
    setShowPreviewModal(true);
    success(`${products.length} products mapped successfully!`);
  };

  // Image handling functions
  const handleImageDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setImageDragActive(true);
    } else if (e.type === "dragleave") {
      setImageDragActive(false);
    }
  };

  const handleImageDrop = (e, itemCode) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFiles(e.dataTransfer.files, itemCode);
    }
  };

  const handleImageInput = (e, itemCode) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFiles(e.target.files, itemCode);
    }
  };

  const handleImageFiles = (files, itemCode) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = Array.from(files).filter(file => {
      if (!validImageTypes.includes(file.type)) {
        error(`${file.name} is not a valid image format`);
        return false;
      }
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
    
    setProductImages(prev => ({
      ...prev,
      [itemCode]: [...(prev[itemCode] || []), ...newImages]
    }));
  };

  const removeProductImage = (itemCode, imageId) => {
    setProductImages(prev => ({
      ...prev,
      [itemCode]: (prev[itemCode] || []).filter(img => img.id !== imageId)
    }));
  };

  const handleSaveAll = async () => {
    if (mappedProducts.length === 0) {
      error('No products to save');
      return;
    }

    setLoading(true);
    
    try {
      // Process products with images
      const productsWithImages = [];
      
      for (const product of mappedProducts) {
        const productData = {
          ...product,
          // Ensure numeric fields are properly converted
          grossWeight: parseFloat(product.grossWeight) || 0,
          netWeight: parseFloat(product.netWeight) || 0,
          stoneWeight: product.stoneWeight ? parseFloat(product.stoneWeight) : null,
          diamondHeight: product.diamondHeight ? parseFloat(product.diamondHeight) : null,
          size: product.size ? parseInt(product.size) : null,
          stoneAmount: product.stoneAmount ? parseFloat(product.stoneAmount) : null,
          diamondAmount: product.diamondAmount ? parseFloat(product.diamondAmount) : null,
          hallmarkAmount: product.hallmarkAmount ? parseFloat(product.hallmarkAmount) : null,
          makingPerGram: product.makingPerGram ? parseFloat(product.makingPerGram) : null,
          makingPercentage: product.makingPercentage ? parseFloat(product.makingPercentage) : null,
          makingFixedAmount: product.makingFixedAmount ? parseFloat(product.makingFixedAmount) : null,
          mrp: parseFloat(product.mrp) || 0,
          status: product.status || 'Active'
        };

        const images = productImages[product.itemCode] || [];
        
        if (images.length > 0) {
          // Use create-with-images API for products with images
          const formData = new FormData();
          
          // Remove null/undefined/empty values from productData
          const cleanedProductData = { ...productData };
          Object.keys(cleanedProductData).forEach(key => {
            if (cleanedProductData[key] === null || cleanedProductData[key] === undefined || cleanedProductData[key] === '') {
              delete cleanedProductData[key];
            }
          });

          // Convert product data to JSON string and append as 'productData'
          const productDataJson = JSON.stringify(cleanedProductData);
          formData.append('productData', productDataJson);

          // Add image files - use 'images' as the key for files
          images.forEach((imgObj) => {
            formData.append('images', imgObj.file, imgObj.file.name);
          });

          try {
            await apiService.createProductWithImages(formData);
          } catch (err) {
            console.error(`Error creating product ${product.itemCode} with images:`, err);
            throw err;
          }
        } else {
          // Use regular create API for products without images
          productsWithImages.push(productData);
        }
      }

      // Bulk create products without images
      if (productsWithImages.length > 0) {
        const payload = {
          products: productsWithImages
        };
        
        await apiService.bulkCreateProducts(payload);
      }
      
      setUploadResult({
        success: true,
        message: 'Products added successfully',
        count: mappedProducts.length
      });
      
      success(`Successfully added ${mappedProducts.length} products!`);
      setShowPreviewModal(false);
      
      // Reset after successful save
      setTimeout(() => {
        clearAll();
      }, 2000);
      
    } catch (err) {
      console.error('Error during bulk create:', err);
      
      // Handle validation errors
      if (err.response?.data) {
        const errorData = err.response.data;
        let errorMessage = 'Validation errors found:';
        
        // Format validation errors
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            const messages = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
            errorMessage += `\n${key}: ${messages.join(', ')}`;
          });
        } else {
          errorMessage = errorData.message || errorData || 'Failed to add products';
        }
        
        error(errorMessage);
        setUploadResult({
          success: false,
          message: errorMessage,
          count: 0
        });
      } else {
        const errorMessage = err.message || 'Failed to add products';
        error(errorMessage);
        setUploadResult({
          success: false,
          message: errorMessage,
          count: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a sample Excel template with proper data types
    const templateData = [
      EXPECTED_FIELDS.map(field => field.label),
      [
        'JWL001', // Item Code
        'Rings', // Category Name
        'Main Branch', // Branch Name
        'Counter 1', // Counter Name
        'Gold Ring', // Product Name
        'Classic', // Design Name
        '24K', // Purity Name
        'RFID001', // RFID Code
        5.5, // Gross Weight (number)
        5.0, // Net Weight (number)
        0.5, // Stone Weight (number)
        1.5, // Diamond Height (number)
        'Premium box', // Box Details
        18, // Size (integer)
        10000, // Stone Amount (number)
        15000, // Diamond Amount (number)
        500, // Hallmark Amount (number)
        100, // Making Per Gram (number)
        15, // Making Percentage (number)
        2000, // Making Fixed Amount (number)
        35000, // MRP (number)
        'Active' // Status
      ],
      [
        'JWL002', // Item Code
        'Necklaces', // Category Name
        'Main Branch', // Branch Name
        'Counter 2', // Counter Name
        'Diamond Necklace', // Product Name
        'Modern', // Design Name
        '18K', // Purity Name
        'RFID002', // RFID Code
        12.0, // Gross Weight (number)
        11.5, // Net Weight (number)
        1.2, // Stone Weight (number)
        2.0, // Diamond Height (number)
        'Luxury box', // Box Details
        20, // Size (integer)
        25000, // Stone Amount (number)
        30000, // Diamond Amount (number)
        800, // Hallmark Amount (number)
        120, // Making Per Gram (number)
        18, // Making Percentage (number)
        3500, // Making Fixed Amount (number)
        75000, // MRP (number)
        'Active' // Status
      ]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Set column widths
    ws['!cols'] = EXPECTED_FIELDS.map(() => ({ wch: 15 }));
    
    XLSX.writeFile(wb, 'bulk-upload-template.xlsx');
    success('Template downloaded successfully!');
  };

  const clearAll = () => {
    setFile(null);
    setExcelData(null);
    setExcelHeaders([]);
    setFieldMapping({});
    setMappedProducts([]);
    setUploadResult(null);
    setShowMappingModal(false);
    setShowPreviewModal(false);
    setProductImages({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          {/* Download Template Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-2">
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">
                    Download Excel Template
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Start by downloading our template with the required format and sample data
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="whitespace-nowrap text-xs px-3 py-1.5 h-auto"
              >
                <Download className="w-3 h-3 mr-1.5" />
                Template
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Upload Excel File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
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
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-gray-400" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Excel (.xlsx, .xls) or CSV files only
              </p>
            </div>
          </div>

          {/* Selected File */}
          {file && (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB · {excelData?.length || 0} rows
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1.5">
                  {mappedProducts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreviewModal(true)}
                      className="text-xs px-2.5 py-1.5 h-auto"
                    >
                      <Eye className="w-3 h-3 mr-1.5" />
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={loading}
                    className="text-xs px-2.5 py-1.5 h-auto"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className={`${uploadResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border rounded-lg p-3`}>
              <div className="flex items-start space-x-2">
                {uploadResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">
                    {uploadResult.success ? 'Success!' : 'Error'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {uploadResult.message}
                  </p>
                  {uploadResult.success && uploadResult.count > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      Successfully added {uploadResult.count} products
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {excelData && excelData.length > 0 && mappedProducts.length === 0 && (
            <div className="flex justify-end">
              <Button
                variant="accent"
                onClick={() => setShowMappingModal(true)}
                className="text-xs px-3 py-1.5 h-auto"
              >
                <MapPin className="w-3 h-3 mr-1.5" />
                Map Fields
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="flex items-start space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
              Bulk Upload Instructions
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
              <li>1. Download the Excel template to see the required format</li>
              <li>2. Fill in all required fields in your Excel file</li>
              <li>3. Upload the Excel file</li>
              <li>4. Map your Excel columns to the required fields</li>
              <li>5. Preview the data and add images (optional)</li>
              <li>6. Click "Save All" to add all products at once</li>
              <li>• Ensure RFID codes are unique for each item</li>
              <li>• Use proper data formats (numbers for weights and amounts)</li>
              <li>• Maximum 1000 rows per upload recommended</li>
              <li>• You can add images for each product in the preview</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Field Mapping Modal */}
      {showMappingModal && (
        <Modal
          isOpen={showMappingModal}
          onClose={() => setShowMappingModal(false)}
          title="Map Excel Columns to Fields"
          size="lg"
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Map your Excel columns to the required fields. Fields marked with * are required.
            </p>
            
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {EXPECTED_FIELDS.map(field => (
                <div key={field.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <select
                      value={fieldMapping[field.key] !== undefined ? fieldMapping[field.key] : ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">-- Select Column --</option>
                      {excelHeaders.map((header, index) => (
                        <option key={index} value={index}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowMappingModal(false)}
                className="text-xs px-3 py-1.5 h-auto"
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={applyMapping}
                className="text-xs px-3 py-1.5 h-auto"
              >
                <CheckCircle className="w-3 h-3 mr-1.5" />
                Apply Mapping
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Data Preview Modal */}
      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={`Preview Products (${mappedProducts.length} items)`}
          size="full"
        >
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Review the data below before saving. Add images (optional) for each product. You can go back to adjust field mapping if needed.
              </p>
            </div>

            <div className="max-h-[60vh] overflow-auto border dark:border-gray-700 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Item Code
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        RFID
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        MRP
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Images
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {mappedProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          {product.itemCode}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          {product.productName}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          {product.categoryName}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 font-mono">
                          {product.rfidCode}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          <div>G: {product.grossWeight}g</div>
                          <div>N: {product.netWeight}g</div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                          ₹{product.mrp?.toLocaleString()}
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <div className="space-y-1.5">
                            {/* Image Upload Area */}
                            <div
                              className={`relative border border-dashed rounded p-1.5 transition-colors ${
                                imageDragActive
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                              }`}
                              onDragEnter={(e) => { handleImageDrag(e); }}
                              onDragLeave={(e) => { handleImageDrag(e); }}
                              onDragOver={(e) => { handleImageDrag(e); }}
                              onDrop={(e) => handleImageDrop(e, product.itemCode)}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageInput(e, product.itemCode)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="text-center">
                                <ImageIcon className="w-3 h-3 mx-auto mb-0.5 text-gray-400" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {(productImages[product.itemCode] || []).length} img
                                </span>
                              </div>
                            </div>
                            {/* Image Previews */}
                            {(productImages[product.itemCode] || []).length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {(productImages[product.itemCode] || []).slice(0, 2).map((img) => (
                                  <div key={img.id} className="relative w-8 h-8">
                                    <img
                                      src={img.preview}
                                      alt="Preview"
                                      className="w-full h-full object-cover rounded border border-gray-200 dark:border-gray-700"
                                    />
                                    <button
                                      onClick={() => removeProductImage(product.itemCode, img.id)}
                                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                ))}
                                {(productImages[product.itemCode] || []).length > 2 && (
                                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
                                    +{(productImages[product.itemCode] || []).length - 2}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                            product.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowMappingModal(true);
                }}
                className="text-xs px-3 py-1.5 h-auto w-full sm:w-auto"
              >
                <MapPin className="w-3 h-3 mr-1.5" />
                Re-map Fields
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 h-auto flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={handleSaveAll}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 h-auto flex-1 sm:flex-initial"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1.5" />
                      Save All ({mappedProducts.length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BulkAddStockForm;

