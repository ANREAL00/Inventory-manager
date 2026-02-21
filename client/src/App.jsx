import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateInventoryPage } from './pages/inventory/CreateInventoryPage';

const Home = () => <div>Home Page - Latest Inventories</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="inventories/new" element={<CreateInventoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
