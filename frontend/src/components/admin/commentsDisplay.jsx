import React, { useState, useEffect } from "react";
import "../../style/components/post.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import useCurrentUser from "../../hooks/currentUser";

export default function CommentsDisplay() {
  const { id } = useParams(); // optional if you need postId
  const { user } = useCurrentUser();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch initial comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/comment/getComments`,
          { withCredentials: true }
        );
        const fetched = Array.isArray(res.data.data) ? res.data.data : [];
        setComments(fetched);
        if (fetched.length < 9) setShowMore(false);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchComments();
    }
  }, [user]);

  // Load more comments
  const handleShowMore = async () => {
    const startIndex = comments.length;
    setLoadingMore(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/comment/getComments?startIndex=${startIndex}`,
        { withCredentials: true }
      );
      const newComments = Array.isArray(res.data.data) ? res.data.data : [];
      setComments((prev) => [...prev, ...newComments]);
      if (newComments.length < 9) setShowMore(false);
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Delete a comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this Comment?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/comment/deleteComment/${commentId}`,
        { withCredentials: true }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting Comment:", error);
      alert("❌ Failed to delete Comment");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return <p style={{ textAlign: "center" }}>No comments found</p>;
  }

  return (
    <div className="post-container">

      <div className="table-wrapper">
        <table className="post-table">
          <thead>
            <tr>
              <th>Date Updated</th>
              <th>Comment Content</th>
              <th>Likes</th>
              <th>Post ID</th>
              <th>User ID</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c._id}>
                <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                <td>{c.content}</td>
                <td>
                  {typeof c.NumberOfLikes !== "undefined"
                    ? c.NumberOfLikes
                    : c.likes?.length || 0}
                </td>
                <td>{c.postId}</td>
                <td>{c.userId || c.userID}</td>
                <td className="action-buttons">
                  <button
                    className="delete-btn-post"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showMore && comments.length > 0 && (
          <button onClick={handleShowMore} className="show-more-btn">
            {loadingMore ? <div className="spinner small"></div> : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
