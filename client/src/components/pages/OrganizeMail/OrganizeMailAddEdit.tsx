import Button from "@/components/atoms/Button";
import { Selection, TextField } from "@/components/molecules/LabeledHookForms";
import useOrganizeMailAddEdit from "@/hooks/pages/useOrganizeMailAddEdit";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FormContainer } from "react-hook-form-mui";

interface OrganizeMailAddEditProps {
  state: "add" | OrganizeMailFormAttributeWithId | null;
  closeFn: () => void;
  resolverFn: () => void;
  signatures: OptionAttribute[];
}

function OrganizeMailAddEdit({
  state,
  closeFn,
  resolverFn,
  signatures,
}: OrganizeMailAddEditProps) {
  const { formContext, handleSubmit, handleClose } = useOrganizeMailAddEdit({
    state,
    closeFn,
    resolverFn,
  });

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = formContext;
  return (
    <Dialog
      open={Boolean(state)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">メールテンプレートの登録</Typography>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
          <DisabledComponentContextProvider value={isSubmitting} showLoading>
            <Paper variant="subpaper">
              <Typography
                variant="sectiontitle2"
                sx={{ transform: "translate(-8px, -8px)" }}
              >
                基本情報
              </Typography>
              <Stack spacing={2}>
                <TextField label="タイトル" name="title" />
                <TextField label="内容" name="content" multiline rows={3} />
                <Selection
                  label="署名"
                  name="signature_id"
                  options={signatures}
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={!(isValid && isDirty)}
              >
                登録
              </Button>
            </Stack>
          </DisabledComponentContextProvider>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}

export default OrganizeMailAddEdit;
