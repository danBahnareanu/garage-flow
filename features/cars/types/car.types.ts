export interface ServiceRecord {
    id: string;
    date: string; // ISO date string
    mileage: number;
    description: string;
    cost: number;
    type: 'maintenance' | 'repair' | 'inspection';
}

export interface Car {
    id: string;
    make: string;         // e.g. Toyota
    model: string;        // e.g. Corolla
    year: number;
    licensePlate: string;
    fuel: 'petrol' | 'diesel' | 'electric' | 'hybrid'; // fuel type
    engineCode?: string; // optional engine code e.g. M54B30
    imageUrl?: string;    // optional thumbnail or photo

    // Insurance information
    insuranceProvider?: string;
    insuranceExpiryDate?: string; // ISO date string
    insuranceCost?: number; // annual cost
    insurancePolicyNumber?: string;

    // Inspections
    technicalInspectionExpiry?: string; // ISO date string
    registrationExpiry?: string; // ISO date string

    // Running costs
    purchasePrice?: number;
    fuelCosts?: number; // cumulative fuel costs
    maintenanceCosts?: number; // cumulative maintenance costs
    repairCosts?: number; // cumulative repair costs

    // Maintenance tracking
    currentMileage?: number;
    lastServiceDate?: string; // ISO date string
    nextServiceDate?: string; // ISO date string
    nextServiceMileage?: number;

    // Service history
    serviceHistory?: ServiceRecord[];

    // Additional details
    vin?: string; // Vehicle Identification Number
    color?: string;
    transmission?: 'manual' | 'automatic';
    notes?: string;
}