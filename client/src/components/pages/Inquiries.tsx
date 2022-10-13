import { Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import MaterialTable from "material-table";
import Link from "@/components/atoms/Link";

function Inquiries() {
  const [data, setData] = useState([
    { 
      name: "Trevion Shields", 
      email: "trevionshields@gmail.com", 
      start_date: "2022-09-20",
      progress_rate: 20,
      score: 8,
      lecture_day: "2022-09-18"
    },
  ]);
  
  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">Inquiries</Typography>
          <MaterialTable 
            columns={[
              { 
                field: "name", 
                title: "氏名",
                render: (row) => (
                  <Link to={`#`}>
                    {row.name}
                  </Link>
                ) 
              },
              { field: "email", title: "メールアドレス" },
              { field: "start_date", title: "受講開始日" },
              { field: "progress_rate", title: "進捗率" },
              { field: "score", title: "点数" },
              { field: "lecture_day", title: "受講完了日" },
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
  )
}

export default Inquiries