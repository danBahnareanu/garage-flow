import { Colors } from '@/constants/colors';
import useSettingsStore from '@/features/cars/store/settings.store';
import { REMINDER_OFFSETS } from '@/features/cars/utils/notificationService';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const progress = useSharedValue(0);
  const enabledReminderDays = useSettingsStore((state) => state.enabledReminderDays);
  const toggleReminderDay = useSettingsStore((state) => state.toggleReminderDay);

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

            <View style={styles.header}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.headerText}>Notification Settings</Text>
            </View>

            <Text style={styles.description}>
              Choose when to be reminded before insurance, inspections and road tax expire.
            </Text>

            {REMINDER_OFFSETS.map((offset) => (
              <View key={offset.days} style={styles.settingRow}>
                <Text style={styles.settingLabel}>{offset.settingLabel}</Text>
                <Switch
                  value={enabledReminderDays.includes(offset.days)}
                  onValueChange={() => toggleReminderDay(offset.days)}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            ))}

            {enabledReminderDays.length === 0 && (
              <Text style={styles.warningText}>
                No reminders will be scheduled while all options are off.
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  headerText: {
    color: Colors.textPrimary,
    fontSize: 18,
    marginLeft: 12,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.textSoft,
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  warningText: {
    color: Colors.warningSoft,
    fontSize: 13,
    marginHorizontal: 20,
    marginTop: 12,
  },
});
