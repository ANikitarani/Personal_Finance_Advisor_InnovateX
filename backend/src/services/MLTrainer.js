
const mongoose = require('mongoose');
const Expense = require('../models/expense');

// Predict Emergency (simple rule based on spending amount/category)
const predictEmergency = async (expense) => {
  const amount = parseFloat(expense.amount) || 0;
  if (expense.category === 'Emergency' || amount > 2000) {
    return 'Emergency';
  }
  return 'Normal';
};

// Load user data
const loadUserDataFromDB = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log('Invalid userId:', userId);
    return [];
  }
  const expenses = await Expense.find({ userId }).lean();
  return expenses;
};

// Helper: Convert a date string (YYYY-MM-DD) to a month key 'YYYY-MM'
const monthKeyFromDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Helper: build monthly category totals (by month key) from expenses
const buildMonthlyCategoryTotals = (expenses) => {
  const monthTotals = {};
  for (const exp of expenses) {
    const monthKey = monthKeyFromDate(exp.date) || 'unknown';
    monthTotals[monthKey] = monthTotals[monthKey] || {};
    monthTotals[monthKey][exp.category] = (monthTotals[monthKey][exp.category] || 0) + parseFloat(exp.amount);
  }
  return monthTotals;
};

// User Analytics + predictions
const getUserAnalytics = async (userId) => {
  const expenses = await loadUserDataFromDB(userId);

  // Compute monthly totals per category (current month only)
  const monthlyCategoryTotals = buildMonthlyCategoryTotals(expenses);
  const monthKeys = Object.keys(monthlyCategoryTotals).sort();
  const currentMonthKey = monthKeys.slice(-1)[0];
  const currentMonthTotals = monthlyCategoryTotals[currentMonthKey] || {};
  const totalThisMonth = Object.values(currentMonthTotals).reduce((sum, v) => sum + v, 0);

  // Determine top category share (e.g., Food is 35% of total spending)
  const categoryShares = Object.entries(currentMonthTotals).map(([category, amount]) => ({
    category,
    amount,
    share: totalThisMonth > 0 ? (amount / totalThisMonth) * 100 : 0,
  }));

  const topCategoryEntry = categoryShares.sort((a, b) => b.amount - a.amount)[0] || { category: null, share: 0, amount: 0 };

  // Emergency spending
  const emergencyExpenses = expenses.filter(exp => exp.category === 'Emergency');
  const emergencyTotal = emergencyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const stats = {
    total: expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
    totalThisMonth,
    topCategory: topCategoryEntry.category,
    topCategoryShare: topCategoryEntry.share,
    categoryShares,
    emergencyTotal,
    emergencyCount: emergencyExpenses.length,
  };

  return { stats, currentMonthKey };
};

// Personalized Recommendations
const generateRecommendations = async (userId) => {
  const { stats, currentMonthKey } = await getUserAnalytics(userId);

  const recs = [];

  // 1) Top category share this month (current-only analysis)
  if (stats.topCategory && stats.topCategoryShare > 0) {
    const pct = Math.min(100, Math.round(stats.topCategoryShare));
    if (pct > 25) {
      // Suggest a reduction target that scales with how dominant the top category is.
      const suggestedReduction = Math.min(30, Math.max(10, Math.round(pct / 2)));
      recs.push(
        ` You spent ${pct}% of this month’s expenses on ${stats.topCategory}. Consider reducing it by ${suggestedReduction}%.`
      );
    }
  }

  // 2) Emergency spending
  if (stats.emergencyTotal > 0) {
    const emergencyShare = stats.totalThisMonth ? (stats.emergencyTotal / stats.totalThisMonth) * 100 : 0;
    if (stats.emergencyCount > 1 || emergencyShare > 10) {
      recs.push(
        ` Emergency spending was high this month (₹${stats.emergencyTotal.toFixed(0)}). Maintain an emergency savings fund for unexpected expenses.`
      );
    }
  }


  return recs;
};

// Training stubs
const trainEmergencyClassifier = async () => {
  console.log(' Emergency model ready (dataset logic)');
  return true;
};

const trainCategoryClassifier = async () => {
  console.log('Category model ready');
  return true;
};

const loadData = async () => {
  console.log('📊 Dataset ready');
  return [];
};

module.exports = {
  trainEmergencyClassifier,
  trainCategoryClassifier,
  generateRecommendations,
  getUserAnalytics,
  predictEmergency,
  loadData
};
