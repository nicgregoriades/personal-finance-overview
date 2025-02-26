import React, { createContext, useState, useContext } from 'react';

// Create the context
export const FinanceContext = createContext();

// Create a custom hook for using the context
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Sample data for all financial categories
  const [income, setIncome] = useState([
    { id: 1, source: 'Salary', amount: 5000, frequency: 'monthly' },
    { id: 2, source: 'Side Gig', amount: 1000, frequency: 'monthly' },
    { id: 3, source: 'Dividends', amount: 500, frequency: 'quarterly' }
  ]);

  const [assets, setAssets] = useState([
    { id: 1, name: 'Checking Account', value: 10000, type: 'liquid', interestRate: 0.01 },
    { id: 2, name: 'Savings Account', value: 25000, type: 'liquid', interestRate: 0.03 },
    { id: 3, name: '401(k)', value: 120000, type: 'retirement', interestRate: 0.07 },
    { id: 4, name: 'Roth IRA', value: 45000, type: 'retirement', interestRate: 0.07 },
    { id: 5, name: 'Brokerage Account', value: 30000, type: 'investment', interestRate: 0.08 },
    { id: 6, name: 'Home', value: 350000, type: 'property', appreciationRate: 0.03 }
  ]);

  const [debts, setDebts] = useState([
    { id: 1, name: 'Mortgage', amount: 280000, interestRate: 0.0375, minimumPayment: 1500, term: 30 },
    { id: 2, name: 'Car Loan', amount: 15000, interestRate: 0.045, minimumPayment: 350, term: 5 },
    { id: 3, name: 'Student Loan', amount: 25000, interestRate: 0.05, minimumPayment: 300, term: 10 },
    { id: 4, name: 'Credit Card', amount: 2000, interestRate: 0.185, minimumPayment: 100, revolving: true }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Housing', name: 'Mortgage', amount: 1500, frequency: 'monthly', essential: true },
    { id: 2, category: 'Housing', name: 'Utilities', amount: 300, frequency: 'monthly', essential: true },
    { id: 3, category: 'Transportation', name: 'Car Payment', amount: 350, frequency: 'monthly', essential: true },
    { id: 4, category: 'Transportation', name: 'Gas', amount: 200, frequency: 'monthly', essential: true },
    { id: 5, category: 'Food', name: 'Groceries', amount: 600, frequency: 'monthly', essential: true },
    { id: 6, category: 'Food', name: 'Dining Out', amount: 400, frequency: 'monthly', essential: false },
    { id: 7, category: 'Entertainment', name: 'Streaming Services', amount: 50, frequency: 'monthly', essential: false },
    { id: 8, category: 'Shopping', name: 'Clothing', amount: 200, frequency: 'monthly', essential: false },
    { id: 9, category: 'Healthcare', name: 'Insurance', amount: 300, frequency: 'monthly', essential: true },
    { id: 10, category: 'Personal', name: 'Gym', amount: 50, frequency: 'monthly', essential: false }
  ]);

  // Calculate monthly income
  const calculateMonthlyIncome = () => {
    return income.reduce((total, source) => {
      switch (source.frequency) {
        case 'monthly':
          return total + source.amount;
        case 'bi-weekly':
          return total + (source.amount * 26 / 12);
        case 'weekly':
          return total + (source.amount * 52 / 12);
        case 'annually':
          return total + (source.amount / 12);
        case 'quarterly':
          return total + (source.amount * 4 / 12);
        default:
          return total;
      }
    }, 0);
  };

  // Calculate monthly expenses (burn rate)
  const calculateBurnRate = () => {
    return expenses.reduce((total, expense) => {
      if (expense.frequency === 'monthly') {
        return total + expense.amount;
      } else if (expense.frequency === 'annually') {
        return total + (expense.amount / 12);
      } else if (expense.frequency === 'weekly') {
        return total + (expense.amount * 4.33);
      } else {
        return total;
      }
    }, 0);
  };

  // Calculate net worth
  const calculateNetWorth = () => {
    const totalAssets = assets.reduce((total, asset) => total + asset.value, 0);
    const totalDebts = debts.reduce((total, debt) => total + debt.amount, 0);
    return totalAssets - totalDebts;
  };

  // Calculate months until financial freedom (25x annual expenses)
  const calculateThreeXAccount = () => {
    const monthlyExpenses = calculateBurnRate();
    const annualExpenses = monthlyExpenses * 12;
    const targetAmount = annualExpenses * 3;
    
    const liquidAssets = assets
      .filter(asset => asset.type === 'liquid' || asset.type === 'investment')
      .reduce((total, asset) => total + asset.value, 0);
    
    return {
      currentAmount: liquidAssets,
      targetAmount: targetAmount,
      percentComplete: (liquidAssets / targetAmount) * 100,
      shortfall: Math.max(0, targetAmount - liquidAssets)
    };
  };

  // Calculate recommended allocation percentages
  const calculateAllocation = () => {
    const monthlyIncome = calculateMonthlyIncome();
    const burnRate = calculateBurnRate();
    const savingsRate = (monthlyIncome - burnRate) / monthlyIncome * 100;
    
    // Basic recommended allocation (simplified version)
    return {
      needs: 50, // Recommend 50% for needs (housing, food, transportation)
      wants: 30, // Recommend 30% for wants (entertainment, dining out)
      savings: 20, // Recommend 20% for savings and debt repayment
      currentSavingsRate: savingsRate, // Current savings rate
    };
  };

  // Functions to add/edit/delete items
  const addIncome = (newIncome) => {
    setIncome([...income, { id: Date.now(), ...newIncome }]);
  };

  const updateIncome = (updatedIncome) => {
    setIncome(income.map(item => item.id === updatedIncome.id ? updatedIncome : item));
  };

  const deleteIncome = (id) => {
    setIncome(income.filter(item => item.id !== id));
  };

  const addAsset = (newAsset) => {
    setAssets([...assets, { id: Date.now(), ...newAsset }]);
  };

  const updateAsset = (updatedAsset) => {
    setAssets(assets.map(item => item.id === updatedAsset.id ? updatedAsset : item));
  };

  const deleteAsset = (id) => {
    setAssets(assets.filter(item => item.id !== id));
  };

  const addDebt = (newDebt) => {
    setDebts([...debts, { id: Date.now(), ...newDebt }]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts(debts.map(item => item.id === updatedDebt.id ? updatedDebt : item));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(item => item.id !== id));
  };

  const addExpense = (newExpense) => {
    setExpenses([...expenses, { id: Date.now(), ...newExpense }]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(item => item.id === updatedExpense.id ? updatedExpense : item));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        income,
        assets,
        debts,
        expenses,
        addIncome,
        updateIncome,
        deleteIncome,
        addAsset,
        updateAsset,
        deleteAsset,
        addDebt,
        updateDebt,
        deleteDebt,
        addExpense,
        updateExpense,
        deleteExpense,
        calculateMonthlyIncome,
        calculateBurnRate,
        calculateNetWorth,
        calculateThreeXAccount,
        calculateAllocation
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceProvider;
