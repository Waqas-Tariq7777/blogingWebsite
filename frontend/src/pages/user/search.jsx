import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Navbar from "../../components/user/navbar.jsx";
import Footer from "../../components/user/footer.jsx";
import "../../style/pages/user/search.css";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  /** Fetch initial posts when filters change */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const sort = urlParams.get("sort") || "desc";
    const category = urlParams.get("category") || "uncategorized";
    setSidebarData({ searchTerm, sort, category });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/admin/getPost?${urlParams.toString()}&limit=20`
        );
        const data = res.data.data || [];
        setPosts(data);
        setHasMore(data.length === 20);
      } catch (e) {
        console.error("Error loading posts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  /** Load more when scrolling near bottom */
  const loadMore = useCallback(
    async (startIndex) => {
      if (!hasMore || loading) return;
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        urlParams.set("limit", 20);
        const res = await axios.get(
          `http://localhost:3000/api/admin/getPost?${urlParams.toString()}`
        );
        const newPosts = res.data.data || [];
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length === 20);
      } catch (e) {
        console.error("Error loading more:", e);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, loading, location.search]
  );

  /** Virtualized row: 2 cards side by side */
  const Row = ({ index, style }) => {
    const first = posts[index * 2];
    const second = posts[index * 2 + 1];
    return (
      <div style={style} className="search-row">
        {first && (
          <div className="search-card">
            <img
              src={first.image || "https://via.placeholder.com/400x200"}
              alt={first.title}
              className="search-card-img"
            />
            <h3 className="search-card-title">{first.title}</h3>
            <p className="search-card-cat">{first.category}</p>
            <a href={`/post/${first.slug}`} className="search-card-btn">
              Read Article
            </a>
          </div>
        )}
        {second && (
          <div className="search-card">
            <img
              src={second.image || "https://via.placeholder.com/400x200"}
              alt={second.title}
              className="search-card-img"
            />
            <h3 className="search-card-title">{second.title}</h3>
            <p className="search-card-cat">{second.category}</p>
            <a href={`/post/${second.slug}`} className="search-card-btn">
              Read Article
            </a>
          </div>
        )}
      </div>
    );
  };

  /** Smoothly detect scroll near bottom */
  const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }) => {
    if (scrollUpdateWasRequested) return;
    const rowHeight = 330;
    const totalHeight = Math.ceil(posts.length / 2) * rowHeight;
    const buffer = 800;
    if (scrollOffset + window.innerHeight + buffer >= totalHeight) {
      loadMore(posts.length);
    }
  };

  /** Sidebar form */
  const handleChange = (e) =>
    setSidebarData((p) => ({ ...p, [e.target.id]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(sidebarData);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />
      <div className="search-page">
        <aside className="search-sidebar">
          <form className="search-sidebar-form" onSubmit={handleSubmit}>
            <input
              id="searchTerm"
              value={sidebarData.searchTerm}
              placeholder="Search term..."
              className="search-input"
              onChange={handleChange}
            />
            <select
              id="sort"
              value={sidebarData.sort}
              className="search-select"
              onChange={handleChange}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
            <select
              id="category"
              value={sidebarData.category}
              className="search-select"
              onChange={handleChange}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="Education">Education</option>
              <option value="Travels">Travels</option>
              <option value="Cars">Cars</option>
            </select>
            <button type="submit" className="search-apply-btn">
              Apply Filters
            </button>
          </form>
        </aside>

        <section className="search-results">
          <h2 className="search-results-title">Results</h2>
          {loading && posts.length === 0 && (
            <p className="search-loading">Loading…</p>
          )}
          {!loading && posts.length === 0 && (
            <p className="search-no-posts">No posts found.</p>
          )}

          {posts.length > 0 && (
            <div className="search-cards">
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    itemCount={Math.ceil(posts.length / 2)}
                    itemSize={330}
                    width={width}
                    onScroll={handleScroll}
                    style={{ overflowX: "hidden", scrollBehavior: "smooth" }}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </div>
          )}
          {loading && posts.length > 0 && (
            <p className="search-loading">Loading more…</p>
          )}
        </section>
      </div>
      <div className="search-footer" style={{marginTop:"-100px"}}><Footer /></div>
    </div>
  );
}
