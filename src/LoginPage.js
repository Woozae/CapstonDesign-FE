import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <>

      {/* 로그인 박스 */}
      <div className="login-container">
        <header className="login-header">
          <h1>Spot-Right</h1>
        </header>
        <div className="login-box">
          <form>
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input type="text" id="username" placeholder="아이디를 입력하세요" />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input type="password" id="password" placeholder="비밀번호를 입력하세요" />
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" /> 로그인 상태 유지
              </label>
            </div>
            <button type="submit" className="login-button">로그인</button>
            <div className="signup-link">
              <a href="/signup">회원가입</a>
            </div>
          </form>
        </div>
      </div>
      <div className="login-bottom">
        <a href="#" className="bottom-icon"> {/* bottom-icon 클릭 가능하게 변경 */}
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
      </div>
    </>
  );
};

export default LoginPage; 