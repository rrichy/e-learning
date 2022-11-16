import Button from "@/components/atoms/Button";
import MyTable from "@/components/atoms/MyTable";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { CourseIndexItemInterface } from "@/interfaces/CourseIndexItemInterface";
import {
  indexCourse,
  massDestroyCourse,
  massUpdateCoursePriority,
} from "@/services/CourseService";
import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columnHelper = createColumnHelper<CourseIndexItemInterface>();

interface CourseListProps {
  open: boolean;
  onClose: () => void;
}

function CourseList({ open, onClose }: CourseListProps) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery(
    ["courses-list"],
    async () => {
      const res = await indexCourse("both");

      const { data } = res.data;

      return {
        data: data.reduce(
          (acc: CourseIndexItemInterface[], b: CourseIndexItemInterface[]) =>
            acc.concat(b),
          []
        ),
        meta: res.data.meta,
      } as TableStateProps<CourseIndexItemInterface>;
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
      enabled: open,
      keepPreviousData: true,
    }
  );
  const [errors, setErrors] = useState<number[]>([]);
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [updated, setUpdated] = useState<{
    [k: number]: { category_id: number; id: number; priority: number };
  }>({});
  const { errorSnackbar, successSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();

  const onSuccess = (res: any) => {
    successSnackbar(res.data.message);
    setUpdated({});
    setSelected({});
    setErrors([]);
    queryClient.invalidateQueries(["courses-list"]);
  };

  const deleteMutation = useMutation(
    (ids: number[]) => massDestroyCourse(ids),
    {
      onSuccess,
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const updateMutation = useMutation(
    (
      payload: {
        category_id: number;
        changes: { id: number; priority: number }[];
      }[]
    ) => massUpdateCoursePriority(payload),
    {
      onSuccess,
      onError: (e: any, payload) => {
        errorSnackbar(e.message);
        const pointers = Object.keys(e.response.data.errors).map((a) =>
          a.match(/\d+/g)!.map(Number)
        );
        setErrors(
          pointers.map(
            ([catIndex, couIndex]) => payload[catIndex].changes[couIndex].id
          )
        );
      },
    }
  );

  const handleUpdate = async () => {
    const confirmed = await isConfirmed({
      title: "update sure?",
      content: "update sure",
    });

    if (confirmed) {
      const parsed: {
        category_id: number;
        changes: {
          id: number;
          priority: number;
        }[];
      }[] = [];

      let parsedIndex: number | null = null;
      Object.values(updated).forEach((update) => {
        if (
          parsedIndex === null ||
          update.category_id !== parsed[parsedIndex].category_id
        ) {
          parsed.push({
            category_id: update.category_id,
            changes: [{ id: update.id, priority: update.priority }],
          });
        } else {
          parsed[parsedIndex].changes.push({
            id: update.id,
            priority: update.priority,
          });
        }

        if (parsedIndex === null) parsedIndex = 0;
        if (update.category_id !== parsed[parsedIndex].category_id)
          parsedIndex++;
      });

      updateMutation.mutate(parsed);
    }
  };

  const handleDelete = async () => {
    const confirmed = await isConfirmed({
      title: "delete sure?",
      content: "delete sure",
    });

    if (confirmed) {
      const course_ids = Object.keys(selected).map(
        (index) => data!.data[+index].course_id!
      );
      deleteMutation.mutate(course_ids);
    }
  };

  const tableColumns: ColumnDef<CourseIndexItemInterface, any>[] = [
    columnHelper.accessor("category_priority", {
      header: () => "並び順",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      enableSorting: false,
      size: 80,
    }),
    columnHelper.accessor("category_name", {
      header: () => "カテゴリー名",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("course_title", {
      header: () => "コース名",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("course_priority", {
      header: () => "並び順",
      cell: ({ row, getValue }) =>
        row.original.course_id ? (
          <MuiTextField
            type="number"
            value={updated[row.index]?.priority ?? getValue()}
            size="small"
            variant="standard"
            onChange={(e) => {
              setUpdated((old) => {
                const temp = { ...old };
                const item = { ...row.original };

                if (+e.target.value === item.course_priority) {
                  delete temp[row.index];
                } else {
                  item.course_priority = +e.target.value;
                  temp[row.index] = {
                    category_id: item.category_id,
                    id: item.course_id!,
                    priority: +e.target.value,
                  };
                }

                return temp;
              });
              setErrors(
                errors.filter(
                  (course_id) => course_id !== row.original.course_id
                )
              );
            }}
            sx={{
              "& input": {
                textAlign: "center",
                ...(updated[row.index] &&
                updated[row.index].priority !== row.original.course_priority
                  ? {
                      color: "secondary.main",
                      fontWeight: "bold",
                    }
                  : {}),
              },
            }}
            error={errors.includes(row.original.course_id)}
          />
        ) : null,
      enableSorting: false,
      size: 80,
    }),
    columnHelper.accessor("course_status", {
      header: () => "ステータス",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          {row.original.course_status === 1 ? "非公開" : "公開"}
        </div>
      ),
      enableSorting: false,
      size: 110,
    }),
    columnHelper.accessor("course_size", {
      header: () => "利用容量",
      cell: () => <div style={{ textAlign: "center" }}>???</div>,
      enableSorting: false,
      size: 100,
    }),
  ];

  useEffect(() => {
    if (!open) {
      setUpdated({});
      setSelected({});
      setErrors([]);
    }
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
        <MyTable
          state={data}
          columns={tableColumns}
          loading={isFetching || deleteMutation.isLoading}
          selector={{
            selected,
            setSelected,
            index: -2,
            selectCondition: (row) => Boolean(row.original.course_id),
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
          <Button
            large
            rounded
            color="inherit"
            variant="outlined"
            onClick={handleUpdate}
            disabled={Object.keys(updated).length === 0}
          >
            アップデート
          </Button>
          <Button
            large
            rounded
            color="secondary"
            variant="contained"
            disabled={Object.keys(selected).length === 0}
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
