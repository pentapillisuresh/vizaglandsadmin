import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Leads from "./pages/Leads";
// import Payments from "./pages/Payments";
// import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import BuyDevelopment from "./pages/BuyDevelopment";
import ContentManager from "./pages/ContentManager";
import Agents from "./pages/Agents";
import Builders from "./pages/Builders"



import "./App.css";

// ✅ Protect admin routes
function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="users" element={<Users />} />
            <Route path="agents" element={<Agents />} />
            <Route path="builders" element={<Builders />} />

            <Route path="schedule" element={<Schedule />} />
            <Route path="leads" element={<Leads />} />
            <Route path="buy-development" element={<BuyDevelopment />} />
            <Route path="content" element={<ContentManager />} />
            {/* <Route path="payments" element={<Payments />} /> */}
            {/* <Route path="reports" element={<Reports />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
