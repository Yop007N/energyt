// PROBLEMA ARREGLADO: Se creó servicio centralizado para APIs de energía
export interface EnergyConsumption {
  id: string;
  clienteId: string;
  medidorId: string;
  timestamp: Date;
  consumo: number;
  unidad: 'kWh' | 'MWh';
  tarifa: number;
  costo: number;
  periodo: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  direccion: string;
  tipo: 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL';
  email: string;
  telefono: string;
  fechaRegistro: string;
  activo: boolean;
}

export interface Medidor {
  id: string;
  numero: string;
  modelo: string;
  fabricante: string;
  clienteId: string;
  ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
  };
  fechaInstalacion: string;
  activo: boolean;
  ultimaLectura: Date;
}

export interface Factura {
  id: string;
  clienteId: string;
  periodo: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  consumoTotal: number;
  montoTotal: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'VENCIDA';
  detalles: {
    consumoBase: number;
    tarifaBase: number;
    impuestos: number;
    descuentos: number;
  };
}

export interface DashboardStats {
  totalClientes: number;
  consumoTotal: number;
  facturacionTotal: number;
  medidoresActivos: number;
  promedioConsumo: number;
  alertasActivas: number;
}

export interface FilterParams {
  clienteId?: string;
  startDate?: Date;
  endDate?: Date;
  limite?: number;
  tipo?: string;
}

class EnergyAPIService {
  private baseUrl: string;
  private clienteUrl: string;
  private consumoUrl: string;
  private facturacionUrl: string;
  private medidorUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
    this.clienteUrl = import.meta.env.VITE_CLIENTE_SERVICE_URL || 'http://localhost:8002';
    this.consumoUrl = import.meta.env.VITE_CONSUMO_SERVICE_URL || 'http://localhost:8003';
    this.facturacionUrl = import.meta.env.VITE_FACTURACION_SERVICE_URL || 'http://localhost:8006';
    this.medidorUrl = import.meta.env.VITE_MEDIDOR_SERVICE_URL || 'http://localhost:8007';
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Métodos de clientes
  async getClientes(): Promise<Cliente[]> {
    return this.makeRequest<Cliente[]>(`${this.clienteUrl}/clientes`);
  }

