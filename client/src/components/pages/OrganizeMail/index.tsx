import { Box, Link, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  OptionAttribute,
  PageDialogProps,
  TableStateProps,
} from "@/interfaces/CommonInterface";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import { getOptions } from "@/services/CommonService";
import {
  destroyOrganizeMail,
  massUpdateOrganizeMailPriority,
} from "@/services/OrganizeMailService";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { DropResult } from "@hello-pangea/dnd";

export type MailRowAttribute = {
  id: number;
  title: string;
  content: string;
  priority: number;
  signature_id: number;
  reordered?: boolean;
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

function arrayMoveTo(
  original: MailRowAttribute[],
  arr: MailRowAttribute[],
  from: number,
  to: number
) {
  const reordered = [...arr];
  reordered.splice(to, 0, reordered.splice(from, 1)[0]);

  let hasReordered = false;

  const mapped = reordered.map((a, i) => {
    const areordered = a.id !== original[i].id;
    if (areordered) hasReordered = true;
    return { ...a, reordered: areordered, priority: original[i].priority };
  });

  return { reordered: mapped, hasReordered };
}

function OrganizeMail() {
  const { isConfirmed } = useConfirm();
  const queryClient = useQueryClient();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [hasReordered, setHasReordered] = useState(false);
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [dragData, setDragData] = useState<MailRowAttribute[]>([]);
  const [dialog, setDialog] =
    useState<PageDialogProps<OrganizeMailFormAttributeWithId>>(null);

  const { signatures, fetchingSignatures } = getSignatures();
  const { tableData, fetchingData } = getTableData(
    { sort, pagination },
    { setSort, setPagination }
  );

  const resolver = {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      setDragData([]);
      setHasReordered(false);
      setSelected({});
      queryClient.invalidateQueries(["mail-templates", pagination, sort]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  };

  const deleteMutation = useMutation(
    (ids: number[]) => destroyOrganizeMail(ids),
    resolver
  );
  const priorityMutation = useMutation(
    (changes: { id: number; priority: number }[]) =>
      massUpdateOrganizeMailPriority(changes),
    resolver
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

  const data = dragData.length ? dragData : tableData?.data ?? [];

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (destination && source.index !== destination.index) {
      const newdata = arrayMoveTo(
        tableData?.data ?? [],
        data,
        source.index,
        destination.index
      );

      setDragData(newdata.reordered);
      setHasReordered(newdata.hasReordered);
    }
  };

  const handleRevertOrder = () => {
    setDragData([]);
    setHasReordered(false);
  };

  const handleUpdateOrder = async () => {
    const confirmed = await isConfirmed({
      title: "update priorty",
      content: "update priority",
    });
    if (confirmed) {
      const changes = dragData.reduce(
        (acc, row) =>
          row.reordered
            ? [...acc, { id: row.id, priority: row.priority }]
            : acc,
        [] as { id: number; priority: number }[]
      );
      priorityMutation.mutate(changes);
    }
  };

  const tablecolumns: ColumnDef<MailRowAttribute, any>[] = [
    columnHelper.accessor("title", {
      header: () => "タイトル",
      cell: (row) => (
        <Link
          component="button"
          onClick={() => setDialog(row.row.original)}
          sx={{ textAlign: "center", width: 1 }}
        >
          {row.getValue()}
        </Link>
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
        <div
          style={{
            textAlign: "center",
            color: row.row.original.reordered ? "red" : "unset",
          }}
        >
          {row.getValue()}
        </div>
      ),
      enableSorting: false,
      size: 80,
    }),
    columnHelper.accessor("signature_id", {
      header: () => "署名",
      cell: (row) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {signatures?.lookup[row.getValue()]}
        </div>
      ),
      minSize: 120,
      enableSorting: false,
    }),
  ];

  useEffect(() => {
    setDragData([]);
    setHasReordered(false);
  }, [sort[0]?.id, sort[0]?.desc, pagination.pageIndex, pagination.pageSize]);

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
              disabled={!hasReordered}
            >
              戻す
            </Button>
            <Button
              variant="contained"
              sx={{ width: 75, borderRadius: 6 }}
              disabled={!hasReordered}
              onClick={handleUpdateOrder}
            >
              更新
            </Button>
          </Stack>
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
            queryClient.invalidateQueries(["mail-templates", pagination, sort])
          }
          signatures={signatures?.option ?? []}
        />
      </Paper>
    </Stack>
  );
}

export default OrganizeMail;
