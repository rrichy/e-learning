import useAuth from "@/hooks/useAuth";
import React, { useMemo } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  To,
  useRoutes,
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Public from "./Public";
import { MembershipType } from "@/enums/membershipTypes";
import Register from "./Register";
import MyPage from "./MyPage";
import ChangePlan from "./ChangePlan";
import ChangePassword from "./ChangePassword";
import Inquiries from "./Inquiries";
import Header from "../organisms/Header";
import CourseManagement from "./CourseManagement";
import CourseManagementAddEdit from "./CourseManagement/CourseManagementAddEdit";
import ComprehensionTestAdd from "./CourseManagement/ComprehensionTestAdd";
import CourseDetail from "./CourseManagement/CourseDetail";
import ConditionalMail from "./CourseManagement/ConditionalMail";
import CourseDetailCorrection from "./CourseManagement/CourseDetailCorrection";
import AccountManagement from "./AccountManagement";
import AccountManagementAddEdit from "./AccountManagement/AccountManagementAddEdit";
import AccountManagementDetails from "./AccountManagement/AccountManagementDetails";
import CategoryManagement from "./CategoryManagement";
import AffiliationsDepartments from "./AffiliationsDepartments";
import Signature from "./Signature";
import NoticeManagement from "./NoticeManagement";
import NoticeManagementAddEdit from "./NoticeManagement/NoticeManagementAddEdit";
import OrganizeMail from "./OrganizeMail";
import Unsubscribe from "./Unsubscribe";
import UnsubscribeReason from "./Unsubscribe/UnsubscribeReason";
import UnsubscribeMessage from "./Unsubscribe/UnsubscribeMessage";
import Contact from "./Contact";
import Sidebar from "../organisms/Sidebar";
import { Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import Footer from "../molecules/Footer";
import pageGlobalStyle from "./indexStyle";
import StudentCourseDetail from "./Student/StudentCourseDetail";
import CourseHistory from "./Student/CourseHistory";
import StudentChapterDisplay from "./Student/StudentChapterDisplay";
import TestDetailsDisplay from "../organisms/Student/TestDetailsDisplay";
import TestAnswerScreen from "../organisms/Student/TestAnswerScreen";
import TestResult from "../organisms/Student/TestResult";
import StudentProfile from "./StudentProfile";

const { trial, individual, corporate, admin, guest } = MembershipType;
const registered = [trial, individual, corporate, admin];

export default function Pages() {
  const routes = useRoutes([
    {
      path: "/login",
      element: (
        <GuessPage to="/home">
          <Login />
        </GuessPage>
      ),
    },
    {
      path: "/register",
      element: (
        <GuessPage to="/home">
          <Register />
        </GuessPage>
      ),
    },
    {
      path: "/home",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/my-page",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <MyPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/change-plan",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <ChangePlan />
        </PrivateRoute>
      ),
    },
    {
      path: "/change-password",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <ChangePassword />
        </PrivateRoute>
      ),
    },
    {
      path: "/inquiries",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <Contact />
        </PrivateRoute>
      ),
    },
    {
      path: "/course-management",
      element: (
        <PrivateRoute membershipTypes={[admin, corporate]}>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <CourseManagement />,
        },
        {
          path: "create",
          element: <CourseManagementAddEdit />,
        },
        {
          path: ":courseId/edit",
          element: <CourseManagementAddEdit />,
        },
      ],
    },
    {
      path: "/course-management/create/comprehension-test",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <ComprehensionTestAdd />
        </PrivateRoute>
      ),
    },
    {
      path: "/course-management/details/:courseId",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <CourseDetail />
        </PrivateRoute>
      ),
    },
    {
      path: "/course-management/details/:courseId/conditional-mail",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <ConditionalMail />
        </PrivateRoute>
      ),
    },
    {
      path: "/course-management/details/detail-correction",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <CourseDetailCorrection />
        </PrivateRoute>
      ),
    },
    {
      path: "/account-management",
      element: (
        <PrivateRoute membershipTypes={[admin, corporate]}>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <AccountManagement />,
        },
        {
          path: "create",
          element: <AccountManagementAddEdit />,
        },
        {
          path: ":accountId/edit",
          element: <AccountManagementAddEdit />,
        },
        {
          path: ":accountId/details",
          element: <AccountManagementDetails />,
        },
      ],
    },
    {
      path: "/category-management",
      element: (
        <PrivateRoute membershipTypes={[admin, corporate]}>
          <CategoryManagement />
        </PrivateRoute>
      ),
    },
    {
      path: "/affiliations-departments-management",
      element: (
        <PrivateRoute membershipTypes={[admin]}>
          <AffiliationsDepartments />
        </PrivateRoute>
      ),
    },
    {
      path: "/departments-management",
      element: (
        <PrivateRoute membershipTypes={[corporate]}>
          <AffiliationsDepartments />
        </PrivateRoute>
      ),
    },
    {
      path: "/signature-management",
      element: (
        <PrivateRoute membershipTypes={[admin]}>
          <Signature />
        </PrivateRoute>
      ),
    },
    {
      path: "/organize-mail-management",
      element: (
        <PrivateRoute membershipTypes={[admin, corporate]}>
          <OrganizeMail />
        </PrivateRoute>
      ),
    },
    {
      path: "/notice-management",
      element: (
        <PrivateRoute membershipTypes={[admin, corporate]}>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <NoticeManagement />,
        },
        {
          path: "create",
          element: <NoticeManagementAddEdit />,
        },
        {
          path: ":noticeId/edit",
          element: <NoticeManagementAddEdit />,
        },
      ],
    },
    {
      path: "/contact",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <Contact />
        </PrivateRoute>
      ),
    },
    {
      path: "/unsubscribe",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Unsubscribe />,
        },
        {
          path: "reason",
          element: <UnsubscribeReason />,
        },
        {
          path: "message",
          element: <UnsubscribeMessage />,
        },
      ],
    },
    {
      path: "/course/:courseId",
      element: (
        <PrivateRoute membershipTypes={[individual]}>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <StudentCourseDetail />,
        },
        {
          path: "course-history",
          element: <CourseHistory />,
        },
        {
          path: "chapter/:chapterId",
          element: <StudentChapterDisplay />,
          children: [
            {
              // not yet implemented
              path: "lecture",
              element: <Home />,
            },
            {
              path: ":testType", // chapter-test | comprehension-test
              element: <TestDetailsDisplay />,
            },
            {
              path: ":testType/result",
              element: <TestResult />,
            },
            {
              path: ":testType/:itemNumber",
              element: <TestAnswerScreen />,
            },
          ],
        },
      ],
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute membershipTypes={registered}>
          <StudentProfile />
        </PrivateRoute>
      ),
    },
    {
      path: "/*",
      element: <Navigate to="/home" />,
    },
  ]);

  return routes;
}

