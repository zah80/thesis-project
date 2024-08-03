import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ShowSignsRate = ({ rating, onRatingChange, interactive }) => {
  const stars = [1, 2, 3, 4, 5];

  const renderStar = (position) => {
    const starFillPercentage = Math.min(100, Math.max(0, (rating - position + 1) * 100));

    return (
      <View key={position} style={{ position: 'relative', marginRight: 5 }}>
        <FontAwesome name="star-o" size={30} color="#FFD700" />
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: `${starFillPercentage}%`,
          overflow: 'hidden'
        }}>
          <FontAwesome name="star" size={30} color="#FFD700" />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => interactive && onRatingChange(star)}
          disabled={!interactive}
        >
          {renderStar(star)}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ShowSignsRate;