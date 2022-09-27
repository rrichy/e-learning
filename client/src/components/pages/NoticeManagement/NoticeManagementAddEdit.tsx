import {
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import {
  Selection,
  TextField,
  RadioGroup,
} from "../../molecules/LabeledHookForms";
import DateRange from "@/components/atoms/HookForms/DateRange";
import Labeler from "@/components/molecules/Labeler";

function NoticeManagementAdd() {
  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">お知らせ登録</Typography>
        <Paper variant="sectionsubpaper">
          <Typography variant="sectiontitle3">Create</Typography>
          <FormContainer>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name="subject"
                  label="Subject Name"
                  placeholder="Subject Name"
                />
                <TextField
                  name="content"
                  label="content"
                  placeholder="content"
                  multiline
                  rows={3}
                />
                <RadioGroup
                  name="gender"
                  label="Posting method"
                  row={false}
                  options={[
                    { id: 1, name: "post notice" },
                    { id: 2, name: "Deliver mail" },
                  ]}
                />
                <RadioGroup
                  name="target"
                  label="Target"
                  row={false}
                  options={[
                    { id: 1, name: "everyone" },
                    { id: 2, name: "group" },
                    { id: 3, name: "individual" },
                    { id: 4, name: "course" },
                  ]}
                />
                <Labeler label="posting period">
                  <DateRange 
                    minDateProps={{ name: "posting_period_from" }} 
                    maxDateProps={{ name: "posting_period_to" }} 
                  />
                </Labeler>
                <Selection name="sex" label="signature" />
              </Stack>
            
            </Paper>
            <Stack direction="row" spacing={2} justifyContent="center" pb={3}>
              <Button
                color="dull"
                variant="outlined"
                rounded
                large
                type="button"
                to="/notice-management"
              >
                キャンセル
              </Button>
              <Button
                color="secondary"
                variant="contained"
                rounded
                large
                type="submit"
                // disabled={!(isValid && isDirty)}
              >
                登録 (Confirmation)
              </Button>
            </Stack>
          </FormContainer>
        </Paper>
      </Stack>
    </Paper>
    // <Stack justifyContent="space-between">
    //   <Container>
    //     <Stack spacing={3} sx={{ p: 3 }}>
    //       <FormContainer>
    //         <Paper variant="softoutline" sx={{ p: 6 }}>
    //           <Stack spacing={3}>
    //             {/* <Typography
    //               fontWeight="bold"
    //               variant="h6"
    //               pl={1}
    //               sx={{ borderLeft: "5px solid #00c2b2" }}
    //             >
    //               コースを作成
    //             </Typography> */}

    //             <Card>
    //               <CardHeader
    //                 title="お知らせ登録"
    //                 sx={{
    //                   fontWeight: "bold",
    //                   background: "#000000",
    //                   color: "#ffffff",
    //                   fontSize: "1.25rem",
    //                 }}
    //               />
    //               <CardContent>
    //                 <Stack spacing={2}>
    //                   <TextField
    //                     name="subject"
    //                     label="Subject Name"
    //                     placeholder="Subject Name"
    //                   />
    //                   <TextField
    //                     name="content"
    //                     label="content"
    //                     placeholder="content"
    //                     multiline
    //                     rows={3}
    //                   />
    //                   <RadioGroup
    //                     name="gender"
    //                     label="Posting method"
    //                     row={false}
    //                     options={[
    //                       { id: 1, name: "post notice" },
    //                       { id: 2, name: "Deliver mail" },
    //                     ]}
    //                   />
    //                   <RadioGroup
    //                     name="target"
    //                     label="Target"
    //                     row={false}
    //                     options={[
    //                       { id: 1, name: "everyone" },
    //                       { id: 2, name: "group" },
    //                       { id: 3, name: "individual" },
    //                       { id: 4, name: "course" },
    //                     ]}
    //                   />
    //                   <DatePicker
    //                     name="birthday"
    //                     label="posting period"
    //                     maxDate={new Date()}
    //                   />
    //                   <DatePicker
    //                     name="birthday"
    //                     maxDate={new Date()}
    //                   />
    //                   <Selection name="sex" label="signature" />
    //                 </Stack>
    //               </CardContent>
    //             </Card>
    //           </Stack>

    //           <Stack direction="row" spacing={2} pt={5} justifyContent="center">
    //             {/* <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button> */}
    //             <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>Cancel</Button>
    //             <Button large variant="contained" sx={{ borderRadius: 7 }}>Confirmation</Button>
    //           </Stack>
    //         </Paper>
    //       </FormContainer>
    //     </Stack>
    //   </Container>
    // </Stack>
  );
}

export default NoticeManagementAdd;
