import React from 'react'
import Button from 'react-bootstrap/Button';
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth"
import { app } from '../../firebase.js';
import { useNavigate } from "react-router-dom";
import axios from "axios"
export default function OAuth() {
  const navigate=useNavigate()
  const auth = getAuth(app)
  const handleGoogleClick = async()=>{
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account'})

  try {
    const resultsFromGoogle = await signInWithPopup(auth, provider)
    const result = await axios.post("https://bloging-website-backend-xi.vercel.app/api/user/google" , {
      name:resultsFromGoogle.user.displayName,
      email:resultsFromGoogle.user.email,
      googlePhotoUrl:resultsFromGoogle.user.photoURL
    }, { withCredentials: true } )
    if(result.status === 200){
      navigate('/')
    }
  } catch (error) {
    console.log(error)
  }
  }
  return (
    <div>
      <Button variant="primary" className="signin-form-google"onClick={handleGoogleClick}>
              <FcGoogle style={{ marginRight: "8px", fontSize: "20px" }} />
              Continue with Google
            </Button>
    </div>
  )
}
