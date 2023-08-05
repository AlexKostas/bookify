import Home from './components/Home';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistentLogin from './components/PersistentLogin';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import useAuth from './hooks/useAuth';
import RoomViewPage from './pages/RoomViewPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import HostDashboard from './pages/HostDashboard';
import ViewUserPage from './pages/ViewUserPage';

export const Admin = "admin";
export const Host = "host";
export const Tenant = "tenant";
export const InactiveHost = "inactive-host";

function App() {
    const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* we want to protect these routes */}
        <Route element={<PersistentLogin />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="room/:roomID" element={<RoomViewPage />} />
          <Route path="user/:username" element={<ViewUserPage />} />
          <Route path="/" element={<Home />} />

          <Route element={<RequireAuth allowedRoles={[Admin]} />}>
            <Route path="admin" element={<AdminPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[Host, InactiveHost]} />}>
            <Route path="host" element={<HostDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={
            [Host, InactiveHost, Tenant, Admin]} />}>
            <Route path ="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
        </Route>
    </Routes>
  );
}

export default App;