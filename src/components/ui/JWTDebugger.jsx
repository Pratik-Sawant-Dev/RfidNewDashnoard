import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Clock, 
  User, 
  Mail, 
  CheckCircle, 
  XCircle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { 
  decodeJWT, 
  isTokenExpired, 
  getTokenExpiration,
  isAdminFromToken,
  getUserRoleFromToken,
  getUserIdFromToken,
  getUsernameFromToken,
  getEmailFromToken
} from '../../utils/jwtUtils';
import Card from './Card';
import Button from './Button';

/**
 * JWT Token Debugger Component
 * Useful for development and debugging JWT token claims
 * Shows token structure, claims, and validation status
 */
const JWTDebugger = () => {
  const { token, isAdmin, isTokenValid, tokenClaims } = useAuth();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!token) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No authentication token found</p>
          <p className="text-sm mt-2">Please log in to see token information</p>
        </div>
      </Card>
    );
  }

  const decoded = decodeJWT(token);
  const expired = isTokenExpired(token);
  const expiration = getTokenExpiration(token);
  const adminFromToken = isAdminFromToken(token);
  const role = getUserRoleFromToken(token);
  const userId = getUserIdFromToken(token);
  const username = getUsernameFromToken(token);
  const email = getEmailFromToken(token);

  const tokenParts = token.split('.');
  
  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InfoItem = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        status === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
        status === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
        'bg-blue-100 dark:bg-blue-900/20'
      }`}>
        <Icon className={`w-5 h-5 ${
          status === 'success' ? 'text-green-600 dark:text-green-400' :
          status === 'error' ? 'text-red-600 dark:text-red-400' :
          'text-blue-600 dark:text-blue-400'
        }`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1 break-all">
          {value || 'Not found'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          JWT Token Debugger
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Debug and inspect your JWT authentication token
        </p>
      </div>

      {/* Token Status */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Token Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {isTokenValid ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Validity</p>
                <p className={`font-semibold ${isTokenValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isTokenValid ? 'Valid' : 'Expired'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {adminFromToken ? (
                <Shield className="w-6 h-6 text-purple-500" />
              ) : (
                <User className="w-6 h-6 text-blue-500" />
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {adminFromToken ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expires At</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {expiration ? expiration.toLocaleString() : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Key className="w-6 h-6 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Token Parts</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {tokenParts.length} (Header.Payload.Signature)
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Extracted Information */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Extracted Information
          </h3>
          
          <div className="space-y-3">
            <InfoItem 
              icon={User} 
              label="User ID" 
              value={userId} 
              status="default"
            />
            <InfoItem 
              icon={User} 
              label="Username" 
              value={username} 
              status="default"
            />
            <InfoItem 
              icon={Mail} 
              label="Email" 
              value={email} 
              status="default"
            />
            <InfoItem 
              icon={Shield} 
              label="Role" 
              value={role || (adminFromToken ? 'Admin' : 'User')} 
              status={adminFromToken ? 'success' : 'default'}
            />
            <InfoItem 
              icon={Shield} 
              label="Is Admin" 
              value={adminFromToken ? 'Yes' : 'No'} 
              status={adminFromToken ? 'success' : 'default'}
            />
          </div>
        </div>
      </Card>

      {/* Raw Token */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              Raw Token
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowToken(!showToken)}
                className="flex items-center gap-2"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showToken ? 'Hide' : 'Show'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToken}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          {showToken ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Header</p>
                <code className="text-xs text-blue-600 dark:text-blue-400 break-all block">
                  {tokenParts[0]}
                </code>
              </div>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Payload</p>
                <code className="text-xs text-green-600 dark:text-green-400 break-all block">
                  {tokenParts[1]}
                </code>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Signature</p>
                <code className="text-xs text-orange-600 dark:text-orange-400 break-all block">
                  {tokenParts[2]}
                </code>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Click "Show" to view the raw token
            </p>
          )}
        </div>
      </Card>

      {/* All Claims */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            All Token Claims
          </h3>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs text-gray-900 dark:text-white">
              {JSON.stringify(decoded, null, 2)}
            </pre>
          </div>
        </div>
      </Card>

      {/* Hook Values */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            useAuth() Hook Values
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">isAdmin</span>
              <span className={`font-semibold ${isAdmin ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {isAdmin ? 'true' : 'false'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">isTokenValid</span>
              <span className={`font-semibold ${isTokenValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isTokenValid ? 'true' : 'false'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300 block mb-2">tokenClaims</span>
              <pre className="text-xs text-gray-900 dark:text-white overflow-x-auto">
                {JSON.stringify(tokenClaims, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Development Tool:</strong> This component is for debugging purposes only. 
          Do not expose sensitive token information in production environments.
        </p>
      </div>
    </div>
  );
};

export default JWTDebugger;

