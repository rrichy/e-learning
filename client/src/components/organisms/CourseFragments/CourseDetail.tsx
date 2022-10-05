import { Avatar, Grid, Paper, Stack, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

interface CourseDetailProps {
  image: string | null;
  title: string;
  content: string;
  studyTime: number;
  preview?: boolean;
}

function CourseDetail({
  image,
  title,
  content,
  studyTime,
  preview,
}: CourseDetailProps) {
  return (
    <>
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1 }}>
          <Stack direction="row" spacing={2} p={2} alignItems="center">
            <Avatar
              src={image || undefined}
              alt="course-image"
              sx={{ width: 70, height: 70 }}
            />
            <Typography variant="h2" fontSize={24} fontWeight="bold">
              {title}対策講座
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            {title}対策講座について
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" p={4}>
            <Stack alignItems="center" whiteSpace="nowrap">
              <Typography variant="subtitle2" fontWeight="bold">
                標準学習時間
              </Typography>
              <AccessTime fontSize="large" color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                {studyTime}分
              </Typography>
            </Stack>
            <Typography whiteSpace="pre-line">{content}</Typography>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
}

export default CourseDetail;
