import { IconButton, Link, Paper, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { SignatureFormAttributeWithId } from "@/validations/SignatureFormValidation";
import { Column } from "material-table";
import { Delete } from "@mui/icons-material";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { destroySignature, indexSignature } from "@/services/SignatureService";
import SignatureAddEdit from "./SignatureAddEdit";

function Signature() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [state, setState] = useState(
    initPaginatedData<SignatureFormAttributeWithId>()
  );
  const [stateSelected, setStateSelected] = useState<
    SignatureFormAttributeWithId[]
  >([]);
  const [dialog, setDialog] =
    useState<PageDialogProps<SignatureFormAttributeWithId>>(null);

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof SignatureFormAttributeWithId = "priority",
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

        const res = await indexSignature(page, pageSize, sort, order);
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

  const handleDelete = async (row?: SignatureFormAttributeWithId) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const res = await destroySignature(
        row ? [row.id] : stateSelected.map((a) => a.id)
      );
      successSnackbar(res.data.message);
      fetchData();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const columns: Column<SignatureFormAttributeWithId>[] = [
    {
      field: "name",
      title: "登録名",
      render: (row) => (
        <Link component="button" onClick={() => setDialog(row)}>
          {row.name}
        </Link>
      ),
    },
    { field: "from_name", title: "from_name" },
    { field: "from_email", title: "from_email" },
    { field: "content", title: "署名" },
    { field: "priority", title: "並び順" },
    {
      field: "id",
      title: "アクション",
      sorting: false,
      render: (row) => (
        <Tooltip title="削除">
          <IconButton onClick={() => handleDelete(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

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
              disabled={stateSelected.length === 0}
            >
              削除
            </Button>
            <Button variant="contained" onClick={() => setDialog("add")}>
              新規追加
            </Button>
          </Stack>
          <Table
            columns={columns}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            options={{
              selection: true,
            }}
          />
        </Stack>
        <SignatureAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            fetchData(state.page, state.per_page, state.sort, state.order)
          }
        />
      </Paper>
    </Stack>
  );
}

export default Signature;
