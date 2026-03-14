const categoryKeywords = {
  'Emergency': [
    'emergency', 'medical emergency', 'hospital', 'doctor emergency', 'accident', 
    'family function', 'wedding', 'funeral', 'marriage', 'family emergency',
    'urgent', 'surgery', 'operation', 'icu', 'ambulance', 'broken', 'repair urgent',
    'family medical', 'child sick', 'parent hospital'
  ],
  'Food': ['food', 'lunch', 'dinner', 'breakfast', 'meal', 'restaurant', 'cafe', 'grocery', 'groceries'],
  'Transport': ['transport', 'taxi', 'uber', 'bus', 'train', 'fuel', 'gas', 'petrol', 'travel'],
  'Entertainment': ['entertainment', 'movie', 'cinema', 'game', 'concert', 'show', 'ticket'],
  'Utilities': ['utilities', 'electricity', 'water', 'internet', 'phone', 'bill'],
  'Shopping': ['shopping', 'clothes', 'shoes', 'mall', 'store', 'purchase'],
  'Health': ['health', 'medicine', 'doctor', 'pharmacy', 'medical', 'clinic'],
  'Education': ['education', 'book', 'course', 'tuition', 'school', 'college']
};

/**
 * Rule-based ML-like category classifier.
 * Matches description against keywords, prioritizes Emergency.
 * Returns best category match or 'Other'.
 */
const classifyCategory = (description = '') => {
  if (!description) return 'Other';

  const lowerDesc = description.toLowerCase();
  
  // Priority: Emergency first
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  return 'Other';
};

/**
 * Auto-set isEmergency if needed (for future use).
 */
const shouldBeEmergency = (category, description) => {
  return category === 'Emergency' || classifyCategory(description) === 'Emergency';
};

module.exports = {
  classifyCategory,
  shouldBeEmergency,
  categoryKeywords
};
