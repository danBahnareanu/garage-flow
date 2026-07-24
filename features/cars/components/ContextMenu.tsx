import { Colors } from '@/constants/colors';
import { BottomSheetModal } from '@/features/cars/components/BottomSheetModal';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ContextMenuAction {
  label: string;
  icon: string;
  color?: string;
  onPress: () => void;
}

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  actions: ContextMenuAction[];
  /** Render as an absolute overlay instead of a native Modal — only needed when
   *  shown inside another native Modal (e.g. within a form sheet) */
  asOverlay?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  onClose,
  title,
  actions,
  asOverlay = false,
}) => {
  // Run the chosen action only after the menu's modal has fully closed, so a
  // modal the action opens isn't torn down with this one (iOS)
  const pendingAction = useRef<(() => void) | null>(null);

  const handleClosed = () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      dragArea="full"
      asOverlay={asOverlay}
      contentStyle={styles.sheetContent}
      onClosed={handleClosed}
    >
      <Text style={styles.title}>{title}</Text>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => {
            pendingAction.current = action.onPress;
            onClose();
          }}
        >
          <Ionicons
            name={action.icon as any}
            size={24}
            color={action.color || Colors.textPrimary}
          />
          <Text style={[styles.menuItemText, action.color ? { color: action.color } : undefined]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingBottom: 40,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  menuItemText: {
    color: Colors.textPrimary,
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
  },
});
