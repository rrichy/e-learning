import Button from "@/components/atoms/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { TableStateProps } from "@/interfaces/CommonInterface";
import { indexCourse, toggleCourses } from "@/services/CourseService";
import { CourseListAttribute } from "@/validations/CourseFormValidation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CourseTable from "@/components/organisms/CourseManagementFragments/CourseTable";
import Loading from "@/components/molecules/Loading";
import { CourseRowAttribute } from "@/columns/rowTypes";

function PublicCourses() {
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(new Set<number>());
  const { categories, fetchingData } = getCourses({});

  const toggleMutation = useMutation(
    (ids: number[]) => toggleCourses("private", ids),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        queryClient.invalidateQueries(["public-courses-table", {}]);
        queryClient.invalidateQueries(["private-courses-table", {}]);
        setSelected(new Set());
      },
      onError: (e: any) => {
        errorSnackbar(e.message);
      },
    }
  );

  const handleSelect = ({
    checked,
    unchecked,
  }: {
    checked: number[];
    unchecked: number[];
  }) => {
    const temp = new Set(selected);

    checked.forEach((id) => temp.add(id));
    unchecked.forEach((id) => temp.delete(id));

    setSelected(temp);
  };

  const handleToggleStatus = async () => {
    const confirmed = await isConfirmed({
      title: "confirmation",
      content: "make all selected courses private?",
    });

    if (confirmed) toggleMutation.mutate([...selected]);
  };

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">公開中のコース状況</Typography>
        <Button
          color="secondary"
          variant="contained"
          rounded
          sx={{ maxWidth: 150 }}
          disabled={selected.size === 0}
          onClick={handleToggleStatus}
        >
          一括非公開
        </Button>
        {fetchingData || toggleMutation.isLoading ? (
          <Loading loading />
        ) : (
          <Box>
            {categories?.data.map((category) => (
              <Accordion
                variant="outlined"
                disableGutters
                sx={{ p: "0 !important" }}
                key={category.id}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography fontWeight="bold" variant="inherit">
                    {category.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CourseTable data={category.courses} setIds={handleSelect} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export default PublicCourses;

const getCourses = (filters: { [k: string]: any }) => {
  const { data, isFetching } = useQuery(
    ["public-courses-table", filters],
    async () => {
      const res = await indexCourse("public");

      return {
        data: res.data.data,
        meta: res.data.meta,
      } as TableStateProps<
        Omit<CourseListAttribute, "courses"> & { courses: CourseRowAttribute[] }
      >;
    },
    {
      staleTime: 5_000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return { categories: data, fetchingData: isFetching };
};
