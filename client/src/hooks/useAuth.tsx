import { MembershipType } from "@/enums/membershipTypes";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { AuthContext } from "@/providers/AuthContextProvider";
import { useContext } from "react";

function useAuth() {
  const [auth, setAuth] = useContext(AuthContext);

  const setAuthorized = () =>
    setAuth!({ isLoggedIn: true, data: null, count: {}, categories: [] });

  const setUnauthorized = () => {
    localStorage.clear();
    setAuth!({ isLoggedIn: false, data: null, count: {}, categories: [] });
  };

  const setAuthData = (data: UserAttributes) => setAuth!({ ...auth!, data });

  return {
    setAuthorized,
    setUnauthorized,
    setAuthData,
    isAuthenticated: auth?.isLoggedIn,
    authData: auth?.data,
    userCount: auth?.count,
    categories: auth?.categories,
    membershipTypeId: auth?.data?.membership_type_id || MembershipType.guest,
  };
}

export default useAuth;
