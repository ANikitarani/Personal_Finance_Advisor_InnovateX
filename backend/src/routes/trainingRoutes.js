const express = require('express');
const { trainEmergencyClassifier, trainCategoryClassifier, generateRecommendations, getUserAnalytics } = require('../services/MLTrainer');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Train model endpoints (stubbed ready)
router.post('/train-emergency', protect, async (req, res) => {
  try {
    const model = await trainEmergencyClassifier();
    res.json({ message: 'Emergency Classifier ready! (Rule-based ML)' });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/train-category', protect, async (req, res) => {
  try {
    const model = await trainCategoryClassifier();
    res.json({ message: 'Category Classifier ready! (Rule-based ML)' });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Recommendations for real user data
router.get('/recommendations/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const recs = await generateRecommendations(userId);
    res.json({ recommendations: recs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics & predictions
router.get('/analytics/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await getUserAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
