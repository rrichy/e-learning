import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import useAlerter from "@/hooks/useAlerter";
import { initPaginatedData, OrderType } from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { NoticeTableRowAttribute } from "@/validations/NoticeFormValidation";
import { destroyNotice, indexNotice } from "@/services/NoticeService";
import noticeColumns from "@/columns/noticeColumns";
import useConfirm from "@/hooks/useConfirm";

function NoticeManagement() {
  const mounted = useRef(true);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [state, setState] = useState(
    initPaginatedData<NoticeTableRowAttribute>()
  );
  const [stateSelected, setStateSelected] = useState<NoticeTableRowAttribute[]>(
    []
  );

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof NoticeTableRowAttribute = "priority",
      order: OrderType = "asc"
    ) => {
      try {
        setState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await indexNotice(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current)
          setState((s) => ({
            ...s,
            loading: false,
            data,
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async (row?: NoticeTableRowAttribute) => {
    const confirmed = await isConfirmed({
      title: "delete?",
      content: "delete?",
    });

    if (confirmed) {
      try {
        setState((s) => ({ ...s, loading: true }));
        const res = await destroyNotice(
          row ? [row.id] : stateSelected.map((a) => a.id)
        );
        successSnackbar(res.data.message);
        fetchData();
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchData();

    return () => {
      mounted.current = false;
    };
  }, []);

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
              disabled={stateSelected.length === 0}
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
          <Table
            columns={noticeColumns(handleDelete)}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            options={{
              selection: true,
              sorting: false,
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default NoticeManagement;
