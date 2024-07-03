// src/utils/AuthInterceptor.tsx
import React, { ReactNode, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

interface AuthInterceptorProps {
  children?: ReactNode;
}

const AuthInterceptor: React.FC<AuthInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const accessingLoginPage = location.pathname.startsWith("/auth");

    if (!token && !accessingLoginPage) {
      console.log("redirect to login page");
      navigate("/auth/login", { replace: true, state: { from: location } });
    } else if (token && !accessingLoginPage) {
      const fetchPrivilege = async () => {
        try {
          const privilegeUrl = "http://54.180.29.36/member/previllege";
          const privilegeResponse = await axios.get(privilegeUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const privilege = privilegeResponse.data.data.previllege;

          if (privilege === "admin" || privilege === "accepted") {
            navigate("/", { replace: true });
          } else {
            navigate("/Unauthorized", { replace: true });
          }
        } catch (error) {
          console.error("권한 확인 중 오류 발생:", error);
          navigate("/Unauthorized", { replace: true });
        }
      };

      fetchPrivilege();
    }
  }, [navigate, location]);

  return <>{children || <Outlet />}</>;
};

export default AuthInterceptor;
