import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Car, InspectionRecord, InsuranceRecord, VignetteRecord } from '../types/car.types';

const REMINDER_CHANNEL_ID = 'reminders';

const REMINDER_OFFSETS = [
  { days: 30, label: 'expires in 30 days' },
  { days: 14, label: 'expires in 2 weeks' },
  { days: 7, label: 'expires in 1 week' },
  { days: 0, label: 'expires today!' },
];

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// --- Generic scheduling core ---

async function scheduleExpiryNotifications(
  carName: string,
  title: string,
  expiryDateISO: string,
  recordId: string,
  dataType: string,
): Promise<string[]> {
  const expiry = new Date(expiryDateISO);
  const now = new Date();
  const ids: string[] = [];

  for (const offset of REMINDER_OFFSETS) {
    const triggerDate = new Date(expiry);
    triggerDate.setDate(triggerDate.getDate() - offset.days);
    triggerDate.setHours(9, 0, 0, 0);

    if (triggerDate <= now) continue;

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    };
    if (Platform.OS === 'android') {
      trigger.channelId = REMINDER_CHANNEL_ID;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: `${title.replace(' Reminder', '')} for ${carName} ${offset.label}`,
        data: { recordId, type: dataType },
      },
      trigger,
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelScheduledNotifications(notificationIds: string[]): Promise<void> {
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // Notification may already have fired or been cleared
    }
  }
}

// --- Insurance ---

export async function scheduleInsuranceNotifications(
  carName: string,
  record: InsuranceRecord,
): Promise<string[]> {
  return scheduleExpiryNotifications(
    carName, 'Insurance Reminder', record.expiryDate, record.id, 'insurance-expiry',
  );
}

// --- Inspection ---

export async function scheduleInspectionNotifications(
  carName: string,
  record: InspectionRecord,
): Promise<string[]> {
  if (!record.expiryDate) return [];
  return scheduleExpiryNotifications(
    carName, 'Inspection Reminder', record.expiryDate, record.id, 'inspection-expiry',
  );
}

// --- Vignette ---

export async function scheduleVignetteNotifications(
  carName: string,
  record: VignetteRecord,
): Promise<string[]> {
  return scheduleExpiryNotifications(
    carName, 'Road Tax Reminder', record.expiryDate, record.id, 'vignette-expiry',
  );
}

// --- Recheck on app launch ---

async function recheckRecords<T extends { id: string; expiryDate?: string; notificationIds?: string[] }>(
  records: T[] | undefined,
  carId: string,
  carName: string,
  scheduledIds: Set<string>,
  scheduleFn: (carName: string, record: T) => Promise<string[]>,
  updateFn: (carId: string, recordId: string, updates: Partial<T>) => void,
) {
  if (!records) return;

  for (const record of records) {
    if (!record.notificationIds || record.notificationIds.length === 0) continue;

    const allIntact = record.notificationIds.every((id) => scheduledIds.has(id));
    if (allIntact) continue;

    // If no expiry date or all triggers are in the past, clear IDs
    if (!record.expiryDate) {
      updateFn(carId, record.id, { notificationIds: [] } as unknown as Partial<T>);
      continue;
    }

    const expiry = new Date(record.expiryDate);
    const now = new Date();
    const expiryTrigger = new Date(expiry);
    expiryTrigger.setHours(9, 0, 0, 0);
    if (expiryTrigger <= now) {
      updateFn(carId, record.id, { notificationIds: [] } as unknown as Partial<T>);
      continue;
    }

    // Cancel remaining and reschedule
    await cancelScheduledNotifications(record.notificationIds);
    const newIds = await scheduleFn(carName, record);
    updateFn(carId, record.id, { notificationIds: newIds } as unknown as Partial<T>);
  }
}

export async function recheckAllNotifications(
  cars: Car[],
  updateInsuranceRecord: (carId: string, recordId: string, updates: Partial<InsuranceRecord>) => void,
  updateInspectionRecord: (carId: string, recordId: string, updates: Partial<InspectionRecord>) => void,
  updateVignetteRecord: (carId: string, recordId: string, updates: Partial<VignetteRecord>) => void,
): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledIds = new Set(scheduled.map((n) => n.identifier));

  for (const car of cars) {
    const carName = `${car.make} ${car.model}`;
    await recheckRecords(car.insuranceHistory, car.id, carName, scheduledIds, scheduleInsuranceNotifications, updateInsuranceRecord);
    await recheckRecords(car.inspectionHistory, car.id, carName, scheduledIds, scheduleInspectionNotifications, updateInspectionRecord);
    await recheckRecords(car.vignetteHistory, car.id, carName, scheduledIds, scheduleVignetteNotifications, updateVignetteRecord);
  }
}

// --- Test notification ---

export const triggerTestNotification = () => {
  setupNotificationHandler();
  requestPermissions();

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: null,
  });
};
