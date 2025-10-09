/**
 * Image Upload Tester Component
 * Use this to test different FormData formats with your backend
 * 
 * To use: Import and render in AddStockPage or any test page
 */

import React, { useState } from 'react';
import Button from '../ui/Button';
import apiService from '../../services/apiService';

const ImageUploadTester = () => {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('format1');
  const [response, setResponse] = useState(null);

  const testFormats = {
    format1: 'Images[i].File with metadata (current)',
    format2: 'Simple images array',
    format3: 'ImageFiles with separate arrays',
    format4: 'Named parameters (ImageFile0, ImageFile1)',
  };

  const createFormData = (format) => {
    const formData = new FormData();
    
    // Add basic product data
    formData.append('itemCode', 'TEST123');
    formData.append('categoryName', 'Test Category');
    formData.append('branchName', 'Test Branch');
    formData.append('counterName', 'Test Counter');
    formData.append('productName', 'Test Product');
    formData.append('designName', 'Test Design');
    formData.append('purityName', '22K');
    formData.append('rfidCode', 'RFID123');
    formData.append('grossWeight', '10');
    formData.append('netWeight', '9');
    formData.append('makingPerGram', '100');
    formData.append('status', 'Active');

    // Add images based on selected format
    switch (format) {
      case 'format1':
        // Current format: Images[i].File with metadata
        files.forEach((file, index) => {
          formData.append(`Images[${index}].File`, file, file.name);
          formData.append(`Images[${index}].ImageType`, index === 0 ? 'Primary' : 'Secondary');
          formData.append(`Images[${index}].DisplayOrder`, (index + 1).toString());
        });
        break;

      case 'format2':
        // Simple array: just 'images'
        files.forEach((file) => {
          formData.append('images', file, file.name);
        });
        break;

      case 'format3':
        // ImageFiles with separate metadata arrays
        files.forEach((file, index) => {
          formData.append('ImageFiles', file, file.name);
          formData.append(`ImageTypes[${index}]`, index === 0 ? 'Primary' : 'Secondary');
          formData.append(`DisplayOrders[${index}]`, (index + 1).toString());
        });
        break;

      case 'format4':
        // Named parameters
        files.forEach((file, index) => {
          formData.append(`ImageFile${index}`, file, file.name);
          formData.append(`ImageType${index}`, index === 0 ? 'Primary' : 'Secondary');
          formData.append(`DisplayOrder${index}`, (index + 1).toString());
        });
        formData.append('ImageCount', files.length.toString());
        break;

      default:
        break;
    }

    return formData;
  };

  const testUpload = async () => {
    try {
      const formData = createFormData(format);
      
      console.log(`\n=== Testing Format: ${testFormats[format]} ===`);
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0] + ':', pair[1].name, `(${pair[1].size} bytes)`);
        } else {
          console.log(pair[0] + ':', pair[1]);
        }
      }

      const result = await apiService.createProductWithImages(formData);
      setResponse({ success: true, data: result });
      console.log('✓ Success:', result);
    } catch (error) {
      setResponse({ success: false, error: error.message });
      console.error('✗ Error:', error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Image Upload Format Tester</h2>
      
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Test Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {files.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {files.length} file(s) selected
            </p>
          )}
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select FormData Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(testFormats).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Test Button */}
        <Button
          onClick={testUpload}
          disabled={files.length === 0}
          variant="primary"
        >
          Test Upload with {testFormats[format]}
        </Button>

        {/* Response Display */}
        {response && (
          <div className={`p-4 rounded-md ${response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-semibold ${response.success ? 'text-green-800' : 'text-red-800'}`}>
              {response.success ? '✓ Success' : '✗ Error'}
            </h3>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(response.success ? response.data : response.error, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Format Descriptions */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="font-semibold text-sm mb-2">Format Details:</h3>
        <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>Format 1:</strong> Images[0].File, Images[0].ImageType, Images[0].DisplayOrder</li>
          <li><strong>Format 2:</strong> Multiple 'images' entries (simple array)</li>
          <li><strong>Format 3:</strong> ImageFiles array with separate ImageTypes and DisplayOrders arrays</li>
          <li><strong>Format 4:</strong> Named parameters (ImageFile0, ImageFile1, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadTester;

