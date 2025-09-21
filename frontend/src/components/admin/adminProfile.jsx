import React, { useEffect, useRef, useState } from "react";
import "../../style/components/userProfile.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);

  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Fetch user info on mount
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/getUser/${id}`,
          { withCredentials: true }
        );
        const u = res.data.data;
        setUserName(u.userName);
        setEmail(u.email);
        setProfilePicture(u.profilePicture);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  // Image picker
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    filePickerRef.current?.click();
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (imageFile) formData.append("profilePicture", imageFile);

    try {
      const res = await axios.put(
        `http://localhost:3000/api/user/updateUser/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        setSuccessMsg("✅ User updated successfully!");
        const updated = res.data.data;
        setUserName(updated.userName);
        setEmail(updated.email);
        setProfilePicture(updated.profilePicture);
        setPassword("");
        setImageFile(null);
        setImageFileUrl(null);

        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/deleteUser/${id}`,
        { withCredentials: true }
      );
      console.log(response.data);

      alert("✅ Account deleted successfully!");

      // Optional: redirect to login or home after delete
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Failed to delete account. Please try again.");
    }
  };


  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/logout",
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
    <main className="profile-content">
      {successMsg && (
        <div className="update-message">
          {successMsg}
        </div>
      )}

      <h2 className="profile-title">Profile</h2>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={filePickerRef}
        onChange={handleImageChange}
      />

      <div className="avatar-wrapper" onClick={handleAvatarClick}>
        <img
          src={imageFileUrl || profilePicture || DEFAULT_AVATAR}
          alt="User Avatar"
          className="avatar"
          onError={(e) => {
            console.log("Image failed:", e);
            e.target.src = DEFAULT_AVATAR;
          }}
        />

      </div>

      <form className="profile-form" onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Username"
          className="form-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="update-btn">
          Update
        </button>
      </form>

      <div className="actions">
        <button type="button" className="delete-btn" onClick={handleDelete}>
          Delete Account
        </button>
        <button type="button" className="signout-btn" onClick={handleSubmit}>
          Sign Out
        </button>
      </div>
    </main>
  );
}
