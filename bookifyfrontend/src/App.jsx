import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import CreateRoomPage from './pages/CreateRoomPage';
import RequireAuth from './components/RequireAuth';
import PersistentLogin from './components/PersistentLogin';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import RoomViewPage from './pages/RoomViewPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import HostDashboard from './pages/HostDashboard';
import ViewUserPage from './pages/ViewUserPage';
import MessageDashboard from './pages/MessageDashboard';
import UpdateProfilePage from './pages/UpdateProfilePage';
import Layout from './components/Layout';
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SearchPage from "./pages/SearchPage";

export const Admin = "admin";
export const Host = "host";
export const Tenant = "tenant";
export const InactiveHost = "inactive-host";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* we want to protect these routes */}
        <Route element={<PersistentLogin />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="room/:roomID" element={<RoomViewPage />} />
          <Route path="user/:username" element={<ViewUserPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/" element={<HomePage />} />

          <Route element={<RequireAuth allowedRoles={[Admin]} />}>
            <Route path="admin" element={<AdminPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[Host, InactiveHost]} />}>
            <Route path="host" element={<HostDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[Host]} />}>
            <Route path="create" element={<CreateRoomPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={
            [Host, InactiveHost, Tenant, Admin]} />}>
            <Route path ="profile" element={<ProfilePage />} />
            <Route path ="updateProfile" element={<UpdateProfilePage />} />
            <Route path="messages" element={<MessageDashboard />} />
            <Route path="changePassword" element={<ChangePasswordPage/>} />
          </Route>
        </Route>

        {/* Page not found */}
        <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
  );
}

export default App;