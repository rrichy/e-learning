import Courses from "@/components/organisms/Student/HomepageFragments/Courses";
import Notice from "@/components/organisms/Student/HomepageFragments/Notice";
import {
  Stack,
} from "@mui/material";

function StudentHomepage() {
  return (
    <Stack justifyContent="space-between">
      <Notice />
      <Courses />
    </Stack>
  );
}

export default StudentHomepage;
