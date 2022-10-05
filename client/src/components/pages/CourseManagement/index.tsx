import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import CourseManagementAccordion from "@/components/organisms/CourseManagementFragments/CourseManagementAccordion";
import CourseManagementSearchAccordion from "@/components/organisms/CourseManagementFragments/CourseManagementSearchAccordion";
import CourseList from "./CourseList";
import useCourse from "@/hooks/pages/useCourse";

function CourseManagement() {
  const {
    categories,
    setOpenTable,
    publicState,
    publicSelected,
    handleSelect,
    handleToggleStatus,
    privateState,
    privateSelected,
    openTable,
  } = useCourse();

  return (
    <>
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
          <CourseManagementSearchAccordion categories={categories} />
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
          <Button
            variant="contained"
            rounded
            onClick={() => setOpenTable(true)}
          >
            コース整理
          </Button>
        </Stack>

        <CourseManagementAccordion
          status="public"
          categories={publicState}
          selected={publicSelected}
          onSelect={handleSelect}
          onToggle={handleToggleStatus}
        />

        <CourseManagementAccordion
          status="private"
          categories={privateState}
          selected={privateSelected}
          onSelect={handleSelect}
          onToggle={handleToggleStatus}
        />
      </Stack>

      <CourseList open={openTable} onClose={() => setOpenTable(false)} />
    </>
  );
}

export default CourseManagement;
