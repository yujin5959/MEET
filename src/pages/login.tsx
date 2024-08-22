import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "@/utils/axios";

const rest_api_key = import.meta.env.VITE_REST_API_KEY; //REST API KEY
const redirect_uri = "http://localhost:5173/auth/kakao/redirect"; //Redirect URI
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

export const Login = () => {
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&scope=friends,account_email,profile_nickname,talk_message`;
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#242424" }}
    >
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md mx-4"
        style={{ backgroundColor: "#3f3f3f" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          로그인
        </h2>
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          <i className="fa-solid fa-comment mr-2"></i>
          카카오 로그인
        </button>
      </div>
    </div>
  );
};

export const KakaoCode = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const [token, setToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (code && !token) {
      console.log("use effect executed", code, token);
      const fetchToken = async () => {
        const postUrl = "https://kauth.kakao.com/oauth/token";

        // URLSearchParams를 사용하여 데이터 인코딩
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", rest_api_key);
        params.append("redirect_uri", redirect_uri);
        params.append("code", code);
        params.append(
          "scope",
          "friends,account_email,profile_nickname,talk_message"
        );
        params.append("client_secret", clientSecret);

        try {
          const response = await axios.post(postUrl, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          console.log("Token received:", response.data);
          setToken(response.data.access_token);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };
      fetchToken();
    }
  }, [code, token]);

  useEffect(() => {
    if (token) {
      console.log("trying to connect backend server...");
      server.post("/auth/login", {
        data: {
          accessToken: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.setItem(
          "accessToken",
          response.data.grantType + " " + response.data.accessToken
        );
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // 사용자 권한 확인
        return server.get("/member/previllege");
      })
      .then((privilegeResponse) => {
        const privilege = privilegeResponse.data.previllege;

          if (privilege === "admin" || privilege === "accepted") {
            navigate("/");
          }
      })
      .catch ((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        }
      });
    }
  }, [token, navigate]);

  return <></>;
};
