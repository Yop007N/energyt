// API Service abstraction for Energy Dashboard
// PROBLEMA ARREGLADO: Se agregó configuración de entorno y manejo mejorado de errores
import { MensajeUplink, Captura, FilterParams, ApiError } from '../types';

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout: number = 10000) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
    this.timeout = timeout;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        code: response.status.toString()
      };
      throw error;
    }
    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            message: `Request timeout after ${this.timeout}ms`,
            code: 'TIMEOUT_ERROR'
          } as ApiError;
        }
        throw {
          message: `Network error: ${error.message}`,
          code: 'NETWORK_ERROR'
        } as ApiError;
      }
      throw error;
    }
  }

  async getCapturas(): Promise<Captura[]> {
    return this.request<Captura[]>('/listar-capturas');
  }

  async getUplinkMessages(params?: FilterParams): Promise<MensajeUplink[]> {
    const searchParams = new URLSearchParams();

    if (params?.deviceId) {
      searchParams.append('deviceId', params.deviceId);
    }
    if (params?.startDate) {
      searchParams.append('startDate', params.startDate.toISOString());
    }
    if (params?.endDate) {
      searchParams.append('endDate', params.endDate.toISOString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/uplink-messages${queryString ? `?${queryString}` : ''}`;

    return this.request<MensajeUplink[]>(endpoint);
  }

  // PROBLEMA ARREGLADO: Se agregaron métodos CRUD faltantes para una API completa
  async createCaptura(data: Partial<Captura>): Promise<Captura> {
    return this.request<Captura>('/capturas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCaptura(id: string, data: Partial<Captura>): Promise<Captura> {
    return this.request<Captura>(`/capturas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCaptura(id: string): Promise<void> {
    return this.request<void>(`/capturas/${id}`, {
      method: 'DELETE',
    });
  }

  async getDevices(): Promise<{id: string, name: string}[]> {
    return this.request<{id: string, name: string}[]>('/devices');
  }

  // Método para cambiar configuración dinámicamente
  updateConfig(baseUrl?: string, timeout?: number): void {
    if (baseUrl) this.baseUrl = baseUrl;
    if (timeout) this.timeout = timeout;
  }

  // Método para obtener estadísticas del sistema
  async getStats(): Promise<{totalMessages: number, totalDevices: number, lastUpdate: string}> {
    return this.request<{totalMessages: number, totalDevices: number, lastUpdate: string}>('/stats');
  }
}

export const apiService = new ApiService();