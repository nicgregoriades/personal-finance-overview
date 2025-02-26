import React, { useState } from 'react';
import { PlusCircle, Edit, Trash, TrendingUp, PieChart } from 'lucide-react';
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const Assets = () => {
  // Use the finance context for all asset operations
  const { 
    financeData, 
    addAsset, 
    updateAsset, 
    deleteAsset 
  } = useFinance();
  
  // Get assets from context
  const assets = financeData.assets.items;
  
  // Asset history for trends
  const assetHistory = financeData.assets.history;
  
  // New asset form state
  const [newAsset, setNewAsset] = useState({ name: '', value: '', type: 'liquid' });
  const [editingId, setEditingId] = useState(null);
  
  // Asset types with colors
  const assetTypes = [
    { value: 'liquid', label: 'Liquid Assets', color: '#3B82F6' },
    { value: 'investment', label: 'Investments', color: '#10B981' },
    { value: 'retirement', label: 'Retirement', color: '#6366F1' },
    { value: 'property', label: 'Property', color: '#F59E0B' },
    { value: 'vehicle', label: 'Vehicles', color: '#EC4899' },
    { value: 'other', label: 'Other', color: '#8B5CF6' }
  ];
  
  // Calculate total assets value
  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Prepare data for pie chart by asset type
  const getAssetsByType = () => {
    const assetsByType = {};
    
    assets.forEach(asset => {
      if (!assetsByType[asset.type]) {
        assetsByType[asset.type] = 0;
      }
      assetsByType[asset.type] += asset.value;
    });
    
    return Object.entries(assetsByType).map(([type, value]) => ({
      type,
      value,
      name: assetTypes.find(t => t.value === type)?.label || 'Other'
    }));
  };
  
  // Handle adding new asset
  const handleAddAsset = () => {
    if (newAsset.name && newAsset.value) {
      if (editingId) {
        // Update existing asset
        updateAsset(editingId, {
          name: newAsset.name,
          value: parseFloat(newAsset.value),
          type: newAsset.type
        });
        setEditingId(null);
      } else {
        // Add new asset
        addAsset({
          name: newAsset.name,
          value: parseFloat(newAsset.value),
          type: newAsset.type
        });
      }
      // Reset form
      setNewAsset({ name: '', value: '', type: 'liquid' });
    }
  };

  // Handle edit asset
  const handleEditAsset = (asset) => {
    setNewAsset({ name: asset.name, value: asset.value.toString(), type: asset.type });
    setEditingId(asset.id);
  };

  // Handle delete asset
  const handleDeleteAsset = (id) => {
    deleteAsset(id);
  };
  
  // Get color for asset type
  const getAssetTypeColor = (type) => {
    return assetTypes.find(t => t.value === type)?.color || '#8B5CF6';
  };
  
  // Get label for asset type
  const getAssetTypeLabel = (type) => {
    return assetTypes.find(t => t.value === type)?.label || 'Other';
  };
  
  // Format dates for display
  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assets</h1>
      
      {/* Assets Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Assets Summary</h2>
        <div className="flex items-center">
          <TrendingUp className="h-10 w-10 text-green-600 mr-3" />
          <div>
            <p className="text-3xl font-bold">${totalAssetsValue.toLocaleString()}</p>
            <p className="text-gray-600">Total Assets Value</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Assets List */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Assets List</h2>
          
          {assets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${getAssetTypeColor(asset.type)}20`, 
                            color: getAssetTypeColor(asset.type) 
                          }}
                        >
                          {getAssetTypeLabel(asset.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">${asset.value.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button 
                          onClick={() => handleEditAsset(asset)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
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
            <p className="text-gray-500 py-4 text-center">No assets added yet</p>
          )}
        </div>
        
        {/* Add/Edit Asset Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Asset' : 'Add Asset'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
              <input
                type="text"
                value={newAsset.name}
                onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Savings Account, Home, 401(k)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
              <input
                type="number"
                value={newAsset.value}
                onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
              <select
                value={newAsset.type}
                onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {assetTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddAsset}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {editingId ? 'Update Asset' : 'Add Asset'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewAsset({ name: '', value: '', type: 'liquid' });
                }}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Assets Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Asset Breakdown</h2>
            <PieChart className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-64">
            {assets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={getAssetsByType()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {getAssetsByType().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getAssetTypeColor(entry.type)} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </RechartPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">Add assets to see breakdown</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Asset Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Asset Growth</h2>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-64">
            {assetHistory.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={assetHistory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Total']}
                    labelFormatter={(date) => formatDate(date)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#10B981" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    name="Asset Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">Add more assets over time to see growth trends</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;
