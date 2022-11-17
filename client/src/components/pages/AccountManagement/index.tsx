import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";
import { TableStateProps } from "@/interfaces/CommonInterface";
import AccountManagementSearch from "@/components/organisms/AccountManagementFragments/AccountManagementSearchAccordion";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { destroyAccount } from "@/services/AccountService";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { accountColumns } from "@/columns";
import { AccountManagementSearchAttributes } from "@/validations/SearchFormValidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useMyTable } from "@/hooks/useMyTable";
import MyTable from "@/components/atoms/MyTable";
import { getCacheableOptions } from "@/services/CommonService";
import generateLookup from "@/mixins/generateLookup";

function AccountManagement() {
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { options, fetchingOptions } = getCacheableOptions(
    "affiliations",
    "departments",
    "child_departments"
  );

  const lookups = useMemo(() => {
    if (!fetchingOptions) {
      return {
        affiliations: generateLookup(options.affiliations),
        departments: generateLookup(options.departments),
        child_departments: generateLookup(options.child_departments),
      };
    }
  }, [fetchingOptions, options]);

  const [filters, setFilters] = useState<{ [k: string]: any }>({});
  const { selector, sorter, pagination, setPagination, resetTable } = useMyTable();
  const { tableData, fetchingData } = getData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
    filters,
  });

  const deleteMutation = useMutation((ids: number[]) => destroyAccount(ids), {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      resetTable();
      queryClient.invalidateQueries([
        "accounts-table",
        pagination,
        sorter.sort,
        filters,
      ]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  });

  const handleSearch = async (raw: AccountManagementSearchAttributes) => {
    const temp: { [k: string]: any } = {};

    for (let [key, value] of Object.entries(raw)) {
      if (key === "never_logged_in") {
        if (value === 1) temp[key] = 1;
      } else if (value) temp[key] = value;
    }

    setFilters(temp);
    resetTable();
  };

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "sure delete?",
      content: "suredelete?",
    });

    if (confirmed) {
      const indexes = Object.keys(selector.selected).map(Number);
      deleteMutation.mutate(
        indexes.map((index) => (tableData?.data ?? [])[index].id!)
      );
    }
  };

  const columns = accountColumns(lookups);

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
              disabled={Object.keys(selector.selected).length === 0}
            >
              削除
            </Button>
            <Box>
              <Typography fontStyle="italic">
                検索結果: {tableData?.meta.total ?? 0}人
              </Typography>
              <MyTable
                loading={fetchingData || deleteMutation.isLoading}
                state={tableData}
                columns={columns}
                selector={selector}
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

const getData = ({
  sort,
  setSort,
  pagination,
  setPagination,
  filters,
}: {
  sort: SortingState;
  setSort: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  filters: { [k: string]: any };
}) => {
  const { data, isFetching } = useQuery(
    ["accounts-table", pagination, sort, filters],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "desc";

      const params = Object.entries(filters)
        .reduce(
          (acc: string[], [key, value]) =>
            !value || ["last_page", "total"].includes(key)
              ? acc
              : [...acc, `${key === "current_page" ? "page" : key}=${value}`],
          []
        )
        .join("&");

      const res = await get(
        `/api/account?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}` + (params ? "&" + params : "")
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<UserAttributes>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};
