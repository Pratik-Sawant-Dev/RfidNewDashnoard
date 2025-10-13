import apiService from './apiService';

class InvoiceService {
  // Create Invoice
  async createInvoice(data) {
    return apiService.post('/api/Invoice', data);
  }

  // Create Bulk Invoices
  async createBulkInvoices(data) {
    return apiService.post('/api/Invoice/bulk', data);
  }

  // Get Invoice by ID
  async getInvoiceById(id) {
    return apiService.get(`/api/Invoice/${id}`);
  }

  // Get All Invoices with Pagination
  async getAllInvoices(params = {}) {
    return apiService.get('/api/Invoice', params);
  }

  // Update Invoice
  async updateInvoice(id, data) {
    return apiService.put(`/api/Invoice/${id}`, data);
  }

  // Delete Invoice
  async deleteInvoice(id) {
    return apiService.delete(`/api/Invoice/${id}`);
  }

  // Get Invoices by Date Range
  async getInvoicesByDateRange(startDate, endDate, params = {}) {
    return apiService.get('/api/Invoice/by-date-range', {
      startDate,
      endDate,
      ...params
    });
  }

  // Get Invoices by Product
  async getInvoicesByProduct(productId) {
    return apiService.get(`/api/Invoice/by-product/${productId}`);
  }

  // Get Invoices by Customer
  async getInvoicesByCustomer(customerName, params = {}) {
    return apiService.get('/api/Invoice/by-customer', {
      customerName,
      ...params
    });
  }

  // Get Invoices by Payment Method
  async getInvoicesByPaymentMethod(paymentMethod, params = {}) {
    return apiService.get('/api/Invoice/by-payment-method', {
      paymentMethod,
      ...params
    });
  }

  // Get Invoice Statistics
  async getInvoiceStatistics(params = {}) {
    return apiService.get('/api/Invoice/statistics', params);
  }

  // Get Revenue Analytics
  async getRevenueAnalytics(startDate, endDate, groupBy = 'day') {
    return apiService.get('/api/Invoice/revenue-analytics', {
      startDate,
      endDate,
      groupBy
    });
  }

  // Get Top Products
  async getTopProducts(limit = 10, startDate, endDate) {
    return apiService.get('/api/Invoice/top-products', {
      limit,
      startDate,
      endDate
    });
  }

  // Get Top Customers
  async getTopCustomers(limit = 10, startDate, endDate) {
    return apiService.get('/api/Invoice/top-customers', {
      limit,
      startDate,
      endDate
    });
  }

  // Get Payment Method Analytics
  async getPaymentMethodAnalytics(startDate, endDate) {
    return apiService.get('/api/Invoice/payment-method-analytics', {
      startDate,
      endDate
    });
  }

  // Get Daily Sales Summary
  async getDailySalesSummary(date) {
    return apiService.get(`/api/Invoice/daily-sales/${date}`);
  }

  // Get Monthly Sales Summary
  async getMonthlySalesSummary(year, month) {
    return apiService.get(`/api/Invoice/monthly-sales/${year}/${month}`);
  }

  // Get Yearly Sales Summary
  async getYearlySalesSummary(year) {
    return apiService.get(`/api/Invoice/yearly-sales/${year}`);
  }

  // Search Invoices
  async searchInvoices(searchTerm, params = {}) {
    return apiService.get('/api/Invoice/search', {
      searchTerm,
      ...params
    });
  }

  // Export Invoices
  async exportInvoices(format = 'excel', params = {}) {
    return apiService.get(`/api/Invoice/export/${format}`, params, {
      responseType: 'blob'
    });
  }

  // Print Invoice
  async printInvoice(id) {
    return apiService.get(`/api/Invoice/print/${id}`, {}, {
      responseType: 'blob'
    });
  }

  // Send Invoice via Email
  async sendInvoiceEmail(id, email) {
    return apiService.post(`/api/Invoice/send-email/${id}`, { email });
  }

  // Get Invoice Templates
  async getInvoiceTemplates() {
    return apiService.get('/api/Invoice/templates');
  }

  // Update Invoice Template
  async updateInvoiceTemplate(templateId, data) {
    return apiService.put(`/api/Invoice/templates/${templateId}`, data);
  }

  // Get Invoice Settings
  async getInvoiceSettings() {
    return apiService.get('/api/Invoice/settings');
  }

  // Update Invoice Settings
  async updateInvoiceSettings(data) {
    return apiService.put('/api/Invoice/settings', data);
  }
}

export default new InvoiceService();
