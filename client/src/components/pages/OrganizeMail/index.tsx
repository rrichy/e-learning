import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { PageDialogProps, TableStateProps } from "@/interfaces/CommonInterface";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import { getCacheableOptions } from "@/services/CommonService";
import {
  destroyOrganizeMail,
  massUpdateOrganizeMailPriority,
} from "@/services/OrganizeMailService";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { DropResult } from "@hello-pangea/dnd";
import { useMyTable } from "@/hooks/useMyTable";
import { organizedMailColumns } from "@/columns";
import { MailRowAttribute } from "@/columns/rowTypes";
import generateLookup from "@/utils/generateLookup";

function OrganizeMail() {
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const queryClient = useQueryClient();
  const { sorter, selector, pagination, setPagination, resetTable } =
    useMyTable();
  const [hasReordered, setHasReordered] = useState(false);

  const [dragData, setDragData] = useState<MailRowAttribute[]>([]);
  const [dialog, setDialog] =
    useState<PageDialogProps<OrganizeMailFormAttributeWithId>>(null);

  const { options, fetchingOptions } = getCacheableOptions("signatures");
  const lookup = useMemo(() => {
    if (!fetchingOptions && options.signatures) {
      return generateLookup(options.signatures);
    }
    return {} as { [k: number]: string };
  }, [fetchingOptions, options]);

  const { tableData, fetchingData } = getTableData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
  });

  const data = dragData.length ? dragData : tableData?.data ?? [];

  const resolver = {
    onSuccess: (res: any) => {
      successSnackbar(res.data.message);
      setDragData([]);
      setHasReordered(false);
      selector.setSelected({});
      queryClient.invalidateQueries([
        "mail-templates",
        pagination,
        sorter.sort,
      ]);
    },
    onError: (e: any) => errorSnackbar(e.message),
  };

  const deleteMutation = useMutation(
    (ids: number[]) => destroyOrganizeMail(ids),
    {
      ...resolver,
      onSuccess: (res: any) => {
        resolver.onSuccess(res);
        resetTable();
      },
    }
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
      const indexes = Object.keys(selector.selected).map(Number);
      deleteMutation.mutate(
        indexes.map((index) => (tableData?.data ?? [])[index].id)
      );
    }
  };

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

  const columns = organizedMailColumns(setDialog, lookup);

  useEffect(() => {
    setDragData([]);
    setHasReordered(false);
  }, [
    sorter.sort[0]?.id,
    sorter.sort[0]?.desc,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

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
              disabled={Object.keys(selector.selected).length === 0}
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
            columns={columns}
            state={tableData ? { ...tableData, data } : undefined}
            loading={
              fetchingData || fetchingOptions || deleteMutation.isLoading
            }
            selector={selector}
            onDragEnd={handleDragEnd}
          />
        </Stack>
        <OrganizeMailAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            queryClient.invalidateQueries([
              "mail-templates",
              pagination,
              sorter.sort,
            ])
          }
          signatures={[
            { id: 0, name: "未選択", selectionType: "disabled" },
            ...(options.signatures ?? []),
          ]}
        />
      </Paper>
    </Stack>
  );
}

export default OrganizeMail;

// included sort for future updates
const getTableData = ({
  sort,
  setSort,
  pagination,
  setPagination,
}: {
  sort: SortingState;
  setSort: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}) => {
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
