import Button from "@/components/atoms/Button";
import { TextField } from "@/components/molecules/LabeledHookForms";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { storeSignature, updateSignature } from "@/services/SignatureService";
import {
  SignatureFormAttribute,
  SignatureFormAttributeWithId,
  signatureFormInit,
  signatureFormSchema,
} from "@/validations/SignatureFormValidation";
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

interface SignatureAddEditProps {
  state: "add" | SignatureFormAttributeWithId | null;
  closeFn: () => void;
  resolverFn: () => void;
}

function SignatureAddEdit({
  state,
  closeFn,
  resolverFn,
}: SignatureAddEditProps) {
  const mounted = useRef(true);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();

  const formContext = useForm<SignatureFormAttribute>({
    mode: "onChange",
    defaultValues: signatureFormInit,
    resolver: yupResolver(signatureFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw: SignatureFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "sure ka?",
        content: "text here",
      });

      if (confirmed) {
        try {
          const res = await (state === "add"
            ? storeSignature(raw)
            : updateSignature(state!.id, raw));

          successSnackbar(res.data.message);
          handleClose();
          resolverFn();
        } catch (e: any) {
          const errors = handleError(e);
          type Key = keyof SignatureFormAttribute;
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
      formContext.reset(signatureFormInit);
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
                <TextField label="登録名" name="name" />
                <TextField label="from名前" name="from_name" />
                <TextField label="fromアドレス" name="from_email" />
                <TextField label="署名" name="content" multiline rows={3} />
                {/* <TextField
                  label="並び順"
                  name="priority"
                  type="number"
                  inputProps={{ min: 1 }}
                /> */}
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
                disabled={!isDirty}
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

export default SignatureAddEdit;
