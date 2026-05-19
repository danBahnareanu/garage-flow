// features/cars/hooks/useTaxonomyItem.ts
import { Alert } from 'react-native';
import useCarStore from '../store/carList.store';
import { generateId } from '../types/editCarDetail.types';
import { TaxonomyItem } from '../types/taxonomy.types';

interface UseTaxonomyItemProps {
  onCategoryChange?: (categoryId: string) => void;
  onTypeChange?: (typeId: string | undefined) => void;
}

export const useTaxonomyItem = ({ onCategoryChange, onTypeChange }: UseTaxonomyItemProps = {}) => {
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    addMaintType,
    updateMaintType,
    deleteMaintType,
  } = useCarStore();

  const handleTaxonomySave = (
    data: { name: string; color: string },
    context: {
      mode: 'add' | 'edit';
      kind: 'category' | 'type';
      initial?: TaxonomyItem;
    }
  ) => {
    if (context.kind === 'category') {
      if (context.mode === 'add') {
        const existing = useCarStore.getState().categories;
        if (existing.some((c) => c.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
          Alert.alert('Duplicate Category', `A category named "${data.name}" already exists.`);
          return;
        }
        const item: TaxonomyItem = {
          id: generateId(),
          name: data.name,
          color: data.color,
          createdAt: new Date().toISOString(),
        };
        addCategory(item);
        onCategoryChange?.(item.name);
      } else if (context.initial) {
        updateCategory(context.initial.id, { name: data.name, color: data.color });
      }
    } else {
      if (context.mode === 'add') {
        const existing = useCarStore.getState().maintTypes;
        if (existing.some((t) => t.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
          Alert.alert('Duplicate Type', `A type named "${data.name}" already exists.`);
          return;
        }
        const item: TaxonomyItem = {
          id: generateId(),
          name: data.name,
          color: data.color,
          createdAt: new Date().toISOString(),
        };
        addMaintType(item);
        onTypeChange?.(item.name);
      } else if (context.initial) {
        updateMaintType(context.initial.id, { name: data.name, color: data.color });
      }
    }
  };

  const handleTaxonomyDelete = (
    kind: 'category' | 'type',
    item: TaxonomyItem,
    options?: {
      currentCategoryId?: string;
      currentTypeId?: string;
      onCategoryDeleted?: () => void;
      onTypeDeleted?: () => void;
    }
  ) => {
    Alert.alert(
      `Delete ${kind === 'category' ? 'Category' : 'Type'}`,
      `Delete "${item.name}"? Existing records will fall back to ${kind === 'category' ? '"Maintenance"' : 'no type'}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (kind === 'category') {
              deleteCategory(item.id);
              if (options?.currentCategoryId === item.name) {
                onCategoryChange?.('maintenance');
              }
              options?.onCategoryDeleted?.();
            } else {
              deleteMaintType(item.id);
              if (options?.currentTypeId === item.name) {
                onTypeChange?.(undefined);
              }
              options?.onTypeDeleted?.();
            }
          },
        },
      ]
    );
  };

  return {
    handleTaxonomySave,
    handleTaxonomyDelete,
  };
};