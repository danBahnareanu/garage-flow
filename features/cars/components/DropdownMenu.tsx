import { Car } from '@/features/cars/types/car.types';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  onAddNewCar: () => void;
  onExportCarList: () => void;
  onImportCarList: () => void;
  cars: Car[];
  onDeleteCar: (car: Car) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  onAddNewCar,
  onExportCarList,
  onImportCarList,
  cars,
  onDeleteCar,
}) => {
  const progress = useSharedValue(0);
  const [showDeleteList, setShowDeleteList] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowDeleteList(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.5,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - progress.value) * SCREEN_HEIGHT,
      },
    ],
  }));

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBackground, overlayAnimatedStyle]} />
        <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />

            {showDeleteList ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowDeleteList(false)}
                >
                  <Ionicons name="arrow-back" size={24} color="#E1E1E2" />
                  <Text style={styles.menuItemText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.deleteListHeader}>Select car to delete</Text>

                <ScrollView style={styles.deleteList}>
                  {cars.map((car) => (
                    <TouchableOpacity
                      key={car.id}
                      style={styles.deleteCarItem}
                      onPress={() => onDeleteCar(car)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF4444" />
                      <Text style={styles.deleteCarText}>{car.make} {car.model}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onAddNewCar}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#E1E1E2" />
                  <Text style={styles.menuItemText}>Add New Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowDeleteList(true)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF4444" />
                  <Text style={[styles.menuItemText, { color: '#FF4444' }]}>Delete Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onExportCarList}
                >
                  <Ionicons name="share-outline" size={24} color="#E1E1E2" />
                  <Text style={styles.menuItemText}>Export Car List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onImportCarList}
                >
                  <Ionicons name="download-outline" size={24} color="#E1E1E2" />
                  <Text style={styles.menuItemText}>Import Car List</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export const MenuButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [styles.menuButton, { opacity: pressed ? 0.7 : 1 }]}>
      <Ionicons name="ellipsis-horizontal" size={24} color="#fff"/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#2C1F5E',
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  modalContent: {
    backgroundColor: '#2C1F5E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: '30%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#7142CD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1C1643',
  },
  menuItemText: {
    color: '#E1E1E2',
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
  },
  deleteListHeader: {
    color: '#8A8A8C',
    fontSize: 14,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteList: {
    maxHeight: 300,
  },
  deleteCarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1C1643',
  },
  deleteCarText: {
    color: '#E1E1E2',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
