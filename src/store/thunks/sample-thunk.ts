import {
  type CommonApiResponse,
  type FetchListPayload,
  type Sample,
  type SamplePaginatedResponse,
} from '@/interfaces/sample';
import { getMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { logger } from '@/lib/default-logger';
import { handleServiceError } from '@/utils/error-handler';

/**
 * Build query parameters safely and cleanly
 */
const buildQueryParams = (payload: FetchListPayload): string => {
  const params = new URLSearchParams();

  const appendParams = <T extends Record<string, unknown>>(prefix: string, data?: T) => {
    if (!data) return;
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(`${prefix}[${key}]`, String(value));
      }
    });
  };

  if (payload.page) params.append('page', String(payload.page));
  if (payload.pageSize) params.append('pageSize', String(payload.pageSize));

  appendParams('exactMatch', payload.exactMatch);
  appendParams('search', payload.search);

  return params.toString();
};

export const fetchList = createAsyncThunk<SamplePaginatedResponse<Sample>, FetchListPayload, { rejectValue: string }>(
  'list/fetch',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `${endPoints.FETCH_LIST}?${buildQueryParams(payload)}`;
      const result = await getMethod<CommonApiResponse<SamplePaginatedResponse<Sample>>>(url);

      if (result?.status !== 'success') {
        return rejectWithValue(result?.message ?? 'Failed to fetch list.');
      }

      return (
        result.data ?? {
          records: [],
          totalCount: 0,
          page: payload.page || 1,
          pageSize: payload.pageSize || 10,
        }
      );
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to fetch list');
      logger.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
