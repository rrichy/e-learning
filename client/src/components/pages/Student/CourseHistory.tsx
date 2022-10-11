import { List, ListItem, Paper, Stack, Typography } from "@mui/material";
import Button from "@/components/atoms/Button";
import MaterialTable from "material-table";
import Link from "@/components/atoms/Link";
import { useState } from "react";

function CourseHistory() {
  const [data, setData] = useState([
    { 
      course_name: "Sample Course", 
      start_date: "2022-09-20",
      course_start_date: "2022-09-20",
      progress_rate: 20,
      latest_score: 8,
      lecture_day: "2022-09-18",
      closed_date: "2022-09-18"
    },
    { 
      course_name: "Sample Course 2", 
      start_date: "2022-09-20",
      course_start_date: "2022-09-20",
      progress_rate: 20,
      latest_score: 8,
      lecture_day: "2022-09-18",
      closed_date: "2022-09-18"
    },
    { 
      course_name: "Sample Course 3", 
      start_date: "2022-09-20",
      course_start_date: "2022-09-20",
      progress_rate: 20,
      latest_score: 8,
      lecture_day: "2022-09-18",
      closed_date: "2022-09-18"
    },
  ]);
  
  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">
            Course History
          </Typography>
        </Stack>
        <Stack pt={5}>
          <MaterialTable 
            columns={[
              { field: "course_name", title: "コース名" },
              { field: "start_date", title: "開講日" },
              { field: "course_start_date", title: "受講開始日" },
              { field: "progress_rate", title: "進捗率" },
              { field: "latest_score", title: "最新得点" },
              { field: "lecture_day", title: "受講完了日" },
              { field: "closed_date", title: "閉講日" },
            ]}
            options={{
              toolbar: false,
              draggable: false,
              paging: false,
              maxBodyHeight: 600,
            }}
            components={{
              Container: (props) => <Paper {...props} variant="table" />,
            }}
            data={data}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default CourseHistory;