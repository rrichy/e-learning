import { Grid, Paper, Typography } from "@mui/material";
import CourseDetail from "@/components/organisms/Student/CourseFragments/CourseDetail";
import CourseTimeSpent from "@/components/organisms/Student/CourseFragments/CourseTimeSpent";
import CourseChapterList from "@/components/organisms/Student/CourseFragments/CourseChapterList";
import { useEffect, useRef, useState } from "react";
import {
  CourseFormAttributeWithId,
  courseFormInit,
} from "@/validations/CourseFormValidation";
import useAlerter from "@/hooks/useAlerter";
import { showCourse } from "@/services/CourseService";
import { useParams } from "react-router-dom";

function StudentCourseDetail() {
  const mounted = useRef(true);
  const { courseId } = useParams();
  const { errorSnackbar } = useAlerter();
  const [course, setCourse] = useState<CourseFormAttributeWithId>({
    ...courseFormInit,
    id: 0,
    study_time: "0",
    chapters: [],
  });

  useEffect(() => {
    mounted.current = true;

    if (courseId) {
      (async () => {
        try {
          const res = await showCourse(+courseId);
          setCourse(res.data.data);
        } catch (e: any) {
          errorSnackbar(e.message);
        }
      })();
    }

    return () => {
      mounted.current = false;
    };
  }, [courseId, errorSnackbar]);

  return (
    <Grid container spacing={2}>
      <CourseDetail
        image={course.image}
        title={course.title}
        content={course.content}
        studyTime={+course.study_time!}
      />
      <CourseTimeSpent attendingCourse={course.attending_course} />
      <CourseChapterList chapters={course.chapters} />
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
