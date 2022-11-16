import { Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/ApiService";
import MyTable from "@/components/atoms/MyTable";
import InquiryDetails from "./InquiryDetails";
import { InquiryRowAttribute } from "@/columns/rowTypes";
import { inquiryColumns } from "@/columns";
import { useMyTable } from "@/hooks/useMyTable";

function Inquiries() {
  const [detailId, setDetailId] = useState<number | null>(null);
  const { sorter, pagination, setPagination } = useMyTable();

  const { data, isFetching } = useQuery(
    ["inquiries", pagination, sorter.sort],
    async () => {
      const sortKey = sorter.sort[0]?.id ?? "id";
      const orderDir = sorter.sort[0]
        ? sorter.sort[0].desc
          ? "desc"
          : "asc"
        : "desc";

      const res = await get(
        `/api/inquiry?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: sorter.setSort,
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

  const columns = inquiryColumns(setDetailId);

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">お問い合わせ</Typography>
          <MyTable state={data} columns={columns} loading={isFetching} />
          <InquiryDetails id={detailId} onClose={() => setDetailId(null)} />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Inquiries;
