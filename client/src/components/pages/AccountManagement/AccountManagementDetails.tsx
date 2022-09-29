import { Avatar, Grid, Paper, Stack, Typography } from "@mui/material";
import Button from "@/components/atoms/Button";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userInit } from "@/interfaces/AuthAttributes";
import useAlerter from "@/hooks/useAlerter";
import { showAccount } from "@/services/AccountService";
import { MembershipTypeJp } from "@/enums/membershipTypes";

function AccountManagementDetails() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [user, setUser] = useState(userInit);
  const [initialized, setInitialized] = useState(false);
  const { errorSnackbar } = useAlerter();

  useEffect(() => {
    mounted.current = true;

    if (accountId) {
      (async () => {
        try {
          const res = await showAccount(+accountId, true);
          const { affiliation_id, department_1, department_2, ...data } =
            res.data.data;

          setUser({
            ...data,
            affiliation_id: affiliation_id ?? 0,
            department_1: department_1 ?? 0,
            department_2: department_2 ?? 0,
          });
        } catch (e: any) {
          errorSnackbar(e.message);
        } finally {
          setInitialized(true);
        }
      })();
    }

    return () => {
      mounted.current = false;
    };
  }, [accountId]);

  return (
    <Paper variant="outlined">
      <DisabledComponentContextProvider showLoading value={!initialized}>
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">アカウント情報</Typography>
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={0} sm={5} />
            <Grid item xs={12} sm={7}>
              <Avatar
                src={user.image ?? undefined}
                alt={user.name}
                sx={{ m: "auto", height: 100, width: 100 }}
              />
            </Grid>
            <Informer label="氏名" value={user.name} />
            <Informer label="メールアドレス" value={user.email} />
            <Informer label="性別" value={["", "男性", "女性"][user.sex!]} />
            <Informer label="生年月日" value={user.birthday} />
            <Informer
              label="権限"
              value={MembershipTypeJp[user.membership_type_id]}
            />
            <Informer label="所属" value={user.affiliation_id_parsed} />
            <Informer label="部署１" value={user.department_1_parsed} />
            <Informer label="部署２" value={user.department_2_parsed} />
            <Informer label="備考" value={user.remarks} />
          </Grid>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              color="secondary"
              variant="contained"
              rounded
              large
              type="button"
              onClick={() =>
                navigate(`/account-management/${accountId}/edit`, {
                  state: user,
                })
              }
            >
              編集
            </Button>
          </Stack>

          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">受講状況</Typography>
            <Paper
              variant="outlined"
              sx={{ m: { xs: 2, md: 4 }, p: 2 }}
            ></Paper>
          </Paper>

          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">過去受講コース</Typography>
            <Paper
              variant="outlined"
              sx={{ m: { xs: 2, md: 4 }, p: 2 }}
            ></Paper>
          </Paper>

          {/* <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
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
            </Paper> */}
          {/* <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
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
            </Paper> */}
        </Stack>

        {/* <FormContainer>
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
      </FormContainer> */}
      </DisabledComponentContextProvider>
    </Paper>
  );
}

export default AccountManagementDetails;

const Informer = ({
  label,
  value,
}: {
  label: string;
  value?: number | string | null;
}) => (
  <>
    <Grid item xs={5}>
      <Typography fontWeight="bold">{label}</Typography>
    </Grid>
    <Grid item xs={7}>
      <Typography
        variant="body2"
        fontSize={{ xs: 14, sm: 16 }}
        textAlign={{ xs: "left", sm: "center" }}
        sx={{ wordBreak: "break-all" }}
      >
        {value ?? ""}
      </Typography>
    </Grid>
  </>
);
