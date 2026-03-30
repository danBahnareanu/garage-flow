import { useState, useCallback, useRef } from 'react';

type DateFields<T extends string> = Record<T, Date | null>;
type PickerVisibility<T extends string> = Record<T, boolean>;

function buildRecord<T extends string, V>(keys: readonly T[], value: V): Record<T, V> {
  return Object.fromEntries(keys.map(k => [k, value])) as Record<T, V>;
}

export function useDatePicker<T extends string>(fieldNames: readonly T[]) {
  const fieldsRef = useRef(fieldNames);

  const [dates, setDates] = useState<DateFields<T>>(
    () => buildRecord(fieldsRef.current, null)
  );

  const [pickerVisible, setPickerVisible] = useState<PickerVisibility<T>>(
    () => buildRecord(fieldsRef.current, false)
  );

  const showPicker = useCallback((field: T) => {
    setPickerVisible(prev => ({ ...prev, [field]: true }));
  }, []);

  const hidePicker = useCallback((field: T) => {
    setPickerVisible(prev => ({ ...prev, [field]: false }));
  }, []);

  const onConfirm = useCallback((field: T, selectedDate: Date) => {
    setPickerVisible(prev => ({ ...prev, [field]: false }));
    setDates(prev => ({ ...prev, [field]: selectedDate }));
  }, []);

  const setDate = useCallback((field: T, value: Date | null) => {
    setDates(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setDates(prev => {
      const reset = {} as DateFields<T>;
      for (const key of Object.keys(prev) as T[]) {
        reset[key] = null;
      }
      return reset;
    });
  }, []);

  const formatDate = useCallback((field: T): string => {
    const d = dates[field];
    return d ? d.toLocaleDateString() : '';
  }, [dates]);

  return { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, resetAll, formatDate };
}
