import { MembershipType } from "@/enums/membershipTypes";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { AuthContext } from "@/providers/AuthContextProvider";
import { useContext } from "react";

function useAuth() {
  const [auth, setAuth] = useContext(AuthContext);

  const setAuthorized = () => setAuth!({ isLoggedIn: true, data: null, count: {} });

  const setUnauthorized = () => {
    localStorage.clear();
    setAuth!({ isLoggedIn: false, data: null, count: {} });
  };

  const setAuthData = (data: UserAttributes) => setAuth!({ ...auth!, data });

  return {
    setAuthorized,
    setUnauthorized,
    setAuthData,
    isAuthenticated: auth?.isLoggedIn,
    authData: auth?.data,
    userCount: auth?.count,
    membershipTypeId: auth?.data?.membership_type_id || MembershipType.guest
  };
}

export default useAuth;
