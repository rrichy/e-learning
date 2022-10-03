import { IconButton, Link, Tooltip } from "@mui/material";
import { PageDialogProps, PaginatedData } from "@/interfaces/CommonInterface";
import { CategoryFormAttributeWithId } from "@/validations/CategoryFormValidation";
import { Column } from "material-table";
import { ContentCopy } from "@mui/icons-material";
import { jpDate } from "@/mixins/jpFormatter";

export default function generate({
  setCategoryDialog,
  categoriesState,
  handleDuplicate,
}: {
  setCategoryDialog: (c: PageDialogProps<CategoryFormAttributeWithId>) => void;
  categoriesState: PaginatedData<CategoryFormAttributeWithId>;
  handleDuplicate: (c: CategoryFormAttributeWithId) => void;
}) {
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

  return columns;
}
