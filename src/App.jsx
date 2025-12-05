// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Projects from "./pages/Projects";
import HandOverProperties from "./pages/PropertiesHandOver";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import BuyDevelopment from "./pages/BuyDevelopment";
import ContentManager from "./pages/ContentManager";
import Agents from "./pages/Agents";
import Builders from "./pages/Builders";

import "./App.css";
import PostProperty from "./pages/PostProperty";
import PostProject from "./pages/PostProject";
import Blogs from "./pages/blogs";

// ✅ Protect admin routes
function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLogin");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* These routes will render inside <Layout /> */}
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="projects" element={<Projects />} />
            <Route path="handOverProperties" element={<HandOverProperties />} />
            <Route path="users"  element={<Users key={location?.state?.role || "default"} />} />
            <Route path="agents" element={<Agents />} />
            <Route path="builders" element={<Builders />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="leads" element={<Leads />} />
            <Route path="blog" element={<Blogs />} />
            <Route path="buy-development" element={<BuyDevelopment />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/post-property" element={<PostProperty />} />
            <Route path="/post-projects" element={<PostProject />} />

          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
