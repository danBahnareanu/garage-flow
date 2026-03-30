import useCarStore from '@/features/cars/store/carList.store';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
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
  Platform,
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

export const InspectionTab: React.FC<InspectionTabProps> = ({ carId, carName, inspectionHistory }) => {
  const { addInspectionRecord, updateInspectionRecord, deleteInspectionRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [inspType, setInspType] = useState<InspectionRecord['type']>('technical');
  const [result, setResult] = useState<InspectionRecord['result']>('pass');

  // Date picker
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
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Inspection Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {inspectionHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordTitleRow}>
              <View
                style={[
                  styles.typeBadge,
                  record.result === 'pass' ? styles.passBadge : styles.failBadge,
                ]}
              >
                <Text style={styles.typeBadgeText}>{record.type.toUpperCase()}</Text>
              </View>
              <Text
                style={[
                  styles.resultText,
                  { color: record.result === 'pass' ? '#4CAF50' : '#FF4444' },
                ]}
              >
                {record.result.toUpperCase()}
              </Text>
            </View>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => openModal(record)}>
                <Ionicons name="pencil" size={18} color="#7142CD" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(record.id)}>
                <Ionicons name="trash" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordSubtitle}>
            Date: {new Date(record.date).toLocaleDateString()}
            {record.expiryDate &&
              ` • Expires: ${new Date(record.expiryDate).toLocaleDateString()}`}
          </Text>
        </View>
      ))}

      {(!inspectionHistory || inspectionHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No inspection records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Inspection</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtonsWrap}>
                {INSPECTION_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, inspType === t && styles.typeButtonActive]}
                    onPress={() => setInspType(t)}
                  >
                    <Text
                      style={[styles.typeButtonText, inspType === t && styles.typeButtonTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker('date')}
              >
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
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker('expiryDate')}
              >
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
