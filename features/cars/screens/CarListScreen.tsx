import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
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

type ItemProps = {
  item: Car;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color:textColor}]}>{item.make}</Text>
    <Text style={[styles.carText, {color:textColor}]}>{item.licensePlate} | {item.year}</Text>
  </TouchableOpacity>
);

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

  const renderItem = ({item}: {item: Car}) => {
    const backgroundColor = item.id === selectedId ? '#7142CD' : '#2C1F5E';

    return (
      <Item
        item={item}
        onPress={() => router.push(`/cars/${item.id}`)}
        backgroundColor={backgroundColor}
        textColor='#E1E1E2'
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={{color: '#E1E1E2', fontSize: 24, padding: 20}}>
          Car List ({carList.length} cars)
        </Text>
        {carList.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No cars yet.
            </Text>
            <Text style={styles.emptyStateText}>
              Tap the ⋯ button in the top right to add a new car, or use "Export Car List" to download a template you can fill in and import.
            </Text>
          </View>
        )}
        <FlatList
          data={carList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
        <Button
                onPress={() => setShowInfo(true)}
                title="Learn More"
               color="#cdcdcd"
              accessibilityLabel="Learn more about this purple button"
              />

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
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 32,
  },
  carText: { fontSize: 16, fontWeight: '500', marginTop: 4 },
  subText: { color: '#666', fontSize: 14 },
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
  learnMoreText: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '600',
  },
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
  }
});

export default CarList;