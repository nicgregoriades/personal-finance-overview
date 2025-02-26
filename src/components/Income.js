import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash, DollarSign, LineChart } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const Income = () => {
  // Use the finance context for all income operations
  const { 
    financeData, 
    addIncomeSource, 
    updateIncomeSource, 
    deleteIncomeSource,
    recordMonthlyIncome 
  } = useFinance();
  
  // Income sources from context
  const incomeSources = financeData.income.sources;
  
  // Monthly history from context
  const monthlyHistory = financeData.income.history.monthly;
  
  // New income source form state
  const [newSource, setNewSource] = useState({ name: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  
  // Current month to record income
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [actualIncome, setActualIncome] = useState('');

  // Compute total monthly income
  const totalMonthlyIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  // Handle adding new income source
  const handleAddSource = () => {
    if (newSource.name && newSource.amount) {
      if (editingId) {
        // Update existing source
        updateIncomeSource(editingId, {
          name: newSource.name,
          amount: parseFloat(newSource.amount)
        });
        setEditingId(null);
      } else {
        // Add new source
        addIncomeSource({
          name: newSource.name,
          amount: parseFloat(newSource.amount)
        });
      }
      // Reset form
      setNewSource({ name: '', amount: '' });
    }
  };

  // Handle edit source
  const handleEditSource = (source) => {
    setNewSource({ name: source.name, amount: source.amount.toString() });
    setEditingId(source.id);
  };

  // Handle delete source
  const handleDeleteSource = (id) => {
    deleteIncomeSource(id);
  };

  // Handle recording monthly income
  const handleRecordMonthlyIncome = () => {
    if (actualIncome) {
      recordMonthlyIncome(currentMonth, parseFloat(actualIncome));
      setActualIncome('');
    }
  };
  
  // Get available months for dropdown
  const getAvailableMonths = () => {
    const now = new Date();
    const months = [];
    
    // Include past 12 months and current month
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
    }
    
    return months;
  };
  
  // Format month string for display
  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  
  // Prepare data for income chart
  const prepareChartData = () => {
    return Object.entries(monthlyHistory)
      .map(([month, amount]) => ({
        month,
        income: amount
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Income</h1>
      
      {/* Monthly Income Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Income Summary</h2>
        <div className="flex items-center">
          <DollarSign className="h-10 w-10 text-green-600 mr-3" />
          <div>
            <p className="text-3xl font-bold">${totalMonthlyIncome.toLocaleString()}</p>
            <p className="text-gray-600">Total Monthly Income</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Income Sources List */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Income Sources</h2>
          
          {incomeSources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incomeSources.map((source) => (
                    <tr key={source.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{source.name}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">${source.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button 
                          onClick={() => handleEditSource(source)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSource(source.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No income sources added yet</p>
          )}
        </div>
        
        {/* Add/Edit Income Source Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Income Source' : 'Add Income Source'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
              <input
                type="text"
                value={newSource.name}
                onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Salary, Freelance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount ($)</label>
              <input
                type="number"
                value={newSource.amount}
                onChange={(e) => setNewSource({...newSource, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={handleAddSource}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {editingId ? 'Update Source' : 'Add Source'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewSource({ name: '', amount: '' });
                }}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Monthly Income History */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Income Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Record Monthly Income */}
          <div>
            <h3 className="text-lg font-medium mb-3">Record Actual Income</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {getAvailableMonths().map(month => (
                    <option key={month} value={month}>
                      {formatMonthDisplay(month)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Income ($)</label>
                <input
                  type="number"
                  value={actualIncome}
                  onChange={(e) => setActualIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                onClick={handleRecordMonthlyIncome}
                className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Record Income
              </button>
            </div>
          </div>
          
          {/* Income History */}
          <div>
            <h3 className="text-lg font-medium mb-3">Income History</h3>
            <div className="overflow-y-auto max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(monthlyHistory)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([month, amount]) => (
                      <tr key={month}>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatMonthDisplay(month)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">${amount.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Income Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Income Trends</h2>
          <LineChart className="h-6 w-6 text-gray-400" />
        </div>
        <div className="h-64">
          {prepareChartData().length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={prepareChartData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(month) => {
                    const [year, monthNum] = month.split('-');
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`;
                  }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Income']}
                  labelFormatter={(month) => formatMonthDisplay(month)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Monthly Income"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Record monthly income to see trends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;
