import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Button from "../atoms/Button";
import Labeler from "../molecules/Labeler";
import MaterialTable from "material-table";

function StudentProfile() {
  const [data, setData] = useState([
    {
      name: "CCNAコース【前編】",
      start_date: "2022-09-20",
      completion_date:"2022-09-20",
      progress_rate: 100,
      latest_score: "ー", 
    },
    { 
      name: "CCNAコース【後編】",
      start_date: "2022-09-20",
      completion_date:"2022-09-20",
      progress_rate: 100,
      latest_score: "ー", 
    },
    { 
      name: "AWSプラクティショナーコース【前編】",
      start_date: "2022-09-20",
      completion_date:"2022-09-20",
      progress_rate: 100,
      latest_score: "ー", 
    },
  ]);
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper variant="softoutline" sx={{ p: 5 }}>
          <Stack spacing={1} pb={2}>
            <Avatar
              src="https://picsum.photos/id/639/200/300"
              alt="sample photo"
              sx={{ m: "auto", height: 125, width: 125 }}
            />
            <Typography variant="h6" align="center" fontWeight={700}>山田 一郎</Typography> 
            <Typography align="center">2021/04/01に登録</Typography> 
          </Stack>
          <Box p={3} sx={{ background: "#e5f7f6" }}>
            <Typography variant="subtitle2" align="center">現在のご利用プラン</Typography> 
            <Typography variant="h6" align="center" fontWeight={700} color="#00c2b2">1ヶ月プラン</Typography> 
          </Box>
          <Stack spacing={2} pt={3}>
            <Button
              variant="contained"
              type="button"
              rounded
            >
              アカウント編集
            </Button>
            <Button
              variant="contained"
              type="button"
              rounded
            >
              プラン変更
            </Button>
            <Button
              variant="contained"
              type="button"
              rounded
            >
              オプション申込み
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={9}>
        <Stack spacing={3}>
          <Paper variant="softoutline" sx={{ p: 7 }}>
            <Typography variant="sectiontitle2">アカウント情報</Typography>
            <Stack spacing={2} pt={5}>
              <Labeler label="氏名">
                <Typography>山田 一郎</Typography>
              </Labeler>
              <Labeler label="性別">
                <Typography>男性</Typography>
              </Labeler>
              <Labeler label="生年月日">
                <Typography>1999年04月01日</Typography>
              </Labeler>
              <Labeler label="メールアドレス">
                <Typography>ichiro.yamada@sample.com</Typography>
              </Labeler>
            </Stack>
          </Paper>
          <Paper variant="softoutline" sx={{ p: 7 }}>
            <Typography variant="sectiontitle2">受講履歴</Typography>
            <Stack pt={5}>
              <MaterialTable 
                columns={[
                  { field: "name", title: "コース名" },
                  { field: "start_date", title: "受講開始日" },
                  { field: "completion_date", title: "完了日" },
                  { field: "progress_rate", title: "進捗率" },
                  { field: "latest_score", title: "最新得点" },
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
      </Grid>
    </Grid>
  );
}

export default StudentProfile;