import React, { useState, useRef } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "../../style/pages/admin/createPost.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filePickerRef = useRef(null);
  const navigate = useNavigate();

  // ========== Submit handler ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return setErrorMessage("Please fill out title and content");
    }
    if (!imageFile) {
      return setErrorMessage("Please select an image");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("image", imageFile);

    setLoading(true);          // ⬅️ start loading
    setErrorMessage("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/createPost",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const created = res.data?.data;
      if (created && created.slug) {
        navigate(`/post/${created.slug}`); // ✅ go to created post URL
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Something went wrong while creating"
      );
    } finally {
      setLoading(false);       // ⬅️ stop loading
    }
  };

  // ========== Image change ==========
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setShowPreview(false); // reset preview if picking another image
    }
  };

  return (
    <div className="cp-wrapper">
      <h1 className="cp-title">Create a post</h1>

      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}

      <form className="cp-form" onSubmit={handleSubmit}>
        {/* Title + Category */}
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

        {/* File picker + Upload button */}
        <div className="cp-image-row">
          <input
            type="file"
            id="postImage"
            ref={filePickerRef}
            onChange={handleImageChange}
            className="cp-file"
          />
          <button
            type="button"
            className="cp-upload-btn"
            onClick={() => setShowPreview(true)}
            disabled={!imageFileUrl}
          >
            Upload Image
          </button>
        </div>

        {/* Show preview only after clicking "Upload Image" */}
        {showPreview && imageFileUrl && (
          <div className="image-wrapper">
            <img src={imageFileUrl} alt="Preview" className="blog-image" />
          </div>
        )}

        {/* Markdown Editor */}
        <div className="cp-editor">
          <SimpleMDE
            placeholder="Write something..."
            value={content}
            onChange={setContent}
          />
        </div>

        {/* Publish */}
        <button type="submit" className="cp-publish" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Uploading...
            </>
          ) : (
            "Publish"
          )}
        </button>

      </form>
    </div>
  );
}
