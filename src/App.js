import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AlbumPage from "./Albumpage/AlbumPage";
import LoginPage from "./Loginpage/LoginPage";
import BookmarkPage from "./Bookmarkpage/BookmarkPage";
import ReviewPage from "./Reviewpage/ReviewPage";
import MainPage from "./Mainpage/MainPage";
import SignupPage from "./Signuppage/SignupPage";
import PlaceDetailPage from "./PlaceDetailPage/PlaceDetailPage";
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

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={() => navigate("/")}>Spot-Right</h1>
        <div className="header-buttons">
          <button className="header-button-bookmark" onClick={() => navigate("/Bookmark")}>Bookmark</button>
          <button className="header-button-album" onClick={() => navigate("/Album")}>Album</button>
          <a href="#" className="header-icon" onClick={() => navigate("/Login")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 45 45" fill="none">
              <path d="M10.9688 32.0625C..." fill="white"/>
            </svg>
          </a>
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
    <Router>
      <MainContent />
    </Router>
  );
};

export default App;
