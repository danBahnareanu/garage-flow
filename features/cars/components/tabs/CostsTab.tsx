import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { RunningCostRecord } from '@/features/cars/types/car.types';
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

interface CostsTabProps {
  carId: string;
  runningCosts?: RunningCostRecord[];
}

const COST_TYPES: RunningCostRecord['type'][] = [
  'fuel',
  'maintenance',
  'repair',
  'insurance',
  'tax',
  'parking',
  'toll',
  'other',
];

export const CostsTab: React.FC<CostsTabProps> = ({ carId, runningCosts }) => {
  const { addRunningCostRecord, updateRunningCostRecord, deleteRunningCostRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [costType, setCostType] = useState<RunningCostRecord['type']>('fuel');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');

  const openModal = (record?: RunningCostRecord) => {
    if (record) {
      setEditingId(record.id);
      setCostType(record.type);
      setDate(record.date);
      setAmount(record.amount.toString());
      setMileage(record.mileage?.toString() || '');
      setDescription(record.description || '');
      setVendor(record.vendor || '');
      setLiters(record.liters?.toString() || '');
      setPricePerLiter(record.pricePerLiter?.toString() || '');
    } else {
      setEditingId(null);
      setCostType('fuel');
      setDate('');
      setAmount('');
      setMileage('');
      setDescription('');
      setVendor('');
      setLiters('');
      setPricePerLiter('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!date || !amount) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: RunningCostRecord = {
      id: editingId || generateId(),
      type: costType,
      date,
      amount: parseFloat(amount),
      mileage: mileage ? parseInt(mileage, 10) : undefined,
      description: description || undefined,
      vendor: vendor || undefined,
      liters: liters ? parseFloat(liters) : undefined,
      pricePerLiter: pricePerLiter ? parseFloat(pricePerLiter) : undefined,
    };
    if (editingId) {
      updateRunningCostRecord(carId, editingId, record);
    } else {
      addRunningCostRecord(carId, record);
    }
    setModalVisible(false);
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRunningCostRecord(carId, recordId),
      },
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Running Costs</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {runningCosts?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordTitleRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{record.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.costAmount}>€{record.amount.toFixed(2)}</Text>
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
            {new Date(record.date).toLocaleDateString()}
          </Text>
          {record.description && (
            <Text style={styles.recordDescription}>{record.description}</Text>
          )}
        </View>
      ))}

      {(!runningCosts || runningCosts.length === 0) && (
        <Text style={styles.noRecordsText}>No cost records. Tap + to add one.</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Cost</Text>
            <ScrollView>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtonsWrap}>
                {COST_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, costType === t && styles.typeButtonActive]}
                    onPress={() => setCostType(t)}
                  >
                    <Text
                      style={[styles.typeButtonText, costType === t && styles.typeButtonTextActive]}
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
              <Text style={styles.label}>Amount * (€)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="50"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Mileage (km)</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="125000"
                placeholderTextColor="#8A8A8C"
                keyboardType="number-pad"
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Fuel fill-up"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Vendor</Text>
              <TextInput
                style={styles.input}
                value={vendor}
                onChangeText={setVendor}
                placeholder="Shell"
                placeholderTextColor="#8A8A8C"
              />
              {costType === 'fuel' && (
                <>
                  <Text style={styles.label}>Liters</Text>
                  <TextInput
                    style={styles.input}
                    value={liters}
                    onChangeText={setLiters}
                    placeholder="45"
                    placeholderTextColor="#8A8A8C"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.label}>Price per Liter (€)</Text>
                  <TextInput
                    style={styles.input}
                    value={pricePerLiter}
                    onChangeText={setPricePerLiter}
                    placeholder="1.45"
                    placeholderTextColor="#8A8A8C"
                    keyboardType="decimal-pad"
                  />
                </>
              )}
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
