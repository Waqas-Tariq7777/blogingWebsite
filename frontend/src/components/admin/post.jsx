import React, { useState, useEffect } from "react";
import "../../style/components/post.css";
import { Link, useParams } from "react-router-dom";
import useCurrentUser from "../../hooks/currentUser";
import axios from "axios";

export default function Post() {
  const { user } = useCurrentUser();
  const { id } = useParams();
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axios.get(
          `https://bloging-website-backend-xi.vercel.app/api/admin/getPost?userId=${user?.id}`,
          { withCredentials: true }
        );

        const fetchedPosts = Array.isArray(result.data.data)
          ? result.data.data
          : [];

        setPost(fetchedPosts);
        if (fetchedPosts.length < 9) setShowMore(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) fetchPosts();
  }, [user]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    setLoadingMore(true);
    try {
      const result = await axios.get(
        `https://bloging-website-backend-xi.vercel.app/api/admin/getPost?userId=${user?.id}&startIndex=${startIndex}`,
        { withCredentials: true }
      );
      const newPosts = Array.isArray(result.data.data)
        ? result.data.data
        : [];
      setPost((prev) => [...prev, ...newPosts]);
      if (newPosts.length < 9) setShowMore(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ---- DELETE POST ----
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(
        `https://bloging-website-backend-xi.vercel.app/api/admin/deletePost/${postId}/${user?.id}`,
        { withCredentials: true }
      );
      setPost((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  // ---------------------

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
      <div className="post-header">
        <Link to={`/adminDashboard/${id}/createPost`}>
          <button className="add-post-btn">➕ Add Post</button>
        </Link>
      </div>

      <div className="table-wrapper">
        {posts.length === 0 ? (
          <p style={{ textAlign: "center" }}>No posts found</p>
        ) : (
          <table className="post-table">
            <thead>
              <tr>
                <th>Date Created</th>
                <th>Date Updated</th>
                <th>Post Image</th>
                <th>Post Title</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <img
                      src={post.image || "https://via.placeholder.com/100"}
                      alt={post.title}
                      className="post-image"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td><Link to={`/post/${post.slug}`} className="td-link">{post.title}</Link></td>
                  <td>{post.category}</td>
                  <td className="action-buttons">
                    <Link to={`/updatePost/${post._id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                  </td>
                  <td> <button
                      className="delete-btn-post"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showMore && (
          <button onClick={handleShowMore} className="show-more-btn">
            {loadingMore ? <div className="spinner small"></div> : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
