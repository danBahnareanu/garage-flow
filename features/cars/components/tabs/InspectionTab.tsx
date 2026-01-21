import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { InspectionRecord } from '@/features/cars/types/car.types';
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

interface InspectionTabProps {
  carId: string;
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

export const InspectionTab: React.FC<InspectionTabProps> = ({ carId, inspectionHistory }) => {
  const { addInspectionRecord, updateInspectionRecord, deleteInspectionRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [inspType, setInspType] = useState<InspectionRecord['type']>('technical');
  const [date, setDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [result, setResult] = useState<InspectionRecord['result']>('pass');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');

  const openModal = (record?: InspectionRecord) => {
    if (record) {
      setEditingId(record.id);
      setInspType(record.type);
      setDate(record.date);
      setExpiryDate(record.expiryDate || '');
      setResult(record.result);
      setMileage(record.mileage?.toString() || '');
      setCost(record.cost?.toString() || '');
      setLocation(record.location || '');
    } else {
      setEditingId(null);
      setInspType('technical');
      setDate('');
      setExpiryDate('');
      setResult('pass');
      setMileage('');
      setCost('');
      setLocation('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!date) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InspectionRecord = {
      id: editingId || generateId(),
      type: inspType,
      date,
      expiryDate: expiryDate || undefined,
      result,
      mileage: mileage ? parseInt(mileage, 10) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      location: location || undefined,
    };
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
        onPress: () => deleteInspectionRecord(carId, recordId),
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Inspection</Text>
            <ScrollView>
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
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="2024-01-01"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="2025-01-01"
                placeholderTextColor="#8A8A8C"
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
        </View>
      </Modal>
    </View>
  );
};
