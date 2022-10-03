import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import CategoryAddEdit from "./CategoryAddEdit";
import useCategory from "@/hooks/pages/useCategory";

function CategoryManagement() {
  const {
    handleDelete,
    categorySelected,
    setCategoryDialog,
    columns,
    categoriesState,
    fetchCategories,
    setCategorySelected,
    categoryDialog,
  } = useCategory();
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
