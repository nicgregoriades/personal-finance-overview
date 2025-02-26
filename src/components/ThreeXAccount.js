import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Box, TextField, Button, LinearProgress } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const ThreeXAccount = () => {
  const { calculateBurnRate, calculateThreeXAccount, assets } = useFinance();
  const threeXAccount = calculateThreeXAccount();
  const monthlyExpenses = calculateBurnRate();
  
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(7);
  
  // Calculate months until 3X account is fully funded
  const calculateTimeToTarget = () => {
    if (threeXAccount.currentAmount >= threeXAccount.targetAmount) {
      return 0; // Already reached target
    }
    
    let currentAmount = threeXAccount.currentAmount;
    const targetAmount = threeXAccount.targetAmount;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    let months = 0;
    
    while (currentAmount < targetAmount && months < 600) { // Cap at 50 years
      currentAmount = currentAmount * (1 + monthlyReturn) + monthlySavings;
      months++;
    }
    
    return months;
  };
  
  const monthsToTarget = calculateTimeToTarget();
  const yearsToTarget = Math.floor(monthsToTarget / 12);
  const remainingMonths = monthsToTarget % 12;
  
  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    let currentAmount = threeXAccount.currentAmount;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    
    // Cap projection at 36 months (3 years) or reaching target, whichever comes first
    const maxMonths = Math.min(36, monthsToTarget);
    
    for (let month = 0; month <= maxMonths; month++) {
      data.push({
        month,
        amount: Math.round(currentAmount),
        target: Math.round(threeXAccount.targetAmount)
      });
      
      currentAmount = currentAmount * (1 + monthlyReturn) + monthlySavings;
    }
    
    return data;
  };
  
  const projectionData = generateProjectionData();
  
  // Generate liquid assets list
  const liquidAssets = assets.filter(asset => 
    asset.type === 'liquid' || asset.type === 'investment'
  );
  
  // Format as currency
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
        3X Account Tracker
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your 3X Account Status
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Monthly Expenses: {formatCurrency(monthlyExpenses)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Annual Expenses: {formatCurrency(monthlyExpenses * 12)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                3X Target (3 years of expenses): {formatCurrency(threeXAccount.targetAmount)}
              </Typography>
              
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Current Progress: {formatCurrency(threeXAccount.currentAmount)} / {formatCurrency(threeXAccount.targetAmount)} ({threeXAccount.percentComplete.toFixed(1)}%)
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(threeXAccount.percentComplete, 100)} 
                    color={threeXAccount.percentComplete >= 100 ? "success" : "primary"}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {threeXAccount.percentComplete.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" color={threeXAccount.percentComplete >= 100 ? "success.main" : "text.primary"} sx={{ mt: 2 }}>
                {threeXAccount.percentComplete >= 100 
                  ? "Congratulations! Your 3X account is fully funded."
                  : `Shortfall: ${formatCurrency(threeXAccount.shortfall)}`
                }
              </Typography>
