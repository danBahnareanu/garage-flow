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
  View,
} from 'react-native';

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
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cost, setCost] = useState('');
  const [coverageType, setCoverageType] = useState('');

  const openModal = (record?: InsuranceRecord) => {
    if (record) {
      setEditingId(record.id);
      setProvider(record.provider);
      setPolicyNumber(record.policyNumber || '');
      setStartDate(record.startDate);
      setExpiryDate(record.expiryDate);
      setCost(record.cost.toString());
      setCoverageType(record.coverageType || '');
    } else {
      setEditingId(null);
      setProvider('');
      setPolicyNumber('');
      setStartDate('');
      setExpiryDate('');
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
      startDate,
      expiryDate,
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
              <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2024-01-01"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Expiry Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="2025-01-01"
                placeholderTextColor="#8A8A8C"
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
