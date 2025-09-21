import React from 'react'
import NavbarUser from '../../components/user/navbar.jsx'
import Footer from '../../components/user/footer.jsx';
export default function About() {
    return (
        <div>
            <NavbarUser />
            <div className="about-content" style={{textAlign:"center", marginTop:"100px"}}>
                <h2 style={{color:"white", fontSize:"40px"}}>About WAQAS'S BLOGS</h2>
                <p style={{maxWidth:'700px', margin:"auto", color:"gray", lineHeight:"30px", fontSize:"20px"}}>Welcome to Waqas Tariq's Blog!
                    This blog was created by Waqas Tariq as a personal project to showcase his skills in full-stack web development by using JavaScript, React, Node.js, Express.js, and MongoDB as a database. Waqas is a passionate developer who loves coding.

                    This is a blog application with an admin dashboard where only the admin can create a blog, and users can read it. Other users can add, delete, and update comments. They can also like comments on others’ posts. Users can create their accounts using Google OAuth as well. Users can upload their profile picture, delete their account, update their credentials, and sign in or sign out.

                    We encourage you to leave comments on our posts and engage with other readers. We believe that a community of learners can help each other grow and improve.

                    Made by Waqas Tariq with ♥️</p>
            </div>
            <Footer />
        </div>
    )
}
