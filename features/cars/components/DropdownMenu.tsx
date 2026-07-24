import { Colors } from '@/constants/colors';
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
  onNotificationSettings: () => void;
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
  onNotificationSettings,
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
                  <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
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
                      <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                      <View style={styles.deleteCarInfo}>
                        <Text style={styles.deleteCarText} numberOfLines={1}>
                          {car.name || `${car.make} ${car.model}`}
                        </Text>
                        {car.name ? (
                          <Text style={styles.deleteCarSubtext} numberOfLines={1}>
                            {car.make} {car.model}
                          </Text>
                        ) : null}
                      </View>
                      {car.licensePlate ? (
                        <View style={styles.plateBox}>
                          <Text style={styles.plateText}>{car.licensePlate.toUpperCase()}</Text>
                        </View>
                      ) : null}
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
                  <Ionicons name="add-circle-outline" size={24} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Add New Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowDeleteList(true)}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.danger} />
                  <Text style={[styles.menuItemText, { color: Colors.danger }]}>Delete Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onExportCarList}
                >
                  <Ionicons name="share-outline" size={24} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Export Car List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onImportCarList}
                >
                  <Ionicons name="download-outline" size={24} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Import Car List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={onNotificationSettings}
                >
                  <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Notification Settings</Text>
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
      <Ionicons name="ellipsis-horizontal" size={24} color={Colors.white}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: '30%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.background,
  },
  menuItemText: {
    color: Colors.textPrimary,
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
  },
  deleteListHeader: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.background,
  },
  deleteCarInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  deleteCarText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteCarSubtext: {
    color: Colors.purpleMuted,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  plateBox: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: Colors.plateBackground,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  plateText: {
    color: Colors.plateText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
