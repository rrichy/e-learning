import Button from "@/components/atoms/Button";
import { Selection, TextField } from "@/components/molecules/LabeledHookForms";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import {
  storeOrganizeMail,
  updateOrganizeMail,
} from "@/services/OrganizeMailService";
import {
  OrganizeMailFormAttribute,
  OrganizeMailFormAttributeWithId,
  organizeMailFormInit,
  organizeMailFormSchema,
} from "@/validations/OrganizeMailFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { FormContainer, useForm } from "react-hook-form-mui";

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
  const mounted = useRef(true);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();

  const formContext = useForm<OrganizeMailFormAttribute>({
    mode: "onChange",
    defaultValues: organizeMailFormInit,
    resolver: yupResolver(organizeMailFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw: OrganizeMailFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "sure ka?",
        content: "text here",
      });

      if (confirmed) {
        try {
          const res = await (state === "add"
            ? storeOrganizeMail(raw)
            : updateOrganizeMail(state!.id, raw));

          successSnackbar(res.data.message);
          handleClose();
          resolverFn();
        } catch (e: any) {
          const errors = handleError(e);
          type Key = keyof OrganizeMailFormAttribute;
          Object.entries(errors).forEach(([name, error]) => {
            const err = error as string | string[];
            const str_error = typeof err === "string" ? err : err.join("");
            formContext.setError(name as Key, {
              type: "manual",
              message: str_error,
            });
          });
        }
      }
    },
    (a, b) => console.log({ a, b })
  );

  const handleClose = () => {
    closeFn();
    setTimeout(() => {
      formContext.reset(organizeMailFormInit);
    }, 200);
  };

  useEffect(() => {
    mounted.current = true;

    if (state && state !== "add") {
      formContext.reset(state);
    }

    return () => {
      mounted.current = false;
    };
  }, [state]);

  return (
    <Dialog
      open={Boolean(state)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">署名の登録</Typography>
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
