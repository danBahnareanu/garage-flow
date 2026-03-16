import useCarStore from '@/features/cars/store/carList.store';
import { MaintenanceRecord } from '@/features/cars/types/car.types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getMaintenanceBadgeStyle = (type: MaintenanceRecord['type']) => {
  switch (type) {
    case 'scheduled':
      return styles.scheduledBadge;
    case 'unscheduled':
      return styles.unscheduledBadge;
    case 'recall':
      return styles.recallBadge;
    default:
      return styles.scheduledBadge;
  }
};

const MaintenanceHistoryScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useCarStore((state) => state.cars.find(c => c.id === id));

  const sortedRecords = [...(car?.maintenanceHistory || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const renderRecord = ({ item: record }: { item: MaintenanceRecord }) => (
    <View style={styles.maintenanceRecord}>
      <View style={styles.maintenanceRecordHeader}>
        <Text style={styles.maintenanceDate}>
          {new Date(record.date).toLocaleDateString()}
        </Text>
        <Text style={styles.maintenanceCost}>€{record.cost.toFixed(2)}</Text>
      </View>
      <Text style={styles.maintenanceDescription}>{record.description}</Text>
      <View style={styles.maintenanceRecordFooter}>
        <Text style={styles.maintenanceMileage}>{record.mileage.toLocaleString()} km</Text>
        <View style={[styles.maintenanceTypeBadge, getMaintenanceBadgeStyle(record.type)]}>
          <Text style={styles.maintenanceTypeText}>{record.type}</Text>
        </View>
      </View>
      {record.partsReplaced && record.partsReplaced.length > 0 && (
        <View style={styles.partsSection}>
          <Text style={styles.partsLabel}>Parts replaced:</Text>
          {record.partsReplaced.map((part, i) => (
            <View key={i} style={styles.partRow}>
              <Text style={styles.partName}>{part.name}</Text>
              <Text style={styles.partCost}>€{part.cost.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={sortedRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No maintenance records</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
  },
  listContent: {
    padding: 16,
  },
  maintenanceRecord: {
    backgroundColor: '#2C1F5E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  maintenanceRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maintenanceDate: {
    fontSize: 14,
    color: '#B0B0B2',
    fontWeight: '500',
  },
  maintenanceCost: {
    fontSize: 14,
    color: '#7142CD',
    fontWeight: '600',
  },
  maintenanceDescription: {
    fontSize: 15,
    color: '#E1E1E2',
    marginBottom: 8,
  },
  maintenanceRecordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maintenanceMileage: {
    fontSize: 13,
    color: '#8A8A8C',
  },
  maintenanceTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduledBadge: {
    backgroundColor: '#4CAF50',
  },
  unscheduledBadge: {
    backgroundColor: '#FFA500',
  },
  recallBadge: {
    backgroundColor: '#FF4444',
  },
  maintenanceTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  partsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3D2F6E',
  },
  partsLabel: {
    fontSize: 12,
    color: '#B0B0B2',
    marginBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  partName: {
    fontSize: 13,
    color: '#E1E1E2',
  },
  partCost: {
    fontSize: 13,
    color: '#7142CD',
    fontWeight: '600',
  },
  emptyText: {
    color: '#8A8A8C',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default MaintenanceHistoryScreen;
