import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

import type { PropsWithChildren } from "react";

interface ProtectedRouteProps extends PropsWithChildren {
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
