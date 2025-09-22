import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/currentUser.jsx";
import "../../style/components/dashboardComp.css";
import { useParams } from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastUsers, setLastUsers] = useState(0);
  const [lastPosts, setLastPosts] = useState(0);
  const [lastComments, setLastComments] = useState(0);
  const [loading, setLoading] = useState(false);

    const { id } = useParams();
  const { user } = useCurrentUser();

  // === fetch helpers ===
  const fetchData = async (endpoint, setter, totalSetter, lastSetter) => {
    try {
      setLoading(true);
      const res = await axios.get(endpoint, { withCredentials: true });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setter(data);
      totalSetter(res.data.totalUsers || res.data.totalPosts || res.data.totalComments || 0);
      lastSetter(res.data.lastMonthUsers || res.data.lastMonthPosts || res.data.lastMonthComments || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData("https://bloging-website-backend-xi.vercel.app/api/admin/getUsers?limit=5", setUsers, setTotalUsers, setLastUsers);
      fetchData("https://bloging-website-backend-xi.vercel.app/api/admin/getPost?limit=5", setPosts, setTotalPosts, setLastPosts);
      fetchData("https://bloging-website-backend-xi.vercel.app/api/comment/getComments?limit=5", setComments, setTotalComments, setLastComments);
    }
  }, [user]);

   if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="dash-wrap">
      {/* ===== TOP TOTAL CARDS ===== */}
      <div className="dash-totals">
        <div className="total-card users">
          <h4>Users</h4>
          <p className="big">{totalUsers}</p>
          <span>Last month: {lastUsers}</span>
        </div>
        <div className="total-card posts">
          <h4>Posts</h4>
          <p className="big">{totalPosts}</p>
          <span>Last month: {lastPosts}</span>
        </div>
        <div className="total-card comments">
          <h4>Comments</h4>
          <p className="big">{totalComments}</p>
          <span>Last month: {lastComments}</span>
        </div>
      </div>

      {/* ===== SECOND ROW: USERS + POSTS ===== */}
      <div className="dash-row duo">
        {/* Users */}
        <div className="dash-box users-box">
          <div className="box-header">
            <h3>Recent Users</h3>
            <Link to={`/adminDashboard/${id}/usersDisplay`} className="btn-view">All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><img src={u.profilePicture} alt="" className="thumb" /></td>
                  <td>{u.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Posts */}
        <div className="dash-box posts-box">
          <div className="box-header">
            <h3>Recent Posts</h3>
            <Link to={`/adminDashboard/${id}/posts`} className="btn-view">All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt="" className="thumb" /></td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== THIRD ROW: COMMENTS ===== */}
      <div className="dash-row single">
        <div className="dash-box comments-box">
          <div className="box-header">
            <h3>Recent Comments</h3>
            <Link to={`/adminDashboard/${id}/comments`} className="btn-view">All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Comment</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c._id}>
                  <td className="truncate">{c.content}</td>
                  <td>{c.numberOfLikes ?? c.likes?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <div className="loading-msg">Loading...</div>}
    </div>
  );
}
