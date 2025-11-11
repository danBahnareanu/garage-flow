export interface Car {
    id: string;
    make: string;         // e.g. Toyota
    model: string;        // e.g. Corolla
    year: number;
    licensePlate: string;
    fuel: 'petrol' | 'diesel' | 'electric' | 'hybrid'; // fuel type
    engineCode?: string; // optional engine code e.g. M54B30
    imageUrl?: string;    // optional thumbnail or photo
}