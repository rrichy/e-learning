import {
  Container,
  Icon,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward, OpenInNew } from "@mui/icons-material";
import { FormContainer } from "react-hook-form-mui";
import { useForm } from "react-hook-form";
import logo from "@/assets/logo.png";
import { TextField } from "../molecules/LabeledHookForms";
import Button from "../atoms/Button";
import Link from "../atoms/Link";
import { getBearerToken, login } from "@/services/AuthService";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAlerter from "@/hooks/useAlerter";
import Footer from "../molecules/Footer";

function Login() {
  const { setAuthorized } = useAuth();
  const { warningSnackbar, handleError } = useAlerter();
  const navigate = useNavigate();
  const formContext = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const {
  //   formState: { isValid, errors },
  // } = formContext;

  const handleSubmit = formContext.handleSubmit(async (raw) => {
    const bearerToken = getBearerToken();
    const validToken = bearerToken !== "" ? bearerToken : undefined;

    if (validToken) {
      setAuthorized();
      warningSnackbar("You are already logged in!");

      navigate("/home");
    } else {
      try {
        await login(raw);
        setAuthorized();

        navigate("/home");
      } catch (e: any) {
        const errors = handleError(e);
        type Key = "email" | "password";
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
  });

  return (
    <Stack minHeight="100vh" justifyContent="space-between">
      <Container maxWidth="sm">
        <Stack
          alignItems="center"
          spacing={{ xs: 2, sm: 5 }}
          my={{ xs: 2, sm: 10 }}
        >
          <Stack
            alignItems="center"
            spacing={1}
            sx={{
              "& img": {
                width: 1,
                maxWidth: 200,
              },
            }}
          >
            <img src={logo} alt="logo" />
            <Typography fontWeight="bold" variant="caption">
              ITインフラエンジニア向け資格対策eラーニング
            </Typography>
          </Stack>
          <Paper
            variant="softoutline"
            sx={{ p: { xs: 4, sm: 6 }, width: 1, maxWidth: 430 }}
          >
            <FormContainer
              formContext={formContext}
              handleSubmit={handleSubmit}
            >
              <Stack spacing={3} alignItems="center">
                <TextField
                  name="email"
                  label="User ID（登録メールアドレス）"
                  labelProps={{ compact: true, accent: true }}
                  placeholder="IDを入力してください"
                />
                <TextField
                  name="password"
                  label="パスワード"
                  labelProps={{ compact: true, accent: true }}
                  type="password"
                />
                {/* {!isValid &&
                  Object.values(errors).map((a, i) => (
                    <Typography color="error" key={i}>
                      {a.message}
                    </Typography>
                  ))} */}
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ py: 2, boxShadow: "0 3px #009696" }}
                >
                  ログイン
                </Button>
              </Stack>
            </FormContainer>
            <Stack alignItems="center">
              <Button
                variant="outlined"
                to="/rule"
                endIcon={<ArrowForward />}
                sx={{
                  width: 150,
                  my: 3,
                  boxShadow: (t) => `0 3px ${t.palette.primary.main}`,
                }}
              >
                利用規約
              </Button>
              <Link variant="caption" to="/forgot-password">
                パスワードをお忘れの方はこちら
              </Link>
              <Link variant="caption" to="/register">
                アカウントをお持ちではない方はこちら
              </Link>
            </Stack>
          </Paper>
          <MuiLink
            variant="caption"
            href="https://www.techhub.tokyo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            techhub TOPページ
            <Icon fontSize="inherit">
              <OpenInNew fontSize="inherit" />
            </Icon>
          </MuiLink>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  );
}

export default Login;
