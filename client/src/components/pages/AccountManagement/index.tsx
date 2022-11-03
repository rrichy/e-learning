import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import {
  initPaginationFilter,
  initReactQueryPagination,
  OptionAttribute,
  OrderType,
  PaginationFilterInterface,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import AccountManagementSearch, {
  useOptions,
} from "@/components/organisms/AccountManagementFragments/AccountManagementSearchAccordion";
import Table from "@/components/atoms/Table";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { destroyAccount } from "@/services/AccountService";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import accountColumns from "@/columns/accountColumns";
import { AccountManagementSearchAttributes } from "@/validations/SearchFormValidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "@/services/ApiService";

const init = initReactQueryPagination<UserAttributes>();

const tableResult = (
  filters: PaginationFilterInterface & { [k: string]: any }
) =>
  useQuery(
    ["accounts", filters],
    async () => {
      const params = Object.entries(filters)
        .reduce(
          (acc: string[], [key, value]) =>
            !value || ["last_page", "total"].includes(key)
              ? acc
              : [...acc, `${key === "current_page" ? "page" : key}=${value}`],
          []
        )
        .join("&");

      const res = await get("/api/account?" + params);
      return res.data as ReactQueryPaginationInterface<UserAttributes>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

function AccountManagement() {
  const queryClient = useQueryClient();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [lookups, setLookups] = useState({
    affiliation_lookup: {} as { [k: number]: string },
    department_lookup: {} as { [k: number]: string },
    child_department_lookup: {} as { [k: number]: string },
  });
  const { data: resOptions, isLoading: resIsLoading } = useOptions();
  const [pagination, setPagination] = useState(initPaginationFilter);
  const [filters, setFilters] = useState<{ [k: string]: any }>({});
  const { data, isFetching } = tableResult({
    ...pagination,
    ...filters,
  });
  const [stateSelected, setStateSelected] = useState<UserAttributes[]>([]);
  const deleteMutation = useMutation((ids: number[]) => destroyAccount(ids), {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      queryClient.invalidateQueries(["accounts", filters]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  });

  const updateFilter = (
    page: number = 1,
    pageSize: number = TABLE_ROWS_PER_PAGE[0],
    sort: keyof UserAttributes = "id",
    order: OrderType = "desc"
  ) => {
    setPagination({
      ...pagination,
      current_page: page,
      per_page: pageSize,
      sort,
      order,
    });
  };

  const handleSearch = async (raw: AccountManagementSearchAttributes) => {
    const temp: { [k: string]: any } = {};

    for (let [key, value] of Object.entries(raw)) {
      if (key === "never_logged_in") {
        if (value === 1) temp[key] = 1;
      } else if (value) temp[key] = value;
    }

    setFilters(temp);
    updateFilter();
  };

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "sure delete?",
      content: "suredelete?",
    });

    if (confirmed) {
      deleteMutation.mutate(stateSelected.map((a) => a.id!));
    }
  };

  useEffect(() => {
    if (!resIsLoading && resOptions) {
      setLookups({
        affiliation_lookup: resOptions.affiliations.reduce(
          (acc: { [k: number]: string }, b: OptionAttribute) => ({
            ...acc,
            [b.id]: b.name,
          }),
          {}
        ),
        department_lookup: resOptions.departments.reduce(
          (acc: { [k: number]: string }, b: OptionAttribute) => ({
            ...acc,
            [b.id]: b.name,
          }),
          {}
        ),
        child_department_lookup: resOptions.child_departments.reduce(
          (acc: { [k: number]: string }, b: OptionAttribute) => ({
            ...acc,
            [b.id]: b.name,
          }),
          {}
        ),
      });
    }
  }, [resOptions, resIsLoading]);

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
        <AccountManagementSearch onSubmit={handleSearch} />
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
                検索結果: {data?.meta.total ?? 0}人
              </Typography>
              <Table
                columns={accountColumns(lookups)}
                state={data || init}
                fetchData={updateFilter}
                isLoading={isFetching || deleteMutation.isLoading}
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
