export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: string;
  version: string;
  pagination?: PaginationMetadata;
  performance?: PerformanceMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PerformanceMetadata {
  executionTime: number;
  cacheHit?: boolean;
  databaseQueries?: number;
}

export class DomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public validationErrors: ValidationErrorDetail[]
  ) {
    super(message, 'VALIDATION_ERROR', { validationErrors }, 400);
    this.name = 'ValidationError';
  }
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
  constraint?: string;
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} with identifier '${identifier}' not found`,
      'NOT_FOUND',
      { resource, identifier },
      404
    );
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', {}, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, conflictDetails?: Record<string, unknown>) {
    super(message, 'CONFLICT', conflictDetails, 409);
    this.name = 'ConflictError';
  }
}