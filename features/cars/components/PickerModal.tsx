import { TAXONOMY_NEUTRAL } from '@/features/cars/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TaxonomyItem } from '../types/taxonomy.types';

interface PickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: TaxonomyItem[];
  selectedId?: string;
  showNoneOption?: boolean;
  onSelect: (id: string | undefined) => void;
  onItemLongPress: (item: TaxonomyItem) => void;
  onAddPress: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PickerModal: React.FC<PickerModalProps> = ({
  visible,
  onClose,
  title,
  items,
  selectedId,
  showNoneOption,
  onSelect,
  onItemLongPress,
  onAddPress,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      progress.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * SCREEN_HEIGHT }],
  }));

  const noneSelected = showNoneOption && !selectedId;

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBg, overlayStyle]} />
        <Animated.View style={[styles.content, modalStyle]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              {showNoneOption && (
                <TouchableOpacity
                  style={[styles.item, noneSelected && styles.itemSelected]}
                  onPress={() => {
                    onSelect(undefined);
                    onClose();
                  }}
                >
                  <View style={[styles.dot, { backgroundColor: TAXONOMY_NEUTRAL }]} />
                  <Text style={styles.itemText}>None</Text>
                  {noneSelected && (
                    <Ionicons name="checkmark" size={20} color="#7142CD" />
                  )}
                </TouchableOpacity>
              )}
              {items.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    onLongPress={() => onItemLongPress(item)}
                    delayLongPress={300}
                  >
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={styles.itemText}>{item.name}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#7142CD" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add new</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  content: {
    backgroundColor: '#2C1F5E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#7142CD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  scroll: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1C1643',
    gap: 12,
  },
  itemSelected: {
    borderWidth: 1,
    borderColor: '#7142CD',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemText: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textTransform: 'capitalize',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7142CD',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
