const express = require("express");
const { addExpense, classifyCategory, getSummary, getFilteredExpenses, updateExpense, deleteExpense, getDeletedExpenses } = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/add", protect, addExpense);
router.get("/summary", protect, getSummary);
router.get("/", protect, getFilteredExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.post("/classify-category", protect, classifyCategory);
router.get("/deleted", protect, getDeletedExpenses);
module.exports = router;

