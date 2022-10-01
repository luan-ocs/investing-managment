import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from '../pages/Auth';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Main from '../layout/main';
import { ProtectedRoutes } from './ProtectedRoutes';
import Dashboard from '../pages/Dashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<Main />} path="/">
            <Route element={<Dashboard />} path="/Dashboard" />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
