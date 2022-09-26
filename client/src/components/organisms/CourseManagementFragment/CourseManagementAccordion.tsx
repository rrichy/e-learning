import {
  CourseFormAttributeWithId,
  CourseListAttribute,
} from "@/validations/CourseFormValidation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MaterialTable from "material-table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@/components/atoms/Button";
import { jpDate } from "@/mixins/jpFormatter";
import Link from "@/components/atoms/Link";

interface CourseManagementAccordionProps {
  status: "public" | "private";
  selected: Map<number, CourseFormAttributeWithId[]>;
  onSelect: (
    s: "public" | "private",
    cat_id: number,
    r: CourseFormAttributeWithId[]
  ) => void;
  onToggle: (s: "public" | "private") => void;
  categories: CourseListAttribute[];
}

function CourseManagementAccordion({
  status,
  selected,
  onSelect,
  onToggle,
  categories,
}: CourseManagementAccordionProps) {
  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">
          {status === "public" ? "公開中のコース状況" : "非公開中のコース状況"}
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          rounded
          sx={{ maxWidth: 150 }}
          onClick={() => onToggle(status)}
        >
          {status === "public" ? "一括非公開" : "一括公開"}
        </Button>
        <Box>
          {categories.map((category) => (
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
                <MaterialTable
                  columns={[
                    {
                      field: "title",
                      title: "コース名",
                      render: (row) => (
                        // <Link to={`/course-management/${row.id}/edit`}>
                        //   {row.title}
                        // </Link>
                        <Link to={`/course-management/details/${row.id}`}>
                          {row.title}
                        </Link>
                      ),
                    },
                    // {field: "user_count", title: "コース名"},
                    // {field: "active_count", title: "コース名"},
                    // {field: "completed_count", title: "コース名"},
                    {
                      field: "start_period",
                      title: "開始日",
                      render: (row) =>
                        jpDate(row.start_period || category.start_period),
                    },
                    {
                      field: "end_period",
                      title: "終了日",
                      render: (row) =>
                        jpDate(row.end_period || category.end_period),
                    },
                  ]}
                  options={{
                    toolbar: false,
                    draggable: false,
                    paging: false,
                    maxBodyHeight: 600,
                    selection: true,
                    selectionProps: (row: CourseFormAttributeWithId) => ({
                      checked: (selected.get(category.id) || []).includes(row),
                    }),
                  }}
                  onSelectionChange={(rows) =>
                    onSelect(status, category.id, rows)
                  }
                  components={{
                    Container: (props) => <Paper {...props} variant="table" />,
                  }}
                  data={category.courses}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}

export default CourseManagementAccordion;
