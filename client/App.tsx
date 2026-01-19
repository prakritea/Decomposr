import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PMDashboard from "./pages/PMDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import Rooms from "./pages/Rooms";
import ProjectRoom from "./pages/ProjectRoom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

// Role-based dashboard redirect
function DashboardRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "pm") {
    return <Navigate to="/pm-dashboard" replace />;
  }

  return <Navigate to="/employee-dashboard" replace />;
}

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <RoomsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <Landing />
                    </AppLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <AppLayout>
                      <DashboardRedirect />
                    </AppLayout>
                  }
                />
                <Route
                  path="/docs"
                  element={
                    <AppLayout>
                      <Docs />
                    </AppLayout>
                  }
                />
                <Route
                  path="/pm-dashboard"
                  element={
                    <AppLayout>
                      <PMDashboard />
                    </AppLayout>
                  }
                />
                <Route
                  path="/employee-dashboard"
                  element={
                    <AppLayout>
                      <EmployeeDashboard />
                    </AppLayout>
                  }
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/rooms"
                  element={
                    <AppLayout>
                      <Rooms />
                    </AppLayout>
                  }
                />
                <Route
                  path="/rooms/:roomId"
                  element={
                    <AppLayout>
                      <ProjectRoom />
                    </AppLayout>
                  }
                />
                <Route
                  path="/saved-projects"
                  element={
                    <AppLayout>
                      <PlaceholderPage title="Saved Projects" />
                    </AppLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AppLayout>
                      <PlaceholderPage title="Settings" />
                    </AppLayout>
                  }
                />
                <Route
                  path="/signin"
                  element={
                    <AppLayout>
                      <PlaceholderPage title="Sign In" />
                    </AppLayout>
                  }
                />
                <Route
                  path="*"
                  element={
                    <AppLayout>
                      <NotFound />
                    </AppLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RoomsProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="text-center max-w-md relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-white/60 mb-8">
          This page is coming soon. Continue building with ArchitectAI to explore more features!
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default App;
