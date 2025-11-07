import React, { useState, useEffect } from 'react';
import {
  Radio,
  Loader2,
  RefreshCw,
  Search,
  Tag,
  X,
  Calendar,
  CheckCircle,
  Pencil,
  Trash2,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';
import { ToastContainer } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';

const UnusedRFIDTagsListPage = () => {
  const [rfidTags, setRfidTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [editEpcValue, setEditEpcValue] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const { error, success, toasts, removeToast } = useToast();

  // Load unused RFID tags from API
  const loadUnusedRfidTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAvailableRfidTags();
      // Handle array response or object with data property
      const tags = Array.isArray(response) ? response : (response.data || response || []);
      setRfidTags(tags);
    } catch (err) {
      console.error('Error loading unused RFID tags:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load unused RFID tags';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnusedRfidTags();
  }, []);

  // Search and filter
  const filteredTags = rfidTags.filter((tag) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tag.rfidCode?.toLowerCase().includes(query) ||
      tag.epcValue?.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTags = filteredTags.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return dateString;
    }
  };

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
      
      // Check for error property
      if (response.error) return response.error;
      if (response.Error) return response.Error;
    }
    
    return defaultMessage;
  };

  // Handle edit action - open modal
  const handleEdit = (tag) => {
    setSelectedTag(tag);
    setEditEpcValue(tag.epcValue || '');
    setIsEditModalOpen(true);
  };

  // Handle update RFID tag
  const handleUpdateTag = async () => {
    if (!selectedTag) return;
    
    if (editEpcValue.trim() === '') {
      error('EPC Value cannot be empty');
      return;
    }
    
    if (editEpcValue === selectedTag.epcValue) {
      // No change
      setIsEditModalOpen(false);
      return;
    }
    
    try {
      setUpdating(true);
      const response = await apiService.updateRfidTag(selectedTag.rfidCode, {
        epcValue: editEpcValue.trim()
      });
      
      // apiService already returns response.data
      const message = extractBackendMessage(response, `RFID tag "${selectedTag.rfidCode}" updated successfully`);
      success(message);
      
      // Close modal and reload tags after update
      setIsEditModalOpen(false);
      setSelectedTag(null);
      setEditEpcValue('');
      await loadUnusedRfidTags();
    } catch (err) {
      console.error('Error updating RFID tag:', err);
      const errorMessage = extractBackendMessage(
        err.response?.data, 
        err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update RFID tag'
      );
      error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTag(null);
    setEditEpcValue('');
  };

  // Handle delete action
  const handleDelete = async (tag) => {
    try {
      setLoading(true);
      const response = await apiService.deleteRfidTag(tag.rfidCode);
      
      // apiService already returns response.data
      const message = extractBackendMessage(response, `RFID tag "${tag.rfidCode}" deleted successfully`);
      success(message);
      
      // Reload tags after deletion
      await loadUnusedRfidTags();
    } catch (err) {
      console.error('Error deleting RFID tag:', err);
      const errorMessage = extractBackendMessage(
        err.response?.data,
        err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete RFID tag'
      );
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-6 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
            <span>Unused RFID Tags List</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            View all available and unused RFID tags in your system
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full">
          {/* Header Section with Search and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Unused RFID Tags ({filteredTags.length})
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:max-w-md">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by RFID Code or EPC Value..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={loadUnusedRfidTags}
                disabled={loading}
                className="min-w-[160px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 rounded-lg font-medium text-sm transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-4 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading unused RFID tags...
              </p>
            </div>
          ) : paginatedTags.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {searchQuery ? 'No unused RFID tags found' : 'No unused RFID tags available'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search criteria.' 
                  : 'All RFID tags are currently in use or no tags have been added yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span>RFID Code</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>EPC Value</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Created On</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTags.map((tag, index) => (
                    <tr
                      key={tag.id || tag.rfidCode || index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {tag.rfidCode || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">
                            {tag.epcValue || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          {tag.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(tag.createdOn)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                            title="Edit RFID Tag"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Delete RFID Tag"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTags.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </div>
          )}
        </Card>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title={`Edit EPC Value - ${selectedTag?.rfidCode || ''}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                RFID Code
              </label>
              <Input
                type="text"
                value={selectedTag?.rfidCode || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                EPC Value *
              </label>
              <Input
                type="text"
                value={editEpcValue}
                onChange={(e) => setEditEpcValue(e.target.value)}
                placeholder="Enter EPC value"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleCloseEditModal}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTag}
                disabled={updating || !editEpcValue.trim()}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default UnusedRFIDTagsListPage;

