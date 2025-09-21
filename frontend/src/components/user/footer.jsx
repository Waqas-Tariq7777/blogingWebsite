import React from 'react'
import "../../style/components/footer.css"
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
export default function Footer() {
    return (
        <div>
            <footer>
                <div className="footer-content">
                    <div className="logo">
                        <Link to="/" className="logo-link">
                            <h3>
                                <span className="logo-highlight">WAQAS'S</span> BLOGS
                            </h3>
                        </Link>
                    </div>
                    <div className="footer-links">
                        <div className="footer-about">
                            <h3>About</h3>
                            <ul>
                                <li>
                                    <a href="#top" className="scroll-top">Know about us</a>
                                </li>
                                <li>
                                    <a href="#top" className="scroll-top">Waqas's Blogs</a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-follow">
                            <h3>Follow</h3>
                            <ul>
                                <li>
                                    <a
                                        href="https://github.com/Waqas-Tariq7777"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="#top" className="scroll-top">Reddit</a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-legal">
                            <h3>Legal</h3>
                            <ul>
                                <li>
                                    <a href="#top" className="scroll-top">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#top" className="scroll-top">Terms & Conditions</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Waqas's Blogs</p>

                    <div className="footer-social">
                        <a
                            href="https://www.instagram.com/waqas_tariq77?igsh=MWoyNTZmc203NjhyYQ=="
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://www.facebook.com/share/19iJVXNZzk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://github.com/Waqas-Tariq7777"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </footer >
        </div >

    )
}
