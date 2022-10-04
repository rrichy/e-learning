import Button from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/HookForms";
import Table from "@/components/atoms/Table";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { initPaginatedData, OrderType } from "@/interfaces/CommonInterface";
import { CourseIndexItemInterface } from "@/interfaces/CourseIndexItemInterface";
import {
  indexCourse,
  massDestroyCourse,
  massUpdateCoursePriority,
} from "@/services/CourseService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  Close,
} from "@mui/icons-material";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Column } from "material-table";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormContainer } from "react-hook-form-mui";

interface CourseListProps {
  open: boolean;
  onClose: () => void;
  // resolveFn: () => void;
}

function CourseList({ open, onClose }: CourseListProps) {
  const mounted = useRef(true);
  const [state, setState] = useState(
    initPaginatedData<CourseIndexItemInterface>()
  );
  const [stateSelected, setStateSelected] = useState<number[]>([]);
  const [snapshot, setSnapshot] = useState<number[]>([]);
  // keyby category_id with value of {priority and id (course)}[]
  const [changes, setChanges] = useState(
    new Map<number, { priority: number; id: number }[]>()
  );
  const { errorSnackbar, successSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof CourseIndexItemInterface = "category_id",
      order: OrderType = "desc"
    ) => {
      setChanges(new Map());
      setStateSelected([]);

      try {
        setState((s) => ({
          ...s,
          loading: true,
        }));

        const res = await indexCourse("both");

        const { data } = res.data;
        const parsed = data.reduce(
          (acc: CourseIndexItemInterface[], b: CourseIndexItemInterface[]) =>
            acc.concat(b),
          []
        );
        if (mounted.current) {
          setState((s) => ({
            ...s,
            loading: false,
            data: parsed,
          }));
          setSnapshot(
            parsed.map((a: CourseIndexItemInterface) => a.course_priority)
          );
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    },
    []
  );

  const handleUpdate = async () => {
    const confirmed = await isConfirmed({
      title: "update sure?",
      content: "update sure",
    });

    if (confirmed) {
      try {
        setState((s) => ({ ...s, loading: true }));

        const parsed: {
          category_id: number;
          changes: {
            id: number;
            priority: number;
          }[];
        }[] = [];
        changes.forEach((courses, category_id) =>
          parsed.push({ category_id, changes: courses })
        );

        const res = await massUpdateCoursePriority(parsed);
        successSnackbar(res.data.message);
        fetchData();
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
        setStateSelected([]);
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "delete sure?",
      content: "delete sure",
    });

    if (confirmed) {
      try {
        setState((s) => ({ ...s, loading: true }));
        const res = await massDestroyCourse(stateSelected);
        successSnackbar(res.data.message);
        fetchData();
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
        setStateSelected([]);
      }
    }
  };

  const columns: Column<CourseIndexItemInterface>[] = [
    {
      field: "category_priority",
      title: "並び順",
      editable: "never",
    },
    {
      field: "category_name",
      title: "カテゴリー名",
      editable: "never",
      cellStyle: { textAlign: "left" },
      width: "20%",
    },
    {
      field: "course_title",
      title: "コース名",
      editable: "never",
      cellStyle: { textAlign: "left" },
      width: "30%",
    },
    {
      field: "course_priority",
      title: "並び順",
      type: "numeric",
      cellStyle: (_d, row) => ({
        color: changes.get(row.category_id)?.find((a) => a.id === row.course_id)
          ? "#00b4aa"
          : "inherit",
        textAlign: "center",
      }),
      align: "center",
      render: (row) =>
        row.course_id
          ? changes.get(row.category_id)?.find((a) => a.id === row.course_id)
              ?.priority ?? row.course_priority
          : null,
      initialEditValue: 234,
    },
    {
      field: "course_status",
      title: "ステータス",
      editable: "never",
      render: (row) => (row.course_status === 1 ? "非公開" : "公開"),
    },
    { field: "course_size", title: "利用容量", editable: "never", render: () => "???" },
  ];

  useEffect(() => {
    mounted.current = true;
    if (open) {
      fetchData();
    }

    return () => {
      mounted.current = false;
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { bgcolor: "#f7f7f7", position: "relative" } }}
    >
      <IconButton
        onClick={onClose}
        color="primary"
        size="large"
        disableRipple
        sx={{ position: "absolute", right: 0 }}
      >
        <Close fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">コース状況</Typography>
      </DialogTitle>
      <DialogContent>
        <Table
          columns={columns}
          state={state}
          fetchData={fetchData}
          actions={[
            (row) => ({
              icon: stateSelected.includes(row.course_id)
                ? CheckBox
                : CheckBoxOutlineBlank,
              onClick: (_e, rowData) => {
                if (stateSelected.includes(rowData.course_id))
                  setStateSelected(
                    stateSelected.filter((a) => a !== rowData.course_id)
                  );
                else setStateSelected([...stateSelected, rowData.course_id]);
              },
              hidden: row.course_id === null,
            }),
          ]}
          localization={{
            header: {
              actions: "削除",
            },
          }}
          options={{
            actionsColumnIndex: 5,
            paging: false,
            sorting: false,
            rowStyle: {
              position: "relative",
            },
          }}
          cellEditable={{
            cellStyle: {
              backgroundColor: "white",
              zIndex: 10,
              position: "absolute",
              minWidth: "200px",
              top: "50%",
              transform: "translateY(-50%)",
            },
            onCellEditApproved: (newValue, _old, row) =>
              new Promise((resolve, reject) => {
                const temp = [...state.data];
                const index = temp.findIndex(
                  (a) => a.course_id === row.course_id
                );
                temp[index]!.course_priority = +newValue;

                const touches = new Map(changes);
                const cat_clone = touches.get(row.category_id) || [];
                if (snapshot[index] === +newValue) {
                  const filtered = cat_clone.filter(
                    (a) => a.id !== +row.course_id
                  );
                  if (filtered.length > 0)
                    touches.set(row.category_id, filtered);
                  else touches.delete(row.category_id);
                } else {
                  const obj = cat_clone.find((a) => a.id === +row.course_id);
                  if (obj) {
                    obj.priority = +newValue;
                  } else {
                    cat_clone.push({ id: +row.course_id, priority: +newValue });
                  }
                  touches.set(row.category_id, cat_clone);
                }

                setChanges(touches);
                setState({ ...state, data: temp });
                resolve();
              }),
          }}
        />
        <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
          <Button
            large
            rounded
            color="inherit"
            variant="outlined"
            onClick={handleUpdate}
            disabled={changes.size === 0}
          >
            アップデート
          </Button>
          <Button
            large
            rounded
            color="secondary"
            variant="contained"
            disabled={stateSelected.length === 0}
            onClick={handleDelete}
          >
            削除する
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CourseList;
