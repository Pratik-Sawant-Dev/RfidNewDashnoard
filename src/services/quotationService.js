import apiService from './apiService';

class QuotationService {
  // Create Quotation
  async createQuotation(data) {
    return apiService.post('/api/Quotation', data);
  }

  // Get Quotation by ID
  async getQuotationById(id) {
    return apiService.get(`/api/Quotation/${id}`);
  }

  // Get All Quotations
  async getAllQuotations(params = {}) {
    return apiService.get('/api/Quotation', params);
  }

  // Update Quotation
  async updateQuotation(id, data) {
    return apiService.put(`/api/Quotation/${id}`, data);
  }

  // Delete Quotation
  async deleteQuotation(id) {
    return apiService.delete(`/api/Quotation/${id}`);
  }
}

export default new QuotationService();

