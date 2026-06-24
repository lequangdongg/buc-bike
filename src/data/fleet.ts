import evo200 from '../assets/bike-evo-200-lite-white.jpg';
import feliz from '../assets/bike-feliz-lite.png';
import grand from '../assets/bike-evo-grand-lite.jpg';
import type { ImageMetadata } from 'astro';

export type BikeId = 'evo-200-lite' | 'feliz-lite' | 'evo-grand-lite';

export interface Bike {
  id: BikeId;
  name: string;
  brand: string;
  image: ImageMetadata;
  /** Max range on a single charge (km), incl. optional extra battery where noted. */
  rangeKm: number;
  topSpeedKmh: number;
  /** Under-seat storage (litres). */
  trunkL: number;
  available: boolean;
}

export const BIKES: Bike[] = [
  { id: 'evo-200-lite', name: 'VinFast Evo 200 Lite', brand: 'VinFast', image: evo200, rangeKm: 203, topSpeedKmh: 50, trunkL: 22, available: true },
  { id: 'feliz-lite', name: 'VinFast Feliz Lite', brand: 'VinFast', image: feliz, rangeKm: 262, topSpeedKmh: 48, trunkL: 34, available: true },
  { id: 'evo-grand-lite', name: 'VinFast Evo Grand Lite', brand: 'VinFast', image: grand, rangeKm: 198, topSpeedKmh: 48, trunkL: 35, available: true },
];

export const getBike = (id: string): Bike | undefined => BIKES.find((b) => b.id === id);
