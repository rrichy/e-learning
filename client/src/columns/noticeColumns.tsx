import Link from "@/components/atoms/Link";
import { jpDate } from "@/mixins/jpFormatter";
import { NoticeTableRowAttribute } from "@/validations/NoticeFormValidation";
import { ArticleOutlined, MarkunreadOutlined, Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Column } from "material-table";

export default function generate(onDelete: (d?: NoticeTableRowAttribute) => void) {
  const columns: Column<NoticeTableRowAttribute>[] = [
    {
      field: "author",
      title: "作成者",
      render: (row) => (
        <Link to={`/notice-management/${row.id}/edit`}>{row.author}</Link>
      ),
    },
    { field: "subject", title: "件名" },
    {
      field: "publish_start",
      title: "掲載期間",
      render: (row) =>
        jpDate(row.publish_start) + "~" + jpDate(row.publish_end),
    },
    {
      field: "posting",
      title: "掲載方法",
      sorting: false,
      render: (row) => (
        <Box>
          {Boolean(row.shown_in_mail) && (
            <Tooltip title="Mail sent">
              <MarkunreadOutlined />
            </Tooltip>
          )}
          {Boolean(row.shown_in_bulletin) && (
            <Tooltip title="Shown in bulletin">
              <ArticleOutlined />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "id",
      title: "アクション",
      sorting: false,
      render: (row) => (
        <Tooltip title="削除">
          <IconButton onClick={() => onDelete(row)}>
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return columns;
}
