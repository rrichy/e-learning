import Button from "@/components/atoms/Button";
import { Selection as AtomSelection } from "@/components/atoms/HookForms";
import { TextField, Selection } from "@/components/molecules/LabeledHookForms";
import Labeler from "@/components/molecules/Labeler";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import { get } from "@/services/ApiService";
import { getOptions } from "@/services/CommonService";
import { storeOrganizeMail } from "@/services/OrganizeMailService";
import {
  AccountMultipleAddFormAttribute,
  accountMultipleAddFormInit,
} from "@/validations/AccountMultipleAddFormValidation";
import {
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface TemplateFormProps {
  form: UseFormReturn<AccountMultipleAddFormAttribute, any>;
}

function TemplateForm({ form }: TemplateFormProps) {
  const { isConfirmed } = useConfirm();
  const { handleError, successSnackbar, errorSnackbar } = useAlerter();
  const navigate = useNavigate();

  const {
    formState: { isDirty },
  } = form;

  const [checked, title, content, signature_id] = form.watch([
    "checked",
    "title",
    "content",
    "signature_id",
  ]);

  const displaySaveable = useMemo(() => {
    return Boolean(title && content && signature_id);
  }, [title, content, signature_id]);

  const [{ data: mail_templates }, { data: signatures }] = fetchingOptions(
    checked!
  );

  const handleApplyTemplate = async (id: number) => {
    if (id) {
      try {
        const res = await get("/api/mail-template/" + id);
        const { title, content, signature_id } = res.data.data;

        form.reset(
          { ...form.getValues(), title, content, signature_id },
          { keepDirty: true }
        );
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    }
  };

  const handleRedirect = async () => {
    let confirmed = true;

    if (isDirty) {
      confirmed = await isConfirmed({
        title: "confirmation",
        content: "discard all and redirect to mail template management",
      });
    }

    if (confirmed) {
      navigate("/organize-mail-management");
    }
  };

  const handleSaveTemplate = async () => {
    const confirmed = await isConfirmed({
      title: "sure ka?",
      content: "text here",
    });

    if (confirmed) {
      try {
        const res = await storeOrganizeMail(form.getValues());
        successSnackbar(res.data.message);
      } catch (e: any) {
        handleError(e, form);
      }
    }
  };

  return (
    <Paper variant="subpaper" sx={{ mt: 3 }}>
      <Stack spacing={2}>
        <Controller
          name="checked"
          render={({ field: { value, onChange, name, ref } }) => (
            <FormControlLabel
              labelPlacement="start"
              label="「登録のお知らせ」メール配信"
              componentsProps={{
                typography: { variant: "sectiontitle2", mr: 1 },
              }}
              sx={{
                transform: `translate(-8px, -${checked ? 8 : 0}px)`,
                justifyContent: "flex-end",
                m: 0,
              }}
              control={
                <Checkbox
                  ref={ref}
                  name={name}
                  checked={value}
                  onChange={(_, checked) => {
                    if (checked) {
                      onChange(checked);
                    } else {
                      form.reset({
                        ...accountMultipleAddFormInit,
                        file: form.getValues("file"),
                        checked,
                      });
                    }
                  }}
                />
              }
            />
          )}
        />
        {checked && (
          <>
            <Labeler label="保存したメールを使用">
              <Stack direction="row" spacing={2}>
                <AtomSelection
                  name="mail_template_id"
                  label="保存したメールを使用"
                  options={[
                    { id: 0, name: "未選択" },
                    ...(mail_templates ?? []),
                  ]}
                  fullWidth
                  size="small"
                  onChange={handleApplyTemplate}
                />
                <Button
                  variant="contained"
                  fit
                  rounded
                  type="button"
                  onClick={handleRedirect}
                >
                  メール整理
                </Button>
              </Stack>
            </Labeler>
            <TextField name="title" label="タイトル" />
            <TextField name="content" label="内容" multiline rows={3} />
            {displaySaveable && (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography color="red" variant="subtitle2">
                  （※）上記タイトル・内容を保存できます。
                </Typography>
                <Button
                  variant="contained"
                  fit
                  rounded
                  type="button"
                  onClick={handleSaveTemplate}
                >
                  保存
                </Button>
              </Stack>
            )}
            <Selection
              name="signature_id"
              label="署名選択"
              options={[{ id: 0, name: "未選択" }, ...(signatures ?? [])]}
            />
          </>
        )}
      </Stack>
    </Paper>
  );
}

export default TemplateForm;

function fetchingOptions(checked: boolean) {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["mail_templates-options"],
        queryFn: async () => {
          const res = await getOptions(["mail_templates"]);
          return res.data.mail_templates as OptionAttribute[];
        },
        staleTime: 10_000,
        enabled: checked,
      },
      {
        queryKey: ["signatures-options"],
        queryFn: async () => {
          const res = await getOptions(["signatures"]);

          return res.data.signatures as OptionAttribute[];
        },
        staleTime: 10_000,
        enabled: checked,
      },
    ],
  });

  return queries;
}
