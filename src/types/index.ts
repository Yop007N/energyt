// Types for Energy Dashboard
export interface MensajeUplink {
  id: string;
  deviceId: string;
  timestamp: Date;
  data: any;
  receivedAt: string;
  payload: {
    bytes: number[];
    decoded: any;
  };
}

export interface Captura {
  id: string;
  deviceId: string;
  timestamp: Date;
  data: any;
}

export interface FilterParams {
  deviceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}