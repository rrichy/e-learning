import { Dialog, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { FormContainer } from "react-hook-form-mui";
import Button from "@/components/atoms/Button";
import {
  DatePicker,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useState } from "react";
import MaterialTable from "material-table";
import Link from "@/components/atoms/Link";
// import AccountManagementForm from "@/components/organisms/AccountManagementFragment/AccountManagementForm";

function AccountManagementDetails() {
  const [applyOpen, setApplyOpen] = useState(false);
  const handleApplyOpen = () => {
    setApplyOpen(true);
  };
  const handleApplyClose = () => {
    setApplyOpen(false);
  };

  const [dataOne, setDataOne] = useState([
    { 
      attending_course: "Course 1-1", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
    { 
      attending_course: "Course 1-2", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
  ]);

  const [dataTwo, setDataTwo] = useState([
    { 
      attending_course: "Course 2-1", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
    { 
      attending_course: "Course 2-2", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
  ]);

  const [dataThree, setDataThree] = useState([
    { 
      attending_course: "Course 1-1", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
    { 
      attending_course: "Course 1-2", 
      start_date: "2022-09-18", 
      progress_rate: "100%",
      score: 100,
      course_complete_date: "2022-09-18",
      end_date: "2022-09-18"
    },
  ]);
  
  return (
    <Paper variant="outlined">
      <FormContainer>
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">アカウントを作成</Typography>
          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">アカウントを作成</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <DisabledComponentContextProvider value>
                {/* <AccountManagementForm
                  viewable={true}
                /> */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    color="secondary"
                    variant="contained"
                    rounded
                    large
                    type="submit"
                    // disabled={!(isValid && isDirty)}
                  >
                    edit
                  </Button>
                </Stack>
              </DisabledComponentContextProvider>
            </Paper>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">コース情報</Typography>
              <Stack spacing={2} pt={3}>
                <MaterialTable 
                  columns={[
                    { 
                      field: "attending_course", 
                      title: "Attending Course 1",
                      render: (row) => (
                        <Link to={`/account-management/1/detail`}>
                          {row.attending_course}
                        </Link>
                      )
                    },
                    { field: "start_date", title: "Start Date" },
                    { field: "progress_rate", title: "Progress Rate" },
                    { field: "score", title: "Score" },
                    { field: "course_complete_date", title: "Course Completed Date" },
                    { field: "end_date", title: "End Date" },
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
                  data={dataOne}
                />
                <MaterialTable 
                  columns={[
                    { 
                      field: "attending_course", 
                      title: "Attending Course 2",
                      render: (row) => (
                        <Link to={`/account-management/1/detail`}>
                          {row.attending_course}
                        </Link>
                      )
                    },
                    { field: "start_date", title: "Start Date" },
                    { field: "progress_rate", title: "Progress Rate" },
                    { field: "score", title: "Score" },
                    { field: "course_complete_date", title: "Course Completed Date" },
                    { field: "end_date", title: "End Date" },
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
                  data={dataTwo}
                />
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">コース情報</Typography>
              <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
                <Selection
                  name="sex"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  onClick={handleApplyOpen}
                >
                  Apply for extension
                </Button>
              </Stack>
              <Stack spacing={2} pt={3}>
                <MaterialTable 
                  columns={[
                    { 
                      field: "attending_course", 
                      title: "Attending Course 1",
                      render: (row) => (
                        <Link to={`/account-management/1/detail`}>
                          {row.attending_course}
                        </Link>
                      )
                    },
                    { field: "start_date", title: "Start Date" },
                    { field: "progress_rate", title: "Progress Rate" },
                    { field: "score", title: "Score" },
                    { field: "course_complete_date", title: "Course Completed Date" },
                    { field: "end_date", title: "End Date" },
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
                  data={dataThree}
                />
              </Stack>
              <Stack spacing={2} pt={3} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  to="/account-management"
                >
                  Back
                </Button>
              </Stack>
            </Paper>
          </Paper>
        </Stack>

        <Dialog 
          open={applyOpen} 
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
        >
          <DialogTitle sx={{ px: 0, pt: 0 }}>
            <Typography variant="sectiontitle1">Apply for period extension</Typography>
          </DialogTitle>
          <DialogContent>
            <Paper variant="subpaper">
              <Stack spacing={2}>
                <DatePicker
                  name="start_date"
                  label="Start Date"
                  maxDate={new Date()}
                />
                <DatePicker
                  name="closing_date"
                  label="Desired Closing Date"
                  maxDate={new Date()}
                />
                <TextField
                  name="reason"
                  placeholder="Reason for Extending"
                  label="Reason for Extending"
                  multiline
                  rows={4}
                />
              </Stack>
            </Paper>
            <Stack
              direction="row"
              mt={3}
              spacing={1}
              justifyContent="space-between"
              sx={{
                "& button": {
                  height: 60,
                  borderRadius: 8,
                },
              }}
            >
              <Button
                variant="outlined"
                color="dull"
                type="button"
                onClick={handleApplyClose}
              >
                キャンセル
              </Button>
              <Button variant="contained" color="secondary" type="submit">
                Apply
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </FormContainer>
    </Paper>
  );
}

export default AccountManagementDetails;