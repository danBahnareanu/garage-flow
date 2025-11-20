import { Car } from "../features/cars/types/car.types";

let carList: Car[] = [
    {
        id: "1",
        make: "Bmw",
        model: "330ci",
        year: 2002,
        licensePlate: "ABC1234",
        fuel: "petrol",
        engineCode: "M54B30",
        imageUrl: "",
        
    },
    {
        id: "4",
        make: "Saab",
        model: "9-3 Convertible",
        year: 2005,
        licensePlate: "B134DVX",
        fuel: "petrol",
        engineCode: "B207L",
        imageUrl: "",
    // Insurance information
        insuranceProvider: "Grawe",
        insuranceExpiryDate: "2025-12-14T14:48:00.000Z",// ISO date string
        insuranceCost: 400,// annual cost
        insurancePolicyNumber: '',
    
        // Inspections
        technicalInspectionExpiry: "2025-12-05T14:48:00.000Z", // ISO date string
    
        // Running costs
        purchasePrice: 3000,
        fuelCosts: 7000, // cumulative fuel costs
        maintenanceCosts: 4000, // cumulative maintenance costs
        repairCosts: 6500, // cumulative repair costs
    
        // Maintenance tracking
        currentMileage: 289000,
        lastServiceDate: "2025-08-20T14:48:00.000Z", // ISO date string
        nextServiceDate: "2026-08-20T14:48:00.000Z", // ISO date string
        nextServiceMileage: 295000,
    
        // Service history
        serviceHistory: [{
            id: "1",
            date: "2025-08-20T14:48:00.000Z", // ISO date string
            mileage: 285000,
            description: "ulei kroon oil torsynth 5w40 + filtru ulei mann",
            cost: 450,
            type: 'maintenance'
        },
        {
            id: "2",
            date: "2025-09-20T14:48:00.000Z", // ISO date string
            mileage: 287382,
            description: "Bujii denso ik24 gap 0.8mm",
            cost: 450,
            type: 'maintenance'
        }
        ],
    
        // Additional details
        vin: "YS3FF75S556010287",// Vehicle Identification Number
        color: "Black",
        transmission: 'manual'
        // notes?: 

        
    }
]

export default carList;