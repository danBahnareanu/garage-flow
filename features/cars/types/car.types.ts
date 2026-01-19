export interface InsuranceRecord {
    id: string;
    provider: string;
    policyNumber?: string;
    startDate: string;          // ISO date string
    expiryDate: string;         // ISO date string
    cost: number;               // policy cost
    coverageType?: string;      // e.g., 'comprehensive', 'third-party'
    notes?: string;
}

export interface InspectionRecord {
    id: string;
    type: 'technical' | 'registration' | 'emissions' | 'safety' | 'custom' | 'ITP';
    date: string;               // ISO date string
    expiryDate?: string;        // ISO date string (when next inspection is due)
    result: 'pass' | 'fail' | 'pending';
    mileage?: number;
    cost?: number;
    location?: string;          // inspection center
    notes?: string;
}

export interface RunningCostRecord {
    id: string;
    type: 'fuel' | 'maintenance' | 'repair' | 'insurance' | 'tax' | 'parking' | 'toll' | 'other';
    date: string;               // ISO date string
    amount: number;             // cost in currency
    mileage?: number;           // odometer reading at time of expense
    description?: string;
    vendor?: string;
    // Fuel-specific fields
    liters?: number;            // for fuel transactions
    pricePerLiter?: number;     // for fuel transactions
}

export interface MaintenanceRecord {
    id: string;
    date: string;               // ISO date string
    mileage: number;
    type: 'scheduled' | 'unscheduled' | 'recall';
    description: string;
    cost: number;
    partsReplaced?: string[];
    serviceProvider?: string;
    nextServiceDate?: string;   // ISO date string
    nextServiceMileage?: number;
    notes?: string;
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

    // Insurance history
    insuranceHistory?: InsuranceRecord[];

    // Inspection history
    inspectionHistory?: InspectionRecord[];

    // Running costs (individual transactions)
    runningCosts?: RunningCostRecord[];
    purchasePrice?: number; // one-time purchase cost

    // Maintenance tracking
    currentMileage?: number;
    maintenanceHistory?: MaintenanceRecord[];

    // Additional details
    vin?: string; // Vehicle Identification Number
    color?: string;
    transmission?: 'manual' | 'automatic';
    notes?: string;
}
