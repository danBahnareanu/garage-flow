import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { tabListStyles as ls } from '@/features/cars/styles/tabList.styles';
import { MaintenanceRecord, ReplacedPart, RUNNING_COST_TYPES, RunningCostType } from '@/features/cars/types/car.types';
import { costTypeColors } from '@/features/cars/styles/runningCost.styles';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
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

const maintenanceTypeColors: Record<MaintenanceRecord['type'], string> = {
  scheduled: '#4CAF50',
  unscheduled: '#FFA500',
  recall: '#FF4444',
  repair: '#FF6B6B',
  upgrade: '#4ECDC4',
  preventive: '#4CAF50',
};

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ carId, maintenanceHistory }) => {
  const { addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextRecord, setContextRecord] = useState<MaintenanceRecord | null>(null);

  // Form fields
  const [maintType, setMaintType] = useState<MaintenanceRecord['type']>('scheduled');
  const [category, setCategory] = useState<RunningCostType>('maintenance');
  const [mileage, setMileage] = useState('');
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
      setCategory(record.category || 'maintenance');
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
      setCategory('maintenance');
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
      category,
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
    <View style={ls.container}>
      <View style={ls.header}>
        <Text style={ls.headerTitle}>Maintenance Records</Text>
        <TouchableOpacity style={ls.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {maintenanceHistory
        ?.slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((record) => (
          <TouchableOpacity
            key={record.id}
            style={ls.card}
            onLongPress={() => setContextRecord(record)}
            activeOpacity={0.8}
          >
            <View style={ls.cardHeader}>
              <Text style={ls.cardDate}>
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <Text style={ls.cardCost}>€{record.cost.toFixed(2)}</Text>
            </View>
            <Text style={ls.cardTitle}>{record.description}</Text>
            <Text style={ls.cardMeta}>{record.mileage.toLocaleString()} km</Text>
            {record.serviceProvider && (
              <Text style={ls.cardMeta}>{record.serviceProvider}</Text>
            )}
            <View style={ls.cardFooter}>
              <View style={ls.badgeRow}>
                <View style={[ls.statusBadge, { backgroundColor: maintenanceTypeColors[record.type] }]}>
                  <Text style={ls.statusBadgeText}>{record.type}</Text>
                </View>
              </View>
            </View>
            {record.partsReplaced && record.partsReplaced.length > 0 && (
              <View style={ls.partsSection}>
                <Text style={ls.partsLabel}>Parts replaced:</Text>
                {record.partsReplaced.map((part, i) => (
                  <View key={i} style={ls.partRow}>
                    <Text style={ls.partName}>{part.name}</Text>
                    <Text style={ls.partCost}>€{part.cost.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

      {(!maintenanceHistory || maintenanceHistory.length === 0) && (
        <Text style={ls.emptyText}>No maintenance records. Tap + to add one.</Text>
      )}

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `${contextRecord.description} — ${new Date(contextRecord.date).toLocaleDateString()}`
            : ''
        }
        actions={[
          {
            label: 'Edit Maintenance',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Maintenance',
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
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Maintenance</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Type</Text>
              <View style={styles.buttonRow}>
                {MAINTENANCE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.optionButton,
                      { borderColor: maintenanceTypeColors[t] },
                      maintType === t && { backgroundColor: maintenanceTypeColors[t], borderColor: maintenanceTypeColors[t] },
                    ]}
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
              <Text style={styles.label}>Category</Text>
              <View style={styles.buttonRow}>
                {RUNNING_COST_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.optionButton,
                      { borderColor: costTypeColors[t] },
                      category === t && { backgroundColor: costTypeColors[t], borderColor: costTypeColors[t] },
                    ]}
                    onPress={() => setCategory(t)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        category === t && styles.optionButtonTextActive,
                      ]}
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
                <Pressable style={styles.partAddButton} onPress={handleAddPart}>
                  <Ionicons name="add" size={18} color="#fff" />
                </Pressable>
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
              <Text style={styles.label}>Next Service Date</Text>
              <TouchableOpacity style={styles.input} onPress={() => showPicker('nextServiceDate')}>
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
