import { TAXONOMY_COLORS } from '@/features/cars/constants/colors';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { TaxonomyItem } from '../types/taxonomy.types';

interface ItemEditorModalProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initial?: TaxonomyItem;
  title: string;
  onClose: () => void;
  onSave: (
    data: { name: string; color: string }, 
    context: {
        mode: 'add' | 'edit';
        kind: 'category' | 'type';
        initial?: TaxonomyItem;
      }) => void;
}

export const ItemEditorModal: React.FC<ItemEditorModalProps> = ({
  visible,
  mode,
  initial,
  title,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(TAXONOMY_COLORS[0]);

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setColor(initial?.color ?? TAXONOMY_COLORS[0]);
    }
  }, [visible, initial]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    onSave({ name: trimmed, color }, { mode, kind: title.toLowerCase() as 'category' | 'type', initial });
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {mode === 'add' ? 'Add' : 'Edit'} {title}
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#8A8A8C"
            autoFocus
          />

          <Text style={styles.label}>Color</Text>
          <View style={styles.swatchGrid}>
            {TAXONOMY_COLORS.map((c) => {
              const isSelected = c === color;
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    isSelected && styles.swatchSelected,
                  ]}
                  onPress={() => setColor(c)}
                />
              );
            })}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#2C1F5E',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E1E1E2',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: '#B0B0B2',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1C1643',
    borderRadius: 10,
    padding: 12,
    color: '#E1E1E2',
    fontSize: 15,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1C1643',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E1E1E2',
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#7142CD',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
