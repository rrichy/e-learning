import Button from "@/components/atoms/Button";
import CommonHeader from "@/components/organisms/Student/CommonHeader";
import useAlerter from "@/hooks/useAlerter";
import { proceedTest, showTest } from "@/services/TestService";
import { TestAttributes, testInit } from "@/validations/CourseFormValidation";
import { ArrowForward } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { Box, Grid, List, ListItem, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StudentTest() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { errorSnackbar } = useAlerter();
  const { courseId, chapterId, testType } = useParams();
  const [test, setTest] = useState<TestAttributes>(testInit);
  console.log({ courseId, chapterId, testType });

  const handleProceed = async () => {
    try {
      const res = await proceedTest(
        +chapterId!,
        testType === "chapter-test" ? 1 : 2
      );
    } catch (e: any) {
      errorSnackbar(e.message);
    }
  };

  useEffect(() => {
    mounted.current = true;

    if (chapterId) {
      (async () => {
        try {
          const res = await showTest(
            +chapterId!,
            testType === "chapter-test" ? 1 : 2
          );
          if (mounted.current) {
            console.log("yes mounted");
            setTest(res.data.data);
          } else console.log("not mounted");
        } catch (e: any) {
          errorSnackbar(e.message);
        }
      })();
    }

    return () => {
      mounted.current = false;
    };
  }, [chapterId, testType]);

  return (
    <Grid container spacing={2}>
      <CommonHeader
        image={test.image || null}
        title={test.chapter_title || ""}
      />
      <Grid item xs={12} md={8}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            このテストについて
          </Typography>
          <Typography m={2}>{test.overview}</Typography>
          <List
            disablePadding
            dense
            sx={{
              m: 2,
              "& .MuiListItem-root": {
                py: 0,
                "&:before": {
                  content: "'•'",
                  pr: 1,
                },
              },
            }}
          >
            <ListItem>問題はすべて、選択形式です。</ListItem>
            <ListItem>テストは、一時中断はできません。</ListItem>
            <ListItem>
              テストの開始時／終了時には、インターネットに接続してる必要があります。
            </ListItem>
            <ListItem>
              途中でブラウザを閉じると、試験を棄権したことになり、成績は保存されません。
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} container spacing={2}>
        <Grid item xs={6} md={12}>
          <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
            <Typography variant="sectiontitle1" component="h3">
              合格ライン
            </Typography>
            <Stack direction="row" alignItems="flex-end" m={2}>
              <Typography fontSize={20} fontWeight="bold">
                {test.passing_score}点以上
              </Typography>
              <Typography>（{test.questions_sum_score}点満点）</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={12}>
          <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
            <Typography variant="sectiontitle1" component="h3">
              問題数
            </Typography>
            <Typography fontSize={20} fontWeight="bold" m={2}>
              {test.questions_count}問
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack alignItems="center">
          <Button
            large
            variant="contained"
            color="tertiary"
            endIcon={<ArrowForward />}
            onClick={handleProceed}
          >
            テストを開始する
          </Button>
          <Button
            variant="outlined"
            endIcon={<Close />}
            sx={{
              width: 150,
              mt: 2,
              boxShadow: (t) => `0 3px ${t.palette.primary.main}`,
            }}
            to={`/course/${courseId}`}
          >
            閉じる
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default StudentTest;
