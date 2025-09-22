import React from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import "../../style/components/sidemenu.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function SideMenu() {

  const navigate = useNavigate()
   const handleSubmit = async () => {
        try {
            await axios.post(
                "https://bloging-website-backend-xi.vercel.app/api/user/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };
    
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="userProfile-profile">
        <FaUser className="sidebar-icon" />
           <span className="sidebar-text">Profile</span>
           <span className="user-badge">User</span>
        </div>
      </div>
      <hr />
      <div className="sidebar-link" onClick={handleSubmit} >
        <HiOutlineLogout />
        <span>Sign Out</span>
      </div>
    </aside>
  );
}
