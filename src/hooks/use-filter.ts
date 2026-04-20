import { ISelectOption } from '@/components/organisms/table/pagination';
import { SortDirection } from '@/components/organisms/table/tableHead';
import { DEFAULT_PAGE, defaultPageSize } from '@/constants/pagination';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';

export interface IFilterProperties {
  page: number;
  pageSize: ISelectOption;
  sortBy: string;
  sortDir: string;
  searchBy: string;
  status: ISelectOption | string;
  fromDate: Date | null;
}
export interface SortOptions {
  sortBy: string;
  sortOrder: string;
}
export type HandleSortChangeCallback = (sort: SortOptions) => void;

export interface IUseFilter {
  handleSortChange: (sort: SortOptions) => void;
  handlePageChange: (_event: any, page: number) => void;
  handleDateChange: (name: string, data: Date | null) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement> | SelectChangeEvent<ISelectOption>) => void;
  handleReset: () => void;
  filterData: IFilterProperties;
}

export const useFilter = (): IUseFilter => {
  const [filterData, setFilterData] = useState<IFilterProperties>({
    page: DEFAULT_PAGE,
    pageSize: { label: `${defaultPageSize}`, value: defaultPageSize },
    sortBy: '',
    sortDir: SortDirection.Desc,
    searchBy: '',
    status: '',
    fromDate: null,
  });

  const handleSortChange = useCallback((sort: SortOptions): void => {
    setFilterData((prevState: IFilterProperties) => ({
      ...prevState,
      sortBy: sort.sortBy,
      sortDir: sort.sortOrder,
    }));
  }, []);

  const handlePageChange = useCallback((_event: any, page: number): void => {
    setFilterData((prevState: IFilterProperties) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleDateChange = (name: string, data: Date | null) => {
    setFilterData((prevState: IFilterProperties) => ({
      ...prevState,
      page: DEFAULT_PAGE,
      [name]: data,
    }));
  };
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | SelectChangeEvent<ISelectOption>
  ) => {
    setFilterData((prevState: IFilterProperties) => ({
      ...prevState,
      page: DEFAULT_PAGE,
      [event.target.name]: event.target.value,
    }));
  };

  const handleReset = () => {
    setFilterData(() => ({
      page: DEFAULT_PAGE,
      pageSize: { label: `${defaultPageSize}`, value: defaultPageSize },
      sortBy: '',
      sortDir: SortDirection.Desc,
      searchBy: '',
      status: '',
      fromDate: null,
    }));
  };

  return {
    handleSortChange,
    handlePageChange,
    handleDateChange,
    handleChange,
    handleReset,
    filterData,
  };
};
