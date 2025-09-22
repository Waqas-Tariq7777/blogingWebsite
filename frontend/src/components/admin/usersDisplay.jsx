import React, { useState, useEffect } from "react";
import "../../style/components/post.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import useCurrentUser from "../../hooks/currentUser";

export default function UsersDisplay() {
  const { id } = useParams();
  const { user } = useCurrentUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `https://bloging-website-backend-xi.vercel.app/api/admin/getUsers`,
          { withCredentials: true }
        );
        console.log("Users API response:", res.data);
        const fetched = Array.isArray(res.data.data) ? res.data.data : [];
        setUsers(fetched);
        if (fetched.length < 9) setShowMore(false);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) fetchUsers();
  }, [user]);

  // Show more
  const handleShowMore = async () => {
    const startIndex = users.length;
    setLoadingMore(true);
    try {
      const res = await axios.get(
        `https://bloging-website-backend-xi.vercel.app/api/admin/getUsers?startIndex=${startIndex}`,
        { withCredentials: true }
      );
      const newUsers = Array.isArray(res.data.data) ? res.data.data : [];
      setUsers((prev) => [...prev, ...newUsers]);
      if (newUsers.length < 9) setShowMore(false);
    } catch (err) {
      console.error("Error loading more users:", err);
    } finally {
      setLoadingMore(false);
    }
  };

// inside UsersDisplay.jsx
const handleDelete = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    await axios.delete(
      `https://bloging-website-backend-xi.vercel.app/api/admin/deleteUsers/${userId}`,
      { withCredentials: true }
    );

    // remove from state
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("❌ Failed to delete user");
  }
};


  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading user info…</p>;
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="post-container">

      <div className="table-wrapper">
        {users.length === 0 ? (
          <p style={{ textAlign: "center" }}>No users found</p>
        ) : (
          <table className="post-table">
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Username</th>
                <th>User Image</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.userName}</td>
                  <td>
                    <img
                      src={u.profilePicture || "https://via.placeholder.com/80"}
                      alt={u.userName}
                      className="post-image"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? "✔️" : "❌"}</td>
                  <td className="action-buttons">
                    <button
                      className="delete-btn-post"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showMore && users.length > 0 && (
          <button onClick={handleShowMore} className="show-more-btn">
            {loadingMore ? <div className="spinner small"></div> : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
