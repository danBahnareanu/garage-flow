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

        // Insurance history
        insuranceHistory: [{
            id: "1",
            provider: "Grawe",
            policyNumber: "",
            startDate: "2024-12-14T14:48:00.000Z",
            expiryDate: "2025-12-14T14:48:00.000Z",
            cost: 400,
            coverageType: "comprehensive"
        }],

        // Inspection history
        inspectionHistory: [{
            id: "1",
            type: "technical",
            date: "2024-12-05T14:48:00.000Z",
            expiryDate: "2025-12-05T14:48:00.000Z",
            result: "pass",
            mileage: 285000
        }],

        // Running costs
        runningCosts: [
            {
                id: "1",
                type: "other",
                date: "2020-01-01T00:00:00.000Z",
                amount: 3000,
                description: "Vehicle purchase"
            },
            {
                id: "2",
                type: "fuel",
                date: "2025-01-01T00:00:00.000Z",
                amount: 7000,
                description: "Cumulative fuel costs"
            },
            {
                id: "3",
                type: "maintenance",
                date: "2025-01-01T00:00:00.000Z",
                amount: 4000,
                description: "Cumulative maintenance costs"
            },
            {
                id: "4",
                type: "repair",
                date: "2025-01-01T00:00:00.000Z",
                amount: 6500,
                description: "Cumulative repair costs"
            }
        ],
        purchasePrice: 3000,

        // Maintenance tracking
        currentMileage: 289000,
        maintenanceHistory: [
            {
                id: "1",
                date: "2025-08-20T14:48:00.000Z",
                mileage: 285000,
                type: "scheduled",
                description: "ulei kroon oil torsynth 5w40 + filtru ulei mann",
                cost: 450,
                nextServiceDate: "2026-08-20T14:48:00.000Z",
                nextServiceMileage: 295000
            },
            {
                id: "2",
                date: "2025-09-20T14:48:00.000Z",
                mileage: 287382,
                type: "scheduled",
                description: "Bujii denso ik24 gap 0.8mm",
                cost: 450
            }
        ],

        // Additional details
        vin: "YS3FF75S556010287",
        color: "Black",
        transmission: 'manual'
    }
]

export default carList;
