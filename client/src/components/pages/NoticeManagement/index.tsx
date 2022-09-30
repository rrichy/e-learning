import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import noticeColumns from "@/columns/noticeColumns";
import useNotice from "@/hooks/pages/useNotice";

function NoticeManagement() {
  const { handleDelete, stateSelected, state, fetchData, setStateSelected } =
    useNotice();

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
