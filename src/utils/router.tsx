import React from "react";
import { type RouteObject } from "react-router-dom";
import * as Pages from "@/pages";

const router: RouteObject[] = [
  {
    path: "/",
    element: <Pages.Dashboard />,
  },
  {
    path: "/admin",
    element: <Pages.Admin />,
  },
  {
    path: "/auth/login",
    element: <Pages.Login />,
  },
  {
    path: "/auth/kakao/redirect",
    element: <Pages.KakaoCode />,
  },
  {
    path: "/error",
    element: <Pages.Error />,
  },
];

export default router;
