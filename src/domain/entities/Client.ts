export interface Client {
  id: string;
  name: string;
  address: string;
  identification: string;
  clientType: ClientType;
  contactInfo: ContactInfo;
  accountInfo: AccountInfo;
  preferences: ClientPreferences;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export enum ClientType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  GOVERNMENTAL = 'GOVERNMENTAL'
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface AccountInfo {
  accountNumber: string;
  contractType: ContractType;
  startDate: Date;
  endDate?: Date;
  status: AccountStatus;
  creditLimit?: number;
  paymentMethod: PaymentMethod;
}

export enum ContractType {
  PREPAID = 'PREPAID',
  POSTPAID = 'POSTPAID',
  CORPORATE = 'CORPORATE'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  DIRECT_DEBIT = 'DIRECT_DEBIT'
}

export interface ClientPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  highUsageAlert: boolean;
  billReminder: boolean;
  outageNotification: boolean;
}

export interface DashboardPreferences {
  defaultView: string;
  refreshInterval: number;
  chartType: string;
  showPredictions: boolean;
}