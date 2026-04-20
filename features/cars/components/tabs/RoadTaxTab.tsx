import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { tabListStyles as ls } from '@/features/cars/styles/tabList.styles';
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
  const [contextRecord, setContextRecord] = useState<VignetteRecord | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

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
    <View style={ls.container}>
      <View style={ls.header}>
        <Text style={ls.headerTitle}>Road Tax Records</Text>
        <TouchableOpacity style={ls.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {vignetteHistory
        ?.slice()
        .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())
        .map((record) => {
          const daysRemaining = Math.ceil(
            (new Date(record.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const isExpired = daysRemaining < 0;
          const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 30;
          return (
            <TouchableOpacity
              key={record.id}
              style={ls.card}
              onLongPress={() => setContextRecord(record)}
              activeOpacity={0.8}
            >
              <View style={ls.cardHeader}>
                <Text style={ls.cardDate}>
                  {new Date(record.purchaseDate).toLocaleDateString()} – {new Date(record.expiryDate).toLocaleDateString()}
                </Text>
                <Text style={ls.cardCost}>€{record.cost.toFixed(2)}</Text>
              </View>
              <Text style={ls.cardTitle}>{record.name}</Text>
              {record.country && (
                <Text style={ls.cardMeta}>{record.country}</Text>
              )}
              {record.notes && (
                <Text style={ls.cardMeta}>{record.notes}</Text>
              )}
              <View style={ls.cardFooter}>
                <Text style={ls.cardMeta}>
                  {isExpired
                    ? `Expired ${Math.abs(daysRemaining)} days ago`
                    : `${daysRemaining} days remaining`}
                </Text>
                <View style={ls.badgeRow}>
                  <View
                    style={[
                      ls.statusBadge,
                      {
                        backgroundColor: isExpired
                          ? '#FF4444'
                          : isExpiringSoon
                            ? '#FFA500'
                            : '#4CAF50',
                      },
                    ]}
                  >
                    <Text style={ls.statusBadgeText}>
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Soon' : 'Valid'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      {(!vignetteHistory || vignetteHistory.length === 0) && (
        <Text style={ls.emptyText}>No road tax records. Tap + to add one.</Text>
      )}

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `${contextRecord.name}${contextRecord.country ? ` — ${contextRecord.country}` : ''}`
            : ''
        }
        actions={[
          {
            label: 'Edit Road Tax',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Road Tax',
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
              <TouchableOpacity style={styles.input} onPress={() => showPicker('purchaseDate')}>
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
              <TouchableOpacity style={styles.input} onPress={() => showPicker('expiryDate')}>
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
