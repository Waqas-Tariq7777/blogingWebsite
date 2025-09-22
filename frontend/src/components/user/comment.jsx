import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import "../../style/components/comment.css";
import useCurrentUser from "../../hooks/currentUser.jsx";
import axios from "axios";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState(null);
  const { user: currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    if (comment.userData) {
      setUser(comment.userData);
    } else {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/user/${comment.userId}`);
          if (res.ok) setUser(await res.json());
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [comment.userId, comment.userData]);

  const timeAgo = () => {
    const created = new Date(comment.createdAt);
    const diff = Math.floor((Date.now() - created.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://bloging-website-backend-xi.vercel.app/api/comment/editComment/${comment._id}`,
        { content: editedContent },
        { withCredentials: true }
      );
      if (res.status === 200) {
        onEdit(comment, editedContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  return (
    <div className="comment-wrapper">
      <img src={user?.profilePicture} alt="avatar" className="comment-avatar" />
      <div className="comment-body">
        <div className="comment-header-line">
          <span className="comment-username">{user ? user.userName : "Loading..."}</span>
          <span className="comment-time">{timeAgo()}</span>
        </div>
        {isEditing ? (
          <>
            <textarea
              className="comment-textarea"
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              placeholder="Write a comment..."
            />
            <div className="comment-edit-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>
            <div className="comment-like">
              <button
                onClick={() => onLike(comment._id)}
                className="like-btn"
                style={{
                  color:
                    currentUser &&
                    comment.likes?.some(uid => uid.toString() === currentUser.id)
                      ? "blue"
                      : "white"
                }}
              >
                <FaThumbsUp />
              </button>
              <span className="like-count">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </span>
              <span>
                {currentUser && (currentUser.id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button className="comment-edit" onClick={handleEdit}>Edit</button>
                    <button className="comment-edit" onClick={() => onDelete(comment._id)}>Delete</button>
                  </>
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
