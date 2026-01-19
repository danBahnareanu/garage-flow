// useCarStore.ts
import carList from '@/database/carList';
import {
  Car,
  InsuranceRecord,
  InspectionRecord,
  RunningCostRecord,
  MaintenanceRecord,
} from '@/features/cars/types/car.types';
import { asyncStorageAdapter } from '@/store/asyncStorageAdapter';

import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

interface CarStore {
  cars: Car[];
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

  // Running Cost CRUD
  addRunningCostRecord: (carId: string, record: RunningCostRecord) => void;
  updateRunningCostRecord: (carId: string, recordId: string, updates: Partial<RunningCostRecord>) => void;
  deleteRunningCostRecord: (carId: string, recordId: string) => void;

  // Maintenance CRUD
  addMaintenanceRecord: (carId: string, record: MaintenanceRecord) => void;
  updateMaintenanceRecord: (carId: string, recordId: string, updates: Partial<MaintenanceRecord>) => void;
  deleteMaintenanceRecord: (carId: string, recordId: string) => void;
}

const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      cars: carList,
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

      getCarById: (id) => {
        return useCarStore.getState().cars.find((car) => car.id === id);
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

      // Running Cost CRUD
      addRunningCostRecord: (carId, record) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  runningCosts: [record, ...(car.runningCosts || [])],
                }
              : car
          ),
        }));
      },

      updateRunningCostRecord: (carId, recordId, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  runningCosts: car.runningCosts?.map((r) =>
                    r.id === recordId ? { ...r, ...updates } : r
                  ),
                }
              : car
          ),
        }));
      },

      deleteRunningCostRecord: (carId, recordId) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === carId
              ? {
                  ...car,
                  runningCosts: car.runningCosts?.filter(
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
    }),
    {
      name: 'car-storage',
      storage: createJSONStorage(() => asyncStorageAdapter as StateStorage),
      partialize: (state) => ({ cars: state.cars }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export default useCarStore;
