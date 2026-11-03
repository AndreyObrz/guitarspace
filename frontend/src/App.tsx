import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FeedPage } from "@/pages/FeedPage";
import { TabsPage } from "@/pages/TabsPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { TopPage } from "@/pages/TopPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { WorkPage } from "@/pages/WorkPage";
import { CoursePage } from "@/pages/CoursePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Публичные роуты (без Header/Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Защищённые роуты (с Header/Sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <Box sx={{ minHeight: "100vh", bgcolor: "#0f0f10" }}>
              <Header />
              <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box component="main" sx={{ flex: 1, p: 3 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/feed" replace />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/tabs" element={<TabsPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/top" element={<TopPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/work/:id" element={<WorkPage />} />
                    <Route path="/course/:id" element={<CoursePage />} />
                    <Route path="*" element={<Navigate to="/feed" replace />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;