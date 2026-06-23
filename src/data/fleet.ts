import evo from '../assets/bike-evo-200-lite.png';
import feliz from '../assets/bike-feliz-s.png';
import theon from '../assets/bike-theon.png';
import type { ImageMetadata } from 'astro';

export type BikeId = 'evo-200-lite' | 'feliz-s' | 'theon';

export interface Bike {
  id: BikeId;
  name: string;
  brand: string;
  image: ImageMetadata;
  rangeKm: number;
  topSpeedKmh: number;
  seats: number;
  available: boolean;
}

export const BIKES: Bike[] = [
  { id: 'evo-200-lite', name: 'VinFast Evo 200 Lite', brand: 'VinFast', image: evo, rangeKm: 120, topSpeedKmh: 70, seats: 2, available: true },
  { id: 'feliz-s', name: 'VinFast Feliz S', brand: 'VinFast', image: feliz, rangeKm: 100, topSpeedKmh: 78, seats: 2, available: true },
  { id: 'theon', name: 'VinFast Theon', brand: 'VinFast', image: theon, rangeKm: 150, topSpeedKmh: 90, seats: 2, available: true },
];

export const getBike = (id: string): Bike | undefined => BIKES.find((b) => b.id === id);
