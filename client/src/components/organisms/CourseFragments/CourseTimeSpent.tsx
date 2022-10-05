import { Grid, Paper, Stack, Typography } from "@mui/material";

interface CourseTimeSpentProps {}

function CourseTimeSpent({}: CourseTimeSpentProps) {
  return (
    <Grid item xs={12} md={4}>
      <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
        <Typography variant="sectiontitle1" component="h3">
          進捗状況
        </Typography>
        <Stack spacing={2} px={2} py={4}>
          <Stack
            direction="row"
            alignItems="flex-end"
            borderBottom="2px solid #F59700"
            whiteSpace="nowrap"
          >
            <Typography fontSize={16} fontWeight="bold" lineHeight={1.8}>
              受講開始から
            </Typography>
            <Typography color="tertiary.main" fontSize={20} fontWeight="bold">
              NaN日経過
            </Typography>
          </Stack>
          <Typography>
            こんなペースじゃ、いつまで経っても終わらないわ！毎日勉強して！
          </Typography>
        </Stack>
      </Paper>
    </Grid>
  );
}

export default CourseTimeSpent;
