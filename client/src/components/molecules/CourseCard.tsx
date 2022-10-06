import { AttendingCourseStatus } from "@/enums/attendingCourseStatus";
import dateDifference from "@/utils/dateDifference";
import { AttendingCourseAttribute } from "@/validations/CourseFormValidation";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  image: string;
  attendingCourse?: AttendingCourseAttribute | null;
}

const { attending, completed } = AttendingCourseStatus;

function CourseCard({ id, title, image, attendingCourse }: CourseCardProps) {
  const { progress_rate, status, start_date, completion_date } =
    attendingCourse || {
      progress_rate: 0,
      status: attending,
      start_date: null,
      completion_date: null,
    };

  const parsedDate = !start_date
    ? "NaN"
    : "" + Math.ceil(
        dateDifference(
          start_date,
          status === completed ? completion_date! : new Date()
        )
      );

  return (
    <Grid item xs={6} md={4}>
      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
        <CardActionArea
          sx={{
            textDecoration: "none !important",
            position: "relative",
          }}
          component={RouterLink}
          to={`/course/${id}`}
        >
          <CardMedia
            component="img"
            src={image}
            sx={{ aspectRatio: "1 / .45", borderRadius: 1, objectFit: "cover" }}
          />
          <CardContent sx={{ p: 0, pt: 1 }}>
            <Typography gutterBottom fontWeight="bold" component="h5">
              {title}
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1, md: 2 }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              sx={{ strong: { fontSize: 18 } }}
            >
              <Typography variant="body2" color="text.secondary">
                受講開始から{parsedDate.padStart(3, "0")}日経過
              </Typography>
              <Typography
                variant="body2"
                color="common.white"
                bgcolor="common.black"
                p="4px 8px"
                borderRadius={1}
                whiteSpace="nowrap"
              >
                進捗率：
                <strong>{progress_rate}</strong>%
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default CourseCard;
