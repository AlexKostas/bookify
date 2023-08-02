import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Admin from './components/Admin';
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

const ROLES = {
  'Admin': "admin",
  'Host': "host",
  'Tenant': "tenant",
  'InactiveHost': "inactive-host",
}

function App() {
    const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="room/:roomID" element={<RoomViewPage />} />
        <Route path="/" element={<Home />} />

        {/* we want to protect these routes */}
        <Route element={<PersistentLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>


          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Host, ROLES.Admin]} />}>
            <Route path="lounge" element={<Lounge />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={
            [ROLES.Host, ROLES.InactiveHost, ROLES.Tenant, ROLES.Admin]} />}>
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