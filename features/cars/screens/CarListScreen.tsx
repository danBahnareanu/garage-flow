import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { recheckAllNotifications, setupNotificationHandler, triggerTestNotification } from '../utils/notificationService';

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
  const [selectedId, setSelectedId] = useState<string>();

  useEffect(() => {
    setupNotificationHandler();
  }, []);

  useEffect(() => {
    if (isHydrated && carList.length > 0) {
      recheckAllNotifications(carList, updateInsuranceRecord, updateInspectionRecord);
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
        <FlatList
          data={carList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
        <Button
          onPress={triggerTestNotification}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
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
  subText: { color: '#666', fontSize: 14 }
});

export default CarList;