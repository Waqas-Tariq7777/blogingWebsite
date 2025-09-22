// src/hooks/useCurrentUser.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get( "https://bloging-website-backend-xi.vercel.app/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data);   // <-- depends on what /me returns (object or data.user)
        
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
}
