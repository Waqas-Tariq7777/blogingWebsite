import React from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/components/sidemenu.css";
import useCurrentUser from "../../hooks/currentUser";
import { BsFillFilePostFill } from "react-icons/bs";
import "../../style/components/adminSideMenu.css"
// adminSideMenu.jsx
import {
  BsPeopleFill,
  BsChatDotsFill,
  BsPieChartFill,
  BsArrowRight,
} from "react-icons/bs";

export default function AdminSideMenu() {
  const { user } = useCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://bloging-website-backend-xi.vercel.app/api/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {user && (
          <div className="userProfile-profile">
            <FaUser className="sidebar-icon" />
            <Link to={`/adminDashboard/${id}`} style={{ textDecoration: "none" }}>
              <span className="sidebar-text" style={{ marginRight: "-15px" }}>
                Profile
              </span>
            </Link>
            <span className="user-badge">Admin</span>
          </div>
        )}
      </div>

      <hr />

      <Link to={`/adminDashboard/${id}/dashboardComp`}  className="sidebar-item">
        <BsPieChartFill className="sidebar-icon" />
        <span>Dashboard</span>
      </Link>

      <Link to={`/adminDashboard/${id}/posts`} className="sidebar-item">
        <BsFillFilePostFill className="sidebar-icon" />
        <span>Posts</span>
      </Link>

      <Link to={`/adminDashboard/${id}/usersDisplay`} className="sidebar-item">
        <BsPeopleFill className="sidebar-icon" />
        <span>Users</span>
      </Link>


      <Link to={`/adminDashboard/${id}/comments`} className="sidebar-item">
        <BsChatDotsFill className="sidebar-icon" />
        <span>Comments</span>
      </Link>


      <div className="sidebar-link" onClick={handleLogout} style={{ marginTop: "8px" }}>
        <HiOutlineLogout />
        <span>Sign Out</span>
      </div>
    </aside>
  );
}
