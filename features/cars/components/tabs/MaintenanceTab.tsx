import useCarStore from '@/features/cars/store/carList.store';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { MaintenanceRecord, ReplacedPart } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
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

interface MaintenanceTabProps {
  carId: string;
  maintenanceHistory?: MaintenanceRecord[];
}

const MAINTENANCE_TYPES: MaintenanceRecord['type'][] = ['scheduled', 'unscheduled', 'recall', 'upgrade', 'preventive', 'repair'];

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ carId, maintenanceHistory }) => {
  const { addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [maintType, setMaintType] = useState<MaintenanceRecord['type']>('scheduled');
  const [mileage, setMileage] = useState('');

  // Date picker
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['date', 'nextServiceDate']);
  const [description, setDescription] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [partsReplaced, setPartsReplaced] = useState<ReplacedPart[]>([]);
  const [partName, setPartName] = useState('');
  const [partCost, setPartCost] = useState('');
  const [nextServiceMileage, setNextServiceMileage] = useState('');

  const openModal = (record?: MaintenanceRecord) => {
    if (record) {
      setEditingId(record.id);
      setMaintType(record.type);
      setDate('date', new Date(record.date));
      setMileage(record.mileage.toString());
      setDescription(record.description);
      setServiceProvider(record.serviceProvider || '');
      setPartsReplaced(record.partsReplaced || []);
      setDate('nextServiceDate', new Date(record.nextServiceDate || ''));
      setNextServiceMileage(record.nextServiceMileage?.toString() || '');
    } else {
      setEditingId(null);
      setMaintType('scheduled');
      setDate('date', null);
      setMileage('');
      setDescription('');
      setServiceProvider('');
      setPartsReplaced([]);
      setDate('nextServiceDate', null);
      setNextServiceMileage('');
    }
    setPartName('');
    setPartCost('');
    setModalVisible(true);
  };

  const totalCost = partsReplaced.reduce((sum, p) => sum + p.cost, 0);

  const handleAddPart = () => {
    const name = partName.trim();
    const cost = parseFloat(partCost);
    if (!name || isNaN(cost)) {
      Alert.alert('Error', 'Please enter a part name and valid cost');
      return;
    }
    setPartsReplaced([...partsReplaced, { name, cost }]);
    setPartName('');
    setPartCost('');
  };

  const handleRemovePart = (index: number) => {
    setPartsReplaced(partsReplaced.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!dates.date || !mileage || !description) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: MaintenanceRecord = {
      id: editingId || generateId(),
      date: dates.date.toISOString(),
      mileage: parseInt(mileage, 10),
      type: maintType,
      description,
      cost: totalCost,
      partsReplaced: partsReplaced.length > 0 ? partsReplaced : undefined,
      serviceProvider: serviceProvider || undefined,
      nextServiceDate: dates.nextServiceDate ? dates.nextServiceDate.toISOString() : undefined,
      nextServiceMileage: nextServiceMileage ? parseInt(nextServiceMileage, 10) : undefined,
    };
    if (editingId) {
      updateMaintenanceRecord(carId, editingId, record);
    } else {
      addMaintenanceRecord(carId, record);
    }
    setModalVisible(false);
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
          {record.partsReplaced && record.partsReplaced.length > 0 && (
            <View style={styles.partsBreakdown}>
              {record.partsReplaced.map((part, i) => (
                <View key={i} style={styles.partItem}>
                  <Text style={styles.partItemText}>{part.name}</Text>
                  <Text style={styles.partItemCost}>€{part.cost.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {(!maintenanceHistory || maintenanceHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No maintenance records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior="padding"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Maintenance</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
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
              <Text style={styles.label}>Service Provider</Text>
              <TextInput
                style={styles.input}
                value={serviceProvider}
                onChangeText={setServiceProvider}
                placeholder="BMW Service"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Parts Replaced</Text>
              <View style={styles.partsInputRow}>
                <TextInput
                  style={[styles.input, styles.partNameInput]}
                  value={partName}
                  onChangeText={setPartName}
                  placeholder="Part name"
                  placeholderTextColor="#8A8A8C"
                />
                <TextInput
                  style={[styles.input, styles.partCostInput]}
                  value={partCost}
                  onChangeText={setPartCost}
                  placeholder="€"
                  placeholderTextColor="#8A8A8C"
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.partAddButton} onPress={handleAddPart}>
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              {partsReplaced.map((part, index) => (
                <View key={index} style={styles.partItem}>
                  <Text style={styles.partItemText}>{part.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.partItemCost}>€{part.cost.toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => handleRemovePart(index)}>
                      <Text style={styles.partRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {partsReplaced.length > 0 && (
                <View style={styles.partsTotalRow}>
                  <Text style={styles.partsTotalText}>Total</Text>
                  <Text style={styles.partsTotalText}>€{totalCost.toFixed(2)}</Text>
                </View>
              )}
              <Text style={styles.label}>Next Service Date </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker('nextServiceDate')}
              >
                <Text style={dates.nextServiceDate ? styles.inputText : styles.placeholderText}>
                  {dates.nextServiceDate ? formatDate('nextServiceDate') : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.nextServiceDate}
                mode="date"
                onConfirm={(d) => onConfirm('nextServiceDate', d)}
                onCancel={() => hidePicker('nextServiceDate')}
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
