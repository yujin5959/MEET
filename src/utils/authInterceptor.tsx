// src/utils/AuthInterceptor.tsx
import React, { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

interface AuthInterceptorProps {
  children?: ReactNode;
}

const AuthInterceptor: React.FC<AuthInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const accessingLoginPage = location.pathname.startsWith('/auth');

    if (!token && !accessingLoginPage) {
      console.log("redirect to login page")
      navigate('/auth/login', { replace: true, state: { from: location } });
    }
  }, [navigate, location]);

  return (
    <>
        {children || <Outlet />}
    </>
  );
};

export default AuthInterceptor;