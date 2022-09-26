import useAlerter from "@/hooks/useAlerter";
import { AuthAttributes } from "@/interfaces/AuthAttributes";
import React, { createContext, useEffect, useState } from "react";
import { get } from "@/services/ApiService";
import { getBearerToken } from "@/services/AuthService";

export const AuthContext = createContext<
  | [
      AuthAttributes | null,
      React.Dispatch<React.SetStateAction<AuthAttributes>> | null
    ]
>([null, null]);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { errorSnackbar } = useAlerter();
  const [auth, setAuth] = useState<AuthAttributes>({
    isLoggedIn: Boolean(getBearerToken()),
    data: null,
    count: {},
  });

  useEffect(() => {
    const bearerToken = getBearerToken();
    if (auth.isLoggedIn && !auth.data) {
      (async () => {
        try {
          const res = await get("/api/me");
          setAuth({
            isLoggedIn: true,
            data: res.data.user,
            count: res.data.users_count,
          });
        } catch (e: any) {
          errorSnackbar(e.message);
          setAuth({
            isLoggedIn: false,
            data: null,
            count: {},
          });
          localStorage.clear();
        }
      })();
    } else if (bearerToken) {
      setAuth({
        isLoggedIn: true,
        data: null,
        count: {},
      });
    }
  }, [auth.isLoggedIn, errorSnackbar]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
