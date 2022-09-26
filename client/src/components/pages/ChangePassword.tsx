import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer } from "react-hook-form-mui";
import { TextField } from "../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";

function ChangePassword(){
  return (
    <Paper variant="outlined">
      <FormContainer>
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">Change Password</Typography>
          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">Change Password</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Stack spacing={2} justifyContent="center">
                <TextField
                  name="old_password"
                  label="Old Password"
                  type="password"
                />
                <TextField
                  name="new_password"
                  label="New Password"
                  type="password"
                />
                <TextField
                  name="new_password_confirm"
                  label="New Password Confirmation"
                  type="password"
                />
              </Stack>
            </Paper>
          </Paper>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              color="dull"
              variant="outlined"
              rounded
              large
              type="button"
              to="/account-management"
            >
              キャンセル
            </Button>
            <Button
              color="secondary"
              variant="contained"
              rounded
              large
              type="submit"
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </FormContainer>
    </Paper>
  );
}

export default ChangePassword;