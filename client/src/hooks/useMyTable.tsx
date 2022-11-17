import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";

export function useMyTable() {
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });

  const resetTable = useCallback(() => {
    setSelected({});
    setSort([]);
    setPagination({
      pageIndex: 0,
      pageSize: TABLE_ROWS_PER_PAGE[0],
    });
  }, []);

  return {
    selector: { selected, setSelected },
    sorter: { sort, setSort },
    pagination,
    setPagination,
    resetTable,
  };
}
