import React from 'react'
import NavbarUser from '../../components/user/navbar.jsx'
import Footer from '../../components/user/footer.jsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../../style/components/sigin.css"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import "../../style/pages/user/signup.css"
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import OAuth from '../../components/user/OAuth.jsx';
export default function SignUp() {

  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return setErrorMessage("Please fill out all the fields");
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const result = await axios.post(
        "http://localhost:3000/api/user/register",
        { userName, email, password }
      );
      setLoading(false)
      if(result.data.success === true){
        navigate('/signin')
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
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="username" onChange={(e) => setUserName(e.target.value.trim())} />
            </Form.Group>
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
                "Sign Up"
              )}
            </Button>
            <OAuth/>
            <p style={{ marginTop: "10px" }}>Already have an account? <Link to='/signin'>Sign in</Link></p>
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
