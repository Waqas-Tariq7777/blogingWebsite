// components/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "../../hooks/currentUser.jsx";
import { Spinner } from "react-bootstrap";
export default function ProtectedRoutes() {
  const { user, loading } = useCurrentUser();

  if (loading){
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
  return user ? <Outlet /> : <Navigate to="/signin" />;
}
