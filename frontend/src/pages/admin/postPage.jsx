import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/navbar.jsx";
import Footer from "../../components/user/footer.jsx";
import "../../style/pages/admin/postPage.css"
import CommentsSection from "../../components/user/commentsSection.jsx";

export default function PostPage() {
    const { postSlug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentPosts, setRecentPosts] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const result = await axios.get(
                    `https://bloging-website-backend-xi.vercel.app/api/admin/getPost?slug=${postSlug}`,
                    { withCredentials: true }
                );

                const fetched =
                    Array.isArray(result.data?.data) && result.data.data.length > 0
                        ? result.data.data[0]
                        : null;

                setPost(fetched);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postSlug]);

    
useEffect(() => {
  const fetchRecentPosts = async () => {
    try {
      const res = await axios.get(
        `https://bloging-website-backend-xi.vercel.app/api/admin/getPost?limit=3`,
        { withCredentials: true }
      );
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setRecentPosts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };
  fetchRecentPosts();
}, []);



    if (loading) {
        return (
            <div className="postpage-spinner-wrapper">
                <div className="postpage-spinner"></div>
            </div>
        );
    }

    if (!post) {
        return <p style={{ textAlign: "center" }}>Post not found</p>;
    }

    const readTime = Math.max(1, Math.ceil(post.content.length / 1000));

    return (
        <div className="postpage-wrapper">
            <Navbar />
            <main className="postpage-content">
                <h1 className="postpage-title">{post.title}</h1>

                <Link
                    to={`/search?category=${encodeURIComponent(post.category)}`}
                    className="postpage-category-link"
                >
                    <span className="postpage-category-badge">{post.category}</span>
                </Link>

                <img
                    src={post.image || "https://via.placeholder.com/800x400"}
                    alt={post.title}
                    className="postpage-banner"
                />

                <div className="postpage-meta">
                    <span className="postpage-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="postpage-readtime">{readTime} mins read</span>
                </div>

                <div
                    className="postpage-body"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
                <CommentsSection postId={post._id} />
             

            </main>
               {recentPosts && (
                    <section className="postpage-recent-posts">
                        <div className="home-recent-posts-heading">
                            <h2>Recent Posts</h2>
                        </div>
                        <div className="home-recent-posts-wrapper">
                            {recentPosts.map((post, i) => (
                                <div className="home-recent-post-card" key={i}>
                                    <Link to={`/post/${post.slug}`}> <img src={post.image || "https://via.placeholder.com/400x200"} alt={post.title} /></Link>
                                    <h3>{post.title}</h3>
                                    <h4>{post.category}</h4>
                                    <div className="card-button">
                                        <Link to={`/post/${post.slug}`}>
                                            <button>Read article</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            <Footer />
        </div>
    );
}
