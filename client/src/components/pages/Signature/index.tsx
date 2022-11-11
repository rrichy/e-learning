import { IconButton, Link, Paper, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import { SignatureFormAttributeWithId } from "@/validations/SignatureFormValidation";
import { Delete } from "@mui/icons-material";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { destroySignature } from "@/services/SignatureService";
import SignatureAddEdit from "./SignatureAddEdit";
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import useConfirm from "@/hooks/useConfirm";

const columnHelper = createColumnHelper<SignatureFormAttributeWithId>();

const getTableData = (
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
    ["signatures", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/signature?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<SignatureFormAttributeWithId>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};

function Signature() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();

  const [dialog, setDialog] =
    useState<PageDialogProps<SignatureFormAttributeWithId>>(null);
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });
  const { tableData, fetchingData } = getTableData(
    { sort, pagination },
    { setSort, setPagination }
  );

  const deleteMutation = useMutation((ids: number[]) => destroySignature(ids), {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      setSelected({});
      queryClient.invalidateQueries(["signatures", pagination, sort]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  });

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

  const columns: ColumnDef<SignatureFormAttributeWithId, any>[] = [
    columnHelper.accessor("name", {
      header: () => "登録名",
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
    columnHelper.accessor("from_name", {
      header: () => "from_name",
    }),
    columnHelper.accessor("from_email", {
      header: () => "from_email",
    }),
    columnHelper.accessor("content", {
      header: () => "署名",
    }),
    columnHelper.accessor("priority", {
      header: () => "並び順",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.getValue()}</div>
      ),
      size: 110,
    }),
    columnHelper.accessor("id", {
      header: () => "アクション",
      enableSorting: false,
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="削除">
            <IconButton
              onClick={() => handleDelete(row.getValue())}
              size="small"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      ),
      size: 110,
    }),
  ];

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">署名の管理</Typography>
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
              onClick={() => handleDelete()}
              disabled={Object.keys(selected).length === 0}
            >
              削除
            </Button>
            <Button variant="contained" onClick={() => setDialog("add")}>
              新規追加
            </Button>
          </Stack>
          <MyTable
            columns={columns}
            loading={fetchingData || deleteMutation.isLoading}
            state={tableData}
            selector={{ selected, setSelected }}
          />
        </Stack>
        <SignatureAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            queryClient.invalidateQueries(["signatures", pagination, sort])
          }
        />
      </Paper>
    </Stack>
  );
}

export default Signature;
