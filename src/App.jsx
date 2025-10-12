import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Users from './pages/Users';
import Leads from './pages/Leads';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="users" element={<Users />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="leads" element={<Leads />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
