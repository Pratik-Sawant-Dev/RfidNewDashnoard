import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Upload, FileSpreadsheet, Loader2, Radio, Tag, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import apiService from '../../services/apiService';

const AddRFIDPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const { success, error, toasts, removeToast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rfidCode: '',
      epcValue: '',
    },
  });

  // Helper function to extract message from backend response
  const extractBackendMessage = (response, defaultMessage) => {
    if (!response) return defaultMessage;
    
    // If response is a string, return it
    if (typeof response === 'string') return response;
    
    // If response is boolean true, return default success message
    if (response === true) return defaultMessage;
    
    // If response is an object
    if (typeof response === 'object') {
      // Check for message property (case-insensitive)
      if (response.message) return response.message;
      if (response.Message) return response.Message;
      
      // Check for data.message
      if (response.data?.message) return response.data.message;
      if (response.data?.Message) return response.data.Message;
      
      // Check for error message
      if (response.error) return response.error;
      if (response.Error) return response.Error;
      
      // Check for status messages
      if (response.status === 'success' && response.message) return response.message;
      if (response.status === 'error' && response.message) return response.message;
      
      // Check for success flag with message
      if (response.success === true && response.message) return response.message;
      if (response.success === false && response.message) return response.message;
      
      // Check for statusText
      if (response.statusText) return response.statusText;
    }
    
    return defaultMessage;
  };

  // Helper function to check if response indicates success
  const isSuccessResponse = (response) => {
    if (!response) return false;
    
    // Boolean true
    if (response === true) return true;
    
    // If response is a string (error message), it's not success
    if (typeof response === 'string') return false;
    
    // If response is an object
    if (typeof response === 'object') {
      // Check for explicit success flag
      if (response.success === true) return true;
      if (response.success === false) return false;
      
      // Check for status
      if (response.status === 'success') return true;
      if (response.status === 'error') return false;
      
      // Check for statusCode (200-299 are success)
      if (response.statusCode >= 200 && response.statusCode < 300) return true;
      if (response.statusCode >= 400) return false;
      
      // Check for HTTP status code in response
      if (response.status >= 200 && response.status < 300) return true;
      if (response.status >= 400) return false;
      
      // If response exists and has data, consider it success (unless explicitly failed)
      if (response.data || Object.keys(response).length > 0) {
        // Only if not explicitly marked as error
        if (response.error || response.status === 'error' || response.success === false) return false;
        return true;
      }
    }
    
    return false;
  };

  // Handle manual RFID addition
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const tagData = {
        rfidCode: data.rfidCode.trim(),
        epcValue: data.epcValue.trim(),
      };
      
      const response = await apiService.addRfidTag(tagData);
      
      // Check if response indicates success
      if (isSuccessResponse(response)) {
        // Extract and show backend message or default success message
        const successMessage = extractBackendMessage(response, 'RFID tag added successfully!');
        success(successMessage);
        reset();
      } else {
        // Extract error message from response
        const errorMessage = extractBackendMessage(response, 'Failed to add RFID tag. Please try again.');
        error(errorMessage);
      }
    } catch (err) {
      console.error('Error adding RFID tag:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      // Extract error message from various possible locations
      let errorMessage = 'Failed to add RFID tag. Please try again.';
      
      // Priority order: response.data.message > response.data.error > response.message > err.message
      if (err.response?.data) {
        const responseData = err.response.data;
        
        // Try different message field variations
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
      
      // Clean and trim the error message
      errorMessage = errorMessage.trim();
      
      // Ensure error message is not empty
      if (!errorMessage || errorMessage === 'undefined' || errorMessage === 'null') {
        errorMessage = 'Failed to add RFID tag. Please try again.';
      }
      
      // Show error toast
      console.log('Displaying error toast with message:', errorMessage);
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileType)) {
      error('Please upload a valid Excel or CSV file');
      return;
    }
    setFile(selectedFile);
  };

  // Handle Excel upload using API
  const handleExcelUpload = async () => {
    if (!file) {
      error('Please select an Excel file first');
      return;
    }

    try {
      setUploadLoading(true);
      
      // Call upload Excel API with form-data
      const response = await apiService.uploadRfidExcel(file, true, true);
      
      // Check if response indicates success
      if (isSuccessResponse(response)) {
        // Extract message from backend
        const successMessage = extractBackendMessage(
          response,
          'Excel file uploaded successfully!'
        );
        
        success(successMessage);
        setFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        // Extract error message from response
        const errorMessage = extractBackendMessage(
          response,
          'Failed to upload Excel file. Please check the file format and try again.'
        );
        error(errorMessage);
      }
    } catch (err) {
      console.error('Error uploading Excel:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      // Extract error message from various possible locations
      let errorMessage = 'Failed to upload Excel file. Please check the file format and try again.';
      
      // Priority order: response.data.message > response.data.error > response.message > err.message
      if (err.response?.data) {
        const responseData = err.response.data;
        
        // Try different message field variations
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
      
      // Clean and trim the error message
      errorMessage = errorMessage.trim();
      
      // Ensure error message is not empty
      if (!errorMessage || errorMessage === 'undefined' || errorMessage === 'null') {
        errorMessage = 'Failed to upload RFID tags. Please check the file format and try again.';
      }
      
      // Show error toast
      console.log('Displaying error toast with message:', errorMessage);
      error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Handle Excel template download from API
  const handleDownloadTemplate = async () => {
    try {
      setUploadLoading(true);
      const response = await apiService.downloadRfidTemplate();
      
      // Create a blob from the response
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'RFID_Tags_Template.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      success('Excel template downloaded successfully!');
    } catch (err) {
      console.error('Error downloading template:', err);
      const errorMessage = extractBackendMessage(
        err.response?.data,
        err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to download template'
      );
      error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-6 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600 dark:text-rose-400" />
            <span>Add RFID Tags</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Add RFID tags individually or upload bulk tags via Excel sheet
          </p>
        </div>

        {/* Top Section - Manual RFID Addition */}
        <Card className="w-full">
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>Add RFID Tag</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Input
                    label="RFID Code"
                    {...register('rfidCode', {
                      required: 'RFID Code is required',
                    })}
                    placeholder="Enter RFID code"
                    error={errors.rfidCode?.message}
                    required
                    icon={Radio}
                    iconColor="text-rose-600 dark:text-rose-400"
                  />
                </div>
                <div className="md:col-span-1">
                  <Input
                    label="EPC Value"
                    {...register('epcValue', {
                      required: 'EPC Value is required',
                    })}
                    placeholder="Enter EPC value"
                    error={errors.epcValue?.message}
                    required
                    icon={Tag}
                    iconColor="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-rose-600 dark:border-rose-400 text-rose-600 dark:text-rose-400 rounded-lg font-medium transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600 dark:text-rose-400" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Add RFID Tag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Bottom Section - Excel Upload */}
        <Card className="w-full">
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Upload RFID Excel Sheet</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Upload an Excel file (.xlsx, .xls) or CSV file containing RFID tags. 
                    The file should have columns: <span className="font-semibold">RFID Code</span> and <span className="font-semibold">EPC Value</span>.
                    The first row should contain headers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="min-w-[160px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 rounded-lg font-medium text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-900/20 whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 lg:p-16 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <FileSpreadsheet className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Excel (.xlsx, .xls) or CSV files only
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            {file && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExcelUpload}
                    disabled={uploadLoading}
                    className="min-w-[160px] flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Excel Format Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Excel Format Example:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                        RFID Code
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                        EPC Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                        RFID001
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                        EPC001234567
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                        RFID002
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                        EPC001234568
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AddRFIDPage;

