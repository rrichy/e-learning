import "./App.css";
import Pages from "@/components/pages";
import { CssBaseline, Grow } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ja } from "date-fns/locale";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthContextProvider from "./providers/AuthContextProvider";
import { SnackbarProvider } from "notistack";
import ConfirmContextProvider from "./providers/ConfirmContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          TransitionComponent={Grow}
          autoHideDuration={3000}
        >
          <CssBaseline />
          <LocalizationProvider adapterLocale={ja} dateAdapter={AdapterDateFns}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <AuthContextProvider>
                <ConfirmContextProvider>
                  <Pages />
                </ConfirmContextProvider>
              </AuthContextProvider>
            </QueryClientProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
