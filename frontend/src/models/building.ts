import { City } from "./city";

export type BuildingType = "HOUSE" | "OFFICE" | "SHOP" | "FACTORY";

export interface Building {
  id: number;
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color?: string;
  modelUrl?: string;
  rotation?: number;
  type: BuildingType;

  cityId: number,
  city: City,
}