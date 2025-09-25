import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';
import store from './store';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PurchaseEntryPage from './pages/PurchaseEntryPage';
import AddStockPage from './pages/AddStockPage';
import InvoicePage from './pages/InvoicePage';

// Reports Pages
import StockReportsPage from './pages/reports/StockReportsPage';
import SalesReportsPage from './pages/reports/SalesReportsPage';
import PurchaseReportsPage from './pages/reports/PurchaseReportsPage';

// Member Pages
import AdminPage from './pages/member/AdminPage';
import UserPage from './pages/member/UserPage';

// Management Pages
import UserManagementPage from './pages/management/UserManagementPage';
import SystemMonitoringPage from './pages/management/SystemMonitoringPage';

// Master Pages
import CategoryPage from './pages/master/CategoryPage';
import ProductPage from './pages/master/ProductPage';
import DesignPage from './pages/master/DesignPage';
import PurityPage from './pages/master/PurityPage';
import BranchPage from './pages/master/BranchPage';
import CounterPage from './pages/master/CounterPage';
import BoxPage from './pages/master/BoxPage';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RightSidebar from './components/layout/RightSidebar';
import ApiSettingsComponent from './components/ApiSettingsComponent';
import AuthInitializer from './components/AuthInitializer';

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
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer />
        <Router>
          <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            } />
            
            <Route path="/purchase-entry" element={
              <MainLayout>
                <PurchaseEntryPage />
              </MainLayout>
            } />
            
            <Route path="/add-stock" element={
              <MainLayout>
                <AddStockPage />
              </MainLayout>
            } />
            
            <Route path="/invoices" element={
              <MainLayout>
                <InvoicePage />
              </MainLayout>
            } />
            
            {/* Member Routes */}
            <Route path="/member/admin" element={
              <MainLayout>
                <AdminPage />
              </MainLayout>
            } />
            
            <Route path="/member/user" element={
              <MainLayout>
                <UserPage />
              </MainLayout>
            } />

            {/* Management Routes */}
            <Route path="/management/users" element={
              <MainLayout>
                <UserManagementPage />
              </MainLayout>
            } />
            
            <Route path="/management/monitoring" element={
              <MainLayout>
                <SystemMonitoringPage />
              </MainLayout>
            } />
            
            {/* Master Routes */}
            <Route path="/master/category" element={
              <MainLayout>
                <CategoryPage />
              </MainLayout>
            } />
            
            <Route path="/master/product" element={
              <MainLayout>
                <ProductPage />
              </MainLayout>
            } />
            
            <Route path="/master/design" element={
              <MainLayout>
                <DesignPage />
              </MainLayout>
            } />
            
            <Route path="/master/purity" element={
              <MainLayout>
                <PurityPage />
              </MainLayout>
            } />
            
            <Route path="/master/branch" element={
              <MainLayout>
                <BranchPage />
              </MainLayout>
            } />
            
            <Route path="/master/counter" element={
              <MainLayout>
                <CounterPage />
              </MainLayout>
            } />
            
            <Route path="/master/box" element={
              <MainLayout>
                <BoxPage />
              </MainLayout>
            } />
            
            {/* Reports Routes */}
            <Route path="/reports/stock" element={
              <MainLayout>
                <StockReportsPage />
              </MainLayout>
            } />
            
            <Route path="/reports/sales" element={
              <MainLayout>
                <SalesReportsPage />
              </MainLayout>
            } />
            
            <Route path="/reports/purchase" element={
              <MainLayout>
                <PurchaseReportsPage />
              </MainLayout>
            } />
            
            {/* Inventory Sub-routes */}
            <Route path="/inventory/stock" element={
              <MainLayout>
                <AddStockPage />
              </MainLayout>
            } />
            
            <Route path="/inventory/catalog" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Product Catalog
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Product catalog management coming soon...
                  </p>
                </div>
              </MainLayout>
            } />
            
            <Route path="/inventory/rfid-tags" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    RFID Tags Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    RFID tags management coming soon...
                  </p>
                </div>
              </MainLayout>
            } />
            
            {/* Sales Sub-routes */}
            <Route path="/sales/pos" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Point of Sale
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Point of sale system coming soon...
                  </p>
                </div>
              </MainLayout>
            } />
            
            <Route path="/sales/history" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Sales History
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sales history coming soon...
                  </p>
                </div>
              </MainLayout>
            } />
            
            <Route path="/sales/customers" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Customer Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Customer management coming soon...
                  </p>
                </div>
              </MainLayout>
            } />
            
            {/* Settings */}
            <Route path="/settings" element={
              <MainLayout>
                <ApiSettingsComponent />
              </MainLayout>
            } />
            
            <Route path="/settings/api" element={
              <MainLayout>
                <ApiSettingsComponent />
              </MainLayout>
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
    </ThemeProvider>
    </Provider>
  );
}

export default App;
