/**
 * Examples of how to use SuspenseLoader in different scenarios
 * Copy these patterns into your components as needed
 */

import React, { useState, useEffect } from 'react';
import SuspenseLoader from '../components/ui/SuspenseLoader';
import Button from '../components/ui/Button';

// ============================================
// Example 1: Full Page Loading (Route Protection)
// ============================================
export const FullPageLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <SuspenseLoader message="Verifying authentication" variant="full" />;
  }

  return <div>Your protected content here</div>;
};

// ============================================
// Example 2: Component Loading State
// ============================================
export const ComponentLoadingExample = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({ items: ['Item 1', 'Item 2'] });
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>
      
      {isLoading ? (
        <SuspenseLoader 
          message="Loading inventory" 
          variant="inline" 
          size="default" 
        />
      ) : (
        <ul>
          {data.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ============================================
// Example 3: Button Loading State
// ============================================
export const ButtonLoadingExample = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  return (
    <Button 
      onClick={handleSubmit} 
      disabled={isSubmitting}
      className="flex items-center gap-2"
    >
      {isSubmitting ? (
        <>
          <SuspenseLoader variant="minimal" size="small" />
          <span>Processing...</span>
        </>
      ) : (
        'Submit Order'
      )}
    </Button>
  );
};

// ============================================
// Example 4: Modal/Dialog Loading
// ============================================
export const ModalLoadingExample = ({ isOpen }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading modal content
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Product Details</h3>
        
        {isLoading ? (
          <SuspenseLoader 
            message="Loading details" 
            variant="inline" 
            size="small" 
          />
        ) : (
          <div>
            <p>Product information here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Example 5: Data Table Loading
// ============================================
export const DataTableLoadingExample = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching table data
    setTimeout(() => {
      setData([
        { id: 1, name: 'Gold Ring', rfid: 'RF001' },
        { id: 2, name: 'Diamond Necklace', rfid: 'RF002' },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Jewelry Inventory</h2>
      
      {isLoading ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <SuspenseLoader 
            message="Loading inventory data" 
            variant="inline" 
            size="default" 
          />
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>RFID</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.rfid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ============================================
// Example 6: Card Loading State
// ============================================
export const CardLoadingExample = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({ total: 1234, available: 1000 });
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Inventory Stats</h3>
      
      {isLoading ? (
        <SuspenseLoader variant="minimal" size="default" />
      ) : (
        <div>
          <p>Total Items: {stats.total}</p>
          <p>Available: {stats.available}</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// Example 7: Search Results Loading
// ============================================
export const SearchLoadingExample = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setIsSearching(true);
    
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResults(['Result 1', 'Result 2', 'Result 3']);
    setIsSearching(false);
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search jewelry..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      
      <div className="mt-4">
        {isSearching ? (
          <SuspenseLoader 
            message="Searching inventory" 
            variant="inline" 
            size="small" 
          />
        ) : results ? (
          <div>
            {results.map((result, idx) => (
              <div key={idx}>{result}</div>
            ))}
          </div>
        ) : (
          <p>No results yet</p>
        )}
      </div>
    </div>
  );
};

// ============================================
// Example 8: Multi-Step Form Loading
// ============================================
export const MultiStepFormExample = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = async () => {
    setIsLoading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep(prev => prev + 1);
    setIsLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Jewelry Item</h2>
      
      {isLoading ? (
        <SuspenseLoader 
          message={`Processing step ${currentStep}`} 
          variant="inline" 
          size="default" 
        />
      ) : (
        <div>
          <p>Step {currentStep} content...</p>
          <Button onClick={nextStep}>Next Step</Button>
        </div>
      )}
    </div>
  );
};

// ============================================
// Example 9: Lazy Loading with React.lazy
// ============================================
export const LazyLoadingExample = () => {
  const [showComponent, setShowComponent] = useState(false);

  // In real usage:
  // const LazyComponent = React.lazy(() => import('./HeavyComponent'));

  return (
    <div className="p-6">
      <Button onClick={() => setShowComponent(true)}>
        Load Heavy Component
      </Button>
      
      {showComponent && (
        <React.Suspense 
          fallback={
            <SuspenseLoader 
              message="Loading component" 
              variant="inline" 
            />
          }
        >
          {/* <LazyComponent /> */}
          <div>Your lazy loaded component</div>
        </React.Suspense>
      )}
    </div>
  );
};

// ============================================
// Example 10: File Upload Progress
// ============================================
export const FileUploadExample = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file) => {
    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsUploading(false);
  };

  return (
    <div className="p-6">
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="mt-4">
          <SuspenseLoader 
            message="Uploading jewelry image" 
            variant="inline" 
            size="small" 
          />
        </div>
      )}
    </div>
  );
};

