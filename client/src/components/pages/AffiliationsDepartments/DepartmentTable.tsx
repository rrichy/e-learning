import { Paper, Stack, Typography } from "@mui/material";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExpandedState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";
import MyTable from "@/components/atoms/MyTable";
import { DepartmentFormAttributeWithId } from "@/validations/DepartmentFormValidation";
import { destroyDepartment } from "@/services/DepartmentService";
import { getCacheableOptions } from "@/services/CommonService";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import DepartmentAddEdit from "./DepartmentAddEdit";
import { useMyTable } from "@/hooks/useMyTable";
import { departmentColumns } from "@/columns";

function DepartmentTable() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { options, fetchingOptions } = getCacheableOptions("affiliations");
  const [dialog, setDialog] =
    useState<PageDialogProps<DepartmentFormAttributeWithId>>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { sorter, selector, pagination, setPagination, resetTable } = useMyTable();
  const { tableData, fetchingData } = getData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
  });

  const lookup = useMemo(() => {
    if (!fetchingData && tableData) {
      return tableData.data.reduce(
        (acc: { [k: number]: DepartmentFormAttributeWithId }, department) => ({
          ...acc,
          [department.id]: department,
        }),
        {}
      );
    }
    return {} as { [k: number]: DepartmentFormAttributeWithId };
  }, [fetchingData, tableData]);

  const deleteMutation = useMutation(
    (ids: number[]) => destroyDepartment(ids),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        resetTable();
        queryClient.invalidateQueries([
          "departments-table",
          pagination,
          sorter.sort,
        ]);
      },
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "sure",
      content: "sure",
    });

    if (confirmed) {
      const indexes = Object.keys(selector.selected).map((a) =>
        a.split(".").map(Number)
      );
      const ids = indexes.map(([parentIndex, childIndex]) => {
        const parent: DepartmentFormAttributeWithId = (tableData?.data ?? [])[
          parentIndex
        ];
        if (childIndex >= 0) return parent.child_departments[childIndex].id;

        return parent.id;
      });

      deleteMutation.mutate(ids);
    }
  };

  const columns = departmentColumns(setDialog, lookup);

  return (
    <>
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">部署の管理</Typography>
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "fit-content", borderRadius: 6 }}
              onClick={() => handleDelete()}
              disabled={Object.keys(selector.selected).length === 0}
            >
              削除
            </Button>
            <Button
              variant="contained"
              sx={{ width: "fit-content", borderRadius: 6 }}
              onClick={() => setDialog("add")}
            >
              追加
            </Button>
          </Stack>
          <MyTable
            state={tableData}
            loading={
              fetchingData || deleteMutation.isLoading || fetchingOptions
            }
            columns={columns}
            selector={selector}
            expander={{ expanded, setExpanded, subRowKey: "child_departments" }}
          />
        </Stack>
      </Paper>
      <OptionsContextProvider
        options={{ affiliation_id: options.affiliations ?? [] }}
      >
        <DepartmentAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            queryClient.invalidateQueries([
              "departments-table",
              pagination,
              sorter.sort,
            ])
          }
        />
      </OptionsContextProvider>
    </>
  );
}

export default DepartmentTable;

const getData = ({
  sort,
  setSort,
  pagination,
  setPagination,
}: {
  sort: SortingState;
  setSort: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}) => {
  const { data, isFetching } = useQuery(
    ["departments-table", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/department?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<DepartmentFormAttributeWithId>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};
