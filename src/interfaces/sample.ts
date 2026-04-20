export interface Sample {
  id: number;
  name: string;
  address: string;
  symbol: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleListState {
  list: Sample[];
  loading: boolean;
  error: string | null;
  page:number;
  pageSize:number;
  totalCount:number;
}

// Pagination & records type
export interface SamplePaginatedResponse<T> {
  records: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FetchListPayload {
  page?: number;
  pageSize?: number;
  exactMatch?: {
    chainId?: number;
    address?: string;
    symbol?: string;
  };
  search?: {
    name?: string;
  };
}

// API response type
export interface CommonApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: string;
  technicalDetails?: unknown;
}
