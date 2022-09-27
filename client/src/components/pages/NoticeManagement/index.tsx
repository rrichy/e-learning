import {
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import MaterialTable from "material-table";
import Link from "@/components/atoms/Link";
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

function NoticeManagement() {
  const [data, setData] = useState([
    { 
      author: "Trevion Shields", 
      subject_name: "Enrise Global",
      publication_period: "2022-09-18 ~ 2022-09-19",
    },
  ]);
  
  return (
    <Stack spacing={3}>
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">所属の管理</Typography>
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "fit-content", borderRadius: 6 }}
              // onClick={() => handleDelete("affiliation")}
              // disabled={affiliationSelected.length === 0}
            >
              削除
            </Button>
            <Button
              variant="contained"
              sx={{ width: "fit-content", borderRadius: 6 }}
              to="create"
              // onClick={() => setAffiliationDialog("add")}
            >
              追加
            </Button>
          </Stack>
          <MaterialTable 
            columns={[
              { 
                field: "author", 
                title: "Author",
                render: (row) => (
                  <Link to={`/notice-management/1/edit`}>
                    {row.author}
                  </Link>
                ) 
              },
              { field: "subject_name", title: "Subject Name" },
              { field: "publication_period", title: "Publication Period" },
              { 
                field: "posting_method", 
                title: "Posting Method",
                render: () => (
                  <>
                    <Link to={`/notice-management/1/edit`}>
                      <MarkunreadOutlinedIcon />
                    </Link>
                    <Link to={`/notice-management/1/edit`}>
                      <ArticleOutlinedIcon />
                    </Link>
                  </>
                ) 
              },
            ]}
            options={{
              toolbar: false,
              draggable: false,
              paging: false,
              maxBodyHeight: 600,
              selection: true,
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

export default NoticeManagement;
