import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, TextField, MenuItem, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const Assets = () => {
  const { assets, addAsset, updateAsset, deleteAsset } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    type: 'liquid',
    interestRate: '',
    appreciationRate: ''
  });

  const totalAssets = assets.reduce((total, asset) => total + asset.value, 0);
  
  // Prepare data for charts
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = 0;
    }
    acc[asset.type] += asset.value;
    return acc;
  }, {});

  const chartData = Object.keys(assetsByType).map(type => ({
    name: type,
    value: assetsByType[type]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['value', 'interestRate', 'appreciationRate'].includes(name) ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && currentAsset) {
      updateAsset({ ...currentAsset, ...formData });
      setEditMode(false);
      setCurrentAsset(null);
    } else {
      addAsset(formData);
    }
    setFormData({ name: '', value: '', type: 'liquid', interestRate: '', appreciationRate: '' });
  };

  const handleEdit = (asset) => {
    setEditMode(true);
    setCurrentAsset(asset);
    setFormData({
      name: asset.name,
      value: asset.value,
      type: asset.type,
      interestRate: asset.interestRate || '',
      appreciationRate: asset.appreciationRate || ''
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentAsset(null);
    setFormData({ name: '', value: '', type: 'liquid', interestRate: '', appreciationRate: '' });
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
        Asset Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Total Assets: {formatCurrency(totalAssets)}
            </Typography>
            
            <Box sx={{ height: 300, mt: 2 }}>
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
                    {chartData.map((entry, index) => (
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
              Your Assets
            </Typography>
            {assets.length === 0 ? (
              <Typography>No assets added yet.</Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight="bold">Value</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Type</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Rate</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" fontWeight="bold">Actions</Typography>
                  </Grid>
                </Grid>
                {assets.map((asset) => (
                  <Grid container spacing={2} key={asset.id} sx={{ mt: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                    <Grid item xs={3}>
                      <Typography>{asset.name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>{formatCurrency(asset.value)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>{asset.type}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>
                        {asset.interestRate ? 
                          `${(asset.interestRate * 100).toFixed(2)}%` : 
                          asset.appreciationRate ? 
                          `${(asset.appreciationRate * 100).toFixed(2)}%` : 
                          'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() =>
