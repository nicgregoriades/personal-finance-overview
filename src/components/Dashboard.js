import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Container, Grid, Typography, Box } from '@mui/material';
import { useFinance } from '../context/FinanceContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const {
    calculateMonthlyIncome,
    calculateBurnRate,
    calculateNetWorth,
    calculateThreeXAccount,
    assets,
    debts,
    expenses
  } = useFinance();

  const monthlyIncome = calculateMonthlyIncome();
  const burnRate = calculateBurnRate();
  const netWorth = calculateNetWorth();
  const threeXAccount = calculateThreeXAccount();

  // Prepare data for charts
  const assetData = assets.map(asset => ({
    name: asset.name,
    value: asset.value
  }));

  const debtData = debts.map(debt => ({
    name: debt.name,
    value: debt.amount
  }));

  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  const expenseData = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="h5">${monthlyIncome.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="h5">${burnRate.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader>
              <CardTitle>Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="h5">${netWorth.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader>
              <CardTitle>3X Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="h5">{threeXAccount.percentComplete.toFixed(1)}%</Typography>
              <Typography variant="body2">
                ${threeXAccount.currentAmount.toFixed(0)} / ${threeXAccount.targetAmount.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Debt Overview */}
        <Grid item xs={12}>
          <Card>
            <CardHeader>
              <CardTitle>Debt Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={debtData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
