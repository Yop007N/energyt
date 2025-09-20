import { useState, useEffect, useCallback } from 'react';
import { dependencyContainer } from '../../infrastructure/config/DependencyContainer';
import { DashboardStats } from '../../application/usecases/GetDashboardStatsUseCase';
import { TimePeriod } from '../../domain/interfaces/repositories/IEnergyRepository';

export interface UseDashboardStatsResult {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updatePeriod: (period: TimePeriod) => Promise<void>;
}

export function useDashboardStats(initialPeriod?: TimePeriod): UseDashboardStatsResult {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod | undefined>(initialPeriod);

  const getDashboardStatsUseCase = dependencyContainer.getDashboardStatsUseCase();

  const fetchData = useCallback(async (currentPeriod?: TimePeriod) => {
    try {
      setLoading(true);
      setError(null);

      const stats = await getDashboardStatsUseCase.execute(currentPeriod);
      setData(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, [getDashboardStatsUseCase]);

  const refetch = useCallback(async () => {
    await fetchData(period);
  }, [fetchData, period]);

  const updatePeriod = useCallback(async (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    await fetchData(newPeriod);
  }, [fetchData]);

  useEffect(() => {
    fetchData(period);
  }, [fetchData, period]);

  return {
    data,
    loading,
    error,
    refetch,
    updatePeriod
  };
}