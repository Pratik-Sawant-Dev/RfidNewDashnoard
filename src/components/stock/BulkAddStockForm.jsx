import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';

const BulkAddStockForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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
      alert('Please upload a valid Excel or CSV file');
      return;
    }
    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.bulkUploadProducts(formData);
      const result = response.data || response;
      
      setUploadResult({
        success: result.successCount || 0,
        failed: result.failedCount || 0,
        total: result.totalCount || 0,
        errors: result.errors || []
      });
      
      success(`Bulk upload completed! ${result.successCount || 0} items added successfully.`);
    } catch (err) {
      console.error('Error during bulk upload:', err);
      error(err.response?.data?.message || 'Failed to upload file');
      
      // Set error result
      setUploadResult({
        success: 0,
        failed: 0,
        total: 0,
        errors: [err.response?.data?.message || 'Upload failed']
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      // In a real app, this would call an API to download the template
      const link = document.createElement('a');
      link.href = '/templates/bulk-upload-template.xlsx'; // Template file path
      link.download = 'bulk-upload-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Template downloaded successfully!');
    } catch (err) {
      error('Failed to download template');
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult(null);
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
                    Start by downloading our template with the required format
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
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFile}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Upload Summary
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <p>✓ Successfully added: <span className="font-semibold text-green-600">{uploadResult.success}</span> items</p>
                      <p>✗ Failed: <span className="font-semibold text-red-600">{uploadResult.failed}</span> items</p>
                      <p>Total processed: {uploadResult.total} items</p>
                    </div>
                  </div>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Errors Found
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={clearFile}
              disabled={!file || loading}
            >
              Clear
            </Button>
            <Button
              variant="accent"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </>
              )}
            </Button>
          </div>
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
              <li>• Download the Excel template to see the required format</li>
              <li>• Fill in all required fields (marked with * in template)</li>
              <li>• Ensure RFID codes are unique for each item</li>
              <li>• Use proper data formats (numbers for weights, dates for dates)</li>
              <li>• Maximum 1000 rows per upload</li>
              <li>• Review the upload summary for any errors</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BulkAddStockForm;

