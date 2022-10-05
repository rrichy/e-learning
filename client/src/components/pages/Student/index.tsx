import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@/components/atoms/Button";
import {
  AccessTime,
  ArrowForward,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import CourseDetail from "@/components/organisms/CourseFragments/CourseDetail";
import CourseTimeSpent from "@/components/organisms/CourseFragments/CourseTimeSpent";
import CourseChapterList from "@/components/organisms/CourseFragments/CourseChapterList";
import { useState } from "react";
import {
  CourseFormAttributeWithId,
  courseFormInit,
} from "@/validations/CourseFormValidation";

function Course() {
  const [course, setCourse] = useState<CourseFormAttributeWithId>({
    ...courseFormInit,
    id: 0,
    study_time: "0",
  });

  return (
    <Grid container spacing={2}>
      <CourseDetail
        title={course.title}
        content={course.content}
        studyTime={+course.study_time!}
      />
      <CourseTimeSpent />
      <CourseChapterList />
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            理解度確認テスト
          </Typography>
        </Paper>
      </Grid>
    </Grid>
    // <Stack justifyContent="space-between">
    //   <Paper variant="outlined">
    //     <Stack spacing={3}>
    //       <Typography variant="sectiontitle2">
    //         ネットワーク
    //       </Typography>
    //     </Stack>
    //     <Stack alignItems="center" p={3}>
    //       <Typography fontWeight="bold">退会される前に必ずご確認ください</Typography>
    //     </Stack>
    //     <Stack p={5}>
    //       <List>
    //         <ListItem>
    //           <Typography>・you can recover your account within 30 days after withdrawal</Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography>・your account will be permanently deleted after 30 days you unsubscribe</Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</Typography>
    //         </ListItem>
    //       </List>
    //     </Stack>
    //     <Stack alignItems="center" spacing={2} p={3} direction="row" justifyContent="center">
    //       <Button
    //         color="secondary"
    //         variant="contained"
    //         rounded
    //         large
    //         type="button"
    //         to="reason"
    //       >
    //         退会手続きへ進む
    //       </Button>
    //       <Button
    //         color="dull"
    //         variant="outlined"
    //         rounded
    //         large
    //         type="button"
    //         to="/"
    //       >
    //         Techhubトップへ
    //       </Button>
    //     </Stack>
    //   </Paper>
    // </Stack>
  );
}

export default Course;
