import React from 'react'
import SideMenu from '../../components/user/sidemenu.jsx'
import NavbarUser from '../../components/user/navbar.jsx'
import Footer from '../../components/user/footer.jsx';
import Profile from '../../components/user/userProfile.jsx';
import "../../style/pages/user/userDashboard.css"
export default function UserDashboard() {
  return (
    <div>
      <NavbarUser/>
       <div className="dashboard">
        <div className="sidemun-dash"> <SideMenu /></div>
        <div className="profile-dash"> <Profile/></div>
    </div>
    <div className="app-footer">
     <Footer/>
    </div>
    </div>
  )
}
