// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import router from "./utils/router";
import React from "react";
import AuthInterceptor from "./utils/authInterceptor";
import NotFound from "./pages/Exceptions/notFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthInterceptor />}>
          {router.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} /> // 404 경로 추가
      </Routes>
    </BrowserRouter>
  );
}

export default App;
