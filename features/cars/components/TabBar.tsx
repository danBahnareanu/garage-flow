import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { TABS, TabType } from '@/features/cars/types/editCarDetail.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          onPress={() => onTabChange(tab.key)}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={activeTab === tab.key ? '#7142CD' : '#8A8A8C'}
          />
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
