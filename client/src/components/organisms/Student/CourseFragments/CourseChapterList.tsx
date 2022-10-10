import {
  Box,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@/components/atoms/Button";
import {
  ArrowForward,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { ChapterAttributes } from "@/validations/CourseFormValidation";

interface CourseChapterListProps {
  chapters: (ChapterAttributes & {
    item_number: number;
    has_passed?: boolean;
    latest_score?: number | null;
  })[];
}

function CourseChapterList({ chapters }: CourseChapterListProps) {
  return (
    <Grid item xs={12}>
      <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
        <Typography variant="sectiontitle1" component="h3">
          学習する
        </Typography>
        <Stack spacing={2} p={4}>
          <List
            disablePadding
            dense
            subheader={
              <Typography component="h4" fontWeight="bold" fontSize={20}>
                学習の流れ
              </Typography>
            }
            sx={{
              "& .MuiListItem-root": {
                py: 0,
                "&:before": {
                  content: "'•'",
                  pr: 1,
                },
              },
            }}
          >
            <ListItem>各章とも、まず解説から視聴しましょう。</ListItem>
            <ListItem>
              内容をしっかり理解できた後、章末テストに挑戦しましょう。
            </ListItem>
            <ListItem>
              章末テストで合格点が取れたら、次の章へ進みましょう。
            </ListItem>
          </List>

          <Box
            sx={{
              "& > div:nth-of-type(1)": {
                borderTop: "1px solid gray",
              },
              "& > div:not(:nth-of-type(2n))": {
                bgcolor: "#0000000f",
              },
            }}
          >
            {chapters.map(
              ({ id, item_number, title, latest_score, has_passed }) => (
                <Chapter
                  key={id}
                  id={id!}
                  chapterNumber={item_number}
                  title={title}
                  score={latest_score!}
                  passed={has_passed!}
                />
              )
            )}
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}

export default CourseChapterList;

const Chapter = ({
  id,
  chapterNumber,
  title,
  score,
  passed,
}: {
  id: number;
  chapterNumber: number;
  title: string;
  score: number | null;
  passed: boolean;
}) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    alignItems="center"
    borderBottom="1px solid gray"
    p={1}
  >
    <Typography
      whiteSpace="nowrap"
      variant="sectiontitle3"
      borderRadius={20}
      width={60}
      height={60}
    >
      {chapterNumber}章
    </Typography>
    <Typography fontWeight="bold" flex={1}>
      {title}
    </Typography>
    <Stack
      direction="row"
      gap={1}
      // rowGap={1}
      alignItems="center"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Button
        variant="contained"
        sx={{ width: "fit-content", whiteSpace: "nowrap" }}
        // startIcon={<CheckBox />}
        startIcon={<CheckBoxOutlineBlank />}
        endIcon={<ArrowForward />}
        to={`chapter/${id}/lecture`}
      >
        解説動画
      </Button>
      <Button
        variant="contained"
        color="tertiary"
        sx={{ width: "fit-content", whiteSpace: "nowrap" }}
        startIcon={passed ? <CheckBox /> : <CheckBoxOutlineBlank />}
        endIcon={<ArrowForward />}
        to={`chapter/${id}/chapter-test`}
      >
        章末テスト
      </Button>
      <Typography
        whiteSpace="nowrap"
        width={36}
        height={36}
        border="2px solid #f59700"
        textAlign="center"
        lineHeight={2.1}
        sx={{
          position: "relative",
          mr: 4,
          "&:after": {
            content: "'点'",
            position: "absolute",
            left: 44,
          },
        }}
      >
        {score && score >= 0 ? score : "-"}
      </Typography>
    </Stack>
  </Stack>
);
