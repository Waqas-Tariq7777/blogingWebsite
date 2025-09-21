import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Home from './pages/user/home.jsx';
import Profile from './pages/user/profile.jsx';
import SignIn from './components/user/sigin.jsx';
import SignUp from './pages/user/signup.jsx';
import About from './pages/user/about.jsx';
import UserDashboard from './pages/user/userDashboard.jsx';
import ProtectedRoutes from './components/user/protectedRoutes.jsx';
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import ProtectedAdminRoute from './components/admin/protectedAdminRoutes.jsx';
import PostView from './pages/admin/postView.jsx';
import UpdatePost from './pages/admin/updatePost.jsx';
import PostPage from './pages/admin/postPage.jsx';
import Search from './pages/user/search.jsx';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path="/post/:postSlug" element={<PostPage />} /> 
        <Route element={<ProtectedRoutes />}>
          <Route path="/userDashboard/:id" element={<UserDashboard />} />
        </Route>

         <Route element={<ProtectedAdminRoute />}>
          <Route path="/adminDashboard/:id/*" element={<AdminDashboard />} />
          <Route path="/updatePost/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
