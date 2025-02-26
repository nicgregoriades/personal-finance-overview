import React from 'react';
import { Wallet, Coins, TrendingUp, TrendingDown, DollarSign, PieChart, Clock, Calculator } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Dashboard = () => {
  // Use the finance context to get all data and calculations
  const { 
    financeData,
    calculateNetWorth,
    calculateDebtToIncomeRatio,
    calculateSavingsRate,
    calculateMonthsTo3XGoal,
    getLiquidAssets
  } = useFinance();
  
  // Calculate all dashboard metrics
  const netWorth = calculateNetWorth();
  const totalAssets = financeData.assets.items.reduce((sum, asset) => sum + asset.value, 0);
  const totalDebts = financeData.debts.items.reduce((sum, debt) => sum + debt.balance, 0);
  const monthlyIncome = financeData.income.monthly;
  const monthlyExpenses = financeData.expenses.monthly;
  const debtToIncomeRatio = calculateDebtToIncomeRatio();
  const savingsRate = calculateSavingsRate();
  const monthsTo3XGoal = calculateMonthsTo3XGoal();
  const liquidAssets = getLiquidAssets();
  const monthlyBurnRate = financeData.expenses.monthly;

  // Sort assets and debts to get top items
  const topAssets = [...financeData.assets.items]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const topDebts = [...financeData.debts.items]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Command Center</h1>
      
      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Net Worth */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Wallet className="mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Net Worth</h2>
          </div>
          <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(netWorth).toLocaleString()}
            {netWorth < 0 && <span className="text-sm ml-1">(Negative)</span>}
          </p>
        </div>
        
        {/* Total Assets */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="mr-2 text-green-600" />
            <h2 className="text-lg font-semibold">Total Assets</h2>
          </div>
          <p className="text-2xl font-bold">${totalAssets.toLocaleString()}</p>
        </div>
        
        {/* Total Debts */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <TrendingDown className="mr-2 text-red-600" />
            <h2 className="text-lg font-semibold">Total Debts</h2>
          </div>
          <p className="text-2xl font-bold">${totalDebts.toLocaleString()}</p>
        </div>
        
        {/* Monthly Income */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Coins className="mr-2 text-green-600" />
            <h2 className="text-lg font-semibold">Monthly Income</h2>
          </div>
          <p className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</p>
        </div>
        
        {/* Monthly Expenses */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="mr-2 text-orange-600" />
            <h2 className="text-lg font-semibold">Monthly Expenses</h2>
          </div>
          <p className="text-2xl font-bold">${monthlyExpenses.toLocaleString()}</p>
        </div>
        
        {/* Debt-to-Income Ratio */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <PieChart className="mr-2 text-purple-600" />
            <h2 className="text-lg font-semibold">Debt-to-Income Ratio</h2>
          </div>
          <p className={`text-2xl font-bold ${debtToIncomeRatio <= 0.36 ? 'text-green-600' : 'text-amber-600'}`}>
            {(debtToIncomeRatio * 100).toFixed(1)}%
          </p>
        </div>
        
        {/* Savings Rate */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Calculator className="mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Savings Rate</h2>
          </div>
          <p className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
        
        {/* Months to 3X Goal */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Clock className="mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold">Months to 3X Goal</h2>
          </div>
          <p className="text-2xl font-bold">
            {isFinite(monthsTo3XGoal) ? monthsTo3XGoal : '∞'}
          </p>
        </div>
        
        {/* Liquid Assets */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Coins className="mr-2 text-cyan-600" />
            <h2 className="text-lg font-semibold">Liquid Assets</h2>
          </div>
          <p className="text-2xl font-bold">${liquidAssets.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Top Assets and Debts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Assets */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Top Assets</h2>
          {topAssets.length > 0 ? (
            <ul className="divide-y">
              {topAssets.map((asset, index) => (
                <li key={asset.id} className="py-2 flex justify-between">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-green-600 font-semibold">${asset.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-4 text-center">No assets added yet</p>
          )}
        </div>
        
        {/* Top Debts */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Top Debts</h2>
          {topDebts.length > 0 ? (
            <ul className="divide-y">
              {topDebts.map((debt, index) => (
                <li key={debt.id} className="py-2 flex justify-between">
                  <span className="font-medium">{debt.name}</span>
                  <span className="text-red-600 font-semibold">${debt.balance.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-4 text-center">No debts added yet</p>
          )}
        </div>
      </div>

      {/* Financial Health Indicators */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Financial Health Indicators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Debt-to-Income */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Debt-to-Income Ratio</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full ${
                  debtToIncomeRatio <= 0.28 ? 'bg-green-600' : 
                  debtToIncomeRatio <= 0.36 ? 'bg-yellow-500' : 
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min(debtToIncomeRatio * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm">
              {debtToIncomeRatio <= 0.28 ? 'Excellent' : 
               debtToIncomeRatio <= 0.36 ? 'Good' : 
               debtToIncomeRatio <= 0.43 ? 'Fair' : 
               'Needs Attention'}
            </p>
          </div>
          
          {/* Emergency Fund */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Emergency Fund</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full ${
                  (liquidAssets / monthlyExpenses) >= 6 ? 'bg-green-600' : 
                  (liquidAssets / monthlyExpenses) >= 3 ? 'bg-yellow-500' : 
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min((liquidAssets / monthlyExpenses / 6) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm">
              {(liquidAssets / monthlyExpenses).toFixed(1)} months of expenses
              {(liquidAssets / monthlyExpenses) < 3 && ' (aim for 3-6 months)'}
            </p>
          </div>
          
          {/* Savings Rate */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Savings Rate</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full ${
                  savingsRate >= 20 ? 'bg-green-600' : 
                  savingsRate >= 10 ? 'bg-yellow-500' : 
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min(savingsRate * 2, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm">
              {savingsRate >= 20 ? 'Excellent' : 
               savingsRate >= 10 ? 'Good' : 
               savingsRate >= 5 ? 'Fair' : 
               'Needs Attention'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
