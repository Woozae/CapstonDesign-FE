import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <>
      {/* 상단 헤더 */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Spot-Right</h1>
          <div className="header-buttons">
            <button className="header-button-bookmark">Bookmark</button>
            <button className="header-button-album">Album</button>
            <a href="#" className="header-icon"> {/* header-icon 클릭 가능하게 변경 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 45 45"
                fill="none"
              >
                <path
                  d="M10.9688 32.0625C12.5625 30.8438 14.3438 29.8828 16.3125 29.1797C18.2813 28.4766 20.3438 28.125 22.5 28.125C24.6562 28.125 26.7188 28.4766 28.6875 29.1797C30.6562 29.8828 32.4375 30.8438 34.0312 32.0625C35.125 30.7812 35.9766 29.3281 36.5859 27.7031C37.1953 26.0781 37.5 24.3438 37.5 22.5C37.5 18.3438 36.0391 14.8047 33.1172 11.8828C30.1953 8.96094 26.6562 7.5 22.5 7.5C18.3438 7.5 14.8047 8.96094 11.8828 11.8828C8.96094 14.8047 7.5 18.3438 7.5 22.5C7.5 24.3438 7.80469 26.0781 8.41406 27.7031C9.02344 29.3281 9.875 30.7812 10.9688 32.0625ZM22.5 24.375C20.6562 24.375 19.1016 23.7422 17.8359 22.4766C16.5703 21.2109 15.9375 19.6562 15.9375 17.8125C15.9375 15.9688 16.5703 14.4141 17.8359 13.1484C19.1016 11.8828 20.6562 11.25 22.5 11.25C24.3438 11.25 25.8984 11.8828 27.1641 13.1484C28.4297 14.4141 29.0625 15.9688 29.0625 17.8125C29.0625 19.6562 28.4297 21.2109 27.1641 22.4766C25.8984 23.7422 24.3438 24.375 22.5 24.375ZM22.5 41.25C19.9062 41.25 17.4688 40.7578 15.1875 39.7734C12.9062 38.7891 10.9219 37.4531 9.23438 35.7656C7.54687 34.0781 6.21094 32.0938 5.22656 29.8125C4.24219 27.5313 3.75 25.0938 3.75 22.5C3.75 19.9062 4.24219 17.4688 5.22656 15.1875C6.21094 12.9062 7.54687 10.9219 9.23438 9.23438C10.9219 7.54687 12.9062 6.21094 15.1875 5.22656C17.4688 4.24219 19.9062 3.75 22.5 3.75C25.0938 3.75 27.5313 4.24219 29.8125 5.22656C32.0938 6.21094 34.0781 7.54687 35.7656 9.23438C37.4531 10.9219 38.7891 12.9062 39.7734 15.1875C40.7578 17.4688 41.25 19.9062 41.25 22.5C41.25 25.0938 40.7578 27.5313 39.7734 29.8125C38.7891 32.0938 37.4531 34.0781 35.7656 35.7656C34.0781 37.4531 32.0938 38.7891 29.8125 39.7734C27.5313 40.7578 25.0938 41.25 22.5 41.25Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

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