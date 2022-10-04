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
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Grid container mt={8}>
      {categories.map(({ name }) => (
        <Grid item xs={12}>
          <Typography variant="h2" fontSize={28} fontWeight="bold" gutterBottom>
            {name}
          </Typography>
          <Grid container spacing={2}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Courses;