// Accessible to every user unless restricted is true, where a page is
// exclusive to only those that are not logged in
// restricted === true ? "register, login, sign in" not accessible to logged in user
const GuessPage = ({
  children,
  to = "/",
}: {
  children: React.ReactElement;
  to?: To;
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={to} /> : children;
};

const PrivateRoute = ({
  children,
  membershipTypes = registered,
  to = "/login",
}: {
  children: React.ReactElement;
  membershipTypes?: number[];
  to?: To;
}) => {
  const theme = useTheme();
  const screenIsMd = useMediaQuery(theme.breakpoints.up("md"));
  const { isAuthenticated, membershipTypeId } = useAuth();

  const isAuthorized = useMemo(() => {
    if (membershipTypeId)
      return membershipTypes.includes(membershipTypeId || guest);
    else return true;
  }, [membershipTypeId, membershipTypes]);

  const useDarkColorScheme = useMemo(
    () => [admin, corporate].includes(membershipTypeId || guest),
    [membershipTypeId]
  );

  return isAuthenticated && isAuthorized ? (
    <Stack minHeight="100vh" justifyContent="space-between">
      <Header showMenu={!screenIsMd} useDarkColorScheme={useDarkColorScheme} />
      <Stack direction="row" flex={1}>
        {screenIsMd && <Sidebar useDarkColorScheme={useDarkColorScheme} />}
        <Container sx={pageGlobalStyle}>{children}</Container>
      </Stack>
      <Footer />
    </Stack>
  ) : (
    <Navigate to={to} />
  );
};
