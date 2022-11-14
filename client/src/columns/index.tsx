import Link from "@/components/atoms/Link";
import { jpDate } from "@/mixins/jpFormatter";
import { NoticeTableRowAttribute } from "@/validations/NoticeFormValidation";
import { ArticleOutlined, Delete, MarkunreadOutlined } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";


const columnHelper = createColumnHelper<NoticeTableRowAttribute>();

export function noticeColumns(onDelete: (id: number) => void) {
  const columns: ColumnDef<NoticeTableRowAttribute, any>[] = [
    columnHelper.accessor("author", {
      header: () => "作成者",
      cell: ({ row, getValue }) => (
        <div style={{ textAlign: "center" }}>
          <Link to={`/notice-management/${row.original.id}/edit`}>
            {getValue()}
          </Link>
        </div>
      ),
    }),
    columnHelper.accessor("subject", {
      header: () => "件名",
    }),
    columnHelper.display({
      id: "publish-date",
      header: () => "掲載期間",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          {jpDate(row.original.publish_start) +
            "~" +
            jpDate(row.original.publish_end)}
        </div>
      ),
      size: 250,
    }),
    columnHelper.display({
      id: "posting-details",
      header: () => "掲載方法",
      cell: ({ row }) => (
        <Box textAlign="center">
          {Boolean(row.original.shown_in_mail) && (
            <Tooltip title="Mail sent">
              <MarkunreadOutlined fontSize="small" />
            </Tooltip>
          )}
          {Boolean(row.original.shown_in_bulletin) && (
            <Tooltip title="Shown in bulletin">
              <ArticleOutlined fontSize="small" />
            </Tooltip>
          )}
        </Box>
      ),
      size: 110,
    }),
    columnHelper.display({
      id: "action",
      header: () => "アクション",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="削除">
            <IconButton
              size="small"
              onClick={() => onDelete(row.original.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
      size: 110,
    }),
  ];

  return columns;
}