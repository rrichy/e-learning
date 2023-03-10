import NoticeItem from "@/components/organisms/NoticeItem";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OrderType,
  PaginationFilterInterface,
} from "@/interfaces/CommonInterface";
import { indexNotice } from "@/services/NoticeService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { NoticeItemAttribute } from "@/validations/NoticeFormValidation";
import { NavigateNext } from "@mui/icons-material";
import {
  Grid,
  Link,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

function Notice() {
  const mounted = useRef(true);
  const { errorSnackbar } = useAlerter();
  const [showPagination, setShowPagination] = useState(false);
  const [notices, setNotices] = useState(
    initPaginatedData<NoticeItemAttribute>()
  );
  const [pagination, setPagination] = useState(1);

  const { data } = useQuery(
    ["notices", pagination],
    async () => {
      const res = await indexNotice(pagination, 10, "created_at", "desc");
      const { data, meta } = res.data;

      return { data, meta } as {
        data: NoticeItemAttribute[];
        meta: PaginationFilterInterface;
      };
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof NoticeItemAttribute = "id",
      order: OrderType = "desc"
    ) => {
      try {
        setNotices((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await indexNotice(page, 10, "created_at", "desc");
        const { data, meta } = res.data;
        if (mounted.current) {
          setNotices((s) => ({
            ...s,
            loading: false,
            data,
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setNotices((s) => ({ ...s, loading: false }));
      }
    },
    [errorSnackbar]
  );

  const handleTogglePagination = () => {
    const newState = !showPagination;

    if (!newState && notices.page !== 1) {
      fetchData(1);
    }

    setShowPagination(newState);
  };

  return (
    <Paper variant="outlined" sx={{ mb: 8 }}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Stack
            direction={{ xs: "row", md: "column" }}
            justifyContent="space-between"
          >
            <Typography
              id="notice"
              variant="sectiontitle2"
              fontWeight="bold"
              gutterBottom
            >
              ????????????
            </Typography>
            <Link
              component="button"
              underline="hover"
              color="common.black"
              display="flex"
              alignItems="center"
              fontWeight={{ xs: "bold", md: "unset" }}
              onClick={handleTogglePagination}
            >
              {showPagination ? "???????????????" : "???????????????"}
              <NavigateNext color="primary" />
            </Link>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{ "div:not(:nth-last-of-type(1))": { mb: 1 } }}
        >
          {(data?.data?.length ?? 0) > 0
            ? data?.data
                .slice(0, showPagination ? 10 : 5)
                .map((d) => <NoticeItem key={d.id} {...d} />)
            : "No notices"}
          {showPagination && (
            <Pagination
              page={data?.meta?.current_page}
              count={data?.meta?.last_page}
              onChange={(_e, page) => setPagination(page)}
              size="small"
              sx={{
                mt: 2,
                "& .MuiPagination-ul": { justifyContent: "center" },
              }}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Notice;
