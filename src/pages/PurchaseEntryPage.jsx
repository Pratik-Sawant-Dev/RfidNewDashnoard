import React, { useState } from 'react';
import { Plus, Minus, Search, Package, Calendar, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const PurchaseEntryPage = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [formData, setFormData] = useState({
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    notes: '',
  });
  const [newItem, setNewItem] = useState({
    productName: '',
    sku: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  const handleAddItem = () => {
    if (newItem.productName && newItem.sku && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const item = {
        ...newItem,
        id: Date.now(),
        totalPrice: newItem.quantity * newItem.unitPrice,
      };
      setPurchaseItems([...purchaseItems, item]);
      setNewItem({
        productName: '',
        sku: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
      setShowProductModal(false);
    }
  };

  const handleRemoveItem = (id) => {
    setPurchaseItems(purchaseItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setPurchaseItems(purchaseItems.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
        : item
    ));
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = () => {
    // Handle purchase submission
    console.log('Purchase submitted:', { formData, purchaseItems });
    alert('Purchase entry saved successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Entry
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Record new inventory purchases and supplier information
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowProductModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Purchase Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Supplier Name"
                name="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Enter supplier name"
              />
              <Input
                label="Purchase Date"
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              />
              <Input
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="Enter invoice number"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </Card>

          {/* Purchase Items */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Purchase Items
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {purchaseItems.length} items
              </span>
            </div>
            
            {purchaseItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No items added yet. Click "Add Product" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchaseItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${item.unitPrice.toFixed(2)} each
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Total: ${item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Purchase Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Items:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {purchaseItems.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax (8%):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(calculateTotal() * 0.08).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(calculateTotal() * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              variant="accent"
              className="w-full"
              onClick={handleSubmit}
              disabled={purchaseItems.length === 0}
            >
              Save Purchase Entry
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPurchaseItems([]);
                setFormData({
                  supplier: '',
                  purchaseDate: new Date().toISOString().split('T')[0],
                  invoiceNumber: '',
                  notes: '',
                });
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Add Product to Purchase"
      >
        <div className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
            />
            <Input
              label="Unit Price ($)"
              type="number"
              min="0"
              step="0.01"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowProductModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleAddItem}
              disabled={!newItem.productName || !newItem.sku || newItem.quantity <= 0 || newItem.unitPrice <= 0}
            >
              Add Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseEntryPage;
