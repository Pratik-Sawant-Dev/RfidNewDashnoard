import apiService from './apiService';

/**
 * Reporting Service
 * Centralized service for all reporting-related API endpoints
 * Based on RFID_Jewelry_Inventory_Complete_API_Collection.json
 */

class ReportingService {
  // ==================== Stock Movement Reports ====================
  
  /**
   * Create stock movement record
   */
  async createStockMovement(movementData) {
    return apiService.post('/api/Reporting/stock-movements', movementData);
  }

  /**
   * Create bulk stock movements
   */
  async createBulkStockMovements(movements, movementDate, remarks) {
    return apiService.post('/api/Reporting/stock-movements/bulk', {
      movements,
      movementDate,
      remarks
    });
  }

  /**
   * Get stock movements with filters
   */
  async getStockMovements(params = {}) {
    return apiService.get('/api/Reporting/stock-movements', params);
  }

  /**
   * Get stock movement by ID
   */
  async getStockMovementById(id) {
    return apiService.get(`/api/Reporting/stock-movements/${id}`);
  }

  /**
   * Get stock movements by date range
   */
  async getStockMovementsByDateRange(startDate, endDate, movementType = null) {
    const params = { startDate, endDate };
    if (movementType) params.movementType = movementType;
    return apiService.get('/api/Reporting/stock-movements/range', params);
  }

  /**
   * Get stock movements by product
   */
  async getStockMovementsByProduct(productId) {
    return apiService.get(`/api/Reporting/stock-movements/product/${productId}`);
  }

  /**
   * Get stock movements by branch
   */
  async getStockMovementsByBranch(branchId) {
    return apiService.get(`/api/Reporting/stock-movements/branch/${branchId}`);
  }

  /**
   * Get stock movements by counter
   */
  async getStockMovementsByCounter(counterId) {
    return apiService.get(`/api/Reporting/stock-movements/counter/${counterId}`);
  }

  /**
   * Get stock movements by category
   */
  async getStockMovementsByCategory(categoryId) {
    return apiService.get(`/api/Reporting/stock-movements/category/${categoryId}`);
  }

  // ==================== Daily Stock Balance Reports ====================
  
  /**
   * Get daily stock balance by product and date
   */
  async getDailyStockBalance(productId, date) {
    return apiService.get(`/api/Reporting/daily-balances/${productId}/${date}`);
  }

  /**
   * Get daily stock balances
   */
  async getDailyStockBalances(startDate, endDate) {
    return apiService.get('/api/Reporting/daily-balances', { startDate, endDate });
  }

  /**
   * Get daily stock balances by date range
   */
  async getDailyStockBalancesByRange(startDate, endDate, groupBy = 'day') {
    return apiService.get('/api/Reporting/daily-balances/range', {
      startDate,
      endDate,
      groupBy
    });
  }

  /**
   * Calculate daily stock balance for product
   */
  async calculateDailyBalance(productId, date) {
    return apiService.post(`/api/Reporting/daily-balances/calculate/${productId}/${date}`);
  }

  /**
   * Calculate all daily stock balances for date
   */
  async calculateAllDailyBalances(date) {
    return apiService.post(`/api/Reporting/daily-balances/calculate/${date}`);
  }

  /**
   * Process daily stock balances
   */
  async processDailyBalances(date) {
    return apiService.post(`/api/Reporting/process-balances/${date}`);
  }

  /**
   * Process daily stock balances for date range
   */
  async processDailyBalancesRange(startDate, endDate) {
    return apiService.post('/api/Reporting/process-balances/range', null, {
      params: { startDate, endDate }
    });
  }

  /**
   * Recalculate all balances
   */
  async recalculateAllBalances(startDate, endDate) {
    return apiService.post('/api/Reporting/recalculate-balances', null, {
      params: { startDate, endDate }
    });
  }

  // ==================== Sales Reports ====================
  
  /**
   * Get sales report
   */
  async getSalesReport(startDate, endDate) {
    return apiService.get('/api/Reporting/sales', { startDate, endDate });
  }

  /**
   * Get sales report by date
   */
  async getSalesReportByDate(date) {
    return apiService.get(`/api/Reporting/sales/date/${date}`);
  }

  /**
   * Get sales report by branch
   */
  async getSalesReportByBranch(branchId, date) {
    return apiService.get(`/api/Reporting/sales/branch/${branchId}/${date}`);
  }

