// useCarStore.ts
import { TAXONOMY_NEUTRAL } from '@/features/cars/constants/colors';
import { costTypeColors } from '@/features/cars/styles/runningCost.styles';
import {
  Car,
  InspectionRecord,
  InsuranceRecord,
  MaintenanceRecord,
  RUNNING_COST_TYPES,
  VignetteRecord,
} from '@/features/cars/types/car.types';
import { asyncStorageAdapter } from '@/store/asyncStorageAdapter';

import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { CategoryItem, MaintTypeItem } from '../types/taxonomy.types';

const MAINT_TYPE_SEEDS: { id: string; name: string; color: string }[] = [
  { id: 'scheduled', name: 'scheduled', color: '#4CAF50' },
  { id: 'unscheduled', name: 'unscheduled', color: '#FFA500' },
  { id: 'recall', name: 'recall', color: '#FF4444' },
  { id: 'upgrade', name: 'upgrade', color: '#4ECDC4' },
  { id: 'preventive', name: 'preventive', color: '#4CAF50' },
  { id: 'repair', name: 'repair', color: '#FF6B6B' },
];

const seedCategories = (): CategoryItem[] => {
  const now = new Date().toISOString();
  return RUNNING_COST_TYPES.map((id) => ({
    id,
    name: id,
    color: costTypeColors[id] ?? TAXONOMY_NEUTRAL,
    createdAt: now,
  }));
};

const seedMaintTypes = (): MaintTypeItem[] => {
  const now = new Date().toISOString();
  return MAINT_TYPE_SEEDS.map((s) => ({ ...s, createdAt: now }));
};

interface CarStore {
  cars: Car[];
  categories: CategoryItem[];
  maintTypes: MaintTypeItem[];
  isHydrated: boolean;

  // Car CRUD
  addCar: (car: Car) => void;
  removeCar: (id: string) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  getCarById: (id: string) => Car | undefined;
  clearCars: () => void;
  setHydrated: (state: boolean) => void;

  // Insurance CRUD
  addInsuranceRecord: (carId: string, record: InsuranceRecord) => void;
  updateInsuranceRecord: (carId: string, recordId: string, updates: Partial<InsuranceRecord>) => void;
  deleteInsuranceRecord: (carId: string, recordId: string) => void;

  // Inspection CRUD
  addInspectionRecord: (carId: string, record: InspectionRecord) => void;
  updateInspectionRecord: (carId: string, recordId: string, updates: Partial<InspectionRecord>) => void;
  deleteInspectionRecord: (carId: string, recordId: string) => void;

  // Vignette CRUD
  addVignetteRecord: (carId: string, record: VignetteRecord) => void;
  updateVignetteRecord: (carId: string, recordId: string, updates: Partial<VignetteRecord>) => void;
  deleteVignetteRecord: (carId: string, recordId: string) => void;

  // Maintenance CRUD
  addMaintenanceRecord: (carId: string, record: MaintenanceRecord) => void;
  updateMaintenanceRecord: (carId: string, recordId: string, updates: Partial<MaintenanceRecord>) => void;
  deleteMaintenanceRecord: (carId: string, recordId: string) => void;

  // Category taxonomy CRUD
  addCategory: (item: CategoryItem) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Maintenance type taxonomy CRUD
  addMaintType: (item: MaintTypeItem) => void;
  updateMaintType: (id: string, updates: Partial<MaintTypeItem>) => void;
  deleteMaintType: (id: string) => void;

  ensureSeeded: () => void;
}

