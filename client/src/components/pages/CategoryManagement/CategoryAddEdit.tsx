import Button from "@/components/atoms/Button";
import { TextField, DatePicker } from "@/components/molecules/LabeledHookForms";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { storeCategory, updateCategory } from "@/services/CategoryService";
import {
  CategoryFormAttribute,
  CategoryFormAttributeWithId,
  categoryFormInit,
  categoryFormSchema,
} from "@/validations/CategoryFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FormContainer, useFieldArray, useForm } from "react-hook-form-mui";

function CategoryAddEdit({
  state,
  closeFn,
  resolverFn,
}: {
  state: "add" | CategoryFormAttributeWithId | null;
  closeFn: () => void;
  resolverFn: () => void;
}) {
  const mounted = useRef(true);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();
  const [hasChildren, setHasChildren] = useState(false);
  const [tempChildren, setTempChildren] = useState<
    CategoryFormAttribute["child_categories"]
  >([]);
  const formContext = useForm<CategoryFormAttribute>({
    mode: "onChange",
    defaultValues: categoryFormInit,
    resolver: yupResolver(categoryFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formContext;

  const {
    fields: child_categories,
    remove,
    append,
  } = useFieldArray({
    control: formContext.control,
    name: "child_categories",
    keyName: "fieldKey",
  });

  const handleSubmit = formContext.handleSubmit(
    async (raw: CategoryFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "sure ka?",
        content: "text here",
      });

      if (confirmed) {
        try {
          const res = await (state === "add"
            ? storeCategory(raw)
            : updateCategory(state!.id, raw));

          successSnackbar(res.data.message);
          handleClose();
          resolverFn();
        } catch (e: any) {
          const errors = handleError(e);
          type Key = keyof CategoryFormAttribute;
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

  const handleCheck = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (!checked) {
      setTempChildren(formContext.getValues("child_categories"));
      formContext.setValue("child_categories", []);
    } else {
      formContext.setValue("child_categories", tempChildren);
    }
    setHasChildren(checked);
  };

  const handleClose = () => {
    closeFn();
    setTimeout(() => {
      formContext.reset(categoryFormInit);
      setTempChildren([]);
      setHasChildren(false);
    }, 200);
  };

  useEffect(() => {
    mounted.current = true;

    if (state && state !== "add") {
      formContext.reset(state);
      if (state.child_categories?.length > 0) {
        setHasChildren(true);
        setTempChildren(state.child_categories);
      }
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
        <Typography variant="sectiontitle1">所属の登録</Typography>
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
                <TextField label="カテゴリー名" name="name" />
                <DatePicker label="開始期間" name="start_period" />
                <DatePicker label="終了期間" name="end_period" />
                <TextField
                  label="並び順"
                  name="priority"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Stack>
            </Paper>
            <Paper variant="subpaper" sx={{ mt: 3 }}>
              <Typography
                variant="sectiontitle2"
                sx={{ transform: "translate(-8px, -8px)" }}
              >
                カテゴリー子部署
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  label="カテゴリー子部署を作成する"
                  control={
                    <Checkbox checked={hasChildren} onChange={handleCheck} />
                  }
                  disabled={isSubmitting}
                />
                {child_categories.map(({ fieldKey }, index) => (
                  <Box key={fieldKey}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: "16px !important",
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    >
                      <Stack spacing={2}>
                        <TextField
                          label="カテゴリー子部署名"
                          name={`child_categories.${index}.name`}
                        />
                        <TextField
                          label="並び順"
                          name={`child_categories.${index}.priority`}
                          type="number"
                          inputProps={{ min: 0 }}
                        />
                      </Stack>
                    </Paper>
                    <Button
                      type="button"
                      color="secondary"
                      startIcon={<Delete />}
                      onClick={() => remove(index)}
                      sx={{
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderTopWidth: 0,
                        bgcolor: "#fff",
                      }}
                    >
                      削除
                    </Button>
                  </Box>
                ))}
                {hasChildren && (
                  <Button
                    type="button"
                    onClick={() => append({ name: "", priority: null })}
                    variant="contained"
                    color="secondary"
                  >
                    カテゴリー子部署を追加✙
                  </Button>
                )}
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

export default CategoryAddEdit;
