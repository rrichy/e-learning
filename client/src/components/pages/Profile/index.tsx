import { Paper, Stack, Typography } from "@mui/material";
import Labeler from "../../molecules/Labeler";
import CommonProfile from "../../organisms/Student/CommonProfile";
import useAuth from "@/hooks/useAuth";
import { jpDate } from "@/utils/jpFormatter";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";
import MyTable from "@/components/atoms/MyTable";
import { useMyTable } from "@/hooks/useMyTable";
import { attendingColumns } from "@/columns";
import { AttendingRowAttribute } from "@/columns/rowTypes";

function StudentProfile() {
  const { authData } = useAuth();
  const { pagination, setPagination, sorter } = useMyTable();
  const { data, isFetching } = useQuery(
    ["attending-courses", pagination, sorter.sort],
    async () => {
      const sort = sorter.sort;
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "asc";

      const res = await get(
        `/api/attending-course?page=${pagination.pageIndex + 1}&per_page=${
          pagination.pageSize
        }&sort=${sortKey}&order=${orderDir}`
      );

      return {
        sorter: sorter.setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<AttendingRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = attendingColumns();

  return (
    <Stack spacing={3} direction={{ xs: "column", lg: "row" }}>
      <CommonProfile
        name={authData?.name}
        image={authData?.image}
        plan={authData?.created_at}
        registered_date={authData?.created_at}
      />
      <Stack spacing={3} flex={1}>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Typography variant="sectiontitle2">アカウント情報</Typography>
          <Stack spacing={2} pt={5}>
            <Labeler label="氏名">
              <Typography>{authData?.name}</Typography>
            </Labeler>
            <Labeler label="性別">
              <Typography>{authData?.sex === 1 ? "男性" : "女性"}</Typography>
            </Labeler>
            <Labeler label="生年月日">
              <Typography>{jpDate(authData?.birthday)}</Typography>
            </Labeler>
            <Labeler label="メールアドレス">
              <Typography>{authData?.email}</Typography>
            </Labeler>
          </Stack>
        </Paper>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Typography variant="sectiontitle2">受講履歴</Typography>
          <Stack pt={5}>
            <MyTable columns={columns} loading={isFetching} state={data} />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default StudentProfile;
