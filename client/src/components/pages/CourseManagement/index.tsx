import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import CourseList from "./CourseList";
import { useState } from "react";
import PublicCourses from "./PublicCourses";
import PrivateCourses from "./PrivateCourses";
import CourseManagementSearchAccordion from "@/components/organisms/CourseManagementFragments/CourseManagementSearchAccordion";

function CourseManagement() {
  const [openTable, setOpenTable] = useState(false);

  return (
    <Stack
      spacing={3}
      sx={{
        p: 3,
        "& tbody tr:nth-last-of-type(1) td": {
          borderBottom: "none !important",
        },
      }}
    >
      <FormContainer>
        {/* TODO: Course management search */}
        <CourseManagementSearchAccordion categories={[]} />
      </FormContainer>
      <Stack
        spacing={2}
        justifyContent="center"
        direction="row"
        sx={{ "& .MuiButton-root": { maxWidth: 200 } }}
      >
        <Button to="create" variant="contained" rounded>
          新規作成
        </Button>
        <Button variant="contained" rounded onClick={() => setOpenTable(true)}>
          コース整理
        </Button>
      </Stack>
      <PublicCourses />
      <PrivateCourses />
      <CourseList open={openTable} onClose={() => setOpenTable(false)} />
    </Stack>
  );
}

export default CourseManagement;
