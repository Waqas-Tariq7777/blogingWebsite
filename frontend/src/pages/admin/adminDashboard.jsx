import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import AdminSideMenu from "../../components/admin/adminSideMenu.jsx";
import NavbarUser from "../../components/user/navbar.jsx";
import Footer from "../../components/user/footer.jsx";
import AdminProfile from "../../components/admin/adminProfile.jsx";
import Post from "../../components/admin/post.jsx";
import CreatePost from "./createPost.jsx";
import PostView from "./postView.jsx";
import UsersDisplay from "../../components/admin/usersDisplay.jsx";
import CommentsDisplay from "../../components/admin/commentsDisplay.jsx";
import DashboardComp from "../../components/admin/dashboardComp.jsx";
export default function AdminDashboard() {
  const { id } = useParams();

  return (
    <div>
      <NavbarUser />
      <div className="dashboard">
        <div className="sidemun-dash">
          <AdminSideMenu />
        </div>

        <div className="profile-dash">
          <Routes>
            <Route index element={<AdminProfile />} />
             <Route path="posts" element={<Post />} />
             <Route path="createPost" element={<CreatePost />} />
             <Route path="usersDisplay" element={<UsersDisplay />} />
             <Route path="comments" element={<CommentsDisplay />} />
             <Route path="dashboardComp" element={<DashboardComp />} />
            <Route path="*" element={<Navigate to="." />} />
          </Routes>
        </div>
      </div>

      <div className="app-footer">
        <Footer />
      </div>
    </div>
  );
}
