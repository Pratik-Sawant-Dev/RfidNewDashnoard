import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import store from './store';
import { initializeApp } from './utils/initializeApp';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Inventory Pages
import InventoryPage from './pages/inventory/InventoryPage';
import AddStockPage from './pages/inventory/AddStockPage';
import ProductListPage from './pages/inventory/ProductListPage';
import ProductViewPage from './pages/inventory/ProductViewPage';
import ProductEditPage from './pages/inventory/ProductEditPage';
import ProductCatalogPage from './pages/inventory/ProductCatalogPage';

// Reports Pages - API Integrated
import StockMovementReportsPage from './pages/reports/StockMovementReportsPage';
import RFIDUsageReportsPage from './pages/reports/RFIDUsageReportsPage';
import DailyBalanceReportsPage from './pages/reports/DailyBalanceReportsPage';
import StockVerificationReportsPage from './pages/reports/StockVerificationReportsPage';
import DailyActivityReportsPage from './pages/reports/DailyActivityReportsPage';
import StockSummaryReportsPage from './pages/reports/StockSummaryReportsPage';
import StockTransferReportsPage from './pages/reports/StockTransferReportsPage';

// Invoice Pages
import InvoicePage from './pages/invoices/InvoicePage';
import InvoiceManagementPage from './pages/invoices/InvoiceManagementPage';
import InvoiceListPage from './pages/invoices/InvoiceListPage';
import CreateInvoicePage from './pages/invoices/CreateInvoicePage';
import InvoiceDetailsPage from './pages/invoices/InvoiceDetailsPage';
import InvoiceAnalyticsPage from './pages/invoices/InvoiceAnalyticsPage';
import InvoiceReportsPage from './pages/invoices/InvoiceReportsPage';

// Quotation Pages
import CreateQuotationPage from './pages/quotation/CreateQuotationPage';

// Member Pages
import AdminPage from './pages/member/AdminPage';
import UserPage from './pages/member/UserPage';

// Management Pages
import UserManagementPage from './pages/management/UserManagementPage';
import AddEditUserPage from './pages/management/AddEditUserPage';
import SystemMonitoringPage from './pages/management/SystemMonitoringPage';

// Master Pages
import CategoryPage from './pages/master/CategoryPage';
import ProductPage from './pages/master/ProductPage';
import DesignPage from './pages/master/DesignPage';
import PurityPage from './pages/master/PurityPage';
import BranchPage from './pages/master/BranchPage';
import CounterPage from './pages/master/CounterPage';
import BoxPage from './pages/master/BoxPage';

// RFID Hub Pages
import AddRFIDPage from './pages/rfid-hub/AddRFIDPage';
import AllRFIDTagsListPage from './pages/rfid-hub/AllRFIDTagsListPage';
import UnusedRFIDTagsListPage from './pages/rfid-hub/UnusedRFIDTagsListPage';


// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RightSidebar from './components/layout/RightSidebar';
import ApiSettingsComponent from './components/ApiSettingsComponent';
import AuthInitializer from './components/AuthInitializer';
import SmartPermissionLoader from './components/SmartPermissionLoader';

// Route Protection Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';

// Main Layout Component
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          onRightSidebarToggle={toggleRightSidebar}
          isRightSidebarOpen={isRightSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      {/* Right Sidebar - Always render for animations */}
      <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
    </div>
  );
};

function App() {
  // Initialize app services
  initializeApp();

  return (
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
        <AuthInitializer />
        <SmartPermissionLoader />
        <Router>
          <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <PublicRoute restricted={true}>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/onboarding" element={
              <PublicRoute restricted={true}>
                <OnboardingPage />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute restricted={true}>
                <ForgotPasswordPage />
              </PublicRoute>
            } />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/add-stock" element={
              <ProtectedRoute>
                <MainLayout>
                  <AddStockPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Invoice Routes */}
            <Route path="/invoices" element={
              <ProtectedRoute>
                <MainLayout>
                  <InvoiceManagementPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/list" element={
              <ProtectedRoute>
                <MainLayout>
                  <InvoiceListPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/create" element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateInvoicePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/details/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <InvoiceDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/edit/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateInvoicePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/analytics" element={
              <ProtectedRoute>
                <MainLayout>
                  <InvoiceAnalyticsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/reports" element={
              <ProtectedRoute>
                <MainLayout>
                  <InvoiceReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Quotation Routes */}
            <Route path="/quotation/create" element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateQuotationPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/quotation/list" element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Quotation List</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Quotation list page coming soon...</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Member Routes */}
            <Route path="/member/admin" element={
              <AdminRoute>
                <MainLayout>
                  <AdminPage />
                </MainLayout>
              </AdminRoute>
            } />
            
            <Route path="/member/user" element={
              <ProtectedRoute>
                <MainLayout>
                  <UserPage />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Management Routes */}
            <Route path="/management/users" element={
              <ProtectedRoute>
                <MainLayout>
                  <UserManagementPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/management/users/add" element={
              <ProtectedRoute>
                <MainLayout>
                  <AddEditUserPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/management/users/edit/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <AddEditUserPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/management/monitoring" element={
              <AdminRoute>
                <MainLayout>
                  <SystemMonitoringPage />
                </MainLayout>
              </AdminRoute>
            } />
            
            {/* Master Routes */}
            <Route path="/master/category" element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoryPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/product" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/design" element={
              <ProtectedRoute>
                <MainLayout>
                  <DesignPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/purity" element={
              <ProtectedRoute>
                <MainLayout>
                  <PurityPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/branch" element={
              <ProtectedRoute>
                <MainLayout>
                  <BranchPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/counter" element={
              <ProtectedRoute>
                <MainLayout>
                  <CounterPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/master/box" element={
              <ProtectedRoute>
                <MainLayout>
                  <BoxPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Reports Routes - API Integrated */}
            <Route path="/reports/stock-movement" element={
              <ProtectedRoute>
                <MainLayout>
                  <StockMovementReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/rfid-usage" element={
              <ProtectedRoute>
                <MainLayout>
                  <RFIDUsageReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/daily-balance" element={
              <ProtectedRoute>
                <MainLayout>
                  <DailyBalanceReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/stock-verification" element={
              <ProtectedRoute>
                <MainLayout>
                  <StockVerificationReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/daily-activity" element={
              <ProtectedRoute>
                <MainLayout>
                  <DailyActivityReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/stock-summary" element={
              <ProtectedRoute>
                <MainLayout>
                  <StockSummaryReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports/stock-transfer" element={
              <ProtectedRoute>
                <MainLayout>
                  <StockTransferReportsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Inventory Route */}
            <Route path="/inventory/product-list" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductListPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/inventory/product/:productId" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductViewPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/inventory/product/:productId/edit" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductEditPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/inventory/product-catalog" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductCatalogPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* RFID Hub Routes */}
            <Route path="/rfid-hub/add-rfid" element={
              <ProtectedRoute>
                <MainLayout>
                  <AddRFIDPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/rfid-hub/all-tags" element={
              <ProtectedRoute>
                <MainLayout>
                  <AllRFIDTagsListPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/rfid-hub/unused-tags" element={
              <ProtectedRoute>
                <MainLayout>
                  <UnusedRFIDTagsListPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Settings */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout>
                  <ApiSettingsComponent />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings/api" element={
              <ProtectedRoute>
                <MainLayout>
                  <ApiSettingsComponent />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    404
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Page not found
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
        </LoadingProvider>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
