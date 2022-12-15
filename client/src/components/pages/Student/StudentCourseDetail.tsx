import { Grid, Paper, Typography } from "@mui/material";
import CourseDetail from "@/components/organisms/Student/CourseFragments/CourseDetail";
import CourseTimeSpent from "@/components/organisms/Student/CourseFragments/CourseTimeSpent";
import CourseChapterList from "@/components/organisms/Student/CourseFragments/CourseChapterList";
import { CourseFormAttributeWithId } from "@/validations/CourseFormValidation";
import { showCourse } from "@/services/CourseService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function StudentCourseDetail() {
  const { courseId } = useParams();

  const { data } = useQuery(
    ["student-course-detail", +courseId!],
    async () => {
      const res = await showCourse(+courseId!);
      const { id, study_time, chapters, ...data } = res.data.data;

      return {
        ...data,
        id: id ?? 0,
        study_time: study_time,
        chapters: chapters,
      } as CourseFormAttributeWithId;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!courseId,
    }
  );

  return (
    <Grid container spacing={2}>
      <CourseDetail
        image={data?.image}
        title={data?.title}
        content={data?.content}
        studyTime={+data?.study_time!}
      />
      <CourseTimeSpent attendingCourse={data?.attending_course} />
      <CourseChapterList chapters={data?.chapters} />
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            理解度確認テスト
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default StudentCourseDetail;
