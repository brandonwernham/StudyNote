import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem("profile")) || null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [user, profile]);

  const value = {
    user,
    setUser,
    profile,
    setProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
