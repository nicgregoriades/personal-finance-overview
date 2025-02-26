import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, TextField, MenuItem, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const Debts = () => {
  const { debts, addDebt, updateDebt, deleteDebt } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [currentDebt, setCurrentDebt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minimumPayment: '',
    term: '',
    revolving: false
  });

  const totalDebt = debts.reduce((total, debt) => total + debt.amount, 0);
  const monthlyPayments = debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  
  // Sort debts by interest rate for debt payoff strategies
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  
  // Prepare data for visualization
  const chartData = debts.map(debt => ({
    name: debt.name,
    amount: debt.amount,
    interestRate: debt.interestRate * 100
  }));

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884D8'];

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'revolving') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: ['amount', 'interestRate', 'minimumPayment', 'term'].includes(name) 
          ? parseFloat(value) || '' 
          : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && currentDebt) {
      updateDebt({ ...currentDebt, ...formData });
      setEditMode(false);
      setCurrentDebt(null);
    } else {
      addDebt(formData);
    }
    setFormData({
      name: '',
      amount: '',
      interestRate: '',
      minimumPayment: '',
      term: '',
      revolving: false
    });
  };

  const handleEdit = (debt) => {
    setEditMode(true);
    setCurrentDebt(debt);
    setFormData({
      name: debt.name,
      amount: debt.amount,
      interestRate: debt.interestRate,
      minimumPayment: debt.minimumPayment,
      term: debt.term || '',
      revolving: debt.revolving || false
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentDebt(null);
    setFormData({
      name: '',
      amount: '',
      interestRate: '',
      minimumPayment: '',
      term: '',
      revolving: false
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
        Debt Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Debt Summary
            </Typography>
            <Typography variant="body1">
              Total Debt: {formatCurrency(totalDebt)}
            </Typography>
            <Typography variant="body1">
              Monthly Payments: {formatCurrency(monthlyPayments)}
            </Typography>
            <Typography variant="body1">
              Debt to Income: {((monthlyPayments / 5000) * 100).toFixed(1)}%
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Debt Payoff Strategy
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Avalanche Method (Highest Interest First)
            </Typography>
            <Box sx={{ mt: 1 }}>
              {sortedDebts.map((debt, index) => (
                <Typography key={debt.id} sx={{ mb: 1 }}>
                  {index + 1}. {debt.name} ({(debt.interestRate * 100).toFixed(1)}%)
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Debt Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
                  <Tooltip formatter={(value, name) => [
                    name === 'amount' ? formatCurrency(value) : `${value.toFixed(2)}%`,
                    name === 'amount' ? 'Balance' : 'Interest Rate'
                  ]} />
                  <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Balance">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="interestRate" fill="#FF8042" name="Interest Rate" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editMode ? 'Edit Debt' : 'Add New Debt'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Debt Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Current Balance"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Interest Rate (%)"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Minimum Monthly Payment"
                    name="minimumPayment"
                    type="number"
                    value={formData.minimumPayment}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Term (Years)"
                    name="term"
                    type="number"
                    value={formData.term}
                    onChange={handleFormChange}
                    fullWidth
                    disabled={formData.revolving}
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.revolving}
                        onChange={handleFormChange}
                        name="revolving"
                      />
                    }
                    label="Revolving Credit (e.g., Credit Card)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                    {editMode ? 'Update Debt' : 'Add Debt'}
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
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Debts
            </Typography>
            {debts.length === 0 ? (
              <Typography>No debts added yet.</Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Balance</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Interest Rate</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Monthly Payment</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Term/Type</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Actions</Typography>
                  </Grid>
                </Grid>
                {debts.map((debt) => (
                  <Grid container spacing={2} key={debt.id} sx={{ mt: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                    <Grid item xs={2}>
                      <Typography>{debt.name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>{formatCurrency(debt.amount)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>{(debt.interestRate * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>{formatCurrency(debt.minimumPayment)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>
                        {debt.revolving ? 'Revolving' : `${debt.term} years`}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => handleEdit(debt)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteDebt(debt.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Debts;
