import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { ForgotPasswordPage } from "./components/pages/ForgotPasswordPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ScreeningPage } from "./components/pages/ScreeningPage";
import { ResultPage } from "./components/pages/ResultPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { NotFoundPage } from "./components/pages/NotFoundPage";
import { Navigate } from "react-router";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { AdminUsersPage } from "./components/pages/AdminUsersPage";
import { AdminScreeningsPage } from "./components/pages/AdminScreeningsPage";
import { VerifyEmailPage } from "./components/pages/VerifyEmailPage";
import { ResetPasswordPage } from "./components/pages/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        path: "forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "verify-email",
        Component: VerifyEmailPage,
      },
      {
        path: "reset-password",
        Component: ResetPasswordPage,
      },
      {
        path: "app",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: "dashboard",
            Component: DashboardPage,
          },
          {
            path: "screening",
            Component: ScreeningPage,
          },
          {
            path: "result",
            Component: ResultPage,
          },
          {
            path: "history",
            Component: HistoryPage,
          },
          {
            path: "profile",
            Component: ProfilePage,
          },
        ],
      },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            Component: AdminDashboardPage,
          },
          {
            path: "users",
            Component: AdminUsersPage,
          },
          {
            path: "screenings",
            Component: AdminScreeningsPage,
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);