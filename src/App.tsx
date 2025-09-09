"use client"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { store, persistor } from "./store"
import { AuthGuard } from "./components/Auth/AuthGuard"
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { useTheme } from "./utils/theme"
import { Layout } from "./components/Layout/Layout"

// Pages
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Devices from "./pages/Devices"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"
import StatusCheck from "./pages/StatusCheck"
import Chat from "./pages/Chat"
import Analytics from "./pages/Analytics"
import Assistant from "./pages/Assistant"
import EnergySavings from "./pages/EnergySavings"
import EnergyUsage from "./pages/EnergyUsage"
import Monitoring from "./pages/Monitoring"
import Security from "./pages/Security"
import SmartDevices from "./pages/SmartDevices"
import Notifications from "./pages/Notifications"

function AppContent() {
  useTheme()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/devices"
          element={
            <AuthGuard>
              <Layout>
                <Devices />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/status-check"
          element={
            <AuthGuard>
              <Layout>
                <StatusCheck />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <Layout>
                <Chat />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Layout>
                <Settings />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <AuthGuard>
              <Layout>
                <Analytics />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/assistant"
          element={
            <AuthGuard>
              <Layout>
                <Assistant />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/energy-savings"
          element={
            <AuthGuard>
              <Layout>
                <EnergySavings />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/energy-usage"
          element={
            <AuthGuard>
              <Layout>
                <EnergyUsage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/monitoring"
          element={
            <AuthGuard>
              <Layout>
                <Monitoring />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/security"
          element={
            <AuthGuard>
              <Layout>
                <Security />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/smart-devices"
          element={
            <AuthGuard>
              <Layout>
                <SmartDevices />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/notifications"
          element={
            <AuthGuard>
              <Layout>
                <Notifications />
              </Layout>
            </AuthGuard>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </BrowserRouter>
  )
}

const App = () => (
  <Provider store={store}>
    <PersistGate
      loading={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
      persistor={persistor}
    >
      <AppContent />
    </PersistGate>
  </Provider>
)

export default App
