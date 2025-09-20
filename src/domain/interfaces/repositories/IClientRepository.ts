import { Client, ClientType, AccountStatus } from '../../entities/Client';
import { QueryFilters, QueryResult } from '../common/QueryOptions';

export interface IClientRepository {
  findAll(filters?: ClientQueryFilters): Promise<Client[]>;

  findById(id: string): Promise<Client | null>;

  findByIdentification(identification: string): Promise<Client | null>;

  findByEmail(email: string): Promise<Client | null>;

  findByType(clientType: ClientType): Promise<Client[]>;

  findByStatus(status: AccountStatus): Promise<Client[]>;

  create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client>;

  update(id: string, client: Partial<Client>): Promise<Client>;

  delete(id: string): Promise<void>;

  search(query: string, filters?: ClientQueryFilters): Promise<QueryResult<Client>>;

  getClientStatistics(): Promise<ClientStatistics>;

  getClientsByConsumptionRange(
    minConsumption: number,
    maxConsumption: number
  ): Promise<Client[]>;
}

export interface ClientQueryFilters extends QueryFilters {
  clientType?: ClientType;
  accountStatus?: AccountStatus;
  city?: string;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  hasActiveContract?: boolean;
}

export interface ClientStatistics {
  totalClients: number;
  activeClients: number;
  clientsByType: ClientTypeStatistics[];
  averageConsumption: number;
  topConsumers: TopConsumer[];
  recentRegistrations: number;
}

export interface ClientTypeStatistics {
  type: ClientType;
  count: number;
  percentage: number;
  averageConsumption: number;
}

export interface TopConsumer {
  clientId: string;
  clientName: string;
  consumption: number;
  cost: number;
}