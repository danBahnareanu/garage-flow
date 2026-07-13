import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { recheckAllNotifications, setupNotificationHandler } from '../utils/notificationService';

const daysUntil = (isoDate: string): number =>
  Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);

const daysLabel = (days: number): { text: string; color: string } => {
  if (days < 0)  return { text: 'Expired',    color: '#FF4444' };
  if (days === 0) return { text: 'Today',      color: '#FF4444' };
  if (days <= 14) return { text: `${days} days left`,   color: '#FF8C00' };
  if (days <= 30) return { text: `${days} days left`,   color: '#F0C040' };
  return              { text: `${days} days left`,   color: '#4CAF50' };
};

const getInsuranceDays = (car: Car) => {
  const records = car.insuranceHistory;
  if (!records?.length) return null;
  const latest = records.reduce((a, b) =>
    new Date(a.expiryDate) > new Date(b.expiryDate) ? a : b
  );
  return daysLabel(daysUntil(latest.expiryDate));
};

const getServiceDays = (car: Car) => {
  const records = car.maintenanceHistory;
  if (!records?.length) return null;
  const soonest = records
    .filter(r => r.category === 'Oils & Filters')
    .sort((a, b) => new Date(b.nextServiceDate!).getTime() - new Date(a.nextServiceDate!).getTime())[0];
  if (!soonest) return null;
  return daysLabel(daysUntil(soonest.nextServiceDate!));
};

const CarCard = ({ item, selected, onPress }: { item: Car; selected: boolean; onPress: () => void }) => {
  const insurance = getInsuranceDays(item);
  const service = getServiceDays(item);
  const fuelDisplay = item.fuel
    ? item.fuel.charAt(0).toUpperCase() + item.fuel.slice(1)
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.85}
    >
      {/* Row 1 — Name + sold tag + chevron */}
      <View style={styles.cardNameRow}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name || item.make}
        </Text>
        {item.sold && (
          <View style={styles.soldTag}>
            <Text style={styles.soldTagText}>SOLD</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#7142CD" />
      </View>

      {/* Row 2 — Make & Model */}
      <Text style={styles.cardMakeModel} numberOfLines={1}>
        {item.make} {item.model}
      </Text>

      {/* Row 3 — License plate */}
      {item.licensePlate ? (
        <View style={styles.plateBox}>
          <Text style={styles.plateText}>{item.licensePlate.toUpperCase()}</Text>
        </View>
      ) : null}

      {/* Row 4 — Year · Fuel */}
      <Text style={styles.cardMeta}>
        {item.year}{fuelDisplay ? ` · ${fuelDisplay}` : ''}
      </Text>

      {/* Row 5 — Insurance & Service */}
      {(insurance || service) ? (
        <View style={styles.statusRow}>
          {insurance ? (
            <View style={styles.statusCell}>
              <View style={styles.statusLabelRow}>
                <Ionicons name="shield-checkmark" size={16} color="#7142CD" />
                <Text style={styles.statusLabel}>Insurance</Text>
              </View>
              <Text style={[styles.statusDays, { color: insurance.color }]}>
                {insurance.text}
              </Text>
            </View>
          ) : <View style={styles.statusCell} />}
          <View style={styles.statusDivider} />
          {service ? (
            <View style={styles.statusCell}>
              <View style={styles.statusLabelRow}>
                <Ionicons name="build" size={16} color="#7142CD" />
                <Text style={styles.statusLabel}>Service</Text>
              </View>
              <Text style={[styles.statusDays, { color: service.color }]}>
                {service.text}
              </Text>
            </View>
          ) : <View style={styles.statusCell} />}
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const CarList = () => {
  const router = useRouter();
  const carList = useCarStore(state => state.cars);
  const isHydrated = useCarStore(state => state.isHydrated);
  const updateInsuranceRecord = useCarStore(state => state.updateInsuranceRecord);
  const updateInspectionRecord = useCarStore(state => state.updateInspectionRecord);
  const updateVignetteRecord = useCarStore(state => state.updateVignetteRecord);
  const [selectedId, setSelectedId] = useState<string>();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setupNotificationHandler();
  }, []);

  useEffect(() => {
    if (isHydrated && carList.length > 0) {
      recheckAllNotifications(carList, updateInsuranceRecord, updateInspectionRecord, updateVignetteRecord);
    }
  }, [isHydrated]);

  const sortedCarList = [...carList].sort((a, b) => Number(a.sold ?? false) - Number(b.sold ?? false));

  const renderItem = ({ item }: { item: Car }) => (
    <CarCard
      item={item}
      selected={item.id === selectedId}
      onPress={() => router.push(`/cars/${item.id}`)}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>
          Cars ({carList.length})
        </Text>
        {carList.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No cars yet.</Text>
            <Text style={styles.emptyStateText}>
              Tap the ⋯ button in the top right to add a new car, or use "Export Car List" to download a template you can fill in and import.
            </Text>
          </View>
        )}
        <FlatList
          data={sortedCarList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        <TouchableOpacity
          onPress={() => setShowInfo(true)}
          style={styles.learnMoreButton}
        >
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>

        <Modal
          visible={showInfo}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInfo(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowInfo(false)}>
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              <Text style={styles.modalTitle}>About Garage Flow</Text>
              <Text style={styles.modalText}>
                All your data is saved locally on your device. Nothing is uploaded to any server.
              </Text>
              <Text style={styles.modalText}>
                You can export your car info to a file and import it later — or on a new device — to keep your data safe.
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowInfo(false)}>
                <Text style={styles.modalCloseText}>Got it</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
    marginTop: StatusBar.currentHeight || 0,
  },
  screenTitle: {
    color: '#E1E1E2',
    fontSize: 24,
    fontWeight: '700',
    padding: 20,
  },

  // Card
  card: {
    backgroundColor: '#2C1F5E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  cardSelected: {
    backgroundColor: '#3D2F8A',
    borderWidth: 1,
    borderColor: '#7142CD',
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardName: {
    color: '#E1E1E2',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
  soldTag: {
    backgroundColor: '#FF444422',
    borderWidth: 1,
    borderColor: '#FF4444',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  soldTagText: {
    color: '#FF4444',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardMakeModel: {
    color: '#7A6EA0',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },

  // License plate
  plateBox: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: '#F5F0D0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  plateText: {
    color: '#1A1A1A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Meta row
  cardMeta: {
    color: '#9B8FBF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.4,
  },

  // Status row (Insurance / Service)
  statusRow: {
    flexDirection: 'row',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#3D2F6E',
    paddingTop: 12,
  },
  statusCell: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 3,
  },
  statusDivider: {
    width: 1,
    backgroundColor: '#3D2F6E',
    marginHorizontal: 8,
  },
  statusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusLabel: {
    color: '#9B8FBF',
    fontSize: 11,
    fontWeight: '600',
  },
  statusDays: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty state
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#665e7f80',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Learn more
  learnMoreButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#3D2F6E',
    marginTop: 8,
  },
  learnMoreText: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C1F5E',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    width: '85%',
  },
  modalTitle: {
    color: '#E1E1E2',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    color: '#C4BDE0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  modalCloseButton: {
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: '#7142CD',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CarList;
