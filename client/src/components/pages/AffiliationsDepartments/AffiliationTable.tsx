import { Link, Paper, Stack, Typography } from "@mui/material";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import { destroyAffiliation } from "@/services/AffiliationService";
import { get } from "@/services/ApiService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { AffiliationFormAttributeWithId } from "@/validations/AffiliationFormValidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import MyTable from "@/components/atoms/MyTable";
import AffiliationAddEdit from "./AffiliationAddEdit";

const columnHelper = createColumnHelper<AffiliationFormAttributeWithId>();

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
    ["affiliations-table", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/affiliation?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<AffiliationFormAttributeWithId>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};

function AffiliationTable() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();

  const [dialog, setDialog] =
    useState<PageDialogProps<AffiliationFormAttributeWithId>>(null);
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
    (ids: number[]) => destroyAffiliation(ids),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        setSelected({});
        queryClient.invalidateQueries(["affiliations-table", pagination, sort]);
      },
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const handleDelete = async (id?: number) => {
    const confirmed = await isConfirmed({
      title: "sure",
      content: "sure",
    });

    if (confirmed) {
      if (id) deleteMutation.mutate([id]);
      else {
        const indexes = Object.keys(selected).map(Number);
        deleteMutation.mutate(
          indexes.map((index) => (tableData?.data ?? [])[index].id)
        );
      }
    }
  };

  const columns: ColumnDef<AffiliationFormAttributeWithId, any>[] = [
    columnHelper.accessor("name", {
      header: () => "所属",
      cell: (row) => (
        <Link
          component="button"
          onClick={() => setDialog(row.row.original)}
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
          <Typography variant="sectiontitle2">所属の管理</Typography>
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
            loading={fetchingData || deleteMutation.isLoading}
            state={tableData}
            columns={columns}
            selector={{ selected, setSelected }}
          />
        </Stack>
      </Paper>
      <AffiliationAddEdit
        state={dialog}
        closeFn={() => setDialog(null)}
        resolverFn={() => {
          queryClient.invalidateQueries([
            "affiliations-table",
            pagination,
            sort,
          ]);
          queryClient.invalidateQueries(["affiliations-option"]);
        }}
      />
    </>
  );
}

export default AffiliationTable;
