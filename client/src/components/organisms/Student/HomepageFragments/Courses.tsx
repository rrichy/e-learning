import CourseCard from "@/components/molecules/CourseCard";
import useAlerter from "@/hooks/useAlerter";
import { indexCourse } from "@/services/CourseService";
import { CourseListAttribute } from "@/validations/CourseFormValidation";
import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function Courses() {
  const mounted = useRef(true);
  const { errorSnackbar } = useAlerter();
  const [categories, setCategories] = useState<CourseListAttribute[]>([]);

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const res = await indexCourse("public");
        setCategories(res.data.data);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Grid container spacing={6}>
      {categories.map(({ name, courses, id }) => (
        <Grid item xs={12} key={id}>
          <Typography variant="h2" fontSize={28} fontWeight="bold" gutterBottom>
            {name}
          </Typography>
          <Grid container spacing={2}>
            {courses.map(({ id, title, image, attending_course }) => (
              <CourseCard
                key={id}
                id={id}
                title={title}
                image={image}
                attendingCourse={attending_course}
              />
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Courses;
