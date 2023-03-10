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
import { useCacheableOptions } from "@/services/CommonService";
import generateLookup from "@/utils/generateLookup";
import AccountMultipleAdd from "./AccountMultipleAdd";

function AccountManagement() {
  const [openMultiple, setOpenMultiple] = useState(false);
  const queryClient = useQueryClient();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { options, fetchingOptions } = useCacheableOptions(
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
  const { selector, sorter, pagination, setPagination, resetTable } =
    useMyTable();
  const { tableData, fetchingData } = useGetData({
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
          ????????????
        </Button>
        <Button
          variant="contained"
          rounded
          onClick={() => setOpenMultiple(true)}
        >
          ????????????
        </Button>
      </Stack>

      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">????????????????????????</Typography>
          <Button
            color="secondary"
            variant="contained"
            rounded
            sx={{ maxWidth: 150 }}
            onClick={handleDelete}
            disabled={Object.keys(selector.selected).length === 0}
          >
            ??????
          </Button>
          <Box>
            <Typography fontStyle="italic">
              ????????????: {tableData?.meta.total ?? 0}???
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
      <AccountMultipleAdd
        open={openMultiple}
        onClose={() => setOpenMultiple(false)}
        resolver={() =>
          queryClient.invalidateQueries([
            "accounts-table",
            pagination,
            sorter.sort,
            filters,
          ])
        }
      />
    </Stack>
  );
}

export default AccountManagement;

const useGetData = ({
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
