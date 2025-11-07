import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Palette, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import Toast from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import apiService from '../../services/apiService';

const DesignPage = () => {
  const [designs, setDesigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    designName: ''
  });
  const { toasts, success, error, removeToast } = useToast();

  // Load designs on component mount
  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDesigns();
      console.log('API Response:', response); // Debug log
      
      // Ensure response is an array
      let designsArray = [];
      if (Array.isArray(response)) {
        designsArray = response;
      } else if (response && Array.isArray(response.data)) {
        designsArray = response.data;
      } else if (response && response.designs && Array.isArray(response.designs)) {
        designsArray = response.designs;
      } else {
        console.warn('Unexpected API response format:', response);
        designsArray = [];
      }
      
      console.log('Designs array:', designsArray); // Debug log to see the structure
      setDesigns(designsArray);
    } catch (err) {
      console.error('Error loading designs:', err);
      error('Failed to load designs. Please try again.');
      setDesigns([]); // Ensure designs is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDesign(null);
    setFormData({ designName: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (design) => {
    console.log(design);
    setSelectedDesign(design);
    setFormData({
      designName: design.designName || design.name || '',
      designId: design.designId || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (design) => {
    setSelectedDesign(design);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (selectedDesign) {
        // Update existing design
        const updatePayload = {
          designId: selectedDesign.designId || selectedDesign.id,
          designName: formData.designName
        };
        
        console.log('Update payload:', updatePayload); // Debug log
        console.log('Selected design:', selectedDesign); // Debug log
        
        await apiService.updateDesign(updatePayload);
        success('Design updated successfully!');
      } else {
        // Add new design - only designName is required
        const addPayload = {
          designName: formData.designName
        };
        
        await apiService.addDesign(addPayload);
        success('Design added successfully!');
      }
      
      // Reload designs to get updated data
      await loadDesigns();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving design:', err);
      error('Failed to save design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log(selectedDesign);
      
      setSaving(true);
      await apiService.deleteDesign(selectedDesign.designId || selectedDesign.id);
      success('Design deleted successfully!');
      
      // Reload designs to get updated data
      await loadDesigns();
      setIsDeleteModalOpen(false);
      setSelectedDesign(null);
    } catch (err) {
      console.error('Error deleting design:', err);
      error('Failed to delete design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDesigns = Array.isArray(designs) ? designs.filter(design =>
    (design.designName || design.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-6">
      {/* Header with Label, Search, and Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-6">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Design Management
        </label>
        
        {/* Search and Add - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="flex-shrink-0 w-full sm:w-64 md:w-80">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Add Button */}
          <Button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Designs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-300">Loading designs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Design Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {!Array.isArray(filteredDesigns) || filteredDesigns.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                      {!Array.isArray(filteredDesigns) ? 'Error loading designs' : 'No designs found'}
                    </td>
                  </tr>
                ) : (
                  filteredDesigns.map((design) => (
                    <tr key={design.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Palette className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {design.designName || design.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(design)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            disabled={saving}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(design)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDesign ? 'Edit Design' : 'Add New Design'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Design Name *
            </label>
            <Input
              type="text"
              value={formData.designName}
              onChange={(e) => setFormData({ designName: e.target.value })}
              placeholder="Enter design name"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {selectedDesign ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                `${selectedDesign ? 'Update' : 'Add'} Design`
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmAlert
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Design"
        message={`Are you sure you want to delete "${selectedDesign?.designName || selectedDesign?.name}"? This action cannot be undone.`}
        confirmText={saving ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        disabled={saving}
      />

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DesignPage;
