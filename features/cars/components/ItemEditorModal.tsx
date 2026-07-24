import { Colors } from '@/constants/colors';
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
            placeholderTextColor={Colors.textMuted}
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
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
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
    borderColor: Colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
