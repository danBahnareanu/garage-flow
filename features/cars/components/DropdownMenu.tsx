import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
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
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  onAddNewCar
}) => {
  const progress = useSharedValue(0);

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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={onAddNewCar}
            >
              <Ionicons name="add-circle-outline" size={24} color="#E1E1E2" />
              <Text style={styles.menuItemText}>Add New Car</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export const MenuButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuButton}>
      <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginRight: 8,
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
});
