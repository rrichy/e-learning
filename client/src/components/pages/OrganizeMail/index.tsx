import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";
import useOrganizeMail from "@/hooks/pages/useOrganizeMail";

function OrganizeMail() {
  const {
    handleDelete,
    stateSelected,
    setDialog,
    handleRevertOrder,
    changes,
    handleUpdateOrder,
    columns,
    state,
    fetchData,
    setStateSelected,
    handleDragEnd,
    dialog,
    signatures,
  } = useOrganizeMail();

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">
            メールテンプレートの管理
          </Typography>
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
              disabled={stateSelected.length === 0}
            >
              削除
            </Button>
            <Button variant="contained" onClick={() => setDialog("add")}>
              新規追加
            </Button>
            <Box flex={1} />
            <Button
              variant="outlined"
              color="dull"
              sx={{ width: 75, borderRadius: 6 }}
              onClick={handleRevertOrder}
              disabled={changes.length === 0}
            >
              戻す
            </Button>
            <Button
              variant="contained"
              sx={{ width: 75, borderRadius: 6 }}
              disabled={changes.length === 0}
              onClick={handleUpdateOrder}
            >
              更新
            </Button>
          </Stack>
          <Table
            columns={columns}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            onDragEnd={handleDragEnd}
            options={{
              selection: true,
              maxBodyHeight: "unset",
              sorting: false,
            }}
          />
        </Stack>
        <OrganizeMailAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            fetchData(state.page, state.per_page, state.sort, state.order)
          }
          signatures={signatures.option}
        />
      </Paper>
    </Stack>
  );
}

export default OrganizeMail;
