import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api.ts";
import { useAuth } from "../LoginState/AuthContext"
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate(); //  페이지 이동을 위한 useNavigate
  const [formData, setFormData] = useState({ email: "", password: "" }); //  로그인 정보 상태
  const [error, setError] = useState(""); //  에러 메시지 상태
  const { login } = useAuth();
  
  useEffect(() => {
    document.body.id = "login-page";
  
    return () => {
      document.body.id = "";
    };
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); //  에러 초기화

    try {
      const response = await authApi.signIn(formData.email, formData.password); //  로그인 요청
      console.log(response);
      localStorage.setItem("accessToken", response.data.data);

      login(); // 로그인 상태 업데이트 (isLoggedIn = true)
      alert("로그인 성공!");
      navigate("/"); //  로그인 성공 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."); //  에러 메시지 설정
    }
  };

  return (
    <>
      <div className="login-container">
        <header className="login-header">
          <h1>Spot-Right</h1>
        </header>
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            {" "}
            {/*  로그인 기능 추가 */}
            <div className="form-group">
              <label htmlFor="email">이메일</label>{" "}
              {/*  id 변경 (username → email) */}
              <input
                type="text"
                id="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange} //  입력값 상태 업데이트
              />
            </div>
            <div className="password-group">
              <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange} //  입력값 상태 업데이트
                />
              </div>
            </div>
           
            <p className="error">
              {error || " "}
            </p>


            {/*  에러 메시지 표시 */}
            <button type="submit" className="login-button">
              로그인
            </button>{" "}
            {/*  로그인 버튼 동작 추가 */}
            <button
              type="button"
              className="sign-up-button"
              onClick={() => navigate("/Signup")} //  페이지 이동 수정
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
      
      <div className="login-bottom">
         {/* 
       <a href="#" className="bottom-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M42 30C42 31.0609 41.5786 32.0783 40.8284 32.8284C40.0783 33.5786 39.0609 34 38 34H14L6 42V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H38C39.0609 6 40.0783 6.42143 40.8284 7.17157C41.5786 7.92172 42 8.93913 42 10V30Z"
              stroke="#F5F5F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a> 
        */}
      </div>
      
    </>
  );
};

export default LoginPage;
