import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import {
  AccountMultipleAddFormAttribute,
  accountMultipleAddFormInit,
  accountMultipleAddFormSchema,
} from "@/validations/AccountMultipleAddFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { parse } from "papaparse";
import { FormContainer, useForm } from "react-hook-form-mui";
import { post } from "@/services/ApiService";
import { localeDate } from "@/utils/localeDateString";
import CSVForm from "@/components/organisms/AccountManagementFragments/CSVForm";
import TemplateForm from "@/components/organisms/AccountManagementFragments/TemplateForm";

interface AccountMultipleAddProps {
  open: boolean;
  onClose: () => void;
  resolver: () => void;
}

function AccountMultipleAdd({
  open,
  onClose,
  resolver,
}: AccountMultipleAddProps) {
  const { isConfirmed } = useConfirm();
  const { handleError, successSnackbar } = useAlerter();

  const form = useForm<AccountMultipleAddFormAttribute>({
    mode: "onChange",
    defaultValues: accountMultipleAddFormInit,
    resolver: yupResolver(accountMultipleAddFormSchema),
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const handleSubmit = async ({
    file,
    ...raw
  }: AccountMultipleAddFormAttribute) => {
    const confirmed = await isConfirmed({ title: "submit", content: "submit" });

    if (confirmed) {
      parse(file[0], {
        complete: async (results) => {
          try {
            const res = await post("/api/account/multiple", {
              ...raw,
              file: results.data,
            });

            successSnackbar(res.data.message);
            handleClose();
            resolver();
          } catch (e: any) {
            handleError(e, form);
          }
        },
        header: true,
        skipEmptyLines: true,
        comments: "#",
        transform: (value, field) =>
          field === "birthday" ? localeDate(new Date(value)) : value,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      form.reset(accountMultipleAddFormInit);
    }, 200);
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">アカウントの複数登録</Typography>
      </DialogTitle>
      <DialogContent>
        <FormContainer
          formContext={form}
          handleSubmit={form.handleSubmit(handleSubmit)}
        >
          <DisabledComponentContextProvider value={isSubmitting} showLoading>
            <CSVForm />
            <TemplateForm form={form} />
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
                disabled={!isValid}
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

export default AccountMultipleAdd;
