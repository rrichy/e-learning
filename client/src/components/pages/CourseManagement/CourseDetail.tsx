import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import MaterialTable from "material-table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@/components/atoms/Button";
import AccountManagementSearch from "@/components/organisms/AccountManagementFragment/AccountManagementSearchAccordion";
import { FormContainer, useForm } from "react-hook-form-mui";
import {
  DatePicker,
  RadioGroup,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import {
  showCourse,
  storeCourse,
  updateCourse,
} from "@/services/CourseService";
import { getOptions } from "@/services/CommonService";
import {
  CourseFormAttribute,
  CourseFormAttributeWithId,
  courseFormInit,
  courseFormSchema,
} from "@/validations/CourseFormValidation";
import Labeler from "@/components/molecules/Labeler";
// import { RadioGroup } from "@/components/atoms/HookForms";
import CloseIcon from '@mui/icons-material/Close';
import { OptionAttribute } from "@/interfaces/CommonInterface";
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import Link from "@/components/atoms/Link";
import useAlerter from "@/hooks/useAlerter";
import { jpDate } from "@/mixins/jpFormatter";

function CourseDetail() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [courseStatusOpen, setCourseStatusOpen] = useState(false);
  const [courseDetail, setCourseDetail] = useState<CourseFormAttribute>();
  const { courseId } = useParams();
  const { state, pathname } = useLocation();
  const mounted = useRef(true);
  const { errorSnackbar } = useAlerter();
  const [initialized, setInitialized] = useState(false);
  const courseContext = useForm<CourseFormAttribute>({
    mode: "onChange",
    defaultValues: courseFormInit,
    resolver: yupResolver(courseFormSchema),
  });

  const isCreate =
    pathname
      .split("/")
      .filter((a) => a)
      .pop() === "create";

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };
  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleCourseStatusOpen = () => {
    setCourseStatusOpen(true);
  };
  const handleCourseStatusClose = () => {
    setCourseStatusOpen(false);
  };

  const [categories, setCategories] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);

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

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let shouldFetch = false;
  //       let course: CourseFormAttribute | CourseFormAttributeWithId =
  //         courseFormInit;
  //       const promise = [getOptions(["categories"])];

  //       if (!isCreate) {
  //         if (!state) {
  //           shouldFetch = true;
  //           promise.push(showCourse(+courseId!));
  //         } else course = state as CourseFormAttributeWithId;
  //       }
  //       const res = await Promise.all(promise);

  //       setCategories([
  //         { id: 0, name: "未選択", selectionType: "disabled" },
  //         ...res[0].data.categories,
  //       ]);
  //       if (!isCreate)
  //         courseContext.reset(!shouldFetch ? course : res[1].data.data);
  //     } catch (e: any) {
  //       errorSnackbar(e.message);
  //     } finally {
  //       setInitialized(true);
  //     }
  //   })();
  // }, [state, pathname, courseId, isCreate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await showCourse(+courseId!);
        const data = res.data.data;
        setCourseDetail(data);
        console.log(data);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();
  }, [data]);

  return (
    <Stack justifyContent="center">
      <Container>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Stack>
              <Typography
                fontWeight="bold"
                variant="h5"
              >
                {courseDetail?.title} 
                {/* Course Title */}
              </Typography>
              <Link to="#">127.0.0.1/course/screen/{courseId} (Course Preview)</Link>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                to={`/course-management/details/${courseId}/conditional-mail`}
                variant="outlined"
                color="inherit"
                sx={{ width: "fit-content" }}
                startIcon={<MailOutlinedIcon />}
              >
                条件付きメール
              </Button>
              <Button
                to={`/course-management/${courseId}/edit`}
                variant="outlined"
                color="inherit"
                sx={{ width: "fit-content" }}
                startIcon={<LibraryBooksOutlinedIcon />}
              >
                コースの更新
              </Button>
            </Stack>
          </Stack>
          <Grid container>
            <Grid xs={12} sm={6}>
              <Labeler label="開講日: ">
                <Typography>{courseDetail?.start_period ? jpDate(courseDetail?.start_period) : "" }</Typography>
              </Labeler>
              <Labeler label="閉講日: ">
                <Typography>{courseDetail?.end_period ? jpDate(courseDetail?.end_period) : "" }</Typography>
              </Labeler>
              <Labeler label="ステータス: ">
                <Typography>{courseDetail?.status}</Typography>
              </Labeler>
              <Labeler label="対象者: ">
                <Typography>{courseDetail?.target}</Typography>
              </Labeler>
            </Grid>
            <Grid xs={12} sm={6}>
              <Labeler label="受講者数: ">
                <Typography>{courseDetail?.study_time}</Typography>
              </Labeler>
              <Labeler label="受講中: ">
                <Typography>{courseDetail?.is_whole_period}</Typography>
              </Labeler>
              <Labeler label="受講完了: ">
                <Typography>{courseDetail?.priority}</Typography>
              </Labeler>
            </Grid>
          </Grid>
          <FormContainer>
            <AccountManagementSearch categories={categories} />
          </FormContainer>
          <Paper variant="outlined" sx={{ p: 6 }}>
            <MaterialTable 
              columns={[
                { 
                  field: "name", 
                  title: "氏名",
                  render: (row) => (
                    <Link to={`/course-management/details/detail-correction`}>
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
          </Paper>
        </Stack>
        <FormContainer>
          <Dialog open={searchOpen} maxWidth="lg">
            <DialogTitle 
              align="center" 
              fontWeight={700} 
              sx={{ 
                background: "#00c2b2", 
                color: "#ffffff" 
              }}
            >
              コースを検索
              <IconButton
                onClick={handleSearchClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 12,
                  color: "#ffffff",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Stack spacing={1} pt={3} pl={3} pr={3}>
              <Selection
                name="sex"
                label="コース情報"
              />
              <TextField
                name="name"
                placeholder="コース名"
              />
              <RadioGroup
                name="gender"
                label="終了日"
                row={false}
                options={[
                  { id: 1, name: "全期間" },
                  { id: 2, name: "Date 1 and Date 2" },
                ]}
              />
              <RadioGroup
                name="gender"
                label="絞り込み"
                row={false}
                options={[
                  { id: 1, name: "今後開催予定のコース" },
                  { id: 2, name: "現在受講可能なコース" },
                  { id: 3, name: "すべて" },
                ]}
              />
              <Selection
                name="sex"
                label="表示件数"
              />
              <Selection
                name="sex"
                label="件"
              />
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>コース名</Button>
              <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>検索</Button>
            </Stack>
          </Dialog>

          <Dialog open={courseStatusOpen} maxWidth="lg">
            <DialogTitle>
              <Typography
                fontWeight="bold"
                variant="h6"
                pl={1}
                sx={{ borderLeft: "5px solid #00c2b2" }}
              >
                公開中のコース状況
              </Typography>
              <IconButton
                onClick={handleCourseStatusClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Typography
              fontWeight="bold"
              pl={1}
              align="center"
            >
              Table Here
            </Typography>
            <Stack direction="row" spacing={2} p={3} justifyContent="flex-end">
              <Button color="warning" variant="contained" sx={{ borderRadius: 7, width: 100 }}>削除</Button>
            </Stack>
          </Dialog>
        </FormContainer>
      </Container>
    </Stack>
  );
}

export default CourseDetail;