  /**
   * Get sales report by counter
   */
  async getSalesReportByCounter(counterId, date) {
    return apiService.get(`/api/Reporting/sales/counter/${counterId}/${date}`);
  }

  /**
   * Get sales report by category
   */
  async getSalesReportByCategory(categoryId, date) {
    return apiService.get(`/api/Reporting/sales/category/${categoryId}/${date}`);
  }

  /**
   * Get sales report by date range
   */
  async getSalesReportByRange(startDate, endDate, groupBy = 'day') {
    return apiService.get('/api/Reporting/sales/range', {
      startDate,
      endDate,
      groupBy
    });
  }

  // ==================== Stock Summary Reports ====================
  
  /**
   * Get stock summary report
   */
  async getStockSummary() {
    return apiService.get('/api/Reporting/stock-summary');
  }

  /**
   * Get stock summary by date
   */
  async getStockSummaryByDate(date) {
    return apiService.get(`/api/Reporting/stock-summary/date/${date}`);
  }

  /**
   * Get stock summary by branch
   */
  async getStockSummaryByBranch(branchId, date) {
    return apiService.get(`/api/Reporting/stock-summary/branch/${branchId}/${date}`);
  }

  /**
   * Get stock summary by counter
   */
  async getStockSummaryByCounter(counterId, date) {
    return apiService.get(`/api/Reporting/stock-summary/counter/${counterId}/${date}`);
  }

  /**
   * Get stock summary by category
   */
  async getStockSummaryByCategory(categoryId, date) {
    return apiService.get(`/api/Reporting/stock-summary/category/${categoryId}/${date}`);
  }

  /**
   * Get stock summary by date range
   */
  async getStockSummaryByRange(startDate, endDate, groupBy = 'day') {
    return apiService.get('/api/Reporting/stock-summary/range', {
      startDate,
      endDate,
      groupBy
    });
  }

  // ==================== Daily Activity Reports ====================
  
  /**
   * Get daily activity report
   */
  async getDailyActivity(startDate, endDate) {
    return apiService.get('/api/Reporting/daily-activity', { startDate, endDate });
  }

  /**
   * Get daily activity by date
   */
  async getDailyActivityByDate(date) {
    return apiService.get(`/api/Reporting/daily-activity/date/${date}`);
  }

  /**
   * Get daily activity by branch
   */
  async getDailyActivityByBranch(branchId, date) {
    return apiService.get(`/api/Reporting/daily-activity/branch/${branchId}/${date}`);
  }

  /**
   * Get daily activity by counter
   */
  async getDailyActivityByCounter(counterId, date) {
    return apiService.get(`/api/Reporting/daily-activity/counter/${counterId}/${date}`);
  }

  /**
   * Get daily activity by category
   */
  async getDailyActivityByCategory(categoryId, date) {
    return apiService.get(`/api/Reporting/daily-activity/category/${categoryId}/${date}`);
  }

  /**
   * Get daily activity by date range
   */
  async getDailyActivityByRange(startDate, endDate, groupBy = 'day') {
    return apiService.get('/api/Reporting/daily-activity/range', {
      startDate,
      endDate,
      groupBy
    });
  }

  // ==================== RFID Usage Reports ====================
  
  /**
   * Get overall RFID usage report
   */
  async getRFIDUsageReport() {
    return apiService.get('/api/Reporting/rfid-usage');
  }

  /**
   * Get RFID usage by date
   */
  async getRFIDUsageByDate(date) {
    return apiService.get(`/api/Reporting/rfid-usage/date/${date}`);
  }

  /**
   * Get used RFID tags
   */
  async getUsedRFIDTags() {
    return apiService.get('/api/Reporting/rfid-usage/used');
  }

  /**
   * Get unused RFID tags
   */
  async getUnusedRFIDTags() {
    return apiService.get('/api/Reporting/rfid-usage/unused');
  }

  /**
   * Get RFID tags by status
   */
  async getRFIDTagsByStatus(isUsed) {
    return apiService.get(`/api/Reporting/rfid-usage/status/${isUsed}`);
  }

  /**
   * Get RFID usage by category
   */
  async getRFIDUsageByCategory() {
    return apiService.get('/api/Reporting/rfid-usage/by-category');
  }

