import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import { Selection, TextField } from "../../molecules/LabeledHookForms";
import CloseIcon from "@mui/icons-material/Close";
import {
  initPaginatedData,
  OptionAttribute,
  OptionsAttribute,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import AccountManagementSearch from "@/components/organisms/AccountManagementFragments/AccountManagementSearchAccordion";
import Table from "@/components/atoms/Table";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { getOptions } from "@/services/CommonService";
import { destroyAccount, indexAccount } from "@/services/AccountService";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import accountColumns from "@/columns/accountColumns";

function AccountManagement() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [lookups, setLookups] = useState({
    affiliation_lookup: {} as { [k: number]: string },
    department_lookup: {} as { [k: number]: string },
  });
  const [state, setState] = useState(initPaginatedData<UserAttributes>());
  const [stateSelected, setStateSelected] = useState<UserAttributes[]>([]);

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof UserAttributes = "id",
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

        const res = await indexAccount(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current) {
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
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "sure delete?",
      content: "suredelete?",
    });

    if (confirmed) {
      try {
        setState((s) => ({ ...s, loading: true }));
        const res = await destroyAccount(stateSelected.map((a) => a.id!));
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

    (async () => {
      try {
        const res = await getOptions(["affiliations", "departments"]);
        setLookups({
          affiliation_lookup: res.data.affiliations.reduce(
            (acc: { [k: number]: string }, b: OptionAttribute) => ({
              ...acc,
              [b.id]: b.name,
            }),
            {}
          ),
          department_lookup: res.data.departments.reduce(
            (acc: { [k: number]: string }, b: OptionAttribute) => ({
              ...acc,
              [b.id]: b.name,
            }),
            {}
          ),
        });
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar]);

  return (
    <>
      <Stack
        spacing={3}
        sx={{
          p: 3,
          "& tbody tr:nth-last-of-type(1) td": {
            borderBottom: "none !important",
          },
        }}
      >
        {/* <FormContainer>
          <AccountManagementSearch categories={categories} />
        </FormContainer> */}
        <Stack
          spacing={2}
          justifyContent="center"
          direction="row"
          sx={{ "& .MuiButton-root": { maxWidth: 200 } }}
        >
          <Button to="create" variant="contained" rounded>
            新規作成
          </Button>
          <Button
            variant="contained"
            rounded
            // onClick={handleMultipleAccountsOpen}
          >
            一括登録
          </Button>
        </Stack>

        <Paper variant="outlined">
          <Stack spacing={3}>
            <Typography variant="sectiontitle2">アカウントの管理</Typography>
            <Button
              color="secondary"
              variant="contained"
              rounded
              sx={{ maxWidth: 150 }}
              onClick={handleDelete}
              disabled={stateSelected.length === 0}
            >
              削除
            </Button>
            <Box>
              <Typography fontStyle="italic">
                検索結果: {state.total}人
              </Typography>
              <Table
                columns={accountColumns(lookups)}
                state={state}
                fetchData={fetchData}
                onSelectionChange={(rows) => setStateSelected(rows)}
                options={{
                  selection: true,
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>

      {/* <FormContainer>
        <Dialog open={multipleAccountsOpen} maxWidth="lg">
          <DialogTitle>
            <Typography
              fontWeight="bold"
              variant="h6"
              pl={1}
              sx={{ borderLeft: "5px solid #00c2b2" }}
            >
              アカウントの複数登録
            </Typography>
            <IconButton
              onClick={handleMultipleAccountsClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Stack spacing={1} p={3}>
            <Card sx={{ border: "1px solid #dadfe1" }}>
              <CardHeader 
                subheader="CSVファイルから登録" 
                sx={{ 
                  background: "#dadfe1",
                  fontSize: "1rem"
                }}
                align="center"
              />
              <CardContent>
                <TextField
                  name="name"
                  placeholder="Upload CSV File"
                  labelProps={{ compact: true }}
                />
              </CardContent>
            </Card>
            <Stack direction="row" spacing={2} p={1} justifyContent="flex-end">
              <Typography>一括登録用のCSVテンプレート</Typography>
              <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>ダウンロード</Button>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2} p={1} justifyContent="space-evenly">
              <Typography>「登録のお知らせ」メール配信</Typography>
              <FormControlLabel
                label="メールを配信する"
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={(_, checked) => setChecked(checked)}
                  />
                }
              />
            </Stack>
            {checked && (
              <>
                <Stack direction="row" spacing={2} p={1}>
                  <Selection
                    name="sex"
                    label="性別"
                  />
                  <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>メール整理</Button>
                </Stack>
                <TextField
                  name="name"
                  placeholder="Upload Image Here"
                  label="アイコン画像"
                />
                <TextField
                  name="name"
                  placeholder="名前を入力"
                  label="氏名"
                  multiline
                  rows={3}
                />
                <Stack direction="row" spacing={2} p={1} justifyContent="space-between">
                  <Typography sx={{ color: "red" }}>（※）上記タイトル・内容を保存できます。</Typography>
                  <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>保存</Button>
                </Stack>
                <Selection
                  name="sex"
                  label="性別"
                />
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={2} p={3} justifyContent="center">
            <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
            <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>登録</Button>
          </Stack>
        </Dialog>
      </FormContainer> */}
    </>
  );
}

export default AccountManagement;
