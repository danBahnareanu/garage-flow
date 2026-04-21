export const RUNNING_COST_TYPES = [
    'fuel',
    'maintenance',
    'repair',
    'insurance',
    'tax',
    'parking',
    'toll',
    'other',
    'aquisition',
    'performance',
    'visual mods',
] as const;

export type RunningCostType = (typeof RUNNING_COST_TYPES)[number];

export interface InsuranceRecord {
    id: string;
    provider: string;
    policyNumber?: string;
    startDate: string;          // ISO date string
    expiryDate: string;         // ISO date string
    cost: number;               // policy cost
    coverageType?: string;      // e.g., 'comprehensive', 'third-party'
    notes?: string;
    pdfUri?: string;             // URI to attached PDF document
    notificationIds?: string[];  // expo-notifications scheduled IDs
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
    notificationIds?: string[];  // expo-notifications scheduled IDs
}

export interface ReplacedPart {
    name: string;
    cost: number;
}

export interface MaintenanceRecord {
    id: string;
    date: string;               // ISO date string
    mileage: number;
    type: 'scheduled' | 'unscheduled' | 'recall' | 'upgrade' | 'preventive' | 'repair';
    category: RunningCostType;
    description: string;
    cost: number;
    partsReplaced?: ReplacedPart[];
    serviceProvider?: string;
    nextServiceDate?: string;   // ISO date string
    nextServiceMileage?: number;
    notes?: string;
}

export interface VignetteRecord {
    id: string;
    name: string;              // e.g., "Romania Vignette", "Hungary e-Vignette"
    purchaseDate: string;      // ISO date string
    expiryDate: string;        // ISO date string
    cost: number;
    country?: string;          // country the vignette is for
    notes?: string;
    notificationIds?: string[];
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

    purchasePrice?: number; // one-time purchase cost

    // Vignette / Road Tax history
    vignetteHistory?: VignetteRecord[];

    // Maintenance tracking
    currentMileage?: number;
    maintenanceHistory?: MaintenanceRecord[];

    // Additional details
    vin?: string; // Vehicle Identification Number
    color?: string;
    transmission?: 'manual' | 'automatic';
    notes?: string;
}
