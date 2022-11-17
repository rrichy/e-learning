import Link from "@/components/atoms/Link";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { jpDate } from "@/mixins/jpFormatter";
import { AffiliationFormAttributeWithId } from "@/validations/AffiliationFormValidation";
import { CategoryFormAttribute } from "@/validations/CategoryFormValidation";
import { DepartmentFormAttributeWithId } from "@/validations/DepartmentFormValidation";
import { SignatureFormAttributeWithId } from "@/validations/SignatureFormValidation";
import {
  ArticleOutlined,
  ChevronRight,
  ContentCopy,
  Delete,
  MarkunreadOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Link as MuiLink, Tooltip } from "@mui/material";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  InquiryRowAttribute,
  MailRowAttribute,
  NoticeTableRowAttribute,
} from "./rowTypes";

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
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() => handleClick(row.original.id)}
          textOverflow="ellipsis"
          width={1}
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {getValue()}
        </MuiLink>
      ),
      minSize: 320,
    }),
    inquiryHelper.accessor("created_at", {
      header: () => "created_at",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{jpDate(getValue())}</div>
      ),
      size: 150,
    }),
  ];

  return columns;
}

const organizedMailHelper = createColumnHelper<MailRowAttribute>();

export function organizedMailColumns(
  handleClick: (row: MailRowAttribute) => void,
  lookup: { [k: number]: string }
) {
  const columns: ColumnDef<MailRowAttribute, any>[] = [
    organizedMailHelper.accessor("title", {
      header: () => "タイトル",
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() => handleClick(row.original)}
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </MuiLink>
      ),
      enableSorting: false,
    }),
    organizedMailHelper.accessor("content", {
      header: () => "内容",
      enableSorting: false,
    }),
    organizedMailHelper.accessor("priority", {
      header: () => "並び順",
      cell: ({ row, getValue }) => (
        <div
          style={{
            textAlign: "center",
            color: row.original.reordered ? "red" : "unset",
          }}
        >
          {getValue()}
        </div>
      ),
      enableSorting: false,
      size: 80,
    }),
    organizedMailHelper.accessor("signature_id", {
      header: () => "署名",
      cell: ({ getValue }) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {lookup[getValue()]}
        </div>
      ),
      minSize: 120,
      enableSorting: false,
    }),
  ];

  return columns;
}

const signatureHelper = createColumnHelper<SignatureFormAttributeWithId>();

export function signatureColumns(
  handleClick: (d: SignatureFormAttributeWithId) => void,
  handleDelete: (id: number) => void
) {
  const columns: ColumnDef<SignatureFormAttributeWithId, any>[] = [
    signatureHelper.accessor("name", {
      header: () => "登録名",
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() => handleClick(row.original)}
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </MuiLink>
      ),
    }),
    signatureHelper.accessor("from_name", {
      header: () => "from_name",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
    }),
    signatureHelper.accessor("from_email", {
      header: () => "from_email",
    }),
    signatureHelper.accessor("content", {
      header: () => "署名",
    }),
    signatureHelper.accessor("priority", {
      header: () => "並び順",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      size: 110,
    }),
    signatureHelper.display({
      id: "action",
      header: () => "アクション",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="削除">
            <IconButton
              onClick={() => handleDelete(row.original.id)}
              size="small"
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

const affiliationHelper = createColumnHelper<AffiliationFormAttributeWithId>();

export function affiliationColumns(
  handleClick: (d: AffiliationFormAttributeWithId) => void
) {
  const columns: ColumnDef<AffiliationFormAttributeWithId, any>[] = [
    affiliationHelper.accessor("name", {
      header: () => "所属",
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() => handleClick(row.original)}
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </MuiLink>
      ),
    }),
    affiliationHelper.accessor("priority", {
      header: () => "並び順",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      size: 110,
    }),
  ];

  return columns;
}

const departmentHelper = createColumnHelper<DepartmentFormAttributeWithId>();

