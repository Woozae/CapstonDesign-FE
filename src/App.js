import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AlbumPage from "./Albumpage/AlbumPage";
import LoginPage from "./Loginpage/LoginPage";
import BookmarkPage from "./Bookmarkpage/BookmarkPage";
import ReviewPage from "./Reviewpage/ReviewPage";
import MainPage from "./Mainpage/MainPage";
import SignupPage from "./Signuppage/SignupPage";
import PlaceDetailPage from "./PlaceDetailPage/PlaceDetailPage";
import { AuthProvider } from "./LoginState/AuthContext";
import { useAuth } from "./LoginState/AuthContext";
import "./App.css";

/** 페이지 최상단으로 이동하는 버튼 */
const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className="scroll-to-top always-visible" onClick={scrollToTop}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
        <path d="M24 38V10M24 10L10 24M24 10L38 24" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

/** 헤더 컴포넌트 */
const Header = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { isLoggedIn, logout } = useAuth();
  const [nickname, setNickname] = useState("");
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태
  
  useEffect(() => {
    if (isLoggedIn) {
      const storedNickname = localStorage.getItem("nickname");
      setNickname(storedNickname || "사용자");
    }
  }, [isLoggedIn]); // 로그인 상태가 바뀌면 닉네임 업데이트

  // 팝업 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest(".user-popup") && !event.target.closest(".header-icon")) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);


    // 로그아웃 핸들러
    const handleLogout = () => {
      localStorage.removeItem("accessToken"); // 토큰 삭제
      logout(); // 로그인 상태 false로 변경
      window.location.reload(); // 페이지 새로고침
    };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" 
          onClick={() => window.location.href = "/"} >
            Spot-Right
        </h1>

        <div className="header-buttons">
          <button className="header-button-bookmark" onClick={() => navigate("/Bookmark")}>Bookmark</button>
          <button className="header-button-album" onClick={() => navigate("/Album")}>Album</button>
          
          
           {/* 로그인 상태 */}
           {isLoggedIn ? (
            <div className="user-menu">
              {/* 프로필 아이콘 클릭 시 팝업 열기 */}
              <div className="header-icon" onClick={() => setShowPopup((prev) => !prev)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 45 45" fill="none">
                  <path d="M10.9688 32.0625C12.5625 30.8438 14.3438 29.8828 16.3125 29.1797C18.2813 28.4766 20.3438 28.125 22.5 28.125C24.6562 28.125 26.7188 28.4766 28.6875 29.1797C30.6562 29.8828 32.4375 30.8438 34.0312 32.0625C35.125 30.7812 35.9766 29.3281 36.5859 27.7031C37.1953 26.0781 37.5 24.3438 37.5 22.5C37.5 18.3438 36.0391 14.8047 33.1172 11.8828C30.1953 8.96094 26.6562 7.5 22.5 7.5C18.3438 7.5 14.8047 8.96094 11.8828 11.8828C8.96094 14.8047 7.5 18.3438 7.5 22.5C7.5 24.3438 7.80469 26.0781 8.41406 27.7031C9.02344 29.3281 9.875 30.7812 10.9688 32.0625ZM22.5 24.375C20.6562 24.375 19.1016 23.7422 17.8359 22.4766C16.5703 21.2109 15.9375 19.6562 15.9375 17.8125C15.9375 15.9688 16.5703 14.4141 17.8359 13.1484C19.1016 11.8828 20.6562 11.25 22.5 11.25C24.3438 11.25 25.8984 11.8828 27.1641 13.1484C28.4297 14.4141 29.0625 15.9688 29.0625 17.8125C29.0625 19.6562 28.4297 21.2109 27.1641 22.4766C25.8984 23.7422 24.3438 24.375 22.5 24.375ZM22.5 41.25C19.9062 41.25 17.4688 40.7578 15.1875 39.7734C12.9062 38.7891 10.9219 37.4531 9.23438 35.7656C7.54687 34.0781 6.21094 32.0938 5.22656 29.8125C4.24219 27.5313 3.75 25.0938 3.75 22.5C3.75 19.9062 4.24219 17.4688 5.22656 15.1875C6.21094 12.9062 7.54687 10.9219 9.23438 9.23438C10.9219 7.54687 12.9062 6.21094 15.1875 5.22656C17.4688 4.24219 19.9062 3.75 22.5 3.75C25.0938 3.75 27.5313 4.24219 29.8125 5.22656C32.0938 6.21094 34.0781 7.54687 35.7656 9.23438C37.4531 10.9219 38.7891 12.9062 39.7734 15.1875C40.7578 17.4688 41.25 19.9062 41.25 22.5C41.25 25.0938 40.7578 27.5313 39.7734 29.8125C38.7891 32.0938 37.4531 34.0781 35.7656 35.7656C34.0781 37.4531 32.0938 38.7891 29.8125 39.7734C27.5313 40.7578 25.0938 41.25 22.5 41.25Z" fill="white"/>
                </svg>
               </div>

              {/* 팝업 메뉴 (닉네임 & 로그아웃 버튼) */}
              {/* 팝업 메뉴 */}
            {showPopup && (
              <div className="user-popup">
                <p className="user-nickname">{nickname}님</p>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
                  )}
            </div>
          ) : (

            // 로그아웃 상태 (로그인 버튼 표시)
            <div className="header-icon" onClick={() => navigate("/Login")}>

            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 45 45" fill="none">
              <path d="M10.9688 32.0625C12.5625 30.8438 14.3438 29.8828 16.3125 29.1797C18.2813 28.4766 20.3438 28.125 22.5 28.125C24.6562 28.125 26.7188 28.4766 28.6875 29.1797C30.6562 29.8828 32.4375 30.8438 34.0312 32.0625C35.125 30.7812 35.9766 29.3281 36.5859 27.7031C37.1953 26.0781 37.5 24.3438 37.5 22.5C37.5 18.3438 36.0391 14.8047 33.1172 11.8828C30.1953 8.96094 26.6562 7.5 22.5 7.5C18.3438 7.5 14.8047 8.96094 11.8828 11.8828C8.96094 14.8047 7.5 18.3438 7.5 22.5C7.5 24.3438 7.80469 26.0781 8.41406 27.7031C9.02344 29.3281 9.875 30.7812 10.9688 32.0625ZM22.5 24.375C20.6562 24.375 19.1016 23.7422 17.8359 22.4766C16.5703 21.2109 15.9375 19.6562 15.9375 17.8125C15.9375 15.9688 16.5703 14.4141 17.8359 13.1484C19.1016 11.8828 20.6562 11.25 22.5 11.25C24.3438 11.25 25.8984 11.8828 27.1641 13.1484C28.4297 14.4141 29.0625 15.9688 29.0625 17.8125C29.0625 19.6562 28.4297 21.2109 27.1641 22.4766C25.8984 23.7422 24.3438 24.375 22.5 24.375ZM22.5 41.25C19.9062 41.25 17.4688 40.7578 15.1875 39.7734C12.9062 38.7891 10.9219 37.4531 9.23438 35.7656C7.54687 34.0781 6.21094 32.0938 5.22656 29.8125C4.24219 27.5313 3.75 25.0938 3.75 22.5C3.75 19.9062 4.24219 17.4688 5.22656 15.1875C6.21094 12.9062 7.54687 10.9219 9.23438 9.23438C10.9219 7.54687 12.9062 6.21094 15.1875 5.22656C17.4688 4.24219 19.9062 3.75 22.5 3.75C25.0938 3.75 27.5313 4.24219 29.8125 5.22656C32.0938 6.21094 34.0781 7.54687 35.7656 9.23438C37.4531 10.9219 38.7891 12.9062 39.7734 15.1875C40.7578 17.4688 41.25 19.9062 41.25 22.5C41.25 25.0938 40.7578 27.5313 39.7734 29.8125C38.7891 32.0938 37.4531 34.0781 35.7656 35.7656C34.0781 37.4531 32.0938 38.7891 29.8125 39.7734C27.5313 40.7578 25.0938 41.25 22.5 41.25Z" fill="white"/>
            </svg>
          </div>
       )}

      </div>
      </div>
    
    </header>
  );
};

/** 메인 라우터 관리 */
const MainContent = () => {
  const location = useLocation();
  
  // "/Detail" 경로일 때 Header와 ScrollToTopButton 숨김
  const isDetailPage = location.pathname === "/Detail";

  return (
    <>
      {!isDetailPage && <Header />}
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 기본 경로 */}
        <Route path="/Bookmark" element={<BookmarkPage />} /> 
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Album" element={<AlbumPage />} />
        <Route path="/Review" element={<ReviewPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/Detail" element={<PlaceDetailPage />} />
      </Routes>
      {!isDetailPage && <ScrollToTopButton />} {/* PlaceDetailPage에서 숨김 */}
    </>
  );
};

/** 최종 App 컴포넌트 */
const App = () => {
  return (
    <AuthProvider> {/* 로그인 상태를 전역적으로 관리 */}
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
