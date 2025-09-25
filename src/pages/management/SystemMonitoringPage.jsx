import React from 'react';
import { Activity, Database, Server, Cpu, HardDrive, Wifi } from 'lucide-react';
import Card from '../../components/ui/Card';

const SystemMonitoringPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor system performance and health metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45%</p>
            </div>
            <Cpu className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">62%</p>
            </div>
            <Server className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Disk Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">38%</p>
            </div>
            <HardDrive className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Network</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Good</p>
            </div>
            <Wifi className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Health Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Performance Metrics
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span>Database Response Time</span>
                  <span className="text-green-600 font-medium">45ms</span>
                </li>
                <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span>API Response Time</span>
                  <span className="text-green-600 font-medium">120ms</span>
                </li>
                <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span>Active Connections</span>
                  <span className="text-blue-600 font-medium">156</span>
                </li>
                <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span>Uptime</span>
                  <span className="text-green-600 font-medium">99.9%</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                System Status
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Database Server - Online
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  API Server - Online
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  File Storage - Online
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Backup System - Online
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitoringPage;
