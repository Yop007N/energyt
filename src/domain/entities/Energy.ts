export interface EnergyConsumption {
  id: string;
  clientId: string;
  timestamp: Date;
  consumption: number;
  unit: EnergyUnit;
  rate: number;
  cost: number;
  metadata: EnergyMetadata;
}

export interface EnergyReading {
  id: string;
  deviceId: string;
  timestamp: Date;
  voltage: number;
  current: number;
  power: number;
  frequency: number;
  powerFactor: number;
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  lastReading?: EnergyReading;
  specifications: DeviceSpecifications;
}

export enum EnergyUnit {
  KWH = 'KWH',
  MWH = 'MWH',
  GWH = 'GWH'
}

export enum DeviceType {
  SMART_METER = 'SMART_METER',
  TRANSFORMER = 'TRANSFORMER',
  GENERATOR = 'GENERATOR',
  SOLAR_PANEL = 'SOLAR_PANEL'
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR'
}

export interface EnergyMetadata {
  tariffType?: string;
  peakHours?: boolean;
  weatherConditions?: string;
  location?: GeoLocation;
}

export interface DeviceSpecifications {
  manufacturer: string;
  model: string;
  capacity: number;
  voltage: number;
  installationDate: Date;
  warrantyExpiry?: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}