import React, { useState, useEffect } from "react";
import useCurrentUser from "../../hooks/currentUser.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./comment.jsx";
import "../../style/components/commentsSection.css";

export default function CommentsSection({ postId }) {
  const { user } = useCurrentUser();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await axios.get(`https://bloging-website-backend-xi.vercel.app/api/comment/getPostComments/${postId}`);
        if (res.status === 200) setComments(res.data);
      } catch (err) {
        console.error("Error loading comments:", err);
        setErrorMessage("Failed to load comments");
      }
    };
    loadComments();
  }, [postId]);

  if (!user) {
    return (
      <div className="comment-box-wrapper">
        <p className="comment-signin-message">You must be signed in to comment</p>
        <Link to="/signin" className="comment-signin-link">Sign In</Link>
      </div>
    );
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!commentText.trim()) {
      setErrorMessage("Comment cannot be empty");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://bloging-website-backend-xi.vercel.app/api/comment/create",
        { content: commentText, postId, userId: user.id },
        { withCredentials: true }
      );
      if (res.status === 201) {
        const newComment = {
          _id: res.data._id,                       // from backend
          content: res.data.content || commentText,
          createdAt: res.data.createdAt || new Date().toISOString(),
          userId: user.id,
          numberOfLikes: 0,
          likes: [],                               // important!
          userData: {
            userName: user.userName,
            profilePicture: user.profilePicture,
          },
        };

        setComments(prev => [newComment, ...prev]);
        setCommentText("");
        setSuccessMessage("Comment added successfully!");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setErrorMessage("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async commentId => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setComments(prev =>
      prev.map(c => {
        if (c._id !== commentId) return c;
        const alreadyLiked = c.likes?.some(uid => uid.toString() === user.id);
        const newLikes = alreadyLiked ? c.likes.filter(uid => uid.toString() !== user.id) : [...(c.likes || []), user.id];
        return { ...c, likes: newLikes, numberOfLikes: alreadyLiked ? c.numberOfLikes - 1 : c.numberOfLikes + 1 };
      })
    );
    try {
      await axios.put(`https://bloging-website-backend-xi.vercel.app/api/comment/likeComment/${commentId}`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map(c => (c._id === comment._id ? { ...c, content: editedContent } : c)));
  };

  const handleDelete = async commentId => {
    try {
      if (!user) {
        navigate("/signin");
        return;
      }
      const res = await axios.delete(`https://bloging-website-backend-xi.vercel.app/api/comment/deleteComment/${commentId}`, { withCredentials: true });
      if (res.status === 200) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <span className="comment-signed-in-text">Signed in as:</span>
        <img src={user.profilePicture} alt="avatar" className="comment-user-avatar" />
        <Link to={`/userDashboard/${user.id}`} className="comment-user-link">@{user.userName}</Link>
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          className="comment-textarea"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <div className="comment-footer">
          <span className="comment-char-count">{commentText.length}/300</span>
          <button type="submit" disabled={submitting} className="comment-submit-btn">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        {errorMessage && <div style={{ color: "red", fontSize: 14 }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: "limegreen", fontSize: 14 }}>{successMessage}</div>}
      </form>
      <div style={{ marginTop: 20 }}>
        {comments.length > 0 ? comments.map(c => (
          <Comment
            key={c._id}
            comment={c}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )) : <p className="comment-empty">No comments yet!</p>}
      </div>
    </div>
  );
}