  /**
   * Get RFID usage by branch
   */
  async getRFIDUsageByBranch() {
    return apiService.get('/api/Reporting/rfid-usage/by-branch');
  }

  /**
   * Get RFID usage by counter
   */
  async getRFIDUsageByCounter() {
    return apiService.get('/api/Reporting/rfid-usage/by-counter');
  }

  /**
   * Get RFID usage for specific category
   */
  async getRFIDUsageByCategoryId(categoryId) {
    return apiService.get(`/api/Reporting/rfid-usage/category/${categoryId}`);
  }

  /**
   * Get RFID usage for specific branch
   */
  async getRFIDUsageByBranchId(branchId) {
    return apiService.get(`/api/Reporting/rfid-usage/branch/${branchId}`);
  }

  /**
   * Get RFID usage for specific counter
   */
  async getRFIDUsageByCounterId(counterId) {
    return apiService.get(`/api/Reporting/rfid-usage/counter/${counterId}`);
  }

  /**
   * Get total RFID count
   */
  async getTotalRFIDCount() {
    return apiService.get('/api/Reporting/rfid-usage/count/total');
  }

  /**
   * Get used RFID count
   */
  async getUsedRFIDCount() {
    return apiService.get('/api/Reporting/rfid-usage/count/used');
  }

  /**
   * Get unused RFID count
   */
  async getUnusedRFIDCount() {
    return apiService.get('/api/Reporting/rfid-usage/count/unused');
  }

  /**
   * Get RFID usage percentage
   */
  async getRFIDUsagePercentage() {
    return apiService.get('/api/Reporting/rfid-usage/percentage');
  }

  // ==================== Stock Verification Reports ====================
  
  /**
   * Create stock verification session
   */
  async createVerificationSession(sessionData) {
    return apiService.post('/api/StockVerification/create-session', sessionData);
  }

  /**
   * Submit stock verification
   */
  async submitVerification(verificationData) {
    return apiService.post('/api/StockVerification/submit-verification', verificationData);
  }

  /**
   * Get stock verification by ID
   */
  async getStockVerificationById(id) {
    return apiService.get(`/api/StockVerification/${id}`);
  }

  /**
   * Get stock verifications list with filters
   */
  async getStockVerificationsList(params = {}) {
    return apiService.get('/api/StockVerification/list', params);
  }

  /**
   * Get stock verification summary
   */
  async getStockVerificationSummary() {
    return apiService.get('/api/StockVerification/summary');
  }

  /**
   * Get date-wise stock verification report
   */
  async getDateWiseVerificationReport(startDate, endDate) {
    return apiService.get('/api/StockVerification/date-wise-report', {
      startDate,
      endDate
    });
  }

  /**
   * Complete stock verification session
   */
  async completeVerificationSession(id) {
    return apiService.post(`/api/StockVerification/${id}/complete`);
  }

  /**
   * Cancel stock verification session
   */
  async cancelVerificationSession(id) {
    return apiService.post(`/api/StockVerification/${id}/cancel`);
  }

  /**
   * Get verification details by status
   */
  async getVerificationDetailsByStatus(id, status) {
    return apiService.get(`/api/StockVerification/${id}/details/${status}`);
  }

  // ==================== Stock Transfer Reports ====================
  
  /**
   * Create stock transfer
   */
  async createStockTransfer(transferData) {
    return apiService.post('/api/StockTransfer', transferData);
  }

  /**
   * Create bulk stock transfers
   */
  async createBulkStockTransfers(transfers, commonReason, commonRemarks) {
    return apiService.post('/api/StockTransfer/bulk', {
      transfers,
      commonReason,
      commonRemarks
    });
  }

  /**
   * Get transfer by ID
   */
  async getTransferById(id) {
    return apiService.get(`/api/StockTransfer/${id}`);
  }

  /**
   * Get all transfers with filters
   */
  async getAllTransfers(params = {}) {
    return apiService.get('/api/StockTransfer', params);
  }

  /**
   * Approve transfer
   */
  async approveTransfer(id, approvedBy, remarks) {
    return apiService.put(`/api/StockTransfer/${id}/approve`, {
      approvedBy,
      remarks
    });
  }

  /**
   * Reject transfer
   */
  async rejectTransfer(id, rejectedBy, rejectionReason, remarks) {
    return apiService.put(`/api/StockTransfer/${id}/reject`, {
      rejectedBy,
      rejectionReason,
      remarks
    });
  }

