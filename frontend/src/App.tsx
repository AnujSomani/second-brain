import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { LandingLayout } from "./layouts/LandingLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrainPage } from "./pages/BrainPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { LandingPage } from "./pages/Landing";
import { SigninPage } from "./pages/SigninPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { SharedBrainPage } from "./pages/SharedBrainPage";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route element={<LandingLayout />}>
          <Route path="/landing" element={<LandingPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>
        {/* Public shared brain route - no authentication required */}
        <Route path="/shared/:shareLink" element={<SharedBrainPage />} />
        <Route
          path="/brain"
          element={
            <ProtectedRoute>
              <BrainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
