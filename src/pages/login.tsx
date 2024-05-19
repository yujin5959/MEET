import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const rest_api_key=import.meta.env.VITE_REST_API_KEY; //REST API KEY
const redirect_uri = 'http://localhost:5173/auth/kakao/redirect' //Redirect URI
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

export const Login = ()=>
    {
        
        // oauth 요청 URL
        const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
        const handleLogin = ()=>{
            window.location.href = kakaoURL;
        }
        return(
        <>
        <button onClick={handleLogin}>카카오 로그인</button>
        </>
        );
    }

export const KakaoCode = () =>{
    const code = new URL(window.location.href).searchParams.get("code");
    const [token, setToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (code && !token) {
            console.log("use effect executed",code,token)
            const fetchToken = async () => {
                const postUrl = 'https://kauth.kakao.com/oauth/token';

                // URLSearchParams를 사용하여 데이터 인코딩
                const params = new URLSearchParams();
                params.append('grant_type', 'authorization_code');
                params.append('client_id', rest_api_key);
                params.append('redirect_uri', redirect_uri);
                params.append('code', code);
                params.append('client_secret', clientSecret);

                try {
                    const response = await axios.post(postUrl, params, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    console.log('Token received:', response.data);
                    setToken(response.data.access_token);

                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            };
            fetchToken();
        }
    }, [code, token]);

    useEffect(() => {
        if (token){
            console.log("trying to connect backend server...")
            const login = async () => {
                const url = 'http://127.0.0.1:8080/auth/login';
                const data = {
                    "accessToken" : "Bearer " + token
                }
                try {
                    const response = await axios.post(url, data);
                    localStorage.setItem("accessToken",response.data.data.grantType + " " + response.data.data.accessToken);
                    localStorage.setItem("refreshToken",response.data.data.refreshToken);
                    
                    navigate('/');

                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            }

            login();
        }


    }, [token]);


    return(
        <>
        </>
    );
}