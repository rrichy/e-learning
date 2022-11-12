import { IconButton, Link, Paper, Stack, Typography } from "@mui/material";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import {
  OptionsAttribute,
  PageDialogProps,
  TableStateProps,
} from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import MyTable from "@/components/atoms/MyTable";
import { DepartmentFormAttributeWithId } from "@/validations/DepartmentFormValidation";
import { destroyDepartment } from "@/services/DepartmentService";
import { ChevronRight } from "@mui/icons-material";
import { getOptions } from "@/services/CommonService";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import DepartmentAddEdit from "./DepartmentAddEdit";

const columnHelper = createColumnHelper<DepartmentFormAttributeWithId>();

const getData = (
  { pagination, sort }: { pagination: PaginationState; sort: SortingState },
  {
    setSort,
    setPagination,
  }: {
    setSort: OnChangeFn<SortingState>;
    setPagination: OnChangeFn<PaginationState>;
  }
) => {
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

const getAffiliations = () => {
  const { data, isFetching } = useQuery(["affiliations-option"], async () => {
    const res = await getOptions(["affiliations"]);

    return {
      affiliation_id: [{ id: 0, name: "未選択" }, ...res.data.affiliations],
    } as OptionsAttribute;
  });

  return { options: data, fetchingOptions: isFetching };
};

function DepartmentTable() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { options, fetchingOptions } = getAffiliations();
  const [dialog, setDialog] =
    useState<PageDialogProps<DepartmentFormAttributeWithId>>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });
  const { tableData, fetchingData } = getData(
    { sort, pagination },
    { setSort, setPagination }
  );

  const deleteMutation = useMutation(
    (ids: number[]) => destroyDepartment(ids),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        setSelected({});
        queryClient.invalidateQueries(["departments-table", pagination, sort]);
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
      const indexes = Object.keys(selected).map((a) =>
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

  const columns: ColumnDef<DepartmentFormAttributeWithId, any>[] = [
    columnHelper.accessor("id", {
      id: "expand-id",
      header: ({ table }) => (
        <IconButton
          onClick={table.getToggleAllRowsExpandedHandler()}
          size="small"
        >
          <ChevronRight
            sx={{
              transform: `rotate(${table.getIsAllRowsExpanded() ? 90 : 0}deg)`,
              color: "white",
            }}
            fontSize="small"
          />
        </IconButton>
      ),
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <IconButton onClick={row.getToggleExpandedHandler()} size="small">
            <ChevronRight
              sx={{
                transform: `rotate(${row.getIsExpanded() ? 90 : 0}deg)`,
              }}
              fontSize="small"
            />
          </IconButton>
        ) : null,
      enableSorting: false,
      size: 40,
    }),
    columnHelper.accessor("name", {
      header: () => "所属",
      cell: (row) => (
        <Link
          component="button"
          onClick={() =>
            setDialog(
              row.row.original.parent_id
                ? tableData?.data.find(
                    (a) => a.id === row.row.original.parent_id
                  )!
                : row.row.original
            )
          }
          sx={{ textAlign: "center", width: 1 }}
        >
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("priority", {
      header: () => "並び順",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.getValue()}</div>
      ),
      size: 110,
    }),
  ];

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
              disabled={Object.keys(selected).length === 0}
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
            loading={fetchingData || deleteMutation.isLoading || fetchingOptions}
            columns={columns}
            selector={{ selected, setSelected }}
            expander={{ expanded, setExpanded, subRowKey: "child_departments" }}
          />
        </Stack>
      </Paper>
      <OptionsContextProvider options={options ?? {}}>
        <DepartmentAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            queryClient.invalidateQueries([
              "departments-table",
              pagination,
              sort,
            ])
          }
        />
      </OptionsContextProvider>
    </>
  );
}

export default DepartmentTable;
