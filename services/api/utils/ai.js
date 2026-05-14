// AI utility functions for property scoring and recommendations

/**
 * Calculate property listing score based on various factors
 * @param {Object} property - Property data
 * @returns {Number} Score between 0-100
 */
exports.propertyScore = async (property) => {
  // In a real implementation, this would use AI models to calculate scores
  // For now, we'll use a weighted algorithm

  let score = 0;
  const weights = {
    location: 0.25,
    price: 0.20,
    size: 0.15,
    bedrooms: 0.10,
    bathrooms: 0.10,
    amenities: 0.10,
    condition: 0.05,
    marketTrends: 0.05
  };

  // Location score (based on city/region desirability)
  const locationScores = {
    'accra': 95,
    'kumasi': 85,
    'cape coast': 80,
    'tema': 75,
    'east legon': 100,
    'airport residential area': 98,
    'cantonments': 95,
    'labadi': 90
  };

  const city = property.address?.city?.toLowerCase() || '';
  const locationScore = locationScores[city] || 50;
  score += locationScore * weights.location;

  // Price score (lower prices get higher scores, but capped)
  if (property.price) {
    // Assuming reasonable price range for properties
    const maxPrice = 1000000; // 1 million GHS
    const priceScore = Math.max(0, 100 - (property.price / maxPrice) * 100);
    score += priceScore * weights.price;
  }

  // Size score (larger properties get higher scores)
  if (property.area) {
    // Assuming reasonable size range
    const maxSize = 1000; // 1000 sqm
    const sizeScore = Math.min(100, (property.area / maxSize) * 100);
    score += sizeScore * weights.size;
  }

  // Bedrooms score
  if (property.bedrooms) {
    // 3-4 bedrooms is ideal, score accordingly
    const bedroomScore = property.bedrooms >= 3 && property.bedrooms <= 4 ? 100 :
                         property.bedrooms >= 2 && property.bedrooms <= 5 ? 80 : 60;
    score += bedroomScore * weights.bedrooms;
  }

  // Bathrooms score
  if (property.bathrooms) {
    // More bathrooms generally better, but diminishing returns
    const bathroomScore = Math.min(100, property.bathrooms * 25);
    score += bathroomScore * weights.bathrooms;
  }

  // Amenities score
  if (property.amenities && property.amenities.length > 0) {
    // Score based on number of amenities (capped at 10)
    const amenitiesScore = Math.min(100, property.amenities.length * 10);
    score += amenitiesScore * weights.amenities;
  }

  // Condition score
  const conditionScores = {
    'new': 100,
    'excellent': 90,
    'good': 75,
    'fair': 60,
    'poor': 40
  };

  const conditionScore = conditionScores[property.condition?.toLowerCase()] || 70;
  score += conditionScore * weights.condition;

  // Market trends score (simplified)
  // In reality, this would come from real market data
  const marketTrendScore = 75; // Assume neutral positive trend
  score += marketTrendScore * weights.marketTrends;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Generate property recommendations for a user
 * @param {Object} user - User data
 * @param {Array} properties - Available properties
 * @returns {Array} Recommended properties
 */
exports.generateRecommendations = async (user, properties) => {
  // In a real implementation, this would use AI models for personalized recommendations
  // For now, we'll use simple filtering and scoring

  // Filter properties based on user preferences
  let filteredProperties = properties;

  // Apply user's preferred listing type
  if (user.preferences?.preferredListingType) {
    filteredProperties = filteredProperties.filter(
      prop => prop.listingType === user.preferences.preferredListingType
    );
  }

  // Score each property for this user
  const scoredProperties = filteredProperties.map(property => {
    // Calculate base score
    const baseScore = property.listingScore || 0;

    // Adjust score based on user preferences (simplified)
    let userAdjustment = 0;

    // If user has viewed similar properties, boost score
    if (user.viewedProperties && user.viewedProperties.length > 0) {
      const recentViews = user.viewedProperties
        .slice(-5) // Last 5 viewed properties
        .map(view => view.propertyId);

      // Check if property type matches recently viewed
      const matchingViews = recentViews.filter(viewId => {
        const viewedProperty = properties.find(p => p._id.toString() === viewId.toString());
        return viewedProperty && viewedProperty.propertyType === property.propertyType;
      });

      userAdjustment += matchingViews.length * 5; // +5 points per matching view
    }

    // If user has favorited similar properties, boost score
    if (user.favorites && user.favorites.length > 0) {
      const favoriteProperties = properties.filter(prop =>
        user.favorites.includes(prop._id.toString())
      );

      // Check if property type matches favorites
      const matchingFavorites = favoriteProperties.filter(fav =>
        fav.propertyType === property.propertyType
      );

      userAdjustment += matchingFavorites.length * 10; // +10 points per matching favorite
    }

    return {
      ...property.toObject ? property.toObject() : property,
      recommendationScore: Math.min(100, baseScore + userAdjustment)
    };
  });

  // Sort by recommendation score
  return scoredProperties.sort((a, b) => b.recommendationScore - a.recommendationScore);
};

/**
 * Perform semantic search on properties
 * @param {String} query - Search query
 * @param {Array} properties - Properties to search
 * @returns {Array} Search results
 */
exports.semanticSearch = async (query, properties) => {
  // In a real implementation, this would use AI models for semantic search
  // For now, we'll use simple text matching with scoring

  const queryTerms = query.toLowerCase().split(/\s+/);

  const scoredProperties = properties.map(property => {
    let score = 0;

    // Convert property to searchable text
    const searchText = [
      property.title,
      property.description,
      property.address?.city,
      property.address?.region,
      property.propertyType,
      ...(property.features || []),
      ...(property.amenities || [])
    ].join(' ').toLowerCase();

    // Score based on term matches
    queryTerms.forEach(term => {
      if (searchText.includes(term)) {
        score += 10; // Base score for term match

        // Bonus for exact phrase matches
        if (property.title.toLowerCase().includes(query.toLowerCase())) {
          score += 20;
        }

        // Bonus for city matches
        if (property.address?.city?.toLowerCase().includes(term)) {
          score += 15;
        }
      }
    });

    return {
      ...property.toObject ? property.toObject() : property,
      searchScore: score
    };
  });

  // Filter out properties with no matches and sort by score
  return scoredProperties
    .filter(prop => prop.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
};