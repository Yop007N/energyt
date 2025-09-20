import { IEnergyRepository, TimePeriod, TimeGranularity } from '../../domain/interfaces/repositories/IEnergyRepository';
import { IClientRepository } from '../../domain/interfaces/repositories/IClientRepository';
import { Client } from '../../domain/entities/Client';
import { EnergyConsumption } from '../../domain/entities/Energy';

export interface DashboardStats {
  totalConsumption: number;
  totalCost: number;
  activeDevices: number;
  totalClients: number;
  consumptionTrend: number;
  costTrend: number;
  peakHours: PeakHourData[];
  monthlyData: MonthlyData[];
  alerts: DashboardAlert[];
}

export interface PeakHourData {
  hour: number;
  consumption: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  consumption: number;
  cost: number;
  clients: number;
}

export interface DashboardAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  clientId?: string;
  deviceId?: string;
}

export enum AlertType {
  HIGH_CONSUMPTION = 'HIGH_CONSUMPTION',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class GetDashboardStatsUseCase {
  constructor(
    private energyRepository: IEnergyRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(period?: TimePeriod): Promise<DashboardStats> {
    const defaultPeriod = period || this.getDefaultPeriod();

    try {
      const [
        totalConsumption,
        totalCost,
        activeDevices,
        totalClients,
        consumptionTrend,
        peakHours,
        monthlyData,
        alerts
      ] = await Promise.all([
        this.getTotalConsumption(defaultPeriod),
        this.getTotalCost(defaultPeriod),
        this.getActiveDevicesCount(),
        this.getTotalClientsCount(),
        this.getConsumptionTrend(defaultPeriod),
        this.getPeakHours(defaultPeriod),
        this.getMonthlyData(defaultPeriod),
        this.getAlerts()
      ]);

      return {
        totalConsumption,
        totalCost,
        activeDevices,
        totalClients,
        consumptionTrend,
        costTrend: this.calculateCostTrend(totalCost, defaultPeriod),
        peakHours,
        monthlyData,
        alerts
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  private async getTotalConsumption(period: TimePeriod): Promise<number> {
    const clients = await this.clientRepository.findAll();
    let totalConsumption = 0;

    for (const client of clients) {
      const consumption = await this.energyRepository.findConsumptionByClientId(
        client.id,
        {
          startDate: period.start,
          endDate: period.end
        }
      );
      totalConsumption += consumption.reduce((sum, c) => sum + c.consumption, 0);
    }

    return totalConsumption;
  }

  private async getTotalCost(period: TimePeriod): Promise<number> {
    const clients = await this.clientRepository.findAll();
    let totalCost = 0;

    for (const client of clients) {
      const consumption = await this.energyRepository.findConsumptionByClientId(
        client.id,
        {
          startDate: period.start,
          endDate: period.end
        }
      );
      totalCost += consumption.reduce((sum, c) => sum + c.cost, 0);
    }

    return totalCost;
  }

  private async getActiveDevicesCount(): Promise<number> {
    const devices = await this.energyRepository.findAllDevices({
      filters: { status: 'ONLINE' }
    });
    return devices.length;
  }

  private async getTotalClientsCount(): Promise<number> {
    const clients = await this.clientRepository.findAll();
    return clients.length;
  }

  private async getConsumptionTrend(period: TimePeriod): Promise<number> {
    const previousPeriod = this.getPreviousPeriod(period);

    const [currentConsumption, previousConsumption] = await Promise.all([
      this.getTotalConsumption(period),
      this.getTotalConsumption(previousPeriod)
    ]);

    if (previousConsumption === 0) return 0;

    return ((currentConsumption - previousConsumption) / previousConsumption) * 100;
  }

  private calculateCostTrend(currentCost: number, period: TimePeriod): number {
    // Implementation would be similar to consumption trend
    // For now, returning a mock calculation
    return Math.random() * 20 - 10; // Random trend between -10% and +10%
  }

  private async getPeakHours(period: TimePeriod): Promise<PeakHourData[]> {
    // Implementation would aggregate consumption by hour
    // For now, returning mock data
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      consumption: Math.random() * 1000,
      percentage: Math.random() * 100
    }));
  }

  private async getMonthlyData(period: TimePeriod): Promise<MonthlyData[]> {
    // Implementation would aggregate data by month
    // For now, returning mock data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      consumption: Math.random() * 10000,
      cost: Math.random() * 5000,
      clients: Math.floor(Math.random() * 100)
    }));
  }

  private async getAlerts(): Promise<DashboardAlert[]> {
    // Implementation would fetch real alerts
    // For now, returning mock data
    return [
      {
        id: '1',
        type: AlertType.HIGH_CONSUMPTION,
        severity: AlertSeverity.HIGH,
        message: 'High consumption detected for Client ABC',
        timestamp: new Date(),
        clientId: 'client-123'
      }
    ];
  }

  private getDefaultPeriod(): TimePeriod {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);

    return {
      start,
      end,
      granularity: TimeGranularity.DAY
    };
  }

  private getPreviousPeriod(period: TimePeriod): TimePeriod {
    const duration = period.end.getTime() - period.start.getTime();
    const start = new Date(period.start.getTime() - duration);
    const end = new Date(period.end.getTime() - duration);

    return {
      start,
      end,
      granularity: period.granularity
    };
  }
}