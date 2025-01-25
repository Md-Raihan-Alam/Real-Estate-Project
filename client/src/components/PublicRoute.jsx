import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = () => {
  const currentUser = useSelector((state) => state.user?.currentUser);

  // If logged in, redirect to the home page or another route
  return currentUser ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
