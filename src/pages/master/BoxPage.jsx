import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Box, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import Toast from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import apiService from '../../services/apiService';

const BoxPage = () => {
  const [boxes, setBoxes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    boxName: '',
    description: '',
    boxType: '',
    size: '',
    color: '',
    material: '',
    isActive: true
  });
  const { toasts, success, error, removeToast } = useToast();

  const boxTypes = ['Wooden', 'Metal', 'Plastic', 'Glass', 'Leather'];
  const boxSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  const colors = ['Brown', 'Black', 'White', 'Red', 'Blue', 'Green', 'Silver', 'Gold'];
  const materials = ['Wood', 'Metal', 'Plastic', 'Glass', 'Leather', 'Fabric'];

  // Load boxes on component mount
  useEffect(() => {
    loadBoxes();
  }, []);

  const loadBoxes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBoxes();
      console.log('API Response:', response); // Debug log
      
      // Ensure response is an array
      let boxesArray = [];
      if (Array.isArray(response)) {
        boxesArray = response;
      } else if (response && Array.isArray(response.data)) {
        boxesArray = response.data;
      } else if (response && response.boxes && Array.isArray(response.boxes)) {
        boxesArray = response.boxes;
      } else {
        console.warn('Unexpected API response format:', response);
        boxesArray = [];
      }
      
      console.log('Boxes array:', boxesArray); // Debug log to see the structure
      setBoxes(boxesArray);
    } catch (err) {
      console.error('Error loading boxes:', err);
      error('Failed to load boxes. Please try again.');
      setBoxes([]); // Ensure boxes is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBox(null);
    setFormData({ 
      boxName: '', 
      description: '', 
      boxType: '', 
      size: '', 
      color: '', 
      material: '', 
      isActive: true 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (box) => {
    console.log('Selected box for edit:', box); // Debug log
    setSelectedBox(box);
    setFormData({
      boxName: box.boxName || box.name || '',
      description: box.description || '',
      boxType: box.boxType || box.type || '',
      size: box.size || '',
      color: box.color || '',
      material: box.material || '',
      isActive: box.isActive !== undefined ? box.isActive : (box.status === 'Active')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (box) => {
    setSelectedBox(box);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (selectedBox) {
        // Update existing box
        const updatePayload = {
          boxId: selectedBox.boxId || selectedBox.id,
          boxName: formData.boxName,
          description: formData.description,
          boxType: formData.boxType,
          size: formData.size,
          color: formData.color,
          material: formData.material,
          isActive: formData.isActive
        };
        
        console.log('Update payload:', updatePayload); // Debug log
        console.log('Selected box:', selectedBox); // Debug log
        
        await apiService.updateBox(updatePayload);
        success('Box updated successfully!');
      } else {
        // Add new box
        const addPayload = {
          boxName: formData.boxName,
          description: formData.description,
          boxType: formData.boxType,
          size: formData.size,
          color: formData.color,
          material: formData.material,
          isActive: formData.isActive
        };
        
        await apiService.addBox(addPayload);
        success('Box added successfully!');
      }
      
      // Reload boxes to get updated data
      await loadBoxes();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving box:', err);
      error('Failed to save box. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log(selectedBox);
      
      setSaving(true);
      await apiService.deleteBox(selectedBox.boxId || selectedBox.id);
      success('Box deleted successfully!');
      
      // Reload boxes to get updated data
      await loadBoxes();
      setIsDeleteModalOpen(false);
      setSelectedBox(null);
    } catch (err) {
      console.error('Error deleting box:', err);
      error('Failed to delete box. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredBoxes = Array.isArray(boxes) ? boxes.filter(box =>
    (box.boxName || box.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.boxType || box.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Box Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage storage boxes and containers
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search boxes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Box
        </Button>
      </div>

      {/* Boxes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-300">Loading boxes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Box Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {!Array.isArray(filteredBoxes) || filteredBoxes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                      {!Array.isArray(filteredBoxes) ? 'Error loading boxes' : 'No boxes found'}
                    </td>
                  </tr>
                ) : (
                  filteredBoxes.map((box) => (
                    <tr key={box.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Box className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {box.boxName || box.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {box.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {box.boxType || box.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {box.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {box.color}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {box.material}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (box.isActive !== undefined ? box.isActive : box.status === 'Active')
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {box.isActive !== undefined ? (box.isActive ? 'Active' : 'Inactive') : box.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(box)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            disabled={saving}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(box)}
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
        title={selectedBox ? 'Edit Box' : 'Add New Box'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Box Name *
            </label>
            <Input
              type="text"
              value={formData.boxName}
              onChange={(e) => setFormData({ ...formData, boxName: e.target.value })}
              placeholder="e.g., Premium Wooden Box"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., High quality wooden jewelry box"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Box Type
              </label>
              <select
                value={formData.boxType}
                onChange={(e) => setFormData({ ...formData, boxType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Type</option>
                {boxTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Size
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Size</option>
                {boxSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Color</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Material
              </label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Material</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                  {selectedBox ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                `${selectedBox ? 'Update' : 'Add'} Box`
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
        title="Delete Box"
        message={`Are you sure you want to delete "${selectedBox?.boxName || selectedBox?.name}"? This action cannot be undone.`}
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

export default BoxPage;
