import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import apiService from '../../services/apiService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
  });
  const { toasts, success, error, removeToast } = useToast();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      
      // Ensure response is an array
      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response && response.result && Array.isArray(response.result)) {
        setCategories(response.result);
      } else {
        setCategories([]);
        console.warn('Unexpected API response format:', response);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      error('Failed to load categories');
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!saving) {
      setIsModalOpen(false);
      setFormData({ categoryName: '' });
      setSelectedCategory(null);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setFormData({ categoryName: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryName: category.categoryName || category.name,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    if (!saving) {
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleSave = async () => {
    if (!formData.categoryName.trim()) {
      error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      
      if (selectedCategory) {
        // Update existing category
        const updateData = {
          categoryId: selectedCategory.categoryId || selectedCategory.id,
          categoryName: formData.categoryName.trim()
        };
        await apiService.updateCategory(updateData);
        success('Category updated successfully!');
      } else {
        // Add new category
        const addData = {
          categoryName: formData.categoryName.trim()
        };
        await apiService.addCategory(addData);
        success('Category added successfully!');
      }
      
      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({ categoryName: '' });
      setSelectedCategory(null);
      
      // Reload categories after successful operation
      await loadCategories();
      
      // Force close modal after a short delay as backup
      setTimeout(() => {
        setIsModalOpen(false);
      }, 100);
      
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save category';
      error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      const categoryId = selectedCategory.categoryId || selectedCategory.id;
      
      await apiService.deleteCategory(categoryId);
      success('Category deleted successfully!');
      
      // Close modal first
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      
      // Reload categories after successful deletion
      await loadCategories();
      
      // Force close modal after a short delay as backup
      setTimeout(() => {
        setIsDeleteModalOpen(false);
      }, 100);
      
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete category';
      error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = Array.isArray(categories) ? categories.filter(category => {
    const categoryName = category.categoryName || category.name || '';
    return categoryName.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div className="p-6">
      {/* Header with Label, Search, Refresh, and Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-6">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Category Management
        </label>
        
        {/* Search, Refresh, and Add - Right Side */}
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
          
          {/* Refresh Button */}
          <Button 
            onClick={loadCategories} 
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          {/* Add Button */}
          <Button 
            onClick={handleAdd} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
            disabled={loading}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading categories...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  Array.isArray(filteredCategories) && filteredCategories.map((category) => (
                    <tr key={category.categoryId || category.id || Math.random()} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.categoryId || category.id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.categoryName || category.name || 'Unnamed Category'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            disabled={saving}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
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
        onClose={handleModalClose}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name *
            </label>
            <Input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="Enter category name"
              disabled={saving}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !saving && formData.categoryName.trim()) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {selectedCategory ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                `${selectedCategory ? 'Update' : 'Add'} Category`
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmAlert
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.categoryName || selectedCategory?.name}"? This action cannot be undone.`}
        confirmText={saving ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        disabled={saving}
      />
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default CategoryPage;
