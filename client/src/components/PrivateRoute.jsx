import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  // Safely access currentUser from the Redux state
  const currentUser = useSelector((state) => state.user?.currentUser);

  // Debugging log to check the current user
  console.log("PrivateRoute - currentUser:", currentUser);

  // Check if the user is authenticated and render accordingly
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
