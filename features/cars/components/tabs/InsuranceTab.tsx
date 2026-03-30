import useCarStore from '@/features/cars/store/carList.store';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { InsuranceRecord } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import {
  cancelScheduledNotifications,
  requestPermissions,
  scheduleInsuranceNotifications,
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

interface InsuranceTabProps {
  carId: string;
  carName: string;
  insuranceHistory?: InsuranceRecord[];
}

export const InsuranceTab: React.FC<InsuranceTabProps> = ({ carId, carName, insuranceHistory }) => {
  const { addInsuranceRecord, updateInsuranceRecord, deleteInsuranceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [cost, setCost] = useState('');
  const [coverageType, setCoverageType] = useState('');

  // Date picker
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['startDate', 'expiryDate']);

  const openModal = (record?: InsuranceRecord) => {
    if (record) {
      setEditingId(record.id);
      setProvider(record.provider);
      setPolicyNumber(record.policyNumber || '');
      setDate('startDate', new Date(record.startDate));
      setDate('expiryDate', new Date(record.expiryDate));
      setCost(record.cost.toString());
      setCoverageType(record.coverageType || '');
    } else {
      setEditingId(null);
      setProvider('');
      setPolicyNumber('');
      setDate('startDate', null);
      setDate('expiryDate', null);
      setCost('');
      setCoverageType('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!provider || !dates.startDate || !dates.expiryDate || !cost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InsuranceRecord = {
      id: editingId || generateId(),
      provider,
      policyNumber: policyNumber || undefined,
      startDate: dates.startDate.toISOString(),
      expiryDate: dates.expiryDate.toISOString(),
      cost: parseFloat(cost),
      coverageType: coverageType || undefined,
    };

    const granted = await requestPermissions();
    if (granted) {
      // Cancel old notifications if editing and expiry date changed
      if (editingId) {
        const oldRecord = insuranceHistory?.find((r) => r.id === editingId);
        if (oldRecord?.notificationIds) {
          await cancelScheduledNotifications(oldRecord.notificationIds);
        }
      }
      record.notificationIds = await scheduleInsuranceNotifications(carName, record);
    }

    if (editingId) {
      updateInsuranceRecord(carId, editingId, record);
    } else {
      addInsuranceRecord(carId, record);
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
          const record = insuranceHistory?.find((r) => r.id === recordId);
          if (record?.notificationIds) {
            await cancelScheduledNotifications(record.notificationIds);
          }
          deleteInsuranceRecord(carId, recordId);
        },
      },
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Insurance Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {insuranceHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{record.provider}</Text>
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
            Expires: {new Date(record.expiryDate).toLocaleDateString()} - €{record.cost}
          </Text>
          {record.coverageType && (
            <Text style={styles.recordDescription}>{record.coverageType}</Text>
          )}
        </View>
      ))}

      {(!insuranceHistory || insuranceHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No insurance records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior="padding"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Insurance</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Provider *</Text>
              <TextInput
                style={styles.input}
                value={provider}
                onChangeText={setProvider}
                placeholder="e.g., Grawe"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Policy Number</Text>
              <TextInput
                style={styles.input}
                value={policyNumber}
                onChangeText={setPolicyNumber}
                placeholder="Policy number"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker('startDate')}
              >
                <Text style={dates.startDate ? styles.inputText : styles.placeholderText}>
                  {dates.startDate ? formatDate('startDate') : 'Select start date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.startDate}
                mode="date"
                onConfirm={(d) => onConfirm('startDate', d)}
                onCancel={() => hidePicker('startDate')}
              />
              <Text style={styles.label}>Expiry Date *</Text>
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
              <Text style={styles.label}>Cost * (€)</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="400"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Coverage Type</Text>
              <TextInput
                style={styles.input}
                value={coverageType}
                onChangeText={setCoverageType}
                placeholder="comprehensive"
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
