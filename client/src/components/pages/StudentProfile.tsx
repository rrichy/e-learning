import { Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Labeler from "../molecules/Labeler";
import CommonProfile from "../organisms/Student/CommonProfile";
import useAuth from "@/hooks/useAuth";
import { jpDate } from "@/utils/jpFormatter";
import Table from "@/components/atoms/Table";
import {
  initPaginationFilter,
  initReactQueryPagination,
  OrderType,
  PaginationFilterInterface,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";
import { AttendingCourseAttributes } from "@/interfaces/AuthAttributes";
import attendingCourseColumns from "@/columns/attendingCourseColumns";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";

const init = initReactQueryPagination<AttendingCourseAttributes>();

const tableResult = (
  filters: PaginationFilterInterface & { [k: string]: any }
) =>
  useQuery(
    ["attending_courses", filters],
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

      const res = await get("/api/attending-course?" + params);
      return res.data as ReactQueryPaginationInterface<AttendingCourseAttributes>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

function StudentProfile() {
  const { authData } = useAuth();
  const [pagination, setPagination] = useState(initPaginationFilter);
  const [filters, setFilters] = useState<{ [k: string]: any }>({});
  const { data, isFetching } = tableResult({
    ...pagination,
    ...filters,
  });
  const updateFilter = (
    page: number = 1,
    pageSize: number = TABLE_ROWS_PER_PAGE[0],
    sort: keyof AttendingCourseAttributes = "id",
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
  
  return (
    <Stack spacing={3} direction={{ xs: "column", lg: "row"}}>
      <CommonProfile 
        name={authData?.name}
        image={authData?.image}
        plan={authData?.created_at}
        registered_date={authData?.created_at}
      />
      
      <Stack spacing={3}>
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
            <Table
              columns={attendingCourseColumns()}
              state={data || init}
              fetchData={updateFilter}
              isLoading={isFetching}
            />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default StudentProfile;