export function departmentColumns(
  handleClick: (d: DepartmentFormAttributeWithId) => void,
  lookup: { [k: number]: DepartmentFormAttributeWithId }
) {
  const columns: ColumnDef<DepartmentFormAttributeWithId, any>[] = [
    departmentHelper.display({
      id: "expand-id",
      header: ({ table }) => (
        <IconButton
          onClick={table.getToggleAllRowsExpandedHandler()}
          size="small"
        >
          <ChevronRight
            sx={{
              transform: `rotate(${table.getIsAllRowsExpanded() ? 90 : 0}deg)`,
              color: "white",
            }}
            fontSize="small"
          />
        </IconButton>
      ),
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <IconButton onClick={row.getToggleExpandedHandler()} size="small">
            <ChevronRight
              sx={{
                transform: `rotate(${row.getIsExpanded() ? 90 : 0}deg)`,
              }}
              fontSize="small"
            />
          </IconButton>
        ) : null,
      size: 40,
    }),
    departmentHelper.accessor("name", {
      header: () => "所属",
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() =>
            handleClick(
              row.original.parent_id
                ? lookup[row.original.parent_id]
                : row.original
            )
          }
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </MuiLink>
      ),
    }),
    departmentHelper.accessor("priority", {
      header: () => "並び順",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
      size: 110,
    }),
  ];

  return columns;
}

const categoryHelper = createColumnHelper<CategoryFormAttribute>();

export function categoryColumns(
  handleClick: (d: CategoryFormAttribute) => void,
  handleDuplicate: (d: CategoryFormAttribute) => void,
  lookup: { [k: number]: CategoryFormAttribute }
) {
  const columns: ColumnDef<CategoryFormAttribute, any>[] = [
    categoryHelper.display({
      id: "expand-id",
      header: ({ table }) => (
        <IconButton
          onClick={table.getToggleAllRowsExpandedHandler()}
          size="small"
        >
          <ChevronRight
            sx={{
              transform: `rotate(${table.getIsAllRowsExpanded() ? 90 : 0}deg)`,
              color: "white",
            }}
            fontSize="small"
          />
        </IconButton>
      ),
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <IconButton onClick={row.getToggleExpandedHandler()} size="small">
            <ChevronRight
              sx={{
                transform: `rotate(${row.getIsExpanded() ? 90 : 0}deg)`,
              }}
              fontSize="small"
            />
          </IconButton>
        ) : null,
      size: 40,
    }),
    categoryHelper.accessor("name", {
      header: () => "カテゴリー名",
      cell: ({ row, getValue }) => (
        <MuiLink
          component="button"
          onClick={() =>
            handleClick(
              row.original.parent_id
                ? lookup[row.original.parent_id]
                : row.original
            )
          }
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </MuiLink>
      ),
    }),
    categoryHelper.accessor("priority", {
      header: () => "並び順",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
    }),
    categoryHelper.accessor("start_period", {
      header: () => "開発期間",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{jpDate(getValue())}</div>
      ),
    }),
    categoryHelper.accessor("end_period", {
      header: () => "終了期間",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{jpDate(getValue())}</div>
      ),
    }),
    categoryHelper.display({
      id: "actions",
      header: () => "アクション",
      cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <Tooltip title="コピー">
            <IconButton
              onClick={() => handleDuplicate(row.original)}
              size="small"
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    }),
  ];

  return columns;
}

const accountHelper = createColumnHelper<UserAttributes>();

export function accountColumns(lookups?: { [k: string]: { [l: number]: string }}) {
  const columns: ColumnDef<UserAttributes, any>[] = [
    accountHelper.accessor("email", {
      header: () => "メールアドレス",
      cell: ({ row, getValue }) => (
        <Link
          to={`/account-management/${row.original.id}/details`}
          sx={{ textAlign: "center", width: 1 }}
        >
          {getValue()}
        </Link>
      ),
      size: 200,
    }),
    accountHelper.accessor("name", {
      header: () => "氏名",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{getValue()}</div>
      ),
    }),
    accountHelper.accessor("affiliation_id", {
      header: () => "所属",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{lookups ? lookups["affiliations"][getValue()] : getValue()}</div>
      ),
    }),
    accountHelper.accessor("department_1", {
      header: () => "部署１",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{lookups ? lookups["departments"][getValue()] : getValue()}</div>
      ),
    }),
    accountHelper.accessor("department_2", {
      header: () => "部署２",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{lookups ? lookups["child_departments"][getValue()] : getValue()}</div>
      ),
    }),
    accountHelper.accessor("created_at", {
      header: () => "登録日",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{jpDate(getValue())}</div>
      ),
    }),
    accountHelper.accessor("last_login_date", {
      header: () => "最終ログイン日",
      cell: ({ getValue }) => (
        <div style={{ textAlign: "center" }}>{jpDate(getValue())}</div>
      ),
      size: 200,
    }),
  ];

  return columns;
}
