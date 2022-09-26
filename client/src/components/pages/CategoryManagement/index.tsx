import {
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { CategoryFormAttributeWithId } from "@/validations/CategoryFormValidation";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  destroyCategory,
  duplicateCategory,
  indexCategory,
} from "@/services/CategoryService";
import { Column } from "material-table";
import Table from "@/components/atoms/Table";
import CategoryAddEdit from "./CategoryAddEdit";
import { ContentCopy } from "@mui/icons-material";
import { jpDate } from "@/mixins/jpFormatter";

function CategoryManagement() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [categoriesState, setCategoriesState] = useState(
    initPaginatedData<CategoryFormAttributeWithId>()
  );
  const [categorySelected, setCategorySelected] = useState<
    CategoryFormAttributeWithId[]
  >([]);
  const [categoryDialog, setCategoryDialog] =
    useState<PageDialogProps<CategoryFormAttributeWithId>>(null);

  const fetchCategories = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof CategoryFormAttributeWithId = "id",
      order: OrderType = "desc"
    ) => {
      try {
        setCategoriesState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await indexCategory(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current)
          setCategoriesState((s) => ({
            ...s,
            loading: false,
            data: data.reduce(
              (acc: any, parent: any) =>
                acc.concat(parent, ...parent.child_categories),
              []
            ),
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setCategoriesState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async () => {
    try {
      setCategoriesState((s) => ({ ...s, loading: true }));
      const res = await destroyCategory(categorySelected.map((a) => a.id));
      successSnackbar(res.data.message);
      fetchCategories();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setCategoriesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleDuplicate = async (category: CategoryFormAttributeWithId) => {
    try {
      setCategoriesState((s) => ({ ...s, loading: true }));
      const res = await duplicateCategory(category.id);
      successSnackbar(res.data.message);
      fetchCategories();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setCategoriesState((s) => ({ ...s, loading: false }));
    }
  };

  const columns: Column<CategoryFormAttributeWithId>[] = [
    {
      field: "name",
      title: "カテゴリー名",
      render: (row) => (
        <Link
          component="button"
          onClick={() =>
            setCategoryDialog(
              row.parent_id
                ? categoriesState.data.find((a) => a.id === row.parent_id)!
                : row
            )
          }
        >
          {row.name}
        </Link>
      ),
    },
    { field: "priority", title: "並び順" },
    {
      field: "start_period",
      title: "開始期間",
      render: (row) => jpDate(row.start_period),
    },
    {
      field: "end_period",
      title: "終了期間",
      render: (row) => jpDate(row.end_period),
    },
    {
      field: "id",
      title: "アクション",
      sorting: false,
      render: (row) => (
        <Tooltip title="コピー">
          <IconButton onClick={() => handleDuplicate(row)}>
            <ContentCopy />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    mounted.current = true;
    fetchCategories();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">カテゴリーの管理</Typography>
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
              disabled={categorySelected.length === 0}
            >
              削除
            </Button>
            <Button
              variant="contained"
              onClick={() => setCategoryDialog("add")}
            >
              追加
            </Button>
          </Stack>
          <Table
            columns={columns}
            state={categoriesState}
            fetchData={fetchCategories}
            onSelectionChange={(rows) => setCategorySelected(rows)}
            parentChildData={(row, rows) =>
              rows.find((a) => a.id === row.parent_id)
            }
            options={{
              selection: true,
              actionsColumnIndex: -1,
            }}
          />
          <CategoryAddEdit
            state={categoryDialog}
            closeFn={() => setCategoryDialog(null)}
            resolverFn={() =>
              fetchCategories(
                categoriesState.page,
                categoriesState.per_page,
                categoriesState.sort,
                categoriesState.order
              )
            }
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default CategoryManagement;
