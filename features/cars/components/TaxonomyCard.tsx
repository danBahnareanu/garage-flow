import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaxonomyCardProps {
  label: string;
  value: string;
  color: string;
  onPress: () => void;
}

export const TaxonomyCard: React.FC<TaxonomyCardProps> = ({ label, value, color, onPress }) => (
  <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={[cardStyles.dot, { backgroundColor: color }]} />
    <View style={cardStyles.textCol}>
      <Text style={cardStyles.label}>{label}</Text>
      <Text style={cardStyles.value}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#8A9BB0" />
  </TouchableOpacity>
);

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1643',
    borderRadius: 10,
    paddingRight: 12,
    marginTop: 12,
    gap: 12,
  },
  dot: {
    width: 20,
    height: 60,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  textCol: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: '#B0B0B2',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#E1E1E2',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

