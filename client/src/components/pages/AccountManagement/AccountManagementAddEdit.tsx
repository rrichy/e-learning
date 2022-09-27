import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragment/AccountManagementForm";

function AccountManagementAddEdit() {
  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">アカウントを作成</Typography>
        <Paper variant="sectionsubpaper">
          <Typography variant="sectiontitle3">アカウントを作成</Typography>
          <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
            <FormContainer>
              <AccountManagementForm
                viewable={true}
                isCreate
              />
            </FormContainer>
          </Paper>
        </Paper>
      </Stack>
    </Paper>
  );
}

export default AccountManagementAddEdit;