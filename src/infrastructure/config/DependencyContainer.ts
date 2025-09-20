import { IEnergyRepository } from '../../domain/interfaces/repositories/IEnergyRepository';
import { IClientRepository } from '../../domain/interfaces/repositories/IClientRepository';
import { EnergyRepository } from '../repositories/EnergyRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { GetDashboardStatsUseCase } from '../../application/usecases/GetDashboardStatsUseCase';

export interface Dependencies {
  // Repositories
  energyRepository: IEnergyRepository;
  clientRepository: IClientRepository;

  // Use Cases
  getDashboardStatsUseCase: GetDashboardStatsUseCase;
}

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: Dependencies;

  private constructor() {
    this.initializeDependencies();
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private initializeDependencies(): void {
    const config = this.getConfiguration();

    // Initialize repositories
    const energyRepository = new EnergyRepository(config.apiBaseURL);
    const clientRepository = new ClientRepository(config.apiBaseURL);

    // Initialize use cases
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
      energyRepository,
      clientRepository
    );

    this.dependencies = {
      energyRepository,
      clientRepository,
      getDashboardStatsUseCase
    };
  }

  private getConfiguration() {
    return {
      apiBaseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
      timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
      retries: parseInt(process.env.REACT_APP_API_RETRIES || '3')
    };
  }

  getDependencies(): Dependencies {
    return this.dependencies;
  }

  // Specific getters for easier access
  getEnergyRepository(): IEnergyRepository {
    return this.dependencies.energyRepository;
  }

  getClientRepository(): IClientRepository {
    return this.dependencies.clientRepository;
  }

  getDashboardStatsUseCase(): GetDashboardStatsUseCase {
    return this.dependencies.getDashboardStatsUseCase;
  }

  // Method to update configuration if needed (for testing, etc.)
  updateDependencies(newDependencies: Partial<Dependencies>): void {
    this.dependencies = { ...this.dependencies, ...newDependencies };
  }

  // Reset container (useful for testing)
  reset(): void {
    this.initializeDependencies();
  }
}

// Export singleton instance
export const dependencyContainer = DependencyContainer.getInstance();