import React from 'react'
import NavbarUser from '../../components/user/navbar.jsx'
import Footer from '../../components/user/footer.jsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../../style/components/sigin.css"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "react-bootstrap";
import OAuth from './OAuth.jsx';
export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setErrorMessage("Please fill out all the fields");
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const result = await axios.post(
        "https://bloging-website-backend-mauve.vercel.app/api/user/signin",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login response:", result.data);
      
      setLoading(false)
      if (result.data.success === true) {
        const { isAdmin } = result.data.data   

        if (isAdmin) {
          navigate('/')
        } else {
          navigate('/')
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong"
      );
      setLoading(false)
    }
  };

  return (
    <div>
      <NavbarUser />
      <div className="sigin-main">
        <div className="sigin-main-left">
          <div className="logo">
            <Link to="/" className="logo-link">
              <h3>
                {" "}
                <span className="logo-highlight">WAQAS'S</span> BLOGS
              </h3>
            </Link>
          </div>
          <p>This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>
        <div className="sigin-main-right">
          <Form className='login-form' onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value.trim())} />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value.trim())} />
            </Form.Group>
            <Button variant="primary" type="submit" className='signin-form-button' disabled={loading}>
              {loading ? (
                <Spinner
                  animation="border"
                  role="status"
                  size="sm"
                  className="me-2"
                />
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
            <p style={{ marginTop: "10px" }}>Don't have an account? <Link to='/signup'>Sign up</Link></p>

          </Form>
          {errorMessage && (
            <div className="error-card">
              <span role="img" aria-label="error">⚠️</span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
