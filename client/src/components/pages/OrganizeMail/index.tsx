import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";
import useOrganizeMail from "@/hooks/pages/useOrganizeMail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { OptionAttribute, TableStateProps } from "@/interfaces/CommonInterface";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import { getOptions } from "@/services/CommonService";
import { destroyOrganizeMail } from "@/services/OrganizeMailService";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { DropResult } from "@hello-pangea/dnd";
import arrayMoveTo from "@/utils/arrayMoveTo";

export type MailRowAttribute = {
  id: number;
  title: string;
  content: string;
  priority: number;
  signature_id: number;
};

const columnHelper = createColumnHelper<MailRowAttribute>();

const getTableData = (
  { pagination, sort }: { pagination: PaginationState; sort: SortingState },
  {
    setSort,
    setPagination,
  }: {
    setSort: OnChangeFn<SortingState>;
    setPagination: OnChangeFn<PaginationState>;
  }
) => {
  const { data, isFetching } = useQuery(
    ["mail-templates", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "priority";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/mail-template?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<MailRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};

const getSignatures = () => {
  const { data, isFetching } = useQuery(
    ["signature-options"],
    async () => {
      const res = await getOptions(["signatures"]);

      return {
        lookup: res.data.signatures.reduce(
          (acc: any, b: any) => ({ ...acc, [b.id]: b.name }),
          {} as any
        ),
        option: [
          { id: 0, name: "未選択", selectionType: "disabled" },
          ...res.data.signatures,
        ] as OptionAttribute[],
      };
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    }
  );

  return { signatures: data, fetchingSignatures: isFetching };
};

function OrganizeMail() {
  const { isConfirmed } = useConfirm();
  const queryClient = useQueryClient();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [dragData, setDragData] = useState<MailRowAttribute[]>([]);

  const { signatures, fetchingSignatures } = getSignatures();
  const { tableData, fetchingData } = getTableData(
    { sort, pagination },
    { setSort, setPagination }
  );
  const deleteMutation = useMutation(
    (ids: number[]) => destroyOrganizeMail(ids),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        setSelected({});
        queryClient.invalidateQueries(["mail-templates", pagination, sort]);
      },
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "sure",
      content: "sure",
    });

    if (confirmed) {
      const indexes = Object.keys(selected).map(Number);
      deleteMutation.mutate(
        indexes.map((index) => (tableData?.data ?? [])[index].id)
      );
    }
  };

  const data = dragData.length ? dragData : (tableData?.data ?? []);
  
  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (destination && source.index !== destination.index) {
      const newdata = arrayMoveTo(
        [...data],
        source.index,
        destination.index,
        "priority"
      );

      setDragData(newdata);

      // const changes = newdata.reduce(
      //   (acc, { id, priority }) =>
      //     prioritySnapshot.get(id) !== priority
      //       ? [...acc, { id, priority }]
      //       : acc,
      //   [] as { id: number; priority: number }[]
      // );

      // setChanges(changes);
    }
  };

  const tablecolumns: ColumnDef<MailRowAttribute, any>[] = [
    columnHelper.accessor("title", {
      header: () => "タイトル",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.getValue()}</div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("content", {
      header: () => "内容",
      enableSorting: false,
    }),
    columnHelper.accessor("priority", {
      header: () => "並び順",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.getValue()}</div>
      ),
      enableSorting: false,
      minSize: 70,
      size: 70,
    }),
    columnHelper.accessor("signature_id", {
      header: () => "署名",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {signatures?.lookup[row.getValue()]}
        </div>
      ),
      minSize: 120,
      enableSorting: false,
    }),
  ];

  const {
    // handleDelete,
    stateSelected,
    setDialog,
    handleRevertOrder,
    changes,
    handleUpdateOrder,
    columns,
    state,
    fetchData,
    setStateSelected,
    // handleDragEnd,
    dialog,
    // signatures,
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
              disabled={Object.keys(selected).length === 0}
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
          {/* <Table
            columns={columns}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            onDragEnd={handleDragEnd}
            options={{
              selection: true,
              sorting: false,
            }}
          /> */}
          <Stack mb={4} />
          <MyTable
            columns={tablecolumns}
            state={tableData ? { ...tableData, data } : undefined}
            loading={
              fetchingData || fetchingSignatures || deleteMutation.isLoading
            }
            selector={{
              selected,
              setSelected,
            }}
            onDragEnd={handleDragEnd}
          />
        </Stack>
        <OrganizeMailAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            fetchData(state.page, state.per_page, state.sort, state.order)
          }
          signatures={signatures?.option ?? []}
        />
      </Paper>
    </Stack>
  );
}

export default OrganizeMail;
