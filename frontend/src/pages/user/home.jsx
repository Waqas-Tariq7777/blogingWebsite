import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarUser from "../../components/user/navbar.jsx";
import Footer from "../../components/user/footer.jsx";
import useCurrentUser from "../../hooks/currentUser.jsx";
import homeHeroImage from "../../assets/images/home-hero.jpg";
import "../../style/pages/user/home.css";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3000/api/admin/getPost?limit=9",
          { withCredentials: true }
        );
        if (res.status === 200 && Array.isArray(res.data.data)) {
          setRecentPosts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const handleProtectedRoute = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/signin");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <NavbarUser />

      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-content">
          <img src={homeHeroImage} alt="Blogs" />
          <div className="home-hero-text">
            <h1>Welcome To My Blog</h1>
            <p>
              Here you will find a variety of articles and tutorials on topics
              such as History, Automobile, Science, and more.
            </p>
            <button onClick={() => handleProtectedRoute("/search")}>
              View all posts
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <section className="home-recent-posts">
        <div className="home-recent-posts-heading">
          <h2>Recent Posts</h2>
        </div>

        {loading ? (
          <div className="posts-loader">
            <div className="home-spinner"></div>
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="home-recent-posts-wrapper">
            {recentPosts.map((post) => (
              <div className="home-recent-post-card" key={post._id}>
                <img
                  src={post.image || "https://via.placeholder.com/400x200"}
                  alt={post.title}
                  onClick={() => handleProtectedRoute(`/post/${post.slug}`)}
                  style={{ cursor: "pointer" }}
                />
                <h3>{post.title}</h3>
                <h4>{post.category}</h4>
                <div className="card-button">
                  <button
                    onClick={() => handleProtectedRoute(`/post/${post.slug}`)}
                  >
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts available.</p>
        )}

        <div className="home-recent-posts-allbutton">
          <button onClick={() => handleProtectedRoute("/search")}>
            View all posts
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
