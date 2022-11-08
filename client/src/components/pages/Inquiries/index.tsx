import { Link, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Column } from "material-table";
import Table from "@/components/atoms/Table";
import {
  initPaginationFilter,
  initReactQueryPagination,
  OrderType,
  PaginationFilterInterface,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { jpDate } from "@/mixins/jpFormatter";
import InquiryDetails from "@/components/molecules/InquiryDetails";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import MyTable from "@/components/atoms/MyTable";

export type InquiryRowAttribute = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

const init = initReactQueryPagination<InquiryRowAttribute>();

function getTableResults(
  filters: PaginationFilterInterface & { [k: string]: any }
) {
  return useQuery(
    ["inquiries", filters],
    async () => {
      const params = Object.entries(filters)
        .reduce(
          (acc: string[], [key, value]) =>
            !value || ["last_page", "total"].includes(key)
              ? acc
              : [...acc, `${key === "current_page" ? "page" : key}=${value}`],
          []
        )
        .join("&");

      const res = await get("/api/inquiries?" + params);

      return res.data as ReactQueryPaginationInterface<InquiryRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
}

const columnHelper = createColumnHelper<InquiryRowAttribute>();

function Inquiries() {
  const [pagination, setPagination] = useState(initPaginationFilter);
  const { data, isFetching } = getTableResults(pagination);
  const [selectedRow, setSelectedRow] = useState<InquiryRowAttribute | null>(
    null
  );

  const updateFilter = (
    page: number = 1,
    pageSize: number = TABLE_ROWS_PER_PAGE[0],
    sort: keyof InquiryRowAttribute = "id",
    order: OrderType = "desc"
  ) => {
    setPagination({
      ...pagination,
      current_page: page,
      per_page: pageSize,
      sort,
      order,
    });
  };

  const columns: Column<InquiryRowAttribute>[] = [
    {
      field: "name",
      title: "氏名",
    },
    {
      field: "email",
      title: "メールアドレス",
    },
    {
      field: "content",
      title: "内容",
      render: (row) => (
        <Link component="button" onClick={() => setSelectedRow(row)}>
          {row.content}
        </Link>
      ),
      cellStyle: {
        maxWidth: "500px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
    },
    {
      field: "created_at",
      title: "created_at",
      render: (row) => jpDate(row.created_at),
    },
  ];

  const tableColumns: ColumnDef<InquiryRowAttribute, string>[] = [
    columnHelper.accessor("name", {
      header: () => "氏名"
    }),
    columnHelper.accessor("email", {
      header: () => "メールアドレス",
    }),
    columnHelper.accessor("content", {
      header: () => "内容",
      cell: (row) => (
        <Link component="button" onClick={() => setSelectedRow(row.row.original)}>
          {row.getValue()}
        </Link>
      )
    }),
    columnHelper.accessor("created_at", {
      header: () => "created_at",
      cell: (row) => jpDate(row.getValue())
    })
  ];

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">お問い合わせ</Typography>
          <Table
            columns={columns}
            state={data || init}
            fetchData={updateFilter}
            isLoading={isFetching}
          />
          <Stack mt={6} />
          <MyTable data={data?.data ?? []} columns={tableColumns} />
          <InquiryDetails
            propInquiry={selectedRow}
            onClose={() => setSelectedRow(null)}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Inquiries;
