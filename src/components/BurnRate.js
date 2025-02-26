import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, TextField, MenuItem, IconButton, Chip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const BurnRate = () => {
  const { expenses, calculateMonthlyIncome, calculateBurnRate, addExpense, updateExpense, deleteExpense } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    amount: '',
    frequency: 'monthly',
    essential: false
  });

  const monthlyIncome = calculateMonthlyIncome();
  const burnRate = calculateBurnRate();
  const monthlySavings = monthlyIncome - burnRate;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;

  // Categorize expenses
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    if (expense.frequency === 'monthly') {
      acc[expense.category] += expense.amount;
    } else if (expense.frequency === 'annually') {
      acc[expense.category] += expense.amount / 12;
    } else if (expense.frequency === 'weekly') {
      acc[expense.category] += expense.amount * 4.33;
    }
    return acc;
  }, {});

  // Prepare data for charts
  const chartData = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category]
  }));

  // Prepare essential vs non-essential data
  const essentialExpenses = expenses
    .filter(expense => expense.essential)
    .reduce((total, expense) => {
      if (expense.frequency === 'monthly') {
        return total + expense.amount;
      } else if (expense.frequency === 'annually') {
        return total + expense.amount / 12;
      } else if (expense.frequency === 'weekly') {
        return total + expense.amount * 4.33;
      }
      return total;
    }, 0);

  const nonEssentialExpenses = burnRate - essentialExpenses;

  const essentialVsNonEssentialData = [
    { name: 'Essential', value: essentialExpenses },
    { name: 'Non-Essential', value: nonEssentialExpenses }
  ];

  const CATEGORY_COLORS = {
    Housing: '#0088FE',
    Transportation: '#00C49F',
    Food: '#FFBB28',
    Entertainment: '#FF8042',
    Shopping: '#8884D8',
    Healthcare: '#82ca9d',
    Personal: '#ffc658',
    Utilities: '#8dd1e1',
    Insurance: '#a4de6c',
    Debt: '#d0ed57',
    Other: '#83a6ed'
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  const ESSENTIAL_COLORS = ['#00C49F', '#FF8042'];

  const expenseCategories = [
    'Housing',
    'Transportation',
    'Food',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Personal',
    'Utilities',
    'Insurance',
    'Debt',
    'Other'
  ];

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' 
        ? parseFloat(value) || '' 
        : name === 'essential' 
          ? checked 
          : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && currentExpense) {
      updateExpense({ ...currentExpense, ...formData });
      setEditMode(false);
      setCurrentExpense(null);
    } else {
      addExpense(formData);
    }
    setFormData({
      category: '',
      name: '',
      amount: '',
      frequency: 'monthly',
      essential: false
    });
  };

  const handleEdit = (expense) => {
    setEditMode(true);
    setCurrentExpense(expense);
    setFormData({
      category: expense.category,
      name: expense.name,
      amount: expense.amount,
      frequency: expense.frequency,
      essential: expense.essential
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentExpense(null);
    setFormData({
      category: '',
      name: '',
      amount: '',
      frequency: 'monthly',
      essential: false
    });
  };

  // Helper to format as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Monthly Expenses & Burn Rate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">Income:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">{formatCurrency(monthlyIncome)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Expenses:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" color="error">{formatCurrency(burnRate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Savings:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" color={monthlySavings > 0 ? 'success.main' : 'error'}>
                  {formatCurrency(monthlySavings)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Savings Rate:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" color={savingsRate > 0 ? 'success.main' : 'error'}>
                  {savingsRate.toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Essential vs Non-Essential
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={essentialVsNonEssentialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {essentialVsNonEssentialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ESSENTIAL_COLORS[index % ESSENTIAL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expense Categories
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={CATEGORY_COLORS[entry.name] || COLORS[0]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {editMode ? 'Edit Expense' : 'Add New Expense'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    fullWidth
                    required
                  >
                    {expenseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Expense Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleFormChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Essential"
                    name="essential"
                    value={formData.essential ? 'yes' : 'no'}
                    onChange={(e) => setFormData({
                      ...formData,
                      essential: e.target.value === 'yes'
                    })}
                    fullWidth
                    required
                  >
                    <MenuItem value="yes">Yes (Need)</MenuItem>
                    <MenuItem value="no">No (Want)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                    {editMode ? 'Update Expense' : 'Add Expense'}
                  </Button>
                  {editMode && (
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Expenses
            </Typography>
            {expenses.length === 0 ? (
              <Typography>No expenses added yet.</Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight="bold">Category/Name</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Amount</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Frequency</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight="bold">Type</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Actions</Typography>
