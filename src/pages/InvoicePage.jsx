import React, { useState } from 'react';
import { Plus, Minus, Search, FileText, Calendar, User, DollarSign, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const InvoicePage = () => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      customerName: 'Sarah Johnson',
      date: '2024-01-15',
      total: 2500.00,
      status: 'Paid',
      items: 3,
    },
    {
      id: 'INV-002',
      customerName: 'Michael Chen',
      date: '2024-01-14',
      total: 1800.00,
      status: 'Pending',
      items: 2,
    },
    {
      id: 'INV-003',
      customerName: 'Emily Rodriguez',
      date: '2024-01-13',
      total: 3200.00,
      status: 'Paid',
      items: 4,
    },
  ]);
  const [currentInvoice, setCurrentInvoice] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    notes: '',
  });
  const [newItem, setNewItem] = useState({
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  const handleAddItem = () => {
    if (newItem.productName && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const item = {
        ...newItem,
        id: Date.now(),
        totalPrice: newItem.quantity * newItem.unitPrice,
      };
      setCurrentInvoice({
        ...currentInvoice,
        items: [...currentInvoice.items, item]
      });
      setNewItem({
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
      setShowProductModal(false);
    }
  };

  const handleRemoveItem = (id) => {
    setCurrentInvoice({
      ...currentInvoice,
      items: currentInvoice.items.filter(item => item.id !== id)
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCurrentInvoice({
      ...currentInvoice,
      items: currentInvoice.items.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      )
    });
  };

  const calculateSubtotal = () => {
    return currentInvoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoice = () => {
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = {
      id: invoiceNumber,
      customerName: currentInvoice.customerName,
      date: currentInvoice.invoiceDate,
      total: calculateTotal(),
      status: 'Pending',
      items: currentInvoice.items.length,
    };
    
    setInvoices([newInvoice, ...invoices]);
    setIsCreatingInvoice(false);
    setCurrentInvoice({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      notes: '',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage customer invoices
          </p>
        </div>
        <Button variant="accent" onClick={() => setIsCreatingInvoice(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Invoice List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Invoices
          </h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Invoice #
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {invoice.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {invoice.customerName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {invoice.date}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {invoice.items} items
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreatingInvoice}
        onClose={() => setIsCreatingInvoice(false)}
        title="Create New Invoice"
        size="xl"
      >
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={currentInvoice.customerName}
                onChange={(e) => setCurrentInvoice({...currentInvoice, customerName: e.target.value})}
                placeholder="Enter customer name"
              />
              <Input
                label="Email"
                type="email"
                value={currentInvoice.customerEmail}
                onChange={(e) => setCurrentInvoice({...currentInvoice, customerEmail: e.target.value})}
                placeholder="customer@example.com"
              />
              <Input
                label="Phone"
                type="tel"
                value={currentInvoice.customerPhone}
                onChange={(e) => setCurrentInvoice({...currentInvoice, customerPhone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Address"
                value={currentInvoice.customerAddress}
                onChange={(e) => setCurrentInvoice({...currentInvoice, customerAddress: e.target.value})}
                placeholder="Enter customer address"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invoice Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice Date"
                type="date"
                value={currentInvoice.invoiceDate}
                onChange={(e) => setCurrentInvoice({...currentInvoice, invoiceDate: e.target.value})}
              />
              <Input
                label="Due Date"
                type="date"
                value={currentInvoice.dueDate}
                onChange={(e) => setCurrentInvoice({...currentInvoice, dueDate: e.target.value})}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invoice Items
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProductModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {currentInvoice.items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No items added yet. Click "Add Item" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentInvoice.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
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
          </div>

          {/* Invoice Summary */}
          {currentInvoice.items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax (8%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
              value={currentInvoice.notes}
              onChange={(e) => setCurrentInvoice({...currentInvoice, notes: e.target.value})}
              placeholder="Additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreatingInvoice(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={generateInvoice}
              disabled={!currentInvoice.customerName || currentInvoice.items.length === 0}
            >
              Create Invoice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Add Product to Invoice"
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={newItem.productName}
            onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
            placeholder="Enter product name"
          />
          <Input
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            placeholder="Product description"
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
              disabled={!newItem.productName || newItem.quantity <= 0 || newItem.unitPrice <= 0}
            >
              Add Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicePage;
