import CourseCard from "@/components/molecules/CourseCard";
import { indexCourse } from "@/services/CourseService";
import { CourseListAttribute } from "@/validations/CourseFormValidation";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

function Courses() {
  const { data } = useQuery(
    ["courses"],
    async () => {
      const res = await indexCourse("public");
      const data = res.data.data;

      return data as CourseListAttribute[];
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Grid container spacing={6}>
      {data?.map(({ name, courses, id }) => (
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
