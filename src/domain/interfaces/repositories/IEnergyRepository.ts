import { EnergyConsumption, EnergyReading, EnergyDevice } from '../../entities/Energy';
import { QueryFilters, PaginationOptions, SortOptions } from '../common/QueryOptions';

export interface IEnergyRepository {
  // Energy Consumption
  findConsumptionByClientId(
    clientId: string,
    filters?: EnergyQueryFilters
  ): Promise<EnergyConsumption[]>;

  findConsumptionById(id: string): Promise<EnergyConsumption | null>;

  createConsumption(consumption: Omit<EnergyConsumption, 'id'>): Promise<EnergyConsumption>;

  updateConsumption(id: string, consumption: Partial<EnergyConsumption>): Promise<EnergyConsumption>;

  deleteConsumption(id: string): Promise<void>;

  // Energy Readings
  findReadingsByDeviceId(
    deviceId: string,
    filters?: EnergyQueryFilters
  ): Promise<EnergyReading[]>;

  findLatestReading(deviceId: string): Promise<EnergyReading | null>;

  createReading(reading: Omit<EnergyReading, 'id'>): Promise<EnergyReading>;

  // Energy Devices
  findAllDevices(filters?: QueryFilters): Promise<EnergyDevice[]>;

  findDeviceById(id: string): Promise<EnergyDevice | null>;

  findDevicesByLocation(location: string): Promise<EnergyDevice[]>;

  createDevice(device: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice>;

  updateDevice(id: string, device: Partial<EnergyDevice>): Promise<EnergyDevice>;

  deleteDevice(id: string): Promise<void>;

  // Analytics
  getConsumptionStatistics(
    clientId: string,
    period: TimePeriod
  ): Promise<ConsumptionStatistics>;

  getPeakUsageHours(clientId: string, date: Date): Promise<PeakUsage[]>;

  getEnergyTrends(
    clientId: string,
    period: TimePeriod
  ): Promise<EnergyTrend[]>;
}

export interface EnergyQueryFilters extends QueryFilters {
  startDate?: Date;
  endDate?: Date;
  minConsumption?: number;
  maxConsumption?: number;
  energyUnit?: string;
  deviceType?: string;
  status?: string;
}

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: TimeGranularity;
}

export enum TimeGranularity {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export interface ConsumptionStatistics {
  totalConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  lowestConsumption: number;
  totalCost: number;
  averageCost: number;
  consumptionTrend: number; // percentage change
  costTrend: number; // percentage change
}

export interface PeakUsage {
  hour: number;
  consumption: number;
  cost: number;
}

export interface EnergyTrend {
  period: string;
  consumption: number;
  cost: number;
  change: number; // percentage change from previous period
}