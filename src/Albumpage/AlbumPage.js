import React, { useState, useEffect } from "react";
import { useAuth } from "../LoginState/AuthContext"; // 로그인 상태 가져오기
import LoginPopup from "../LoginState/LoginPopup"; // 팝업 컴포넌트 추가
import "./AlbumPage.css";

const AlbumPage = () => {
  const { isLoggedIn } = useAuth(); // 로그인 상태 확인
    const [showLoginPopup, setShowLoginPopup] = useState(false); // 팝업 상태
    const [popupPosition, setPopupPosition] = useState({ top: "50%", left: "50%" });
  const [profileImage, setProfileImage] = useState(null);
  const totalPhotos = 8; // 사진 개수
  const [bookmarkedStates, setBookmarkedStates] = useState(
    Array(totalPhotos).fill(false) // 각 북마크 상태를 false로 초기화
  );

  useEffect(() => {
    const paragraphs = document.querySelectorAll(".photo-card p");
    const maxLength = 70;

    paragraphs.forEach((paragraph) => {
      const text = paragraph.textContent.trim();
      if (text.length > maxLength) {
        paragraph.textContent = text.substring(0, maxLength) + "...";
      }
    });
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result); // base64 URL로 설정
      };
      reader.readAsDataURL(file);
    }
  };


  // 로그인 필요 팝업 표시
  const showLoginRequiredPopup = () => {
    // 스크롤 업 버튼 위치 기준으로 팝업 배치
    const scrollButton = document.querySelector(".scroll-to-top");
  
    if (!scrollButton) return; // 버튼이 없으면 리턴
  
    const buttonRect = scrollButton.getBoundingClientRect();
    
    // 기본 위치 (스크롤 버튼 왼쪽)
    let left = buttonRect.left - 300; // 버튼 왼쪽에서 360px 이동
    let top = buttonRect.top - 10; // 현재 스크롤 위치 반영
  
    setPopupPosition({ top: `${top}px`, left: `${left}px` });
    setShowLoginPopup(true);
  };

  const handleBookmarkClick = (event, index) => {
    if (event && event.stopPropagation) {
      event.stopPropagation(); // 부모 요소 클릭 방지
    }
  
    if (!isLoggedIn) {
      showLoginRequiredPopup(event); // 로그인 필요 팝업 표시
      return;
    }
  
    setBookmarkedStates((prevStates) => {
      const newStates = [...prevStates]; // 상태 복사
      newStates[index] = !newStates[index]; // 클릭한 북마크의 상태 변경
      return newStates;
    });
  };
  

  return (
    
    <main className="album-main">
      <h2 className="album-title">나의 사진첩</h2>
      <div className="album-section">
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <div
              className="profile-image"
              style={{
                backgroundImage: profileImage
                  ? `url(${profileImage})`
                  : "none",
                backgroundColor: !profileImage ? "#ccc" : "transparent",
              }}
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            ></div>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
          <div className="profile-info">
            <h3>Name</h3>
            <p>Information</p>
          </div>
        </div>

        <div className="album-gallery">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div className="photo-card" key={index}>
                <div className="photo-thumbnail"></div>
                <div className="photo-header">
                <h4>Title</h4>
                <div
                      className="bookmark-icon"
                      onClick={(event) => handleBookmarkClick(event, index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 62 62"
                    fill={bookmarkedStates[index] ? "#fef399" : "none"} // 개별 카드 상태에 따라 색상 변경
                    stroke="#1E1E1E"
                  >
                    <path
                      d="M49.0834 54.25L31.0001 41.3333L12.9167 54.25V12.9167C12.9167 11.5464 13.4611 10.2322 14.43 9.26328C15.399 8.29434 16.7131 7.75 18.0834 7.75H43.9167C45.287 7.75 46.6012 8.29434 47.5701 9.26328C48.5391 10.2322 49.0834 11.5464 49.0834 12.9167V54.25Z"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
                <p>
                  오늘은 맑은 하늘 아래 산책을 하며 상쾌한 공기를 마셨습니다.
                  따스한 햇살과 함께 걷는 길은 마음을 편안하게 해줍니다.
                </p>
              </div>
            ))}
        </div>
      {/* 로그인 필요 팝업 추가 */}
     <LoginPopup show={showLoginPopup} onClose={() => setShowLoginPopup(false)} position={popupPosition} />
      
      </div>
    </main>
    
  );
};

export default AlbumPage;
