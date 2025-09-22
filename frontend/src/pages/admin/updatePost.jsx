import React, { useState, useRef, useEffect } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "../../style/pages/admin/createPost.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/user/navbar.jsx";
import Footer from "../../components/user/footer.jsx";
import useCurrentUser from "../../hooks/currentUser.jsx";

export default function UpdatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { postId } = useParams();
  const { user } = useCurrentUser();
  const filePickerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setFetching(true);
      try {
        const res = await axios.get("https://bloging-website-backend-xi.vercel.app/api/admin/getPost", {
          withCredentials: true,
        });

        const posts = res.data?.data || [];
        const post = posts.find((p) => p._id === postId);

        if (post) {
          setTitle(post.title || "");
          setCategory(post.category || "");
          setContent(post.content || "");
          if (post.image) {
            setImageFileUrl(post.image);
            setShowPreview(true);
          }
        } else {
          setErrorMessage("Post not found");
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Failed to fetch post details"
        );
      } finally {
        setFetching(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return setErrorMessage("Please fill out title and content");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.put(
        `https://bloging-website-backend-xi.vercel.app/api/admin/updatePost/${postId}/${user.id}`,
        formData,
        { withCredentials: true }
      );

      const updated = res.data?.data;
      navigate(updated?.slug ? `/post/${updated.slug}` : `/postView/${postId}`);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Something went wrong while updating"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setShowPreview(false);
    }
  };

  // === Loader while fetching ===
  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="cp-spinner-wrapper">
          <div className="cp-spinner"></div>
        </div>
        <Footer />
      </>
    );
  }

  // === Main Form ===
  return (
    <>
      <Navbar />
      <div className="cp-wrapper">
        <h1 className="cp-title">Update Post</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="cp-input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="cp-select"
            >
              <option value="">Select a category</option>
              <option value="Education">Education</option>
              <option value="Travels">Travels</option>
              <option value="Cars">Cars</option>
            </select>
          </div>

          <div className="cp-image-row">
            <input type="file" ref={filePickerRef} onChange={handleImageChange} />
            <button
              type="button"
              className="cp-upload-btn"
              onClick={() => setShowPreview(true)}
              disabled={!imageFileUrl}
            >
              Preview
            </button>
          </div>

          {showPreview && imageFileUrl && (
            <div className="image-wrapper">
              <img src={imageFileUrl} alt="Preview" className="blog-image" />
            </div>
          )}

          <div className="cp-editor">
            <SimpleMDE
              value={content}
              onChange={setContent}
              placeholder="Write something..."
            />
          </div>

          <button type="submit" className="cp-publish" disabled={loading}>
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
