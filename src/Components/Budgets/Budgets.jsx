import React, { useState, useEffect } from 'react';
import { addBudget, fetchBudgets } from '../api Service/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
    recurringType: 'monthly',
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await fetchBudgets(localStorage.getItem('id'));
      if (response && Array.isArray(response.budgets)) {
        setBudgets(response.budgets);
      } else {
        setBudgets([]);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      alert('Failed to load budgets. Please try again.');
    }
  };

  const handleSaveBudget = async () => {
    const { category, amount, startDate, endDate, recurringType } = currentBudget;

    if (!category || !amount || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid budget amount.');
      return;
    }

    const budgetData = {
      userId: localStorage.getItem('id'),
      category,
      amount: parsedAmount,
      startDate,
      endDate,
      recurringType,
    };

    try {
      const token = localStorage.getItem('token');
      const newBudget = await addBudget(token, budgetData);

      if (newBudget && typeof newBudget === 'object') {
        setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
        window.location.reload(); // Reload the window after successful addition
      } else {
        throw new Error('Invalid budget data returned');
      }

      alert('Budget saved successfully!');
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save the budget. Please try again.');
    }
  };

  const resetForm = () => {
    setCurrentBudget({
      category: '',
      amount: '',
      startDate: '',
      endDate: '',
      recurringType: 'monthly',
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getBudgetStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) return 'Pending';
    if (currentDate > end) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Expired':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
            Budget Manager
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '0.7rem' }} />}
            onClick={() => setIsModalOpen(true)}
            sx={{ borderRadius: 1, fontSize: '0.7rem', py: 0.5 }}
          >
            Add Budget
          </Button>
        </Stack>
      </motion.div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '0.8rem' }}>Add New Budget</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Category"
              fullWidth
              value={currentBudget.category}
              onChange={(e) => setCurrentBudget({ ...currentBudget, category: e.target.value })}
              InputProps={{
                startAdornment: <CategoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.8rem' }} />,
              }}
              sx={{ '& .MuiInputLabel-root': { fontSize: '0.7rem' }, '& .MuiInputBase-input': { fontSize: '0.7rem' } }}
            />
            <TextField
              label="Budget Amount (RWF)"
              type="number"
              fullWidth
              value={currentBudget.amount}
              onChange={(e) => setCurrentBudget({ ...currentBudget, amount: e.target.value })}
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.8rem' }} />,
              }}
              sx={{ '& .MuiInputLabel-root': { fontSize: '0.7rem' }, '& .MuiInputBase-input': { fontSize: '0.7rem' } }}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={currentBudget.startDate}
              onChange={(e) => setCurrentBudget({ ...currentBudget, startDate: e.target.value })}
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.8rem' }} />,
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { fontSize: '0.7rem' }, '& .MuiInputBase-input': { fontSize: '0.7rem' } }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={currentBudget.endDate}
              onChange={(e) => setCurrentBudget({ ...currentBudget, endDate: e.target.value })}
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '0.8rem' }} />,
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { fontSize: '0.7rem' }, '& .MuiInputBase-input': { fontSize: '0.7rem' } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: '0.7rem' }}>Recurring Type</InputLabel>
              <Select
                value={currentBudget.recurringType}
                label="Recurring Type"
                onChange={(e) => setCurrentBudget({ ...currentBudget, recurringType: e.target.value })}
                sx={{ fontSize: '0.7rem' }}
              >
                <MenuItem value="weekly" sx={{ fontSize: '0.7rem' }}>Weekly</MenuItem>
                <MenuItem value="monthly" sx={{ fontSize: '0.7rem' }}>Monthly</MenuItem>
                <MenuItem value="yearly" sx={{ fontSize: '0.7rem' }}>Yearly</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              resetForm();
              setIsModalOpen(false);
            }}
            sx={{ fontSize: '0.7rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveBudget}
            sx={{ fontSize: '0.7rem' }}
          >
            Save Budget
          </Button>
        </DialogActions>
      </Dialog>

      <motion.div layout>
        <Typography sx={{ mb: 1, fontSize: '0.8rem' }}>
          All Budgets
        </Typography>
        <Grid container spacing={2}>
          <AnimatePresence>
            {budgets.length > 0 ? (
              budgets.map((budget, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        height: '100%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 'medium' }}>
                            {budget.category}
                          </Typography>
                          <Chip
                            label={getBudgetStatus(budget.startDate, budget.endDate)}
                            color={getStatusColor(getBudgetStatus(budget.startDate, budget.endDate))}
                            size="small"
                            sx={{ fontSize: '0.6rem', height: '16px' }}
                          />
                        </Stack>
                        <Typography sx={{ fontSize: '0.8rem', color: 'primary.main' }}>
                          RWF {budget.amount.toLocaleString()}
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                            {budget.recurringType.charAt(0).toUpperCase() + budget.recurringType.slice(1)}
                          </Typography>
                          <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <EditIcon sx={{ fontSize: '0.8rem' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center' }}>
                  No budgets added yet.
                </Typography>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Budgets;