import {
  Box,
  Grid,
  Link,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Column } from "material-table";
import Button from "@/components/atoms/Button";
import { showAttendees, showCourse } from "@/services/CourseService";
import { CourseFormAttributeWithId } from "@/validations/CourseFormValidation";
import {
  initPaginationFilter,
  initReactQueryPagination,
  OrderType,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { jpDate } from "@/mixins/jpFormatter";
import { useQuery } from "@tanstack/react-query";
import { breakpoint_values } from "@/providers/ThemeProvider";
import IconButton from "@/components/atoms/IconButton";
import Table from "@/components/atoms/Table";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";

interface Attendee {
  name: string;
  email: string;
  start_date: string;
  progress_rate: number;
  highest_score: number | null;
  latest_score: number | null;
  completion_date: string | null;
}

const init = initReactQueryPagination<Attendee>();

function CourseDetail() {
  const { courseId } = useParams();
  const [filters, setFilters] = useState(initPaginationFilter);
  const { isFetching: courseIsFetching, data: courseDetails } = useQuery(
    ["course-detail", courseId],
    async () => {
      const res = await showCourse(+courseId!, true);
      return res.data.data as CourseFormAttributeWithId;
    },
    {
      staleTime: 3_000,
      refetchOnWindowFocus: false,
      enabled: !!courseId,
    }
  );
  const { data, isFetching } = useQuery(
    ["attendees", courseId, filters],
    async () => {
      const res = await showAttendees(+courseId!, filters);
      return res.data as ReactQueryPaginationInterface<Attendee>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: !!courseId,
    }
  );

  const updateFilter = (
    page: number = 1,
    pageSize: number = TABLE_ROWS_PER_PAGE[0],
    sort: "id",
    order: OrderType = "desc"
  ) => {
    console.log({ page, pageSize, sort, order });
    setFilters({
      ...filters,
      current_page: page,
      per_page: pageSize,
      sort,
      order,
    });
  };

  const columns: Column<Attendee>[] = [
    { field: "name", title: "氏名" },
    { field: "email", title: "メールアドレス" },
    {
      field: "start_date",
      title: "受講開始日",
      render: (row) => jpDate(row.start_date),
    },
    { field: "progress_rate", title: "進捗率" },
    { field: "highest_score", title: "最高点" },
    { field: "latest_score", title: "最新点" },
    {
      field: "completion_date",
      title: "受講完了日",
      render: (row) =>
        row.completion_date ? jpDate(row.completion_date) : "-",
    },
  ];

  const isMd = useMediaQuery(`(min-width:${breakpoint_values.md}px)`);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center">
          {courseIsFetching ? (
            <Box flex={1}>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={16} />
            </Box>
          ) : (
            <Box flex={1}>
              <Typography fontWeight="bold" variant="h5">
                {courseDetails?.title}
              </Typography>
              <Link
                component="button"
                onClick={() => console.log("open preview")}
              >
                {`${import.meta.env.VITE_HOST}:${
                  import.meta.env.VITE_PORT
                }/course/screen/${courseId} (Course Preview)`}
              </Link>
            </Box>
          )}
          {isMd ? (
            <>
              <Button
                to={`/course-management/details/${courseId}/conditional-mail`}
                variant="outlined"
                color="inherit"
                fitY
                fit
                startIcon={<MailOutlinedIcon />}
                sx={{ whiteSpace: "nowrap", mr: 1 }}
              >
                条件付きメール
              </Button>
              <Button
                to={`/course-management/${courseId}/edit`}
                variant="outlined"
                color="inherit"
                fitY
                fit
                startIcon={<LibraryBooksOutlinedIcon />}
              >
                コースの更新
              </Button>
            </>
          ) : (
            <>
              <IconButton
                to={`/course-management/details/${courseId}/conditional-mail`}
              >
                <MailOutlinedIcon sx={{ color: "common.black" }} />
              </IconButton>
              <IconButton to={`/course-management/${courseId}/edit`}>
                <LibraryBooksOutlinedIcon sx={{ color: "common.black" }} />
              </IconButton>
            </>
          )}
        </Stack>
      </Grid>

      {courseIsFetching ? (
        <Grid item xs={12} container spacing={2}>
          <Detailer label="開講日 ~ 閉講日" value={<Skeleton />} />
          <Detailer label="ステータス" value={<Skeleton />} />
          <Detailer label="対象者" value={<Skeleton />} />
          <Detailer label="受講者数" value={<Skeleton />} />
          <Detailer label="受講中" value={<Skeleton />} />
          <Detailer label="受講完了" value={<Skeleton />} />
        </Grid>
      ) : (
        <Grid item xs={12} container spacing={2}>
          <Detailer
            label="開講日 ~ 閉講日"
            value={`${jpDate(
              courseDetails?.start_period ??
                courseDetails?.attendees_information?.category_start_period
            )} ~ ${jpDate(
              courseDetails?.end_period ??
                courseDetails?.attendees_information?.category_end_period
            )}`}
          />
          <Detailer
            label="ステータス"
            value={courseDetails?.attendees_information?.status_parsed}
          />
          <Detailer
            label="対象者"
            value={courseDetails?.attendees_information?.target_parsed}
          />
          <Detailer
            label="受講者数"
            value={courseDetails?.attendees_information?.attendees}
          />
          <Detailer
            label="受講中"
            value={courseDetails?.attendees_information?.current_attendees}
          />
          <Detailer
            label="受講完了"
            value={
              (courseDetails?.attendees_information?.attendees || 0) -
              (courseDetails?.attendees_information?.current_attendees || 0)
            }
          />
        </Grid>
      )}

      {/* <Grid item xs={12}>
        <FormContainer>
          <AccountManagementSearch categories={categories} />
        </FormContainer>
      </Grid> */}

      <Grid item xs={12}>
        <Table
          columns={columns}
          state={data || init}
          fetchData={updateFilter}
          isLoading={isFetching}
        />
      </Grid>
    </Grid>
  );
}

export default CourseDetail;

const Detailer = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <>
    <Grid item xs={6} md={2}>
      <Typography variant="body2" fontWeight="bold" textAlign="right">
        {label}:
      </Typography>
    </Grid>
    <Grid item xs={6} md={4} textAlign="center">
      {value}
    </Grid>
  </>
);
