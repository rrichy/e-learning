import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import { SignatureFormAttributeWithId } from "@/validations/SignatureFormValidation";
import { destroySignature } from "@/services/SignatureService";
import SignatureAddEdit from "./SignatureAddEdit";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import useConfirm from "@/hooks/useConfirm";
import { useMyTable } from "@/hooks/useMyTable";
import { signatureColumns } from "@/columns";

function Signature() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();

  const [dialog, setDialog] =
    useState<PageDialogProps<SignatureFormAttributeWithId>>(null);
  const { sorter, selector, pagination, setPagination } = useMyTable();
  const { tableData, fetchingData } = useGetTableData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
  });

  const deleteMutation = useMutation((ids: number[]) => destroySignature(ids), {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      selector.setSelected({});
      queryClient.invalidateQueries(["signatures", pagination, sorter.sort]);
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
        const indexes = Object.keys(selector.selected).map(Number);
        deleteMutation.mutate(
          indexes.map((index) => (tableData?.data ?? [])[index].id)
        );
      }
    }
  };

  const columns = signatureColumns(setDialog, handleDelete);

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
              disabled={Object.keys(selector.selected).length === 0}
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
            selector={selector}
          />
        </Stack>
        <SignatureAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            queryClient.invalidateQueries([
              "signatures",
              pagination,
              sorter.sort,
            ])
          }
        />
      </Paper>
    </Stack>
  );
}

export default Signature;

const useGetTableData = ({
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
