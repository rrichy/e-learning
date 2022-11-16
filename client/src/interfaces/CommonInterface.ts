import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { PaginationState, SortingState } from "@tanstack/react-table";
import React from "react";

export interface OptionsAttribute {
  [k: string]: OptionAttribute[];
}

export interface OptionAttribute {
  id: number | string;
  name: string;
  selectionType?: "disabled" | "category";
}

export interface NativeObjectInterface<T = any> {
  [key: string | number]: T;
}

export type PageDialogProps<T> = "add" | T | null;

export type OrderType = "asc" | "desc";

export interface PaginatedData<T> {
  loading: boolean;
  page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: T[];
  order?: OrderType;
  sort?: keyof T;
}

export const initPaginatedData = <T>(): PaginatedData<T> => ({
  loading: true,
  page: 1,
  last_page: 1,
  per_page: TABLE_ROWS_PER_PAGE[0],
  data: [],
  total: 0,
  order: "desc",
});

export interface InfiniteScrollAttribute<T> extends PaginatedData<T> {
  maxVisited: number;
}

export type CourseScreenType =
  | "course"
  | `chapter/${number}/chapter-test`
  | `chapter/${number}/chapter-test/result`
  | `chapter/${number}/chapter-test/${number}`
  | `chapter/${number}/lecture`;

export interface PaginationFilterInterface {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  order?: OrderType;
  sort?: string;
}

export const initPaginationFilter: PaginationFilterInterface = {
  current_page: 1,
  last_page: 1,
  per_page: TABLE_ROWS_PER_PAGE[0],
  total: 0,
  order: "desc",
  sort: "id",
};

export interface ReactQueryPaginationInterface<T> {
  data: T[];
  meta: PaginationFilterInterface;
  message?: string;
}

export const initReactQueryPagination = <
  T = any
>(): ReactQueryPaginationInterface<T> => ({
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
});

export interface TableStateProps<T> {
  data: T[];
  meta: PaginationFilterInterface;
  message?: string;
  paginator?: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorter?: React.Dispatch<React.SetStateAction<SortingState>>;
}

export const initTableState: TableStateProps<any> = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: TABLE_ROWS_PER_PAGE[0],
    total: 0,
  },
};