  /**
   * Complete transfer
   */
  async completeTransfer(id, completedBy) {
    return apiService.put(`/api/StockTransfer/${id}/complete`, null, {
      params: { completedBy }
    });
  }

  /**
   * Cancel transfer
   */
  async cancelTransfer(id, cancelledBy) {
    return apiService.put(`/api/StockTransfer/${id}/cancel`, null, {
      params: { cancelledBy }
    });
  }

  /**
   * Get transfer summary
   */
  async getTransferSummary(fromDate, toDate) {
    return apiService.get('/api/StockTransfer/summary', { fromDate, toDate });
  }

  /**
   * Get transfers by product
   */
  async getTransfersByProduct(productId) {
    return apiService.get(`/api/StockTransfer/product/${productId}`);
  }

  /**
   * Get transfers by RFID
   */
  async getTransfersByRFID(rfidCode) {
    return apiService.get(`/api/StockTransfer/rfid/${rfidCode}`);
  }

  /**
   * Get pending transfers by location
   */
  async getPendingTransfersByLocation(branchId, counterId, boxId = null) {
    const params = { branchId, counterId };
    if (boxId) params.boxId = boxId;
    return apiService.get('/api/StockTransfer/pending', params);
  }

  /**
   * Validate transfer
   */
  async validateTransfer(transferData) {
    return apiService.post('/api/StockTransfer/validate', transferData);
  }

  /**
   * Get transfer types
   */
  async getTransferTypes() {
    return apiService.get('/api/StockTransfer/types');
  }

  /**
   * Get transfer statuses
   */
  async getTransferStatuses() {
    return apiService.get('/api/StockTransfer/statuses');
  }

  /**
   * Get product transfer history
   */
  async getProductTransferHistory(productId) {
    return apiService.get(`/api/StockTransfer/history/${productId}`);
  }

  // ==================== Report Summaries ====================
  
  /**
   * Get comprehensive report summary for a date
   */
  async getReportSummary(date) {
    return apiService.get(`/api/Reporting/summary/${date}`);
  }

  /**
   * Get report summary by date range
   */
  async getReportSummaryByRange(startDate, endDate) {
    return apiService.get('/api/Reporting/summary/range', { startDate, endDate });
  }

  /**
   * Get report summary by branch
   */
  async getReportSummaryByBranch(branchId, date) {
    return apiService.get(`/api/Reporting/summary/branch/${branchId}/${date}`);
  }

  /**
   * Get report summary by counter
   */
  async getReportSummaryByCounter(counterId, date) {
    return apiService.get(`/api/Reporting/summary/counter/${counterId}/${date}`);
  }

  // ==================== Current Stock Tracking ====================
  
  /**
   * Get current stock by product
   */
  async getCurrentStockByProduct(productId) {
    return apiService.get(`/api/Reporting/stock/current/${productId}`);
  }

  /**
   * Get current stock by product and branch
   */
  async getCurrentStockByProductAndBranch(productId, branchId) {
    return apiService.get(`/api/Reporting/stock/current/${productId}/branch/${branchId}`);
  }

  /**
   * Get current stock by product and counter
   */
  async getCurrentStockByProductAndCounter(productId, counterId) {
    return apiService.get(`/api/Reporting/stock/current/${productId}/counter/${counterId}`);
  }

  /**
   * Get current stock by category
   */
  async getCurrentStockByCategory(categoryId) {
    return apiService.get(`/api/Reporting/stock/current/category/${categoryId}`);
  }

  /**
   * Get stock value by product
   */
  async getStockValueByProduct(productId) {
    return apiService.get(`/api/Reporting/stock/value/${productId}`);
  }

  /**
   * Get stock value by product and branch
   */
  async getStockValueByProductAndBranch(productId, branchId) {
    return apiService.get(`/api/Reporting/stock/value/${productId}/branch/${branchId}`);
  }

  /**
   * Get stock value by product and counter
   */
  async getStockValueByProductAndCounter(productId, counterId) {
    return apiService.get(`/api/Reporting/stock/value/${productId}/counter/${counterId}`);
  }

  /**
   * Get stock value by category
   */
  async getStockValueByCategory(categoryId) {
    return apiService.get(`/api/Reporting/stock/value/category/${categoryId}`);
  }
}

// Create and export singleton instance
const reportingService = new ReportingService();
export default reportingService;

