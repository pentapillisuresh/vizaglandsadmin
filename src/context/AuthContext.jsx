import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = (email, password) => {
    if (email === "admin@admin.com" && password === "admin123") {
      const adminUser = {
        id: "admin1",
        email: "admin@admin.com",
        fullName: "Admin User",
        role: "admin",
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
