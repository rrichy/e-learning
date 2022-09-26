import { OptionsAttribute } from "@/interfaces/CommonInterface";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import {
  RegistrationFormAttribute,
  registrationFormInit,
  registrationFormSchema,
} from "@/validations/RegistrationFormValidation";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form-mui";
import Footer from "../molecules/Footer";
import Header from "../organisms/Header";
import { yupResolver } from "@hookform/resolvers/yup";
import RegistrationForm from "../organisms/RegistrationForm";
import useConfirm from "@/hooks/useConfirm";
import { register } from "@/services/AuthService";
import useAlerter from "@/hooks/useAlerter";
import { useNavigate } from "react-router-dom";

function Register() {
  const [options, setOptions] = useState<OptionsAttribute>({});
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const formContext = useForm<RegistrationFormAttribute>({
    mode: "onChange",
    defaultValues: registrationFormInit,
    resolver: yupResolver(registrationFormSchema),
  });

  const handleSubmit = async (raw: RegistrationFormAttribute) => {
    try {
      const confirmed = await isConfirmed({
        title: "アカウント情報確認",
        content: (
          <OptionsContextProvider options={options}>
            <RegistrationForm formContext={formContext} />
          </OptionsContextProvider>
        ),
      });

      if (confirmed) {
        const res = await register(raw);
        successSnackbar(res?.data?.message);
        navigate("/login");
      }
    } catch (e: any) {
      const errors = handleError(e);
      type Key = keyof RegistrationFormAttribute;
      Object.entries(errors).forEach(([name, error]) => {
        const err = error as string | string[];
        const str_error = typeof err === "string" ? err : err.join("");
        formContext.setError(name as Key, {
          type: "manual",
          message: str_error,
        });
      });
    }
  };

  useEffect(() => {
    mounted.current = true;

    try {
      // fetch options
      setOptions({
        sex: [
          { id: 0, name: "未選択", selectionType: "disabled" },
          { id: 1, name: "男性" },
          { id: 2, name: "女性" },
        ],
        department_1: [{ id: 0, name: "未選択", selectionType: "disabled" }],
        department_2: [{ id: 0, name: "未選択", selectionType: "disabled" }],
      });
    } catch (e: any) {
      errorSnackbar(e.message);
    }

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Stack minHeight="100vh" justifyContent="space-between">
      <Header />
      <Container maxWidth="sm">
        <Box my={4}>
          <Paper variant="softoutline" sx={{ width: 1 }}>
            <Typography variant="sectiontitle1" component="h2">
              アカウント登録
            </Typography>
            <OptionsContextProvider options={options}>
              <RegistrationForm
                formContext={formContext}
                onSubmit={handleSubmit}
              />
            </OptionsContextProvider>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </Stack>
  );
}

export default Register;
