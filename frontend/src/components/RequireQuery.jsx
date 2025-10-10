import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";

export default function RequireQuery({ name = "id", redirectTo = "/?error=missing_id", children }) {
  const [params] = useSearchParams();
  const value = params.get(name);
  if (!value) return <Navigate to={redirectTo} replace />;
  return children;
}
