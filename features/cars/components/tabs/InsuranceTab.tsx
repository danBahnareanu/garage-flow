import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { InsuranceRecord } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface InsuranceTabProps {
  carId: string;
  insuranceHistory?: InsuranceRecord[];
}

export const InsuranceTab: React.FC<InsuranceTabProps> = ({ carId, insuranceHistory }) => {
  const { addInsuranceRecord, updateInsuranceRecord, deleteInsuranceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [cost, setCost] = useState('');
  const [coverageType, setCoverageType] = useState('');

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  const openModal = (record?: InsuranceRecord) => {
    if (record) {
      setEditingId(record.id);
      setProvider(record.provider);
      setPolicyNumber(record.policyNumber || '');
      setStartDate(new Date(record.startDate));
      setExpiryDate(new Date(record.expiryDate));
      setCost(record.cost.toString());
      setCoverageType(record.coverageType || '');
    } else {
      setEditingId(null);
      setProvider('');
      setPolicyNumber('');
      setStartDate(null);
      setExpiryDate(null);
      setCost('');
      setCoverageType('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!provider || !startDate || !expiryDate || !cost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InsuranceRecord = {
      id: editingId || generateId(),
      provider,
      policyNumber: policyNumber || undefined,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      cost: parseFloat(cost),
      coverageType: coverageType || undefined,
    };
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
      { text: 'Delete', style: 'destructive', onPress: () => deleteInsuranceRecord(carId, recordId) },
    ]);
  };

  const hideDatePicker = (fieldName: string) => {
       fieldName === 'startDate' ? setShowStartDatePicker(false) : setShowExpiryDatePicker(false);
  };

  const handleConfirmStartDate = (selectedDate: Date) => {
    setShowStartDatePicker(false);
        if (selectedDate) {
       setStartDate(selectedDate);
       }
    hideDatePicker('startDate');
  };

   const handleConfirmExpiryDate= (selectedDate: Date) => {
    setShowExpiryDatePicker(false);
        if (selectedDate) {
       setExpiryDate(selectedDate);
       }
    hideDatePicker('expiryDate');
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString();
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Insurance</Text>
            <ScrollView>
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
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={startDate ? styles.inputText : styles.placeholderText}>
                  {startDate ? formatDateForDisplay(startDate) : 'Select start date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showStartDatePicker}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => hideDatePicker('startDate')}
              />
              <Text style={styles.label}>Expiry Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowExpiryDatePicker(true)}
              >
                <Text style={expiryDate ? styles.inputText : styles.placeholderText}>
                  {expiryDate ? formatDateForDisplay(expiryDate) : 'Select expiry date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showExpiryDatePicker}
                mode="date"
                onConfirm={handleConfirmExpiryDate}
                onCancel={() => hideDatePicker('expiryDate')}
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
        </View>
      </Modal>
    </View>
  );
};
