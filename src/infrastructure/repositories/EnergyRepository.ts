import { BaseApiClient } from '../http/BaseApiClient';
import {
  IEnergyRepository,
  EnergyQueryFilters,
  TimePeriod,
  ConsumptionStatistics,
  PeakUsage,
  EnergyTrend
} from '../../domain/interfaces/repositories/IEnergyRepository';
import { EnergyConsumption, EnergyReading, EnergyDevice } from '../../domain/entities/Energy';
import { QueryFilters } from '../../domain/interfaces/common/QueryOptions';

export class EnergyRepository extends BaseApiClient implements IEnergyRepository {
  constructor(baseURL: string) {
    super(baseURL);
  }

  // Energy Consumption Methods
  async findConsumptionByClientId(
    clientId: string,
    filters?: EnergyQueryFilters
  ): Promise<EnergyConsumption[]> {
    const params: Record<string, string> = { clientId };

    if (filters?.startDate) {
      params.startDate = filters.startDate.toISOString();
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate.toISOString();
    }
    if (filters?.minConsumption) {
      params.minConsumption = filters.minConsumption.toString();
    }
    if (filters?.maxConsumption) {
      params.maxConsumption = filters.maxConsumption.toString();
    }

    const response = await this.get<EnergyConsumption[]>('/energy/consumption', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch energy consumption data');
    }

    return response.data.map(this.mapConsumptionDates);
  }

  async findConsumptionById(id: string): Promise<EnergyConsumption | null> {
    try {
      const response = await this.get<EnergyConsumption>(`/energy/consumption/${id}`);

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapConsumptionDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createConsumption(
    consumption: Omit<EnergyConsumption, 'id'>
  ): Promise<EnergyConsumption> {
    const response = await this.post<EnergyConsumption>('/energy/consumption', consumption);

    if (!response.success || !response.data) {
      throw new Error('Failed to create energy consumption record');
    }

    return this.mapConsumptionDates(response.data);
  }

  async updateConsumption(
    id: string,
    consumption: Partial<EnergyConsumption>
  ): Promise<EnergyConsumption> {
    const response = await this.put<EnergyConsumption>(
      `/energy/consumption/${id}`,
      consumption
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update energy consumption record');
    }

    return this.mapConsumptionDates(response.data);
  }

  async deleteConsumption(id: string): Promise<void> {
    const response = await this.delete(`/energy/consumption/${id}`);

    if (!response.success) {
      throw new Error('Failed to delete energy consumption record');
    }
  }

  // Energy Readings Methods
  async findReadingsByDeviceId(
    deviceId: string,
    filters?: EnergyQueryFilters
  ): Promise<EnergyReading[]> {
    const params: Record<string, string> = { deviceId };

    if (filters?.startDate) {
      params.startDate = filters.startDate.toISOString();
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate.toISOString();
    }

    const response = await this.get<EnergyReading[]>('/energy/readings', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch energy readings');
    }

    return response.data.map(this.mapReadingDates);
  }

  async findLatestReading(deviceId: string): Promise<EnergyReading | null> {
    try {
      const response = await this.get<EnergyReading>(`/energy/readings/latest/${deviceId}`);

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapReadingDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createReading(reading: Omit<EnergyReading, 'id'>): Promise<EnergyReading> {
    const response = await this.post<EnergyReading>('/energy/readings', reading);

    if (!response.success || !response.data) {
      throw new Error('Failed to create energy reading');
    }

    return this.mapReadingDates(response.data);
  }

  // Energy Devices Methods
  async findAllDevices(filters?: QueryFilters): Promise<EnergyDevice[]> {
    const params: Record<string, string> = {};

    if (filters?.search) {
      params.search = filters.search;
    }
    if (filters?.filters?.status) {
      params.status = filters.filters.status as string;
    }

    const response = await this.get<EnergyDevice[]>('/energy/devices', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch energy devices');
    }

    return response.data.map(this.mapDeviceDates);
  }

  async findDeviceById(id: string): Promise<EnergyDevice | null> {
    try {
      const response = await this.get<EnergyDevice>(`/energy/devices/${id}`);

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapDeviceDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findDevicesByLocation(location: string): Promise<EnergyDevice[]> {
    const response = await this.get<EnergyDevice[]>('/energy/devices', { location });

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch devices by location');
    }

    return response.data.map(this.mapDeviceDates);
  }

  async createDevice(device: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice> {
    const response = await this.post<EnergyDevice>('/energy/devices', device);

    if (!response.success || !response.data) {
      throw new Error('Failed to create energy device');
    }

    return this.mapDeviceDates(response.data);
  }

  async updateDevice(id: string, device: Partial<EnergyDevice>): Promise<EnergyDevice> {
    const response = await this.put<EnergyDevice>(`/energy/devices/${id}`, device);

    if (!response.success || !response.data) {
      throw new Error('Failed to update energy device');
    }

    return this.mapDeviceDates(response.data);
  }

  async deleteDevice(id: string): Promise<void> {
    const response = await this.delete(`/energy/devices/${id}`);

    if (!response.success) {
      throw new Error('Failed to delete energy device');
    }
  }

  // Analytics Methods
  async getConsumptionStatistics(
    clientId: string,
    period: TimePeriod
  ): Promise<ConsumptionStatistics> {
    const params = {
      clientId,
      startDate: period.start.toISOString(),
      endDate: period.end.toISOString(),
      granularity: period.granularity
    };

    const response = await this.get<ConsumptionStatistics>('/energy/analytics/consumption', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch consumption statistics');
    }

    return response.data;
  }

  async getPeakUsageHours(clientId: string, date: Date): Promise<PeakUsage[]> {
    const params = {
      clientId,
      date: date.toISOString().split('T')[0] // YYYY-MM-DD format
    };

    const response = await this.get<PeakUsage[]>('/energy/analytics/peak-usage', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch peak usage hours');
    }

    return response.data;
  }

  async getEnergyTrends(clientId: string, period: TimePeriod): Promise<EnergyTrend[]> {
    const params = {
      clientId,
      startDate: period.start.toISOString(),
      endDate: period.end.toISOString(),
      granularity: period.granularity
    };

    const response = await this.get<EnergyTrend[]>('/energy/analytics/trends', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch energy trends');
    }

    return response.data;
  }

  // Private mapping methods to ensure Date objects are properly handled
  private mapConsumptionDates(consumption: any): EnergyConsumption {
    return {
      ...consumption,
      timestamp: new Date(consumption.timestamp)
    };
  }

  private mapReadingDates(reading: any): EnergyReading {
    return {
      ...reading,
      timestamp: new Date(reading.timestamp)
    };
  }

  private mapDeviceDates(device: any): EnergyDevice {
    return {
      ...device,
      specifications: {
        ...device.specifications,
        installationDate: new Date(device.specifications.installationDate),
        warrantyExpiry: device.specifications.warrantyExpiry
          ? new Date(device.specifications.warrantyExpiry)
          : undefined
      },
      lastReading: device.lastReading ? this.mapReadingDates(device.lastReading) : undefined
    };
  }
}