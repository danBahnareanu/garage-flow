import { Colors } from '@/constants/colors';
import { BottomSheetModal } from '@/features/cars/components/BottomSheetModal';
import { Car } from '@/features/cars/types/car.types';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  /** Called once the menu's modal has fully closed (safe to open another modal) */
  onClosed?: () => void;
  onAddNewCar: () => void;
  onExportCarList: () => void;
  onImportCarList: () => void;
  onNotificationSettings: () => void;
  cars: Car[];
  onDeleteCar: (car: Car) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  onClosed,
  onAddNewCar,
  onExportCarList,
  onImportCarList,
  onNotificationSettings,
  cars,
  onDeleteCar,
}) => {
  const [showDeleteList, setShowDeleteList] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowDeleteList(false);
    }
  }, [visible]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      onClosed={onClosed}
      dragArea={showDeleteList ? 'handle' : 'full'}
      contentStyle={styles.sheetContent}
    >
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
    </BottomSheetModal>
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
  sheetContent: {
    paddingBottom: 40,
    minHeight: '30%',
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
