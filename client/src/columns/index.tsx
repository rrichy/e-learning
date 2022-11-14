import Link from "@/components/atoms/Link";
import { jpDate } from "@/mixins/jpFormatter";
import { ArticleOutlined, Delete, MarkunreadOutlined } from "@mui/icons-material";
import { Box, IconButton, Link as MuiLink, Tooltip } from "@mui/material";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { InquiryRowAttribute, NoticeTableRowAttribute } from "./rowTypes";


const noticeHelper = createColumnHelper<NoticeTableRowAttribute>();

export function noticeColumns(handleDelete: (id: number) => void) {
  const columns: ColumnDef<NoticeTableRowAttribute, any>[] = [
    noticeHelper.accessor("author", {
      header: () => "作成者",
      cell: ({ row, getValue }) => (
        <div style={{ textAlign: "center" }}>
          <Link to={`/notice-management/${row.original.id}/edit`}>
            {getValue()}
          </Link>
        </div>
      ),
    }),
    noticeHelper.accessor("subject", {
      header: () => "件名",
    }),
    noticeHelper.display({
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
    noticeHelper.display({
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
    noticeHelper.display({
      id: "action",
      header: () => "アクション",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="削除">
            <IconButton
              size="small"
              onClick={() => handleDelete(row.original.id)}
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


const inquiryHelper = createColumnHelper<InquiryRowAttribute>();

export function inquiryColumns(handleClick: (id: number) => void) {
  const columns: ColumnDef<InquiryRowAttribute, string>[] = [
    inquiryHelper.accessor("name", {
      header: () => "氏名",
    }),
    inquiryHelper.accessor("email", {
      header: () => "メールアドレス",
      minSize: 160,
    }),
    inquiryHelper.accessor("content", {
      header: () => "内容",
      cell: (row) => (
        <MuiLink
          component="button"
          onClick={() => handleClick(row.row.original.id)}
          textOverflow="ellipsis"
          width={1}
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {row.getValue()}
        </MuiLink>
      ),
      minSize: 320,
    }),
    inquiryHelper.accessor("created_at", {
      header: () => "created_at",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{jpDate(row.getValue())}</div>
      ),
      size: 150,
    }),
  ];

  return columns;
}