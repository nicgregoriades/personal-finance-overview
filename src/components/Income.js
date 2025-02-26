import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, TextField, MenuItem, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useFinance } from '../context/FinanceContext';

const Income = () => {
  const { income, addIncome, updateIncome, deleteIncome, calculateMonthlyIncome } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    frequency: 'monthly'
  });

  const totalMonthlyIncome = calculateMonthlyIncome();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && currentIncome) {
      updateIncome({ ...currentIncome, ...formData });
      setEditMode(false);
      setCurrentIncome(null);
    } else {
      addIncome(formData);
    }
    setFormData({ source: '', amount: '', frequency: 'monthly' });
  };

  const handleEdit = (incomeItem) => {
    setEditMode(true);
    setCurrentIncome(incomeItem);
    setFormData({
      source: incomeItem.source,
      amount: incomeItem.amount,
      frequency: incomeItem.frequency
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentIncome(null);
    setFormData({ source: '', amount: '', frequency: 'monthly' });
  };

  const calculateMonthlyEquivalent = (amount, frequency) => {
    switch (frequency) {
      case 'monthly':
        return amount;
      case 'bi-weekly':
        return (amount * 26) / 12;
      case 'weekly':
        return (amount * 52) / 12;
      case 'annually':
        return amount / 12;
      case 'quarterly':
        return (amount * 4) / 12;
      default:
        return amount;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Income Management
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Total Monthly Income: ${totalMonthlyIncome.toFixed(2)}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editMode ? 'Edit Income Source' : 'Add Income Source'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Source"
                name="source"
                value={formData.source}
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
                <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                {editMode ? 'Update' : 'Add'}
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
          Income Sources
        </Typography>
        {income.length === 0 ? (
          <Typography>No income sources added yet.</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">Source</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">Amount</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">Frequency</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">Monthly Equivalent</Typography>
              </Grid>
            </Grid>
            {income.map((item) => (
              <Grid container spacing={2} key={item.id} sx={{ mt: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                <Grid item xs={3}>
                  <Typography>{item.source}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>${item.amount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>{item.frequency}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>${calculateMonthlyEquivalent(item.amount, item.frequency).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => handleEdit(item)} size="small">
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => deleteIncome(item.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Income;
