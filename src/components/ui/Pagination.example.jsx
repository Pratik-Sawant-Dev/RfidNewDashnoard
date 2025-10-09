/**
 * PAGINATION COMPONENT - USAGE EXAMPLES
 * 
 * This file shows how to use the Pagination component in your modules
 */

import React, { useState } from 'react';
import Pagination from './Pagination';

// Example 1: Basic Usage
function BasicExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Your data array
  const allItems = []; // Your full data array
  
  // Calculate pagination
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  return (
    <div>
      {/* Your list/table here */}
      <div>
        {paginatedItems.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>

      {/* Pagination footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={allItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newValue) => {
          setItemsPerPage(newValue);
          setCurrentPage(1); // Reset to page 1
        }}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </div>
  );
}

// Example 2: With Table
function TableExample() {
  const [data, setData] = useState([
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
    // ... more items
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination at footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

// Example 3: Custom Rows Per Page Options
function CustomOptionsExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const items = []; // Your data

  return (
    <div>
      {/* Your content */}
      
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(items.length / itemsPerPage)}
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        rowsPerPageOptions={[10, 20, 30, 50, 100]} // Custom options
      />
    </div>
  );
}

// Example 4: Complete Integration Pattern
function CompleteExample() {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Pagination helpers
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optional: scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Always reset to first page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2>My Module ({data.length} total items)</h2>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* List/Table Content */}
        <div className="p-4">
          {loading ? (
            <div>Loading...</div>
          ) : data.length === 0 ? (
            <div>No data available</div>
          ) : (
            <div>
              {paginatedData.map((item) => (
                <div key={item.id}>{item.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer - Only show when we have data */}
        {!loading && data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[25, 50, 100]}
          />
        )}
      </div>
    </div>
  );
}

export { BasicExample, TableExample, CustomOptionsExample, CompleteExample };

