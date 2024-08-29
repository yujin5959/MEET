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
    path: "/Unauthorized",
    element: <Pages.Unauthorized />,
  },
  {
    path: "/meet/list",
    element: <Pages.MeetList />,
  },
  {
    path: "/not-found",
    element: <Pages.NotFound />,
  },
  {
    path: "meet/edit",
    element: <Pages.MeetEdit />,
  },
  {
    path: "/meet/vote",
    element: <Pages.VotePage />,
  },
  {
    path: "/meet",
    element: <Pages.MeetDetail />,
  }
];

export default router;
