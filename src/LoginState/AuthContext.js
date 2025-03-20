import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // localStorage에서 직접 초기값 가져와서 상태 유지
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);

  const login = () => setIsLoggedIn(true);


  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken"); // 로그아웃 시 토큰 삭제
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
