import React from "react";
import { server } from '@/utils/axios';

const adminUrl = "/admin"
const handleAdmin = ()=>{
    server.get('/member/previllege')
        .then(response => {
            if (response.data === true) {
                // 서버 응답이 true일 경우 admin 페이지로 리디렉션
                window.location.href = adminUrl;
            } else {
                // 권한이 없거나 다른 응답일 경우 적절한 처리를 할 수 있습니다.
                alert('Access denied or invalid response');
            }
        })
        .catch(error => {
            // 요청 실패 처리
            console.error('Error fetching privilege information:', error);
        });
}

export const Dashboard = () => {
  return (
    <>
      <button className = "bg-white	" onClick={handleAdmin}>관리자</button>
    </>
  );
};
