import CourseChapterList from "@/components/organisms/Student/CourseFragments/CourseChapterList";
import CourseDetail from "@/components/organisms/Student/CourseFragments/CourseDetail";
import CourseTimeSpent from "@/components/organisms/Student/CourseFragments/CourseTimeSpent";
import { CourseScreenType } from "@/interfaces/CommonInterface";
import { CourseFormAttribute } from "@/validations/CourseFormValidation";
import { Grid, Paper, Typography } from "@mui/material";

interface CourseDetailPreviewProps {
  course: CourseFormAttribute;
  screenFn?: (s: CourseScreenType) => void;
}

function CourseDetailPreview({ course, screenFn }: CourseDetailPreviewProps) {
  return (
    <>
      <CourseDetail
        image={course.image}
        title={course.title}
        content={course.content}
        studyTime={+course.study_time!}
      />
      <CourseTimeSpent attendingCourse={null} />
      <CourseChapterList
        screenFn={screenFn}
        chapters={course.chapters.map((c, i) => ({
          ...c,
          item_number: i + 1,
        }))}
      />
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            理解度確認テスト
          </Typography>
        </Paper>
      </Grid>
    </>
  );
}

export default CourseDetailPreview;
