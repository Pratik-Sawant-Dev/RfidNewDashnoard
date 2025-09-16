import React, { useState } from 'react';
import { Plus, Search, Package, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const AddStockPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    productName: '',
    sku: '',
    category: '',
    material: '',
    weight: '',
    price: '',
    quantity: 1,
    rfidTag: '',
    description: '',
  });

  const categories = [
    'Rings',
    'Necklaces',
    'Bracelets',
    'Earrings',
    'Pendants',
    'Watches',
    'Other'
  ];

  const materials = [
    'Gold',
    'Silver',
    'Platinum',
    'Diamond',
    'Ruby',
    'Sapphire',
    'Emerald',
    'Pearl',
    'Other'
  ];

  const handleAddItem = () => {
    if (newItem.productName && newItem.sku && newItem.category && newItem.material && newItem.price) {
      const item = {
        ...newItem,
        id: Date.now(),
        rfidTag: newItem.rfidTag || `RFID-${Date.now()}`,
        addedDate: new Date().toLocaleDateString(),
        status: 'In Stock',
      };
      setStockItems([...stockItems, item]);
      setNewItem({
        productName: '',
        sku: '',
        category: '',
        material: '',
        weight: '',
        price: '',
        quantity: 1,
        rfidTag: '',
        description: '',
      });
      setShowAddModal(false);
    }
  };

  const filteredItems = stockItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateRFIDTag = () => {
    const tag = `RFID-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setNewItem({...newItem, rfidTag: tag});
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add new jewelry items to your inventory with RFID tracking
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent focus:ring-0"
            />
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stockItems.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Items
            </p>
          </div>
        </Card>
      </div>

      {/* Stock Items Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Items
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredItems.length} items
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No items found matching your search.' : 'No items added yet. Click "Add New Item" to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Material
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    RFID Tag
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.sku}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.material}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      ${item.price}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                          {item.rfidTag}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Stock Item"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={newItem.productName}
              onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
              placeholder="Enter product name"
            />
            <Input
              label="SKU"
              value={newItem.sku}
              onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
              placeholder="Enter product SKU"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Material
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newItem.material}
                onChange={(e) => setNewItem({...newItem, material: e.target.value})}
              >
                <option value="">Select material</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Weight (grams)"
              type="number"
              step="0.01"
              value={newItem.weight}
              onChange={(e) => setNewItem({...newItem, weight: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="0.00"
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RFID Tag
            </label>
            <div className="flex space-x-2">
              <Input
                value={newItem.rfidTag}
                onChange={(e) => setNewItem({...newItem, rfidTag: e.target.value})}
                placeholder="Auto-generated or enter custom"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={generateRFIDTag}
                className="whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Product description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleAddItem}
              disabled={!newItem.productName || !newItem.sku || !newItem.category || !newItem.material || !newItem.price}
            >
              Add to Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddStockPage;
