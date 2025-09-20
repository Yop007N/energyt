import { BaseApiClient } from '../http/BaseApiClient';
import {
  IClientRepository,
  ClientQueryFilters,
  ClientStatistics,
  ClientTypeStatistics,
  TopConsumer
} from '../../domain/interfaces/repositories/IClientRepository';
import { Client, ClientType, AccountStatus } from '../../domain/entities/Client';
import { QueryResult } from '../../domain/interfaces/common/QueryOptions';

export class ClientRepository extends BaseApiClient implements IClientRepository {
  constructor(baseURL: string) {
    super(baseURL);
  }

  async findAll(filters?: ClientQueryFilters): Promise<Client[]> {
    const params: Record<string, string> = {};

    if (filters?.clientType) {
      params.clientType = filters.clientType;
    }
    if (filters?.accountStatus) {
      params.accountStatus = filters.accountStatus;
    }
    if (filters?.city) {
      params.city = filters.city;
    }
    if (filters?.registrationDateFrom) {
      params.registrationDateFrom = filters.registrationDateFrom.toISOString();
    }
    if (filters?.registrationDateTo) {
      params.registrationDateTo = filters.registrationDateTo.toISOString();
    }
    if (filters?.hasActiveContract !== undefined) {
      params.hasActiveContract = filters.hasActiveContract.toString();
    }

    const response = await this.get<Client[]>('/clients', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch clients');
    }

    return response.data.map(this.mapClientDates);
  }

  async findById(id: string): Promise<Client | null> {
    try {
      const response = await this.get<Client>(`/clients/${id}`);

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapClientDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByIdentification(identification: string): Promise<Client | null> {
    try {
      const response = await this.get<Client>('/clients/by-identification', { identification });

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapClientDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Client | null> {
    try {
      const response = await this.get<Client>('/clients/by-email', { email });

      if (!response.success || !response.data) {
        return null;
      }

      return this.mapClientDates(response.data);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByType(clientType: ClientType): Promise<Client[]> {
    const response = await this.get<Client[]>('/clients', { clientType });

    if (!response.success || !response.data) {
      throw new Error(`Failed to fetch clients of type ${clientType}`);
    }

    return response.data.map(this.mapClientDates);
  }

  async findByStatus(status: AccountStatus): Promise<Client[]> {
    const response = await this.get<Client[]>('/clients', { accountStatus: status });

    if (!response.success || !response.data) {
      throw new Error(`Failed to fetch clients with status ${status}`);
    }

    return response.data.map(this.mapClientDates);
  }

  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const response = await this.post<Client>('/clients', client);

    if (!response.success || !response.data) {
      throw new Error('Failed to create client');
    }

    return this.mapClientDates(response.data);
  }

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const response = await this.put<Client>(`/clients/${id}`, client);

    if (!response.success || !response.data) {
      throw new Error('Failed to update client');
    }

    return this.mapClientDates(response.data);
  }

  async delete(id: string): Promise<void> {
    const response = await this.delete(`/clients/${id}`);

    if (!response.success) {
      throw new Error('Failed to delete client');
    }
  }

  async search(query: string, filters?: ClientQueryFilters): Promise<QueryResult<Client>> {
    const params: Record<string, string> = { query };

    if (filters?.clientType) {
      params.clientType = filters.clientType;
    }
    if (filters?.accountStatus) {
      params.accountStatus = filters.accountStatus;
    }
    if (filters?.pagination?.page) {
      params.page = filters.pagination.page.toString();
    }
    if (filters?.pagination?.limit) {
      params.limit = filters.pagination.limit.toString();
    }

    const response = await this.get<QueryResult<Client>>('/clients/search', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to search clients');
    }

    return {
      ...response.data,
      data: response.data.data.map(this.mapClientDates)
    };
  }

  async getClientStatistics(): Promise<ClientStatistics> {
    const response = await this.get<ClientStatistics>('/clients/statistics');

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch client statistics');
    }

    return response.data;
  }

  async getClientsByConsumptionRange(
    minConsumption: number,
    maxConsumption: number
  ): Promise<Client[]> {
    const params = {
      minConsumption: minConsumption.toString(),
      maxConsumption: maxConsumption.toString()
    };

    const response = await this.get<Client[]>('/clients/by-consumption', params);

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch clients by consumption range');
    }

    return response.data.map(this.mapClientDates);
  }

  // Private method to handle date mapping
  private mapClientDates(client: any): Client {
    return {
      ...client,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt),
      accountInfo: {
        ...client.accountInfo,
        startDate: new Date(client.accountInfo.startDate),
        endDate: client.accountInfo.endDate ? new Date(client.accountInfo.endDate) : undefined
      }
    };
  }
}