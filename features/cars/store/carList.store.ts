// useCarStore.ts
import carList from '@/database/carList';
import { Car } from '@/features/cars/types/car.types';
import { asyncStorageAdapter } from '@/store/asyncStorageAdapter';

import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

interface CarStore {
  cars: Car[];
  addCar: (car: Car) => void;
  removeCar: (id: string) => void;
  clearCars: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      cars: carList, // Default/initial data
      isHydrated: false,
      
      addCar: (car) => {
        set((state) => ({ cars: [...state.cars, car] }));
      },
      
      removeCar: (id) => {
        set((state) => ({ 
          cars: state.cars.filter((car) => car.id !== id) 
        }));
      },
      
      clearCars: () => {
        set({ cars: [] });
      },
      
      setHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: 'car-storage', // Key in AsyncStorage
      storage: createJSONStorage(() => asyncStorageAdapter as StateStorage),
      
      // Only persist the cars array
      partialize: (state) => ({ cars: state.cars }),
      
      // Called when storage is loaded
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export default useCarStore;
