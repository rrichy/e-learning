import { Grid, Paper, Stack, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import CommonHeader from "../CommonHeader";

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
      <CommonHeader image={image} title={title} preview={preview} />
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
