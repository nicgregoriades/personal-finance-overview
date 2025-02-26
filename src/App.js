import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp,
  TrendingDown, 
  LineChart, 
  PieChart, 
  Calculator, 
  Wallet,
  Menu,
  X,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { useFinance } from './context/FinanceContext';

// Import all page components
import Dashboard from './components/Dashboard';
import Income from './components/Income';
import Assets from './components/Assets';
import Debts from './components/Debts';
import BurnRate from './components/BurnRate';
import NetWorth from './components/NetWorth';
import AllocationCalculator from './components/AllocationCalculator';
import ThreeXAccount from './components/ThreeXAccount';

const App = () => {
  // Access finance context
  const { resetAllData, exportData, importData } = useFinance();
  
  // State for current page
  const [currentPage, setCurrentPage] = useState('dashboard');
  // State for mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for settings dropdown
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'income', name: 'Income', icon: <DollarSign size={20} /> },
    { id: 'assets', name: 'Assets', icon: <TrendingUp size={20} /> },
    { id: 'debts', name: 'Debts', icon: <TrendingDown size={20} /> },
    { id: 'burn', name: 'Burn Rate', icon: <LineChart size={20} /> },
    { id: 'networth', name: 'Net Worth', icon: <PieChart size={20} /> },
    { id: 'allocation', name: 'Allocation Calculator', icon: <Calculator size={20} /> },
    { id: 'threex', name: '3X Account', icon: <Wallet size={20} /> }
  ];
  
  // Handle page navigation
  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };
  
  // Handle data reset
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all financial data? This cannot be undone.')) {
      resetAllData();
      setIsSettingsOpen(false);
    }
  };
  
  // Handle data export
  const handleExportData = () => {
    exportData();
    setIsSettingsOpen(false);
  };
  
  // Handle data import
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const result = importData(event.target.result);
            if (result) {
              alert('Data imported successfully!');
            } else {
              alert('Error importing data. Invalid format.');
            }
          } catch (error) {
            console.error('Error importing data:', error);
            alert('Error importing data. Please try again.');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
    setIsSettingsOpen(false);
  };
  
  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <Income />;
      case 'assets':
        return <Assets />;
      case 'debts':
        return <Debts />;
      case 'burn':
        return <BurnRate />;
      case 'networth':
        return <NetWorth />;
      case 'allocation':
        return <AllocationCalculator />;
      case 'threex':
        return <ThreeXAccount />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-gray-800">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-white text-xl font-bold">Finance Overview</h1>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  currentPage === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transition-transform transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}>
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <h1 className="text-white text-xl font-bold">Finance Overview</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  currentPage === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Top header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
            </div>
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-800 md:ml-0 ml-4">
                {navItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <Settings size={20} />
              </button>
              
              {/* Settings dropdown */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={handleExportData}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download size={16} className="mr-2" />
                      Export Data
                    </button>
                    <button
                      onClick={handleImportData}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download size={16} className="mr-2 transform rotate-180" />
                      Import Data
                    </button>
                    <button
                      onClick={handleResetData}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Reset Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
