import { Link, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { jpDate } from "@/mixins/jpFormatter";
import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import MyTable from "@/components/atoms/MyTable";
import InquiryDetails from "./InquiryDetails";

export type InquiryRowAttribute = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

const columnHelper = createColumnHelper<InquiryRowAttribute>();

function Inquiries() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [sort, setSort] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_ROWS_PER_PAGE[0],
  });

  const { data, isFetching } = useQuery(
    ["inquiries", pagination, sort],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "desc";

      const res = await get(
        `/api/inquiry?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<InquiryRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns: ColumnDef<InquiryRowAttribute, string>[] = [
    columnHelper.accessor("name", {
      header: () => "氏名",
    }),
    columnHelper.accessor("email", {
      header: () => "メールアドレス",
      minSize: 160,
    }),
    columnHelper.accessor("content", {
      header: () => "内容",
      cell: (row) => (
        <Link
          component="button"
          onClick={() => setSelectedRow(row.row.original.id)}
          textOverflow="ellipsis"
          width={1}
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {row.getValue()}
        </Link>
      ),
      minSize: 320,
    }),
    columnHelper.accessor("created_at", {
      header: () => "created_at",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{jpDate(row.getValue())}</div>
      ),
      size: 150,
    }),
  ];

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">お問い合わせ</Typography>
          <MyTable state={data} columns={columns} loading={isFetching} />
          <InquiryDetails
            id={selectedRow}
            onClose={() => setSelectedRow(null)}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Inquiries;
