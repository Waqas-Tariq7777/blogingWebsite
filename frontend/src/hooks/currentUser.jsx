// src/hooks/useCurrentUser.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const API_BASE = import.meta.env.VITE_API_URL || "https://bloging-website-backend-seven.vercel.app";
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/user/me`, {
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
