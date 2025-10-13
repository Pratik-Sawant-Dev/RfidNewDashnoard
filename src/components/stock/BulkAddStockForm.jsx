import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, MapPin, Save, X, Eye } from 'lucide-react';
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

  const handleSaveAll = async () => {
    if (mappedProducts.length === 0) {
      error('No products to save');
      return;
    }

    setLoading(true);
    
    try {
      // Transform the data to match API expectations
      const transformedProducts = mappedProducts.map(product => ({
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
        // Ensure status has a default value
        status: product.status || 'Active'
      }));

      const payload = {
        products: transformedProducts
      };
      
      console.log('Sending payload:', payload);
      
      const response = await apiService.bulkCreateProducts(payload);
      
      setUploadResult({
        success: true,
        message: response.message || 'Products added successfully',
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
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          {/* Download Template Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Download Excel Template
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Start by downloading our template with the required format and sample data
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="whitespace-nowrap"
              >
                <Download className="w-4 h-4 mr-2" />
                Template
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Excel File
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
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Excel (.xlsx, .xls) or CSV files only
              </p>
            </div>
          </div>

          {/* Selected File */}
          {file && (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB · {excelData?.length || 0} rows
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {mappedProducts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreviewModal(true)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className={`${uploadResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border rounded-lg p-4`}>
              <div className="flex items-start space-x-3">
                {uploadResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {uploadResult.success ? 'Success!' : 'Error'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {uploadResult.message}
                  </p>
                  {uploadResult.success && uploadResult.count > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
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
              >
                <MapPin className="w-4 h-4 mr-2" />
                Map Fields
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="flex items-start space-x-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Bulk Upload Instructions
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>1. Download the Excel template to see the required format</li>
              <li>2. Fill in all required fields in your Excel file</li>
              <li>3. Upload the Excel file</li>
              <li>4. Map your Excel columns to the required fields</li>
              <li>5. Preview the data to ensure accuracy</li>
              <li>6. Click "Save All" to add all products at once</li>
              <li>• Ensure RFID codes are unique for each item</li>
              <li>• Use proper data formats (numbers for weights and amounts)</li>
              <li>• Maximum 1000 rows per upload recommended</li>
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
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Map your Excel columns to the required fields. Fields marked with * are required.
            </p>
            
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {EXPECTED_FIELDS.map(field => (
                <div key={field.key} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                  <div className="flex-1">
                    <select
                      value={fieldMapping[field.key] !== undefined ? fieldMapping[field.key] : ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
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

            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowMappingModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={applyMapping}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
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
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Review the data below before saving. You can go back to adjust field mapping if needed.
              </p>
            </div>

            <div className="max-h-[60vh] overflow-auto border dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      RFID Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Gross Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Net Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      MRP
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {mappedProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.itemCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.productName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.categoryName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.rfidCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.grossWeight}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.netWeight}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        ₹{product.mrp?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
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

            <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowMappingModal(true);
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Re-map Fields
              </Button>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={handleSaveAll}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save All ({mappedProducts.length} items)
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