  async getCliente(id: string): Promise<Cliente> {
    return this.makeRequest<Cliente>(`${this.clienteUrl}/clientes/${id}`);
  }

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    return this.makeRequest<Cliente>(`${this.clienteUrl}/clientes`, {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  }

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    return this.makeRequest<Cliente>(`${this.clienteUrl}/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  }

  async deleteCliente(id: string): Promise<void> {
    await this.makeRequest<void>(`${this.clienteUrl}/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos de consumo
  async getConsumos(params?: FilterParams): Promise<EnergyConsumption[]> {
    const searchParams = new URLSearchParams();
    if (params?.clienteId) searchParams.append('clienteId', params.clienteId);
    if (params?.startDate) searchParams.append('startDate', params.startDate.toISOString());
    if (params?.endDate) searchParams.append('endDate', params.endDate.toISOString());
    if (params?.limite) searchParams.append('limite', params.limite.toString());

    const queryString = searchParams.toString();
    const url = `${this.consumoUrl}/consumos${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<EnergyConsumption[]>(url);
  }

  async getConsumosByCliente(clienteId: string, startDate?: Date, endDate?: Date): Promise<EnergyConsumption[]> {
    const params = new URLSearchParams({ clienteId });
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    return this.makeRequest<EnergyConsumption[]>(`${this.consumoUrl}/consumos/cliente/${clienteId}?${params}`);
  }

  async createConsumo(consumo: Omit<EnergyConsumption, 'id'>): Promise<EnergyConsumption> {
    return this.makeRequest<EnergyConsumption>(`${this.consumoUrl}/consumos`, {
      method: 'POST',
      body: JSON.stringify(consumo),
    });
  }

  // Métodos de medidores
  async getMedidores(): Promise<Medidor[]> {
    return this.makeRequest<Medidor[]>(`${this.medidorUrl}/medidores`);
  }

  async getMedidor(id: string): Promise<Medidor> {
    return this.makeRequest<Medidor>(`${this.medidorUrl}/medidores/${id}`);
  }

  async getMedidoresByCliente(clienteId: string): Promise<Medidor[]> {
    return this.makeRequest<Medidor[]>(`${this.medidorUrl}/medidores/cliente/${clienteId}`);
  }

  async createMedidor(medidor: Omit<Medidor, 'id'>): Promise<Medidor> {
    return this.makeRequest<Medidor>(`${this.medidorUrl}/medidores`, {
      method: 'POST',
      body: JSON.stringify(medidor),
    });
  }

  async updateMedidor(id: string, medidor: Partial<Medidor>): Promise<Medidor> {
    return this.makeRequest<Medidor>(`${this.medidorUrl}/medidores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medidor),
    });
  }

  // Métodos de facturación
  async getFacturas(params?: FilterParams): Promise<Factura[]> {
    const searchParams = new URLSearchParams();
    if (params?.clienteId) searchParams.append('clienteId', params.clienteId);
    if (params?.startDate) searchParams.append('startDate', params.startDate.toISOString());
    if (params?.endDate) searchParams.append('endDate', params.endDate.toISOString());

    const queryString = searchParams.toString();
    const url = `${this.facturacionUrl}/facturas${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<Factura[]>(url);
  }

  async getFactura(id: string): Promise<Factura> {
    return this.makeRequest<Factura>(`${this.facturacionUrl}/facturas/${id}`);
  }

  async getFacturasByCliente(clienteId: string): Promise<Factura[]> {
    return this.makeRequest<Factura[]>(`${this.facturacionUrl}/facturas/cliente/${clienteId}`);
  }

  async createFactura(factura: Omit<Factura, 'id'>): Promise<Factura> {
    return this.makeRequest<Factura>(`${this.facturacionUrl}/facturas`, {
      method: 'POST',
      body: JSON.stringify(factura),
    });
  }

  async updateFactura(id: string, factura: Partial<Factura>): Promise<Factura> {
    return this.makeRequest<Factura>(`${this.facturacionUrl}/facturas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(factura),
    });
  }

  // Métodos de dashboard y estadísticas
  async getDashboardStats(): Promise<DashboardStats> {
    return this.makeRequest<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  async getConsumosPorPeriodo(periodo: 'day' | 'week' | 'month' | 'year'): Promise<any[]> {
    return this.makeRequest<any[]>(`${this.baseUrl}/dashboard/consumos-periodo?periodo=${periodo}`);
  }

  async getTopConsumidores(limite: number = 10): Promise<any[]> {
    return this.makeRequest<any[]>(`${this.baseUrl}/dashboard/top-consumidores?limite=${limite}`);
  }

  async getConsumosPorTipo(): Promise<any[]> {
    return this.makeRequest<any[]>(`${this.baseUrl}/dashboard/consumos-tipo`);
  }

  // Métodos de configuración
  updateConfig(newConfig: {
    baseUrl?: string;
    clienteUrl?: string;
    consumoUrl?: string;
    facturacionUrl?: string;
    medidorUrl?: string;
  }): void {
    if (newConfig.baseUrl) this.baseUrl = newConfig.baseUrl;
    if (newConfig.clienteUrl) this.clienteUrl = newConfig.clienteUrl;
    if (newConfig.consumoUrl) this.consumoUrl = newConfig.consumoUrl;
    if (newConfig.facturacionUrl) this.facturacionUrl = newConfig.facturacionUrl;
    if (newConfig.medidorUrl) this.medidorUrl = newConfig.medidorUrl;
  }

  getConfig() {
    return {
      baseUrl: this.baseUrl,
      clienteUrl: this.clienteUrl,
      consumoUrl: this.consumoUrl,
      facturacionUrl: this.facturacionUrl,
      medidorUrl: this.medidorUrl,
    };
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; services: any }> {
    try {
      const results = await Promise.allSettled([
        fetch(`${this.clienteUrl}/health`),
        fetch(`${this.consumoUrl}/health`),
        fetch(`${this.facturacionUrl}/health`),
        fetch(`${this.medidorUrl}/health`),
      ]);

      const services = {
        cliente: results[0].status === 'fulfilled' && results[0].value.ok,
        consumo: results[1].status === 'fulfilled' && results[1].value.ok,
        facturacion: results[2].status === 'fulfilled' && results[2].value.ok,
        medidor: results[3].status === 'fulfilled' && results[3].value.ok,
      };

      const allHealthy = Object.values(services).every(status => status);

      return {
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services,
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {},
      };
    }
  }
}

// Export singleton instance
export const energyAPI = new EnergyAPIService();
export default energyAPI;