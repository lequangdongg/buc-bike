import evo200 from '../assets/bike-evo-200-lite-cut.png';
import feliz from '../assets/feliz-lite-bright.png';
import grand from '../assets/bike-evo-grand-lite-cut.png';
import type { ImageMetadata } from 'astro';

export type BikeId = 'evo-200-lite' | 'feliz-lite' | 'evo-grand-lite';

export interface Bike {
  id: BikeId;
  name: string;
  brand: string;
  image: ImageMetadata;
  imagePadded: boolean;
  glow: string;
  rangeKm: number;
  topSpeedKmh: number;
  trunkL: number;
  trunkWithExtraBatteryL: number | null;
  available: boolean;
}

export const BIKES: Bike[] = [
  {
    id: 'evo-200-lite',
    name: 'VinFast Evo 200 Lite',
    brand: 'VinFast',
    image: evo200,
    imagePadded: false,
    glow: 'rgba(239, 68, 68, 0.3)',
    rangeKm: 150,
    topSpeedKmh: 49,
    trunkL: 22,
    trunkWithExtraBatteryL: null,
    available: true,
  },
  {
    id: 'feliz-lite',
    name: 'VinFast Feliz Lite',
    brand: 'VinFast',
    image: feliz,
    imagePadded: true,
    glow: 'rgba(176, 204, 176, 0.3)',
    rangeKm: 100,
    topSpeedKmh: 48,
    trunkL: 34,
    trunkWithExtraBatteryL: 15,
    available: true,
  },
  {
    id: 'evo-grand-lite',
    name: 'VinFast Evo Grand Lite',
    brand: 'VinFast',
    image: grand,
    imagePadded: false,
    glow: 'rgba(226, 204, 164, 0.28)',
    rangeKm: 100,
    topSpeedKmh: 48,
    trunkL: 35,
    trunkWithExtraBatteryL: 16,
    available: true,
  },
];

export const MAX_RANGE_KM = Math.max(...BIKES.map((bike) => bike.rangeKm));

export const getBike = (id: string): Bike | undefined => BIKES.find((b) => b.id === id);
