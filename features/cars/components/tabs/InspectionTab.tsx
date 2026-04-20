import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { tabListStyles as ls } from '@/features/cars/styles/tabList.styles';
import { InspectionRecord } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import {
  cancelScheduledNotifications,
  requestPermissions,
  scheduleInspectionNotifications,
} from '@/features/cars/utils/notificationService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface InspectionTabProps {
  carId: string;
  carName: string;
  inspectionHistory?: InspectionRecord[];
}

const INSPECTION_TYPES: InspectionRecord['type'][] = [
  'technical',
  'registration',
  'emissions',
  'safety',
  'custom',
  'ITP',
];

const RESULT_OPTIONS: InspectionRecord['result'][] = ['pass', 'fail', 'pending'];

const getResultColor = (result: string) => {
  switch (result) {
    case 'pass': return '#4CAF50';
    case 'fail': return '#FF4444';
    default: return '#FFA500';
  }
};

export const InspectionTab: React.FC<InspectionTabProps> = ({ carId, carName, inspectionHistory }) => {
  const { addInspectionRecord, updateInspectionRecord, deleteInspectionRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextRecord, setContextRecord] = useState<InspectionRecord | null>(null);

  // Form fields
  const [inspType, setInspType] = useState<InspectionRecord['type']>('technical');
  const [result, setResult] = useState<InspectionRecord['result']>('pass');
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['date', 'expiryDate']);
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');

  const openModal = (record?: InspectionRecord) => {
    if (record) {
      setEditingId(record.id);
      setInspType(record.type);
      setDate('date', new Date(record.date));
      setDate('expiryDate', record.expiryDate ? new Date(record.expiryDate) : null);
      setResult(record.result);
      setMileage(record.mileage?.toString() || '');
      setCost(record.cost?.toString() || '');
      setLocation(record.location || '');
    } else {
      setEditingId(null);
      setInspType('technical');
      setDate('date', null);
      setDate('expiryDate', null);
      setResult('pass');
      setMileage('');
      setCost('');
      setLocation('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!dates.date) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InspectionRecord = {
      id: editingId || generateId(),
      type: inspType,
      date: dates.date.toISOString(),
      expiryDate: dates.expiryDate ? dates.expiryDate.toISOString() : undefined,
      result,
      mileage: mileage ? parseInt(mileage, 10) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      location: location || undefined,
    };

    const granted = await requestPermissions();
    if (granted && record.expiryDate) {
      if (editingId) {
        const oldRecord = inspectionHistory?.find((r) => r.id === editingId);
        if (oldRecord?.notificationIds) {
          await cancelScheduledNotifications(oldRecord.notificationIds);
        }
      }
      record.notificationIds = await scheduleInspectionNotifications(carName, record);
    }

    if (editingId) {
      updateInspectionRecord(carId, editingId, record);
    } else {
      addInspectionRecord(carId, record);
    }
    setModalVisible(false);
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const record = inspectionHistory?.find((r) => r.id === recordId);
          if (record?.notificationIds) {
            await cancelScheduledNotifications(record.notificationIds);
          }
          deleteInspectionRecord(carId, recordId);
        },
      },
    ]);
  };

  return (
    <View style={ls.container}>
      <View style={ls.header}>
        <Text style={ls.headerTitle}>Inspection Records</Text>
        <TouchableOpacity style={ls.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {inspectionHistory
        ?.slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((record) => {
          const daysRemaining = record.expiryDate
            ? Math.ceil((new Date(record.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;
          const isExpired = daysRemaining !== null && daysRemaining < 0;
          const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 30;
          return (
            <TouchableOpacity
              key={record.id}
              style={ls.card}
              onLongPress={() => setContextRecord(record)}
              activeOpacity={0.8}
            >
              <View style={ls.cardHeader}>
                <Text style={ls.cardDate}>
                  {new Date(record.date).toLocaleDateString()}
                  {record.expiryDate && ` – ${new Date(record.expiryDate).toLocaleDateString()}`}
                </Text>
                {record.cost != null && record.cost > 0 && (
                  <Text style={ls.cardCost}>€{record.cost.toFixed(2)}</Text>
                )}
              </View>
              <Text style={ls.cardTitle}>{record.type.toUpperCase()}</Text>
              {record.mileage != null && record.mileage > 0 && (
                <Text style={ls.cardMeta}>{record.mileage.toLocaleString()} km</Text>
              )}
              {record.location && (
                <Text style={ls.cardMeta}>{record.location}</Text>
              )}
              <View style={ls.cardFooter}>
                <Text style={ls.cardMeta}>
                  {daysRemaining !== null
                    ? isExpired
                      ? `Expired ${Math.abs(daysRemaining)} days ago`
                      : `${daysRemaining} days remaining`
                    : ''}
                </Text>
                <View style={ls.badgeRow}>
                  <View style={[ls.statusBadge, { backgroundColor: getResultColor(record.result) }]}>
                    <Text style={ls.statusBadgeText}>{record.result.toUpperCase()}</Text>
                  </View>
                  {daysRemaining !== null && (
                    <View
                      style={[
                        ls.statusBadge,
                        {
                          backgroundColor: isExpired
                            ? '#FF4444'
                            : isExpiringSoon
                              ? '#FFA500'
                              : '#4CAF50',
                        },
                      ]}
                    >
                      <Text style={ls.statusBadgeText}>
                        {isExpired ? 'Expired' : isExpiringSoon ? 'Soon' : 'Valid'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      {(!inspectionHistory || inspectionHistory.length === 0) && (
        <Text style={ls.emptyText}>No inspection records. Tap + to add one.</Text>
      )}

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `${contextRecord.type.toUpperCase()} — ${new Date(contextRecord.date).toLocaleDateString()}`
            : ''
        }
        actions={[
          {
            label: 'Edit Inspection',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Inspection',
            icon: 'trash-outline',
            color: '#FF4444',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) handleDelete(rec.id);
            },
          },
        ]}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Inspection</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtonsWrap}>
                {INSPECTION_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.optionButton, inspType === t && styles.optionButtonActive]}
                    onPress={() => setInspType(t)}
                  >
                    <Text
                      style={[styles.optionButtonText, inspType === t && styles.optionButtonTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity style={styles.input} onPress={() => showPicker('date')}>
                <Text style={dates.date ? styles.inputText : styles.placeholderText}>
                  {dates.date ? formatDate('date') : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.date}
                mode="date"
                onConfirm={(d) => onConfirm('date', d)}
                onCancel={() => hidePicker('date')}
              />
              <Text style={styles.label}>Expiry Date</Text>
              <TouchableOpacity style={styles.input} onPress={() => showPicker('expiryDate')}>
                <Text style={dates.expiryDate ? styles.inputText : styles.placeholderText}>
                  {dates.expiryDate ? formatDate('expiryDate') : 'Select expiry date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.expiryDate}
                mode="date"
                onConfirm={(d) => onConfirm('expiryDate', d)}
                onCancel={() => hidePicker('expiryDate')}
              />
              <Text style={styles.label}>Result</Text>
              <View style={styles.buttonRow}>
                {RESULT_OPTIONS.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.optionButton, result === r && styles.optionButtonActive]}
                    onPress={() => setResult(r)}
                  >
                    <Text
                      style={[styles.optionButtonText, result === r && styles.optionButtonTextActive]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Mileage (km)</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="125000"
                placeholderTextColor="#8A8A8C"
                keyboardType="number-pad"
              />
              <Text style={styles.label}>Cost (€)</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="50"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Service center"
                placeholderTextColor="#8A8A8C"
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
