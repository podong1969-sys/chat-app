
import { useState, useEffect, useCallback, useRef } from 'react';
import { lumi } from '../lib/lumi';

interface UseRealTimeDataOptions {
  entityName: string;
  pollInterval?: number;
  filter?: (item: any) => boolean;
  sort?: (a: any, b: any) => number;
}

export const useRealTimeData = ({
  entityName,
  pollInterval = 2000, // 2초마다 업데이트
  filter,
  sort
}: UseRealTimeDataOptions) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const { list } = await lumi.entities[entityName].list();
      
      if (!mountedRef.current) return;
      
      let processedData = list;
      
      if (filter) {
        processedData = processedData.filter(filter);
      }
      
      if (sort) {
        processedData = processedData.sort(sort);
      }
      
      setData(processedData);
      setError(null);
    } catch (err) {
      console.error(`${entityName} 데이터 조회 오류:`, err);
      if (mountedRef.current) {
        setError('데이터를 불러오는 중 오류가 발생했습니다');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [entityName, filter, sort]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // 데이터 생성
  const createItem = useCallback(async (itemData: any) => {
    try {
      const newItem = await lumi.entities[entityName].create(itemData);
      await fetchData(); // 즉시 새로고침
      return newItem;
    } catch (error) {
      console.error(`${entityName} 생성 오류:`, error);
      throw error;
    }
  }, [entityName, fetchData]);

  // 데이터 업데이트
  const updateItem = useCallback(async (id: string, updates: any) => {
    try {
      const updatedItem = await lumi.entities[entityName].update(id, updates);
      await fetchData(); // 즉시 새로고침
      return updatedItem;
    } catch (error) {
      console.error(`${entityName} 업데이트 오류:`, error);
      throw error;
    }
  }, [entityName, fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    // 초기 데이터 로드
    fetchData();
    
    // 주기적 업데이트 설정
    intervalRef.current = setInterval(fetchData, pollInterval);
    
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, pollInterval]);

  return {
    data,
    loading,
    error,
    refresh,
    createItem,
    updateItem
  };
};

