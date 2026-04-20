import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
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

interface ContextMenuAction {
  label: string;
  icon: string;
  color?: string;
  onPress: () => void;
}

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  actions: ContextMenuAction[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ContextMenu: React.FC<ContextMenuProps> = ({ visible, onClose, title, actions }) => {
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

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBg, overlayStyle]} />
        <Animated.View style={[styles.content, modalStyle]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={action.onPress}
              >
                <Ionicons
                  name={action.icon as any}
                  size={24}
                  color={action.color || '#E1E1E2'}
                />
                <Text style={[styles.menuItemText, action.color ? { color: action.color } : undefined]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
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
    paddingBottom: 40,
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
