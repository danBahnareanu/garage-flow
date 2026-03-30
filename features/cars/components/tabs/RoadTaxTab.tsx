import useCarStore from '@/features/cars/store/carList.store';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { VignetteRecord } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import {
  cancelScheduledNotifications,
  requestPermissions,
  scheduleVignetteNotifications,
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

interface RoadTaxTabProps {
  carId: string;
  carName: string;
  vignetteHistory?: VignetteRecord[];
}

export const RoadTaxTab: React.FC<RoadTaxTabProps> = ({ carId, carName, vignetteHistory }) => {
  const { addVignetteRecord, updateVignetteRecord, deleteVignetteRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  // Date picker
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['purchaseDate', 'expiryDate']);

  const openModal = (record?: VignetteRecord) => {
    if (record) {
      setEditingId(record.id);
      setName(record.name);
      setCountry(record.country || '');
      setDate('purchaseDate', new Date(record.purchaseDate));
      setDate('expiryDate', new Date(record.expiryDate));
      setCost(record.cost.toString());
      setNotes(record.notes || '');
    } else {
      setEditingId(null);
      setName('');
      setCountry('');
      setDate('purchaseDate', null);
      setDate('expiryDate', null);
      setCost('');
      setNotes('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !dates.purchaseDate || !dates.expiryDate || !cost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: VignetteRecord = {
      id: editingId || generateId(),
      name,
      country: country || undefined,
      purchaseDate: dates.purchaseDate.toISOString(),
      expiryDate: dates.expiryDate.toISOString(),
      cost: parseFloat(cost),
      notes: notes || undefined,
    };

    const granted = await requestPermissions();
    if (granted) {
      if (editingId) {
        const oldRecord = vignetteHistory?.find((r) => r.id === editingId);
        if (oldRecord?.notificationIds) {
          await cancelScheduledNotifications(oldRecord.notificationIds);
        }
      }
      record.notificationIds = await scheduleVignetteNotifications(carName, record);
    }

    if (editingId) {
      updateVignetteRecord(carId, editingId, record);
    } else {
      addVignetteRecord(carId, record);
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
          const record = vignetteHistory?.find((r) => r.id === recordId);
          if (record?.notificationIds) {
            await cancelScheduledNotifications(record.notificationIds);
          }
          deleteVignetteRecord(carId, recordId);
        },
      },
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Road Tax Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {vignetteHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{record.name}</Text>
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
          {record.country && (
            <Text style={styles.recordDescription}>{record.country}</Text>
          )}
          {record.notes && (
            <Text style={styles.recordDescription}>{record.notes}</Text>
          )}
        </View>
      ))}

      {(!vignetteHistory || vignetteHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No road tax records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Road Tax</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Romania Vignette"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="e.g., Romania"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Purchase Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker('purchaseDate')}
              >
                <Text style={dates.purchaseDate ? styles.inputText : styles.placeholderText}>
                  {dates.purchaseDate ? formatDate('purchaseDate') : 'Select purchase date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.purchaseDate}
                mode="date"
                onConfirm={(d) => onConfirm('purchaseDate', d)}
                onCancel={() => hidePicker('purchaseDate')}
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
                placeholder="50"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.input}
                value={notes}
                onChangeText={setNotes}
                placeholder="Additional notes"
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
