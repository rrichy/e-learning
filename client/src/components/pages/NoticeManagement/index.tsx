import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import MyTable from "@/components/atoms/MyTable";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMyTable } from "@/hooks/useMyTable";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { destroyNotice } from "@/services/NoticeService";
import { get } from "@/services/ApiService";
import { noticeColumns } from "@/columns";
import { NoticeTableRowAttribute } from "@/columns/rowTypes";

function NoticeManagement() {
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { selector, pagination, setPagination, sorter, resetTable } = useMyTable();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(
    ["notices-management", pagination, sorter.sort],
    async () => {
      const sort = sorter.sort;
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/notice?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: sorter.setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<NoticeTableRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const deleteMutation = useMutation((ids: number[]) => destroyNotice(ids), {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      resetTable();
      queryClient.invalidateQueries([
        "notices-management",
        pagination,
        sorter.sort,
      ]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  });

  const handleDelete = async (id?: number) => {
    const confirmed = await isConfirmed({
      title: "delete?",
      content: "delete?",
    });

    if (confirmed) {
      if (id) deleteMutation.mutate([id]);
      else {
        const notice_ids = Object.keys(selector.selected).map(
          (a) => data!.data[+a].id
        );
        deleteMutation.mutate(notice_ids);
      }
    }
  };

  const columns = noticeColumns(handleDelete);

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">お知らせの管理</Typography>
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete()}
              disabled={Object.keys(selector.selected).length === 0}
              fit
              rounded
            >
              削除
            </Button>
            <Button
              variant="contained"
              to="/notice-management/create"
              fit
              rounded
            >
              追加
            </Button>
          </Stack>
          <MyTable
            columns={columns}
            selector={selector}
            state={data}
            loading={isFetching}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default NoticeManagement;