const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      cars: [] as Car[],
      categories: [],
      maintTypes: [],
      isHydrated: false,

      // Car CRUD
      addCar: (car) => {
        set((state) => ({ cars: [...state.cars, car] }));
      },

      removeCar: (id) => {
        set((state) => ({
          cars: state.cars.filter((car) => car.id !== id),
        }));
      },

      updateCar: (id, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, ...updates } : car
          ),
        }));
      },

      getCarById: (id): Car | undefined => {
        return useCarStore.getState().cars.find((car: Car) => car.id === id);
      },

      clearCars: () => {
        set({ cars: [] });
      },

      setHydrated: (state) => {
        set({ isHydrated: state });
      },

      // Insurance CRUD
      addInsuranceRecord: (carId, record) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  insuranceHistory: [record, ...(car.insuranceHistory || [])],
                }
              : car
          ),
        }));
      },

      updateInsuranceRecord: (carId, recordId, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  insuranceHistory: car.insuranceHistory?.map((r) =>
                    r.id === recordId ? { ...r, ...updates } : r
                  ),
                }
              : car
          ),
        }));
      },

      deleteInsuranceRecord: (carId, recordId) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  insuranceHistory: car.insuranceHistory?.filter(
                    (r) => r.id !== recordId
                  ),
                }
              : car
          ),
        }));
      },

      // Inspection CRUD
      addInspectionRecord: (carId, record) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  inspectionHistory: [record, ...(car.inspectionHistory || [])],
                }
              : car
          ),
        }));
      },

      updateInspectionRecord: (carId, recordId, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  inspectionHistory: car.inspectionHistory?.map((r) =>
                    r.id === recordId ? { ...r, ...updates } : r
                  ),
                }
              : car
          ),
        }));
      },

      deleteInspectionRecord: (carId, recordId) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  inspectionHistory: car.inspectionHistory?.filter(
                    (r) => r.id !== recordId
                  ),
                }
              : car
          ),
        }));
      },

      // Vignette CRUD
      addVignetteRecord: (carId, record) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  vignetteHistory: [record, ...(car.vignetteHistory || [])],
                }
              : car
          ),
        }));
      },

      updateVignetteRecord: (carId, recordId, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  vignetteHistory: car.vignetteHistory?.map((r) =>
                    r.id === recordId ? { ...r, ...updates } : r
                  ),
                }
              : car
          ),
        }));
      },

      deleteVignetteRecord: (carId, recordId) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  vignetteHistory: car.vignetteHistory?.filter(
                    (r) => r.id !== recordId
                  ),
                }
              : car
          ),
        }));
      },

      // Maintenance CRUD
      addMaintenanceRecord: (carId, record) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  maintenanceHistory: [record, ...(car.maintenanceHistory || [])],
                }
              : car
          ),
        }));
      },

      updateMaintenanceRecord: (carId, recordId, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  maintenanceHistory: car.maintenanceHistory?.map((r) =>
                    r.id === recordId ? { ...r, ...updates } : r
                  ),
                }
              : car
          ),
        }));
      },

      deleteMaintenanceRecord: (carId, recordId) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  maintenanceHistory: car.maintenanceHistory?.filter(
                    (r) => r.id !== recordId
                  ),
                }
              : car
          ),
        }));
      },

      // Category taxonomy CRUD
      addCategory: (item) => {
        set((state) => ({ categories: [...state.categories, item] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          cars: state.cars.map((car) =>
            car.maintenanceHistory
              ? {
                  ...car,
                  maintenanceHistory: car.maintenanceHistory.map((r) =>
                    r.category === id ? { ...r, category: 'maintenance' } : r
                  ),
                }
              : car
          ),
        }));
      },

      // Maintenance type taxonomy CRUD
      addMaintType: (item) => {
        set((state) => ({ maintTypes: [...state.maintTypes, item] }));
      },

      updateMaintType: (id, updates) => {
        set((state) => ({
          maintTypes: state.maintTypes.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteMaintType: (id) => {
        set((state) => ({
          maintTypes: state.maintTypes.filter((t) => t.id !== id),
          cars: state.cars.map((car) =>
            car.maintenanceHistory
              ? {
                  ...car,
                  maintenanceHistory: car.maintenanceHistory.map((r) =>
                    r.type === id ? { ...r, type: undefined } : r
                  ),
                }
              : car
          ),
        }));
      },

      ensureSeeded: () => {
        set((state) => ({
          categories: state.categories.length === 0 ? seedCategories() : state.categories,
          maintTypes: state.maintTypes.length === 0 ? seedMaintTypes() : state.maintTypes,
        }));
      },
    }),
    {
      name: 'car-storage',
      storage: createJSONStorage(() => asyncStorageAdapter as StateStorage),
      partialize: (state) => ({
        cars: state.cars,
        categories: state.categories,
        maintTypes: state.maintTypes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.ensureSeeded();
        state?.setHydrated(true);
      },
    }
  )
);

export default useCarStore;
