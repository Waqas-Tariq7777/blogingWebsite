// components/ProtectedAdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "../../hooks/currentUser.jsx";
import { Spinner } from "react-bootstrap";

export default function ProtectedAdminRoute() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "transparent",
        }}
      >
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  // If user is logged in AND role is admin → allow access
  if (user && user.isAdmin === true ) {
    return <Outlet />;
  }

  // Otherwise redirect (you can send them to /signin or /)
  return <Navigate to="/signin" replace />;
}
