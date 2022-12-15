import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import CategoryAddEdit from "./CategoryAddEdit";
import { categoryColumns } from "@/columns";
import { useMemo, useState } from "react";
import { CategoryFormAttribute } from "@/validations/CategoryFormValidation";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import {
  ExpandedState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useMyTable } from "@/hooks/useMyTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { get } from "@/services/ApiService";
import { destroyCategory, duplicateCategory } from "@/services/CategoryService";
import MyTable from "@/components/atoms/MyTable";

function CategoryManagement() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [dialog, setDialog] =
    useState<PageDialogProps<CategoryFormAttribute>>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { sorter, selector, pagination, setPagination, resetTable } =
    useMyTable();
  const { tableData, fetchingData } = useGetData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
  });

  const resolver = {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      resetTable();
      queryClient.invalidateQueries([
        "categories-table",
        pagination,
        sorter.sort,
      ]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  };

  const deleteMutation = useMutation(
    (ids: number[]) => destroyCategory(ids),
    resolver
  );

  const copyMutation = useMutation(
    (id: number) => duplicateCategory(id),
    resolver
  );

  const lookup = useMemo(() => {
    if (!fetchingData && tableData) {
      return tableData.data.reduce(
        (acc: { [k: number]: CategoryFormAttribute }, category) => ({
          ...acc,
          [category.id!]: category,
        }),
        {}
      );
    }
    return {} as { [k: number]: CategoryFormAttribute };
  }, [fetchingData, tableData]);

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
        const parent: CategoryFormAttribute = (tableData?.data ?? [])[
          parentIndex
        ];
        if (childIndex >= 0) return parent.child_categories[childIndex].id!;

        return parent.id!;
      });

      deleteMutation.mutate(ids);
    }
  };

  const handleDuplicate = async (category: CategoryFormAttribute) => {
    copyMutation.mutate(category.id!);
  };

  const columns = categoryColumns(setDialog, handleDuplicate, lookup);

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">カテゴリーの管理</Typography>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              "& button": {
                borderRadius: 6,
                maxWidth: "fit-content",
                wordBreak: "keep-all",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              disabled={Object.keys(selector.selected).length === 0}
            >
              削除
            </Button>
            <Button variant="contained" onClick={() => setDialog("add")}>
              追加
            </Button>
          </Stack>
          <MyTable
            state={tableData}
            loading={
              fetchingData || deleteMutation.isLoading || copyMutation.isLoading
            }
            columns={columns}
            selector={selector}
            expander={{ expanded, setExpanded, subRowKey: "child_categories" }}
          />
          <CategoryAddEdit
            state={dialog}
            closeFn={() => setDialog(null)}
            resolverFn={() =>
              queryClient.invalidateQueries([
                "categories-table",
                pagination,
                sorter.sort,
              ])
            }
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default CategoryManagement;

const useGetData = ({
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
    ["categories-table", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "desc";

      const res = await get(
        `/api/category?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<CategoryFormAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};
