import { ApiResponse, ApiError, DomainError } from '../../domain/interfaces/common/ApiResponse';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ClientConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultHeaders?: Record<string, string>;
  baseURL?: string;
}

export abstract class BaseApiClient {
  protected baseURL: string;
  protected timeout: number = 10000;
  protected retries: number = 3;
  protected retryDelay: number = 1000;
  protected defaultHeaders: Record<string, string>;

  constructor(baseURL: string, config?: ClientConfig) {
    this.baseURL = baseURL.replace(/\/$/, '');

    if (config?.timeout) this.timeout = config.timeout;
    if (config?.retries) this.retries = config.retries;
    if (config?.retryDelay) this.retryDelay = config.retryDelay;

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config?.defaultHeaders
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const timeout = options.timeout || this.timeout;
    const retries = options.retries ?? this.retries;

    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    };

    const requestConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(timeout)
    };

    if (options.body && method !== 'GET') {
      requestConfig.body = JSON.stringify(options.body);
    }

    return this.executeWithRetry<T>(url, requestConfig, retries);
  }

  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retriesLeft: number
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (retriesLeft > 0 && this.isRetryableError(error)) {
        await this.delay(this.retryDelay);
        return this.executeWithRetry<T>(url, config, retriesLeft - 1);
      }

      throw this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const responseText = await response.text();

    if (!response.ok) {
      const errorData = this.parseErrorResponse(responseText);
      throw new DomainError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData.code || 'HTTP_ERROR',
        errorData.details,
        response.status
      );
    }

    try {
      const data = responseText ? JSON.parse(responseText) : null;

      // Handle different response formats
      if (this.isApiResponse(data)) {
        return data as ApiResponse<T>;
      }

      // Wrap raw data in ApiResponse format
      return {
        success: true,
        data: data as T,
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    } catch (parseError) {
      throw new DomainError(
        'Failed to parse response',
        'PARSE_ERROR',
        { originalResponse: responseText }
      );
    }
  }

  private parseErrorResponse(responseText: string): Partial<ApiError> {
    try {
      const errorData = JSON.parse(responseText);
      return {
        message: errorData.message || errorData.error || 'Unknown error',
        code: errorData.code || 'UNKNOWN_ERROR',
        details: errorData.details || errorData
      };
    } catch {
      return {
        message: responseText || 'Unknown error',
        code: 'PARSE_ERROR'
      };
    }
  }

  private isApiResponse(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      typeof (data as any).success === 'boolean'
    );
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof DomainError) {
      // Don't retry client errors (4xx)
      return error.statusCode >= 500;
    }

    // Retry network errors
    return error instanceof TypeError || error.name === 'AbortError';
  }

  private handleError(error: unknown): Error {
    if (error instanceof DomainError) {
      return error;
    }

    if (error.name === 'AbortError') {
      return new DomainError('Request timeout', 'TIMEOUT_ERROR', {}, 408);
    }

    if (error instanceof TypeError) {
      return new DomainError('Network error', 'NETWORK_ERROR', { originalError: error.message });
    }

    return new DomainError(
      'Unknown error occurred',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Standard CRUD operations
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}