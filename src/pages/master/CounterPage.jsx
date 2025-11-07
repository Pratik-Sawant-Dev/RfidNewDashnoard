import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calculator, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import Toast from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import apiService from '../../services/apiService';
import { selectUser } from '../../store/slices/authSlice';

const CounterPage = () => {
  const [counters, setCounters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    counterName: '',
    branchId: ''
  });
  const { toasts, success, error, removeToast } = useToast();
  const user = useSelector(selectUser);

  // Load counters and branches on component mount
  useEffect(() => {
    loadCounters();
    loadBranches();
  }, []);

  const loadCounters = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCounters();
      console.log('API Response:', response); // Debug log
      
      // Ensure response is an array
      let countersArray = [];
      if (Array.isArray(response)) {
        countersArray = response;
      } else if (response && Array.isArray(response.data)) {
        countersArray = response.data;
      } else if (response && response.counters && Array.isArray(response.counters)) {
        countersArray = response.counters;
      } else {
        console.warn('Unexpected API response format:', response);
        countersArray = [];
      }
      
      console.log('Counters array:', countersArray); // Debug log to see the structure
      setCounters(countersArray);
    } catch (err) {
      console.error('Error loading counters:', err);
      error('Failed to load counters. Please try again.');
      setCounters([]); // Ensure counters is always an array
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const response = await apiService.getBranches();
      console.log('Branches API Response:', response); // Debug log
      
      // Ensure response is an array
      let branchesArray = [];
      if (Array.isArray(response)) {
        branchesArray = response;
      } else if (response && Array.isArray(response.data)) {
        branchesArray = response.data;
      } else if (response && response.branches && Array.isArray(response.branches)) {
        branchesArray = response.branches;
      } else {
        console.warn('Unexpected branches API response format:', response);
        branchesArray = [];
      }
      
      console.log('Branches array:', branchesArray); // Debug log to see the structure
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading branches:', err);
      error('Failed to load branches. Please try again.');
      setBranches([]); // Ensure branches is always an array
    }
  };

  const handleAdd = () => {
    setSelectedCounter(null);
    setFormData({ counterName: '', branchId: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (counter) => {
    console.log('Selected counter for edit:', counter); // Debug log
    setSelectedCounter(counter);
    setFormData({
      counterName: counter.counterName || counter.name || '',
      branchId: counter.branchId || counter.branch?.id || counter.branch || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (counter) => {
    setSelectedCounter(counter);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        counterName: formData.counterName,
        branchId: parseInt(formData.branchId),
        clientCode: user.clientCode || ''
      };
      
      console.log('Payload:', payload); // Debug log
      console.log('User clientCode:', user.clientCode); // Debug log
      
      if (selectedCounter) {
        // Update existing counter
        await apiService.updateCounter(payload);
        success('Counter updated successfully!');
      } else {
        // Add new counter
        await apiService.addCounter(payload);
        success('Counter added successfully!');
      }
      
      // Reload counters to get updated data
      await loadCounters();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving counter:', err);
      error('Failed to save counter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log(selectedCounter);
      
      setSaving(true);
      await apiService.deleteCounter(selectedCounter.counterId || selectedCounter.id);
      success('Counter deleted successfully!');
      
      // Reload counters to get updated data
      await loadCounters();
      setIsDeleteModalOpen(false);
      setSelectedCounter(null);
    } catch (err) {
      console.error('Error deleting counter:', err);
      error('Failed to delete counter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCounters = Array.isArray(counters) ? counters.filter(counter =>
    (counter.counterName || counter.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-6">
      {/* Header with Label, Search, and Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-6">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Counter Management
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

      {/* Counters Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-300">Loading counters...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Counter Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {!Array.isArray(filteredCounters) || filteredCounters.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-300">
                      {!Array.isArray(filteredCounters) ? 'Error loading counters' : 'No counters found'}
                    </td>
                  </tr>
                ) : (
                  filteredCounters.map((counter) => {
                    // Find branch name from branches array
                    const branch = branches.find(b => b.id === counter.branchId || b.branchId === counter.branchId);
                    const branchName = branch ? (branch.branchName || branch.name) : (counter.branchName || counter.branch || 'Unknown Branch');
                    
                    return (
                      <tr key={counter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calculator className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {counter.counterName || counter.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {branchName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(counter)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              disabled={saving}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(counter)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              disabled={saving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
        title={selectedCounter ? 'Edit Counter' : 'Add New Counter'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Counter Name *
            </label>
            <Input
              type="text"
              value={formData.counterName}
              onChange={(e) => setFormData({ ...formData, counterName: e.target.value })}
              placeholder="e.g., Counter 1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branch *
            </label>
            <select
              value={formData.branchId}
              onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id || branch.branchId} value={branch.id || branch.branchId}>
                  {branch.branchName || branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Client Code:</strong> {user.clientCode || 'Not available'}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              This will be automatically included in the API request.
            </p>
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
                  {selectedCounter ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                `${selectedCounter ? 'Update' : 'Add'} Counter`
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
        title="Delete Counter"
        message={`Are you sure you want to delete "${selectedCounter?.counterName || selectedCounter?.name}"? This action cannot be undone.`}
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

export default CounterPage;
