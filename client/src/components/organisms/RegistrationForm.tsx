import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { RegistrationFormAttribute } from "@/validations/RegistrationFormValidation";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useState } from "react";
import { FormContainer, UseFormReturn } from "react-hook-form-mui";
import Button from "../atoms/Button";
import Link from "../atoms/Link";
import {
  DatePicker,
  Selection,
  TextField,
} from "../molecules/LabeledHookForms";

interface RegistrationFormProps {
  formContext: UseFormReturn<RegistrationFormAttribute, any>;
  onSubmit?: (d: RegistrationFormAttribute) => void;
}

function RegistrationForm({ formContext, onSubmit }: RegistrationFormProps) {
  const [checked, setChecked] = useState(false);

  const {
    formState: { isValid, isSubmitting },
  } = formContext;

  return (
    <FormContainer
      formContext={formContext}
      handleSubmit={formContext.handleSubmit(onSubmit || (() => null))}
    >
      <DisabledComponentContextProvider value={isSubmitting || !onSubmit}>
        <Stack spacing={3} alignItems="center" p={{ xs: 2, sm: 5 }}>
          <TextField
            name="name"
            label="氏名"
            labelProps={{ compact: true, accent: true }}
          />
          <TextField
            name="email"
            label="メールアドレス"
            labelProps={{ compact: true, accent: true }}
          />
          <Selection
            name="sex"
            label="性別"
            labelProps={{ compact: true, accent: true }}
          />
          <DatePicker
            name="birthday"
            label="生年月日"
            labelProps={{ compact: true, accent: true }}
            maxDate={new Date()}
          />
          <TextField
            name="password"
            label="パスワード"
            labelProps={{ compact: true, accent: true }}
            type="password"
          />
          <TextField
            name="password_confirmation"
            label="パスワード（確認用）"
            labelProps={{ compact: true, accent: true }}
            type="password"
          />
          {/* <Selection
            name="department_1"
            label="部署1"
            labelProps={{ compact: true, accent: true }}
          />
          <Selection
            name="department_2"
            label="部署2"
            labelProps={{ compact: true, accent: true }}
          />
          <TextField
            name="remarks"
            label="備考"
            labelProps={{ compact: true, accent: true }}
            multiline
            rows={3}
          /> */}
          {onSubmit && (
            <>
              <Button
                variant="outlined"
                to="/rule"
                type="button"
                disabled={isSubmitting}
                sx={{
                  width: 150,
                  my: 3,
                  boxShadow: (t) => `0 3px ${t.palette.primary.main}`,
                }}
              >
                利用規約
              </Button>
              <FormControlLabel
                label="利用規約に同意する"
                disabled={isSubmitting}
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={(_, checked) => setChecked(checked)}
                  />
                }
              />
              <Button
                variant="contained"
                sx={{ py: 2, boxShadow: "0 3px #009696" }}
                disabled={!checked || !isValid}
                loading={isSubmitting}
              >
                登録
              </Button>
              <Link to="/login">ホームページへ</Link>
            </>
          )}
        </Stack>
      </DisabledComponentContextProvider>
    </FormContainer>
  );
}

export default RegistrationForm;
