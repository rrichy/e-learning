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
import Button from "@/components/atoms/Button";
import { showCourse } from "@/services/CourseService";
import { CourseFormAttributeWithId } from "@/validations/CourseFormValidation";
import { TableStateProps } from "@/interfaces/CommonInterface";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { jpDate } from "@/utils/jpFormatter";
import { useQuery } from "@tanstack/react-query";
import { breakpoint_values } from "@/providers/ThemeProvider";
import IconButton from "@/components/atoms/IconButton";
import CourseAttendeeSearch from "@/components/organisms/CourseManagementFragments/CourseAttendeeSearch";
import { CourseAttendeeSearchAttributes } from "@/validations/SearchFormValidation";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { get } from "@/services/ApiService";
import { AttendeeRowAttribute } from "@/columns/rowTypes";
import MyTable from "@/components/atoms/MyTable";
import { useMyTable } from "@/hooks/useMyTable";
import { attendeeColumns } from "@/columns";

function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<{ [k: string]: any }>({});
  const { sorter, pagination, setPagination, resetTable } = useMyTable();
  const { fetchingCourseDetails, courseDetails } = useCourseResult(+courseId!);
  const { tableData, fetchingData } = useGetData({
    sort: sorter.sort,
    setSort: sorter.setSort,
    pagination,
    setPagination,
    courseId: +courseId!,
    filters,
  });

  const handleSearch = (raw: CourseAttendeeSearchAttributes) => {
    const temp: { [k: string]: any } = {};

    for (let [key, value] of Object.entries(raw)) {
      if (key === "never_logged_in") {
        if (value === 1) temp[key] = 1;
      } else if (value) temp[key] = value;
    }

    setFilters(temp);
    resetTable();
  };

  const columns = attendeeColumns();

  const isMd = useMediaQuery(`(min-width:${breakpoint_values.md}px)`);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center">
          {fetchingCourseDetails ? (
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

      {fetchingCourseDetails ? (
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

      <Grid item xs={12}>
        <CourseAttendeeSearch onSubmit={handleSearch} />
      </Grid>

      <Grid item xs={12}>
        <MyTable state={tableData} columns={columns} loading={fetchingData} />
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

const useGetData = ({
  sort,
  setSort,
  pagination,
  setPagination,
  filters,
  courseId,
}: {
  sort: SortingState;
  setSort: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  filters: { [k: string]: any };
  courseId?: number;
}) => {
  const { data, isFetching } = useQuery(
    ["attendees", courseId, pagination, sort, filters],
    async () => {
      const sortKey = sort[0]?.id ?? "id";
      const orderDir = sort[0] ? (sort[0].desc ? "desc" : "asc") : "desc";

      const params = Object.entries(filters)
        .reduce(
          (acc: string[], [key, value]) =>
            !value ? acc : [...acc, `${key}=${value}`],
          []
        )
        .join("&");

      const res = await get(
        `/api/course/${courseId}/attendees?page=${
          pagination.pageIndex + 1
        }&per_page=${pagination.pageSize}&sort=${sortKey}&order=${orderDir}` +
          (params ? "&" + params : "")
      );

      return {
        sorter: setSort,
        paginator: setPagination,
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<AttendeeRowAttribute>;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: !!courseId,
    }
  );

  return { tableData: data, fetchingData: isFetching };
};

const useCourseResult = (courseId: number) => {
  const { data, isFetching } = useQuery(
    ["course-details-view", courseId],
    async () => {
      const res = await showCourse(courseId, true);
      return res.data.data as CourseFormAttributeWithId;
    },
    {
      staleTime: 5_000,
      refetchOnWindowFocus: false,
      enabled: !!courseId,
    }
  );

  return { courseDetails: data, fetchingCourseDetails: isFetching };
};
