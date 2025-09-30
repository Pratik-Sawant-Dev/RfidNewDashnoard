import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Building, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import Toast from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import apiService from '../../services/apiService';
import { selectUser } from '../../store/slices/authSlice';

const BranchPage = () => {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    branchName: ''
  });
  const { toasts, success, error, removeToast } = useToast();
  const user = useSelector(selectUser);

  // Load branches on component mount
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBranches();
      console.log('API Response:', response); // Debug log
      
      // Ensure response is an array
      let branchesArray = [];
      if (Array.isArray(response)) {
        branchesArray = response;
      } else if (response && Array.isArray(response.data)) {
        branchesArray = response.data;
      } else if (response && response.branches && Array.isArray(response.branches)) {
        branchesArray = response.branches;
      } else {
        console.warn('Unexpected API response format:', response);
        branchesArray = [];
      }
      
      console.log('Branches array:', branchesArray); // Debug log to see the structure
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading branches:', err);
      error('Failed to load branches. Please try again.');
      setBranches([]); // Ensure branches is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBranch(null);
    setFormData({ branchName: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (branch) => {
    console.log('Selected branch for edit:', branch); // Debug log
    setSelectedBranch(branch);
    setFormData({
      branchName: branch.branchName || branch.name || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (selectedBranch) {
        // Update existing branch
        const updatePayload = {
          branchId: selectedBranch.branchId || selectedBranch.id,
          branchName: formData.branchName,
          clientCode: user.clientCode || ''
        };
        
        console.log('Update payload:', updatePayload); // Debug log
        console.log('Selected branch:', selectedBranch); // Debug log
        
        await apiService.updateBranch(updatePayload);
        success('Branch updated successfully!');
      } else {
        // Add new branch
        const addPayload = {
          branchName: formData.branchName,
          clientCode: user.clientCode || ''
        };
        
        console.log('Add payload:', addPayload); // Debug log
        console.log('User clientCode:', user.clientCode); // Debug log
        
        await apiService.addBranch(addPayload);
        success('Branch added successfully!');
      }
      
      // Reload branches to get updated data
      await loadBranches();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving branch:', err);
      error('Failed to save branch. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log(selectedBranch);
      
      setSaving(true);
      await apiService.deleteBranch(selectedBranch.branchId || selectedBranch.id);
      success('Branch deleted successfully!');
      
      // Reload branches to get updated data
      await loadBranches();
      setIsDeleteModalOpen(false);
      setSelectedBranch(null);
    } catch (err) {
      console.error('Error deleting branch:', err);
      error('Failed to delete branch. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredBranches = Array.isArray(branches) ? branches.filter(branch =>
    (branch.branchName || branch.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Branch Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage store branches and locations
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Branch
        </Button>
      </div>

      {/* Branches Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-300">Loading branches...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {!Array.isArray(filteredBranches) || filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                      {!Array.isArray(filteredBranches) ? 'Error loading branches' : 'No branches found'}
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {branch.branchName || branch.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(branch)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            disabled={saving}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(branch)}
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
        title={selectedBranch ? 'Edit Branch' : 'Add New Branch'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branch Name *
            </label>
            <Input
              type="text"
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              placeholder="e.g., Main Branch"
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
                  {selectedBranch ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                `${selectedBranch ? 'Update' : 'Add'} Branch`
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
        title="Delete Branch"
        message={`Are you sure you want to delete "${selectedBranch?.branchName || selectedBranch?.name}"? This action cannot be undone.`}
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

export default BranchPage;
