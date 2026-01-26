import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { MaintenanceRecord } from '@/features/cars/types/car.types';
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
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface MaintenanceTabProps {
  carId: string;
  maintenanceHistory?: MaintenanceRecord[];
}

const MAINTENANCE_TYPES: MaintenanceRecord['type'][] = ['scheduled', 'unscheduled', 'recall'];

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ carId, maintenanceHistory }) => {
  const { addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [maintType, setMaintType] = useState<MaintenanceRecord['type']>('scheduled');
  const [date, setDate] = useState<Date | null>(null);
  const [mileage, setMileage] = useState('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [nextServiceMileage, setNextServiceMileage] = useState('');

  const openModal = (record?: MaintenanceRecord) => {
    if (record) {
      setEditingId(record.id);
      setMaintType(record.type);
      setDate(new Date(record.date));
      setMileage(record.mileage.toString());
      setDescription(record.description);
      setCost(record.cost.toString());
      setServiceProvider(record.serviceProvider || '');
      setNextServiceDate(record.nextServiceDate || '');
      setNextServiceMileage(record.nextServiceMileage?.toString() || '');
    } else {
      setEditingId(null);
      setMaintType('scheduled');
      setDate(null);
      setMileage('');
      setDescription('');
      setCost('');
      setServiceProvider('');
      setNextServiceDate('');
      setNextServiceMileage('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!date || !mileage || !description || !cost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: MaintenanceRecord = {
      id: editingId || generateId(),
      date: date.toISOString(),
      mileage: parseInt(mileage, 10),
      type: maintType,
      description,
      cost: parseFloat(cost),
      serviceProvider: serviceProvider || undefined,
      nextServiceDate: nextServiceDate || undefined,
      nextServiceMileage: nextServiceMileage ? parseInt(nextServiceMileage, 10) : undefined,
    };
    if (editingId) {
      updateMaintenanceRecord(carId, editingId, record);
    } else {
      addMaintenanceRecord(carId, record);
    }
    setModalVisible(false);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDateForDisplay = (dateValue: Date | null): string => {
    if (!dateValue) return '';
    return dateValue.toLocaleDateString();
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMaintenanceRecord(carId, recordId),
      },
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Maintenance Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {maintenanceHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle} numberOfLines={1}>
              {record.description}
            </Text>
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
            {new Date(record.date).toLocaleDateString()} • €{record.cost} •{' '}
            {record.mileage.toLocaleString()} km
          </Text>
          <View style={[styles.typeBadge, styles.maintenanceTypeBadge]}>
            <Text style={styles.typeBadgeText}>{record.type}</Text>
          </View>
        </View>
      ))}

      {(!maintenanceHistory || maintenanceHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No maintenance records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Maintenance</Text>
            <ScrollView>
              <Text style={styles.label}>Type</Text>
              <View style={styles.buttonRow}>
                {MAINTENANCE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.optionButton, maintType === t && styles.optionButtonActive]}
                    onPress={() => setMaintType(t)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        maintType === t && styles.optionButtonTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={date ? styles.inputText : styles.placeholderText}>
                  {date ? formatDateForDisplay(date) : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
              />
              <Text style={styles.label}>Mileage * (km)</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="125000"
                placeholderTextColor="#8A8A8C"
                keyboardType="number-pad"
              />
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Oil change..."
                placeholderTextColor="#8A8A8C"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.label}>Cost * (€)</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="150"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Service Provider</Text>
              <TextInput
                style={styles.input}
                value={serviceProvider}
                onChangeText={setServiceProvider}
                placeholder="BMW Service"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Next Service Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={nextServiceDate}
                onChangeText={setNextServiceDate}
                placeholder="2025-01-01"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Next Service Mileage (km)</Text>
              <TextInput
                style={styles.input}
                value={nextServiceMileage}
                onChangeText={setNextServiceMileage}
                placeholder="135000"
                placeholderTextColor="#8A8A8C"
                keyboardType="number-pad"
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
