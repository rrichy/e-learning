import Button from "@/components/atoms/Button";
import { TextField } from "@/components/molecules/LabeledHookForms";
import useAlerter from "@/hooks/useAlerter";
// import useConfirm from "@/hooks/useConfirm";
import {
  storeAffiliation,
  updateAffiliation,
} from "@/services/AffiliationService";
import {
  AffiliationFormAttribute,
  AffiliationFormAttributeWithId,
  affiliationFormInit,
  affiliationFormSchema,
} from "@/validations/AffiliationFormValidation";
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
import { useForm } from "react-hook-form";
import { FormContainer } from "react-hook-form-mui";

function AffiliationAddEdit({
  state,
  closeFn,
  resolverFn,
}: {
  state: "add" | AffiliationFormAttributeWithId | null;
  closeFn: () => void;
  resolverFn: () => void;
}) {
  const mounted = useRef(true);
  // const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();
  const formContext = useForm<AffiliationFormAttribute>({
    mode: "onChange",
    defaultValues: affiliationFormInit,
    resolver: yupResolver(affiliationFormSchema),
  });

  const handleSubmit = formContext.handleSubmit(
    async (raw: AffiliationFormAttribute) => {
      try {
        const res = await (state === "add"
          ? storeAffiliation(raw)
          : updateAffiliation(state!.id, raw));

        successSnackbar(res.data.message);
        handleClose();
        resolverFn();
      } catch (e: any) {
        const errors = handleError(e);
        type Key = keyof AffiliationFormAttribute;
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
  );

  const handleClose = () => {
    closeFn();
    formContext.reset(affiliationFormInit);
  };

  useEffect(() => {
    mounted.current = true;

    if (state && state !== "add") {
      formContext.reset(state);
    }

    return () => {
      mounted.current = false;
    };
  }, [formContext, state]);

  return (
    <Dialog
      open={Boolean(state)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">所属の登録</Typography>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
          <Paper variant="subpaper">
            <Typography
              variant="sectiontitle2"
              sx={{ transform: "translate(-8px, -8px)" }}
            >
              基本情報
            </Typography>
            <Stack spacing={2}>
              <TextField label="所属名" name="name" />
              <TextField
                label="並び順"
                name="priority"
                type="number"
                inputProps={{ min: 0 }}
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
            >
              キャンセル
            </Button>
            <Button variant="contained" color="secondary" type="submit">
              登録
            </Button>
          </Stack>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}

export default AffiliationAddEdit;
