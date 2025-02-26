import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Box, TextField, Button } from '@mui/material';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const NetWorth = () => {
  const { assets, debts, calculateNetWorth } = useFinance();
  const [projectionYears, setProjectionYears] = useState(10);
  const [growthRate, setGrowthRate] = useState(7);
  const [savingsRate, setSavingsRate] = useState(15);
  const [monthlyIncome, setMonthlyIncome] = useState(6000);

  const netWorth = calculateNetWorth();
  const totalAssets = assets.reduce((total, asset) => total + asset.value, 0);
  const totalDebts = debts.reduce((total, debt) => total + debt.amount, 0);

  // Categorize assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = 0;
    }
    acc[asset.type] += asset.value;
    return acc;
  }, {});

  // Prepare data for asset/debt comparison chart
  const comparisonData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Debts', value: totalDebts },
    { name: 'Net Worth', value: netWorth }
  ];

  // Prepare data for asset composition chart
  const assetCompositionData = Object.keys(assetsByType).map(type => ({
    name: type,
    value: assetsByType[type]
  }));

  // Generate net worth projection data
  const generateProjectionData = () => {
    const data = [];
    
    // Start with current net worth
    let currentNetWorth = netWorth;
    let annualSavings = (monthlyIncome * (savingsRate / 100)) * 12;
    
    for (let year = 0; year <= projectionYears; year++) {
      data.push({
        year,
        netWorth: Math.round(currentNetWorth)
      });
      
      // Calculate next year's net worth with growth and additional savings
      currentNetWorth = currentNetWorth * (1 + growthRate / 100) + annualSavings;
    }
    
    return data;
  };

  const projectionData = generateProjectionData();

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#8884D8', '#82ca9d'];
  
  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format large numbers
  const formatLargeNumber = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Net Worth Tracker
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Net Worth
            </Typography>
            <Typography variant="h3" color={netWorth >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(netWorth)}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body1">Total Assets:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">{formatCurrency(totalAssets)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Total Debts:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" color="error.main">{formatCurrency(totalDebts)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Net Worth Projection Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Projection Years"
                  type="number"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(parseInt(e.target.value) || 1)}
                  fullWidth
                  inputProps={{ min: 1, max: 40 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Annual Growth Rate (%)"
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                  fullWidth
                  inputProps={{ min: 0, max: 20, step: 0.1 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Monthly Income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  fullWidth
                  inputProps={{ min: 0, step: 100 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Savings Rate (%)"
                  type="number"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(parseFloat(e.target.value) || 0)}
                  fullWidth
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={() => generateProjectionData()}
                  fullWidth
                >
                  Update Projection
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Net Worth Projection
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis tickFormatter={formatLargeNumber} />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Net Worth"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Net Worth"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Assets vs Debts
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatLargeNumber} />
                  <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                  <Legend />
                  <Bar dataKey="value" name="Amount">
                    {comparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#0088FE' : index === 1 ? '#FF8042' : '#00C49F'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Asset Composition
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assetCompositionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={formatLargeNumber} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                  <Legend />
                  <Bar dataKey="value" name="Value">
                    {assetCompositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NetWorth;
