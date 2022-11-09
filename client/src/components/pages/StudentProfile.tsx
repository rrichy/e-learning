import { Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Labeler from "../molecules/Labeler";
import MaterialTable from "material-table";
import CommonProfile from "../organisms/Student/CommonProfile";
import useAuth from "@/hooks/useAuth";
import { jpDate } from "@/mixins/jpFormatter";
import Table from "@/components/atoms/Table";
import {
  initPaginationFilter,
  initReactQueryPagination,
  OptionAttribute,
  OrderType,
  PaginationFilterInterface,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";
import {
  useOptions,
} from "@/components/organisms/AccountManagementFragments/AccountManagementSearchAccordion";
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
  const [lookups, setLookups] = useState({
    course_lookup: {} as { [k: number]: string },
  });
  const { data: resOptions, isLoading: resIsLoading } = useOptions();
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

  useEffect(() => {
    if (!resIsLoading && resOptions) {
      setLookups({
        course_lookup: resOptions.courses.reduce(
          (acc: { [k: number]: string }, b: OptionAttribute) => ({
            ...acc,
            [b.id]: b.name,
          }),
          {}
        )
      });
    }
  }, [resOptions, resIsLoading]);

  // const [dataOldTable, setDataOldTable] = useState([
  //   {
  //     name: "CCNAコース【前編】",
  //     start_date: "2022-09-20",
  //     completion_date:"2022-09-20",
  //     progress_rate: 100,
  //     latest_score: "ー", 
  //   },
  //   { 
  //     name: "CCNAコース【後編】",
  //     start_date: "2022-09-20",
  //     completion_date:"2022-09-20",
  //     progress_rate: 100,
  //     latest_score: "ー", 
  //   },
  //   { 
  //     name: "AWSプラクティショナーコース【前編】",
  //     start_date: "2022-09-20",
  //     completion_date:"2022-09-20",
  //     progress_rate: 100,
  //     latest_score: "ー", 
  //   },
  // ]);
  
  return (
    <Grid container spacing={3}>
      <CommonProfile 
        name={authData?.name}
        image={authData?.image}
        plan={authData?.created_at}
        registered_date={authData?.created_at}
      />
      <Grid item xs={12} md={9}>
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
              {/* <MaterialTable 
                columns={[
                  { field: "name", title: "コース名" },
                  { field: "start_date", title: "受講開始日" },
                  { field: "completion_date", title: "完了日" },
                  { field: "progress_rate", title: "進捗率" },
                  { field: "latest_score", title: "最新得点" },
                ]}
                options={{
                  toolbar: false,
                  draggable: false,
                  paging: false,
                  maxBodyHeight: 600,
                }}
                components={{
                  Container: (props) => <Paper {...props} variant="table" />,
                }}
                data={dataOldTable}
              /> */}
              <Table
                columns={attendingCourseColumns(lookups)}
                state={data || init}
                fetchData={updateFilter}
                isLoading={isFetching}
              />
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default StudentProfile;