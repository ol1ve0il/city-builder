import { Building } from './building'

export interface City {
  id: number
  name: string
  size: number
  buildings: Building[]
}
