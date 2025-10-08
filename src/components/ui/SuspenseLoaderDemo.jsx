import React, { useState } from 'react';
import SuspenseLoader from './SuspenseLoader';
import Card from './Card';
import Button from './Button';

/**
 * Demo component to showcase different SuspenseLoader variants
 * This can be used for testing and documentation purposes
 */
const SuspenseLoaderDemo = () => {
  const [showFull, setShowFull] = useState(false);
  const [showInline, setShowInline] = useState(false);
  const [showMinimal, setShowMinimal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SuspenseLoader Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Showcase of the RFID Jewellery app's universal suspense loader
        </p>
      </div>

      {/* Full Screen Variant */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Full Screen Loader
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Used in route protection (ProtectedRoute, AdminRoute, PublicRoute) and authentication flows.
            Features RFID pulse waves, rotating gem, and sparkle effects.
          </p>
          <Button onClick={() => setShowFull(!showFull)}>
            {showFull ? 'Hide' : 'Show'} Full Screen Loader
          </Button>
          
          {showFull && (
            <div className="fixed inset-0 z-50">
              <SuspenseLoader message="Verifying authentication" variant="full" />
              <button
                onClick={() => setShowFull(false)}
                className="absolute top-4 right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Inline Variant */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Inline Loader
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Used for loading states within components or sections of a page.
            Available in small, default, and large sizes.
          </p>
          <Button onClick={() => setShowInline(!showInline)} className="mb-4">
            {showInline ? 'Hide' : 'Show'} Inline Loaders
          </Button>
          
          {showInline && (
            <div className="space-y-6 mt-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Small</h3>
                <SuspenseLoader message="Loading data" variant="inline" size="small" />
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default</h3>
                <SuspenseLoader message="Processing request" variant="inline" size="default" />
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Large</h3>
                <SuspenseLoader message="Syncing inventory" variant="inline" size="large" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Minimal Variant */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Minimal Loader
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Compact loader for buttons, small UI elements, or tight spaces.
            Available in small, default, and large sizes.
          </p>
          <Button onClick={() => setShowMinimal(!showMinimal)} className="mb-4">
            {showMinimal ? 'Hide' : 'Show'} Minimal Loaders
          </Button>
          
          {showMinimal && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-8">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Small</h3>
                  <SuspenseLoader variant="minimal" size="small" />
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default</h3>
                  <SuspenseLoader variant="minimal" size="default" />
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Large</h3>
                  <SuspenseLoader variant="minimal" size="large" />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Usage Examples */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Usage Examples
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Screen (Authentication)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`<SuspenseLoader 
  message="Verifying authentication" 
  variant="full" 
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Inline (Component Loading)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`<SuspenseLoader 
  message="Loading inventory" 
  variant="inline" 
  size="default" 
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Minimal (Button/Small UI)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`<SuspenseLoader 
  variant="minimal" 
  size="small" 
/>`}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Props Documentation */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Props
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prop
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">message</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">"Loading..."</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Loading message to display</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">size</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">"small" | "default" | "large"</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">"default"</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Size of the loader</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">variant</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">"full" | "inline" | "minimal"</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">"full"</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Loader variant/style</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuspenseLoaderDemo;

