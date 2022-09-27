import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OptionAttribute,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { MTableBodyRow } from "material-table";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import {
  destroyOrganizeMail,
  indexOrganizeMail,
  massUpdateOrganizeMailPriority,
} from "@/services/OrganizeMailService";
import Table from "@/components/atoms/Table";
import { getOptions } from "@/services/CommonService";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";
import organizeMailColumns from "@/columns/organizeMailColumns";
import arrayMoveTo from "@/utils/arrayMoveTo";
import useConfirm from "@/hooks/useConfirm";

function OrganizeMail() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [state, setState] = useState(
    initPaginatedData<OrganizeMailFormAttributeWithId>()
  );
  const [snapshot, setSnapshot] = useState<OrganizeMailFormAttributeWithId[]>(
    []
  );
  // keyof id value of priority
  const [prioritySnapshot, setPrioritySnapshot] = useState(
    new Map<number, number>()
  );
  const [changes, setChanges] = useState<{ id: number; priority: number }[]>(
    []
  );
  const dragState = {
    row: -1,
    dropIndex: -1,
  };
  const [stateSelected, setStateSelected] = useState<
    OrganizeMailFormAttributeWithId[]
  >([]);
  const [signatures, setSignatures] = useState({
    lookup: {} as { [k: number]: string },
    option: [
      { id: 0, name: "未選択", selectionType: "disabled" },
    ] as OptionAttribute[],
  });
  const [dialog, setDialog] =
    useState<PageDialogProps<OrganizeMailFormAttributeWithId>>(null);

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof OrganizeMailFormAttributeWithId = "priority",
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
        setChanges([]);

        const res = await indexOrganizeMail(page, pageSize, sort, order);
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
          setSnapshot(data);
          setPrioritySnapshot(
            new Map(
              data.map((a: OrganizeMailFormAttributeWithId) => [
                a.id,
                a.priority,
              ])
            )
          );
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
    try {
      setState((s) => ({ ...s, loading: true }));
      const res = await destroyOrganizeMail(stateSelected.map((a) => a.id));
      successSnackbar(res.data.message);
      fetchData();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleReorder = (sourceIndex: number, targetIndex: number) => {
    const newdata = arrayMoveTo(
      [...state.data],
      sourceIndex,
      targetIndex,
      "priority"
    );

    setState({
      ...state,
      data: newdata,
    });
    const changes = newdata.reduce(
      (acc, { id, priority }) =>
        prioritySnapshot.get(id) !== priority
          ? [...acc, { id, priority }]
          : acc,
      [] as { id: number; priority: number }[]
    );

    setChanges(changes);
  };

  const handleRevertOrder = () => {
    setState({
      ...state,
      data: snapshot,
    });
    setChanges([]);
  };

  const handleUpdateOrder = async () => {
    const confirmed = await isConfirmed({
      title: "update priorty",
      content: "update priority",
    });
    if (confirmed) {
      try {
        const res = await massUpdateOrganizeMailPriority(changes);

        successSnackbar(res.data.message);
        fetchData(state.page, state.per_page, state.sort, state.order);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchData();

    (async () => {
      try {
        const res = await getOptions(["signatures"]);
        setSignatures({
          lookup: res.data.signatures.reduce(
            (acc: any, b: any) => ({ ...acc, [b.id]: b.name }),
            {} as any
          ),
          option: [
            { id: 0, name: "未選択", selectionType: "disabled" },
            ...res.data.signatures,
          ],
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
            columns={organizeMailColumns({
              lookup: signatures.lookup,
              titleClickFn: setDialog,
              prioritySnapshot,
            })}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            options={{
              selection: true,
              maxBodyHeight: "unset",
            }}
            components={{
              Row: (props) => (
                <MTableBodyRow
                  {...props}
                  draggable="true"
                  onDragStart={(e: React.DragEvent<HTMLElement>) => {
                    console.log({
                      src: dragState.row,
                      target: dragState.dropIndex,
                    });
                    dragState.row = props.data.tableData.id;
                  }}
                  onDragEnter={(e: React.DragEvent<HTMLElement>) => {
                    e.preventDefault();
                    if (props.data.tableData.id !== dragState.row) {
                      dragState.dropIndex = props.data.tableData.id;
                    }
                  }}
                  onDragEnd={(e: any) => {
                    console.log({
                      src: dragState.row,
                      target: dragState.dropIndex,
                    });
                    if (dragState.dropIndex !== -1) {
                      handleReorder(dragState.row, dragState.dropIndex);
                    }
                    dragState.row = -1;
                    dragState.dropIndex = -1;
                  }}
                />
              ),
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
