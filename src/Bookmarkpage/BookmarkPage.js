import React, { useState } from "react"; 
import { useAuth } from "../LoginState/AuthContext"; // 로그인 상태 가져오기
import LoginPopup from "../LoginState/LoginPopup"; // 팝업 컴포넌트 추가
import "./BookmarkPage.css";

const BookmarkPage = () => {
  const { isLoggedIn } = useAuth(); // 로그인 상태 확인
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 팝업 상태
  const [popupPosition, setPopupPosition] = useState({ top: "50%", left: "50%" });
  const [bookmarkedStates, setBookmarkedStates] = useState(
    Array(8).fill(false) // 초기에는 모든 북마크 상태가 false
  );
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리 상태

  const categories = ["하늘", "바다", "산", "도시", "기타"];

  // 각 카드의 카테고리를 랜덤으로 설정 (카드당 3개씩)
  const cardCategories = Array(8)
    .fill(0)
    .map(() => {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3).sort((a, b) => categories.indexOf(a) - categories.indexOf(b)); // 순서대로 정렬
    });


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
  
  // 북마크 클릭 시 로그인 체크 후 처리
  const handleBookmarkClick = (event, index) => {
    event.stopPropagation();
    if (!isLoggedIn) {
      showLoginRequiredPopup(event);
      return;
    }

    const updatedStates = [...bookmarkedStates];
    updatedStates[index] = !bookmarkedStates[index];
    setBookmarkedStates(updatedStates);
  };


  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };


  
  return (
    <div className="bookmark-main">
      <div className="bookmark-header">
        <h2 className="bookmark-title">Bookmark</h2>
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
          <button
            className={`category-button ${selectedCategory === "전체" ? "active" : ""}`}
            onClick={() => handleCategoryFilter("전체")}
          >
            전체
          </button>
        </div>
      </div>
      <div className="bookmark-section">
        <div className="bookmark-gallery">
          {Array(8)
            .fill(0)
            .map((_, index) => {
              // 선택된 카테고리에 해당하지 않으면 렌더링하지 않음
              if (
                selectedCategory !== "전체" &&
                !cardCategories[index].includes(selectedCategory)
              ) {
                return null;
              }
              return (
                <div className="bookmark-card" key={index}>
                  <div className="bookmark-thumbnail"></div>
                  <div className="bookmark-semi-header">
                    <h4 className="bookmark-card-title">Title</h4>
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
                  <div className="bookmark-categories">
                    {cardCategories[index].map((category, idx) => (
                      <span className="bookmark-category" key={idx}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

     {/* 로그인 필요 팝업 추가 */}
     <LoginPopup show={showLoginPopup} onClose={() => setShowLoginPopup(false)} position={popupPosition} />
      
      </div>
  );
};

export default BookmarkPage;