// src/LoginState/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 저장


  useEffect(() => {
    const token = localStorage.getItem("accessToken"); 
    setIsLoggedIn(!!token); // 토큰이 존재하면 true, 없으면 false 설정
  }, []);

   // 로그인 시 accessToken 저장 & 상태 업데이트
   const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken"); // 로그아웃 시 토큰 삭제
  };
  
   // 새로고침 시에도 localStorage에서 accessToken을 확인하여 로그인 상태 유지
   useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
