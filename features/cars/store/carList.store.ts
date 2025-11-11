// useCarStore.ts
import carList from '@/database/carList'
import { Car } from '@/features/cars/types/car.types'
import { create } from 'zustand'


interface CarStore {
  cars: Car[]
  addCar: (car: Car) => void
  removeCar: (id: string) => void,
  clearCars: () => void
}

const useCarStore = create<CarStore>((set, get) => ({
  cars: carList,
  addCar: (car) => {
    set((state) => ({cars: [...state.cars, car]}))
    },
  removeCar: (id) => {
    set((state) => ({cars: state.cars.filter((car) => car.id !== id)}))
  },
  clearCars: () => {
    set({ cars: [] })
  }
}));

// const storage: StateStorage = {
//   getItem: async (name) => {
//     const value = await AsyncStorage.getItem(name)
//     return value ?? null
//   },
//   setItem: async (name, value) => {
//     await AsyncStorage.setItem(name, value)
//   },
//   removeItem: async (name) => {
//     await AsyncStorage.removeItem(name)
//   },
// }

export default useCarStore
