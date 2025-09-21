import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import useCurrentUser from "../../hooks/currentUser.jsx";
import "../../style/components/navbar.css";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Search submit with login check
  const handleSubmitSearch = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/signin");
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  // ✅ Mobile search click with login check
  const handleSearchClick = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    navigate("/search");
  };

  // Load search term from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get("searchTerm");
    if (term) setSearchTerm(term);
  }, [location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Toggle mobile menu
  const handleButtonToggle = () => setShowMenu((prev) => !prev);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <header>
      <div className="container">
        <div className="navbar-flex">
          {/* ---------- Left Section ---------- */}
          <div className="left-section">
            <div className="logo">
              <Link to="/" className="logo-link">
                <h3>
                  <span className="logo-highlight">WAQAS'S</span> BLOGS
                </h3>
              </Link>
            </div>

            {/* Desktop search */}
            <form onSubmit={handleSubmitSearch}>
              <div className="search desktop-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile search icon */}
            <div className="mobile-search-icon" onClick={handleSearchClick}>
              <FaSearch />
            </div>
          </div>

          {/* ---------- Right Section ---------- */}
          <div className="right-section">
            <nav className={showMenu ? "menu-mobile" : "menu-web"}>
              <ul className="menu-items">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <hr />
                <li>
                  {user ? (
                    user.isAdmin ? (
                      <Link to={`/adminDashboard/${user.id}/dashboardComp`}>
                        Dashboard
                      </Link>
                    ) : (
                      <Link to={`/userDashboard/${user.id}`}>Profile</Link>
                    )
                  ) : (
                    <Link to="/profile">Profile</Link>
                  )}
                </li>
                <hr />
                <li>
                  <Link to="/about">About</Link>
                </li>
                <hr />
              </ul>
            </nav>

            {/* User profile / dropdown */}
            <div className="user-profile-icon">
              {user ? (
                <div
                  className="profile-wrapper"
                  onClick={(e) => e.stopPropagation()}
                  style={{ position: "relative", width: "40px", height: "40px" }}
                >
                  {!imgLoaded && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}

                  <img
                    src={user?.profilePicture || DEFAULT_AVATAR}
                    alt="User profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: imgLoaded ? "block" : "none",
                    }}
                    onLoad={() => setImgLoaded(true)}
                    onClick={() => setShowDropdown((prev) => !prev)}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                      setImgLoaded(true);
                    }}
                  />

                  {showDropdown && (
                    <div className="dropdown">
                      <p className="dropdown-email">{user.email}</p>
                      {user.isAdmin ? (
                        <Link
                          to={`/adminDashboard/${user.id}/dashboardComp`}
                          className="dropdown-link"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to={`/userDashboard/${user.id}`}
                          className="dropdown-link"
                        >
                          Profile
                        </Link>
                      )}
                      <button
                        className="dropdown-signout"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin">
                  <button>Sign in</button>
                </Link>
              )}
            </div>

            {/* Hamburger menu */}
            <div className="ham-menu">
              <button onClick={handleButtonToggle}>
                <GiHamburgerMenu />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
