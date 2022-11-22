import useAlerter from "@/hooks/useAlerter";
import { AuthAttributes } from "@/interfaces/AuthAttributes";
import React, { createContext, useEffect, useState } from "react";
import { post } from "@/services/ApiService";
import { getAuthData, getBearerToken } from "@/services/AuthService";
import Button from "@/components/atoms/Button";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext<
  | [
      AuthAttributes | null,
      React.Dispatch<React.SetStateAction<AuthAttributes>> | null
    ]
>([null, null]);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { errorSnackbar, warningSnackbar, closeSnackbar } = useAlerter();
  const [auth, setAuth] = useState<AuthAttributes>({
    isLoggedIn: Boolean(getBearerToken()),
    data: null,
    count: {},
    categories: [],
  });

  useQuery(["authenticated-data"], () => getAuthData(), {
    enabled: auth.isLoggedIn && !auth.data,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    onSuccess: (res) => {
      setAuth({
        isLoggedIn: true,
        data: res.data.user,
        count: res.data.users_count,
        categories: res.data.categories ?? [],
      });
      if (!res.data.user.email_verified_at) {
        warningSnackbar("Verify your email", {
          action: (snackbarId) => (
            <Button
              onClick={() => {
                post("/api/email/verification-notification");
                closeSnackbar(snackbarId);
              }}
            >
              resend verification
            </Button>
          ),
        });
      }
    },
    onError: (e: any) => {
      errorSnackbar(e.message);
      setAuth({
        isLoggedIn: false,
        data: null,
        count: {},
        categories: [],
      });
      localStorage.clear();
    },
  });

  useEffect(() => {
    const bearerToken = getBearerToken();
    if (!auth.isLoggedIn && bearerToken) {
      setAuth({
        isLoggedIn: true,
        data: null,
        count: {},
        categories: [],
      });
    }
  }, [auth.isLoggedIn]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
