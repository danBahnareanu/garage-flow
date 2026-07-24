import { Colors } from '@/constants/colors';
import { BottomSheetModal } from '@/features/cars/components/BottomSheetModal';
import useSettingsStore from '@/features/cars/store/settings.store';
import { REMINDER_OFFSETS } from '@/features/cars/utils/notificationService';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const enabledReminderDays = useSettingsStore((state) => state.enabledReminderDays);
  const toggleReminderDay = useSettingsStore((state) => state.toggleReminderDay);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      dragArea="full"
      contentStyle={styles.sheetContent}
    >
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
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingBottom: 40,
    minHeight: '30%',
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
