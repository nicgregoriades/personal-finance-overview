import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Box, TextField, Slider, Button } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const AllocationCalculator = () => {
  const { calculateMonthlyIncome, calculateBurnRate, calculateAllocation } = useFinance();
  
  const monthlyIncome = calculateMonthlyIncome();
  const burnRate = calculateBurnRate();
  const monthlySavings = monthlyIncome - burnRate;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  const recommendedAllocation = calculateAllocation();
  
  const [income, setIncome] = useState(monthlyIncome);
  const [needs, setNeeds] = useState(recommendedAllocation.needs);
  const [wants, setWants] = useState(recommendedAllocation.wants);
  const [savings, setSavings] = useState(recommendedAllocation.savings);
  const [customMode, setCustomMode] = useState(false);
  
  // Reset allocation percentages when income changes
  useEffect(() => {
    if (!customMode) {
      setNeeds(recommendedAllocation.needs);
      setWants(recommendedAllocation.wants);
      setSavings(recommendedAllocation.savings);
    }
  }, [income, customMode, recommendedAllocation]);
  
  // Ensure percentages always sum to 100%
  const adjustPercentages = (newValue, setter, category) => {
    setter(newValue);
    
    if (category === 'needs') {
      const remaining = 100 - newValue;
      const ratio = wants / (wants + savings);
      setWants(Math.round(remaining * ratio));
      setSavings(100 - newValue - Math.round(remaining * ratio));
    } else if (category === 'wants') {
      const remaining = 100 - newValue;
      const ratio = needs / (needs + savings);
      setNeeds(Math.round(remaining * ratio));
      setSavings(100 - Math.round(remaining * ratio) - newValue);
    } else if (category === 'savings') {
      const remaining = 100 - newValue;
      const ratio = needs / (needs + wants);
      setNeeds(Math.round(remaining * ratio));
      setWants(100 - Math.round(remaining * ratio) - newValue);
    }
  };
  
  // Calculate dollar amounts based on percentages
  const needsAmount = (income * needs) / 100;
  const wantsAmount = (income * wants) / 100;
  const savingsAmount = (income * savings) / 100;
  
  // Data for the allocation pie chart
  const allocationData = [
    { name: 'Needs', value: needsAmount },
    { name: 'Wants', value: wantsAmount },
    { name: 'Savings', value: savingsAmount }
  ];
  
  // Data for current spending pie chart
  const actualNeedsAmount = burnRate * 0.6; // Estimation
  const actualWantsAmount = burnRate * 0.4; // Estimation
  
  const currentAllocationData = [
    { name: 'Needs', value: actualNeedsAmount },
    { name: 'Wants', value: actualWantsAmount },
    { name: 'Savings', value: monthlySavings }
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#00C49F'];
  
  // Format currency helper
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
        Budget Allocation Calculator
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Income & Allocation Settings
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Monthly Income
              </Typography>
              <TextField
                type="number"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                inputProps={{ min: 0, step: 100 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant={customMode ? "outlined" : "contained"} 
                color="primary"
                onClick={() => setCustomMode(false)}
                sx={{ mr: 1 }}
              >
                50/30/20 Rule
              </Button>
              <Button 
                variant={customMode ? "contained" : "outlined"} 
                color="primary"
                onClick={() => setCustomMode(true)}
              >
                Custom Allocation
              </Button>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Needs: {needs}% ({formatCurrency(needsAmount)})
              </Typography>
              <Slider
                value={needs}
                onChange={(_, value) => adjustPercentages(value, setNeeds, 'needs')}
                disabled={!customMode}
                aria-labelledby="needs-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
                sx={{ color: COLORS[0] }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Wants: {wants}% ({formatCurrency(wantsAmount)})
              </Typography>
              <Slider
                value={wants}
                onChange={(_, value) => adjustPercentages(value, setWants, 'wants')}
                disabled={!customMode}
                aria-labelledby="wants-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
                sx={{ color: COLORS[1] }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Savings: {savings}% ({formatCurrency(savingsAmount)})
              </Typography>
              <Slider
                value={savings}
                onChange={(_, value) => adjustPercentages(value, setSavings, 'savings')}
                disabled={!customMode}
                aria-labelledby="savings-slider"
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={100}
                sx={{ color: COLORS[2] }}
              />
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Allocation Guidelines
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Needs (50%)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Essential expenses that you can't avoid:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Housing (rent/mortgage)</li>
              <li>Utilities</li>
              <li>Groceries</li>
              <li>Transportation</li>
              <li>Insurance</li>
              <li>Minimum debt payments</li>
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Wants (30%)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Non-essential expenses that improve your life:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Dining out</li>
              <li>Entertainment</li>
              <li>Shopping</li>
              <li>Hobbies</li>
              <li>Subscriptions</li>
              <li>Travel</li>
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Savings (20%)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Future financial security:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Emergency fund</li>
              <li>Retirement contributions</li>
              <li>Investments</li>
              <li>Extra debt payments</li>
              <li>Major future purchases</li>
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Allocation
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              Your Current Allocation
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {currentAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Current Savings Rate: {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color={savingsRate >= 15 ? 'success.main' : 'error.main'}>
                {savingsRate >= 15 
                  ? 'Great job! You\'re saving more than the recommended minimum.'
                  : 'Consider reducing expenses to increase your savings rate to at least 15%.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllocationCalculator;
