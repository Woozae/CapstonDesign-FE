import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../LoginState/AuthContext"; // 로그인 상태 가져오기
import LoginPopup from "../LoginState/LoginPopup"; // 팝업 컴포넌트 추가
import "./MainPage.css";

const Mainpage = () => {
  const { isLoggedIn } = useAuth(); // 로그인 상태 확인
  const navigate = useNavigate();
  const [map, setMap] = useState(null); // 지도 객체 상태 추가
  const [level, setLevel] = useState(9); // 초기 줌 레벨
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 팝업 상태
  const [popupPosition, setPopupPosition] = useState({ top: "50%", left: "50%" });
 

  // 인천 지역 실제 장소 리스트
  const locations = [
    { title: "인천대공원", lat: 37.4487, lng: 126.7369, description: "넓은 자연 경관과 호수가 있는 공원", category: "자연" },
    { title: "송도 센트럴파크", lat: 37.393, lng: 126.634, description: "인천 송도에 위치한 아름다운 공원", category: "도시" },
    { title: "월미도", lat: 37.471, lng: 126.617, description: "놀이공원과 바다가 있는 명소", category: "바다" },
    { title: "강화도 마니산", lat: 37.6152, lng: 126.469, description: "한반도 최초의 개천제 장소", category: "산" },
  ];

  const loadNaverMap = (callback) => {
    if (window.naver && window.naver.maps) {
        callback();  // 네이버 지도 객체가 이미 있으면 바로 실행
        return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=kauma70b3t`;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  };

  
  
  const [selectedItemBookmark, setSelectedItemBookmark] = useState(false);
  const [selectedItemHeart, setSelectedItemHeart] = useState(false);
  const [bookmarkedStates, setBookmarkedStates] = useState([false, false, false, false]);
  const [heartStates, setHeartStates] = useState([false, false, false, false]);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [filteredLocations, setFilteredLocations] = useState(locations); // 필터된 리스트 상태
  const [selectedCategory, setSelectedCategory] = useState(""); // 추가된 상태
  
  //명소 상세 정보 페이지로 이동
  const handleTitleClick = (title) => {
    const detailUrl = `/Detail?title=${encodeURIComponent(title)}`;
  
    // 현재 사용자의 화면 크기 가져오기
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  
    // 새 창의 크기 설정
    const windowWidth = 800;  // 새 창의 너비
    const windowHeight = 1000; // 새 창의 높이
  
    // 새 창의 위치 설정 (화면 오른쪽 끝에 배치)
    const leftPosition = screenWidth - windowWidth;  // 오른쪽 끝 위치
    const topPosition = (screenHeight - windowHeight) / 2; // 세로 중앙 정렬
  
    // 새 창 열기
    window.open(
      detailUrl,
      "_blank",
      `width=${windowWidth},height=${windowHeight},left=${leftPosition},top=${topPosition},resizable=no,scrollbars=yes`
    );
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
    event.stopPropagation(); // 부모 요소 클릭 방지
    if (!isLoggedIn) {
      showLoginRequiredPopup(event);
      return;
    }
    const updatedStates = [...bookmarkedStates];
    updatedStates[index] = !bookmarkedStates[index];
    setBookmarkedStates(updatedStates);
  };

  

  const handleHeartClick = (event, index) => {
    event.stopPropagation(); // 부모 요소 클릭 방지
    if (!isLoggedIn) {
      showLoginRequiredPopup(event);
      return;
    }
    const updatedStates = [...heartStates];
    updatedStates[index] = !heartStates[index];
    setHeartStates(updatedStates);
  };

  // 상세 정보의 북마크 토글
  const handleDetailBookmarkClick = (event) => {
    event.stopPropagation(); // 부모 요소 클릭 방지
    if (!isLoggedIn) {
      showLoginRequiredPopup(event); // event 전달
      return;
    }
    setSelectedItemBookmark(!selectedItemBookmark);
  };

  // 상세 정보의 하트 토글
  const handleDetailHeartClick = (event) => {
    event.stopPropagation(); // 부모 요소 클릭 방지
    if (!isLoggedIn) {
      showLoginRequiredPopup(event); // event 전달
      return;
    }
    setSelectedItemHeart(!selectedItemHeart);
  };


  const handleItemClick = (index) => {
    const location = locations[index];
  
    if (selectedItem?.index === index) {
      // 선택 해제 시
      setSelectedItem(null);
  
      if (map) {
        map.setCenter(new naver.maps.LatLng(37.4565, 126.7052)); // 기본 위치로 이동
        map.setZoom(10); // 기본 줌 레벨
      }
    } else {
      // 새로운 아이템 선택 시
      setSelectedItem({
        index,
        title: location.title,
        description: location.description,
        category: location.category,
      });
  
      if (map) {
        map.setCenter(new naver.maps.LatLng(location.lat, location.lng));
        map.setZoom(13);
      }
    }
  
    // 부드러운 스크롤 이동
    setTimeout(() => {
      window.scrollTo({
        top: selectedItem ? 60 : 180,
        behavior: "smooth",
      });
    }, 100);
  };
  
  

  // **X 버튼 클릭 시 상세정보 닫기**
  const handleCloseDetail = () => {
    setSelectedItem(null);
      //항상 smooth 스크롤 적용
      setTimeout(() => {
        window.scrollTo({
          top: 60, // 페이지 최상단으로 이동
          behavior: "smooth",
        });
      }, 100);
  };


  // 검색 기능 추가
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredLocations(locations); // 검색어가 없으면 전체 리스트
    } else {
      setFilteredLocations(
        locations.filter((location) => location.title.includes(searchQuery))
      );
    }
  };

 // 카테고리 필터 기능 추가
 const handleCategoryClick = (category) => {
  if (selectedCategory === category) {
    setSelectedCategory(""); // 같은 카테고리 클릭하면 필터 해제
    setFilteredLocations(locations);
  } else {
    setSelectedCategory(category);
    setFilteredLocations(locations.filter((location) => location.category === category));
  }
  };




  useEffect(() => {

    loadNaverMap(() => {
      if (window.naver && window.naver.maps) {
        const mapInstance = new window.naver.maps.Map("map", {
          center: new window.naver.maps.LatLng(37.4565, 126.7052),
          zoom: 10,
        });

        window.map = mapInstance; // 전역 변수에 저장
        setMap(mapInstance);  

        naver.maps.Event.addListener(mapInstance, "zoom_changed", () => {
          const newZoomLevel = mapInstance.getZoom();
          setLevel((prevLevel) => {
            if (prevLevel !== newZoomLevel) {
              return newZoomLevel;
            }
            return prevLevel;
          });
        });
        }
    });
  }, []);



  const [markers, setMarkers] = useState([]); // 마커 상태 추가

  useEffect(() => {
    if (!map || locations.length === 0) return;
  

    if (level < 13) {
      // 상태 변경이 필요할 때만 실행
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]); 
      }
      return;
    }

  
    // 기존 마커와 개수 및 위치 비교 -> 동일하면 업데이트 안 함 (깜빡임 방지)
    if (markers.length === locations.length && markers.every((m, i) => 
      m.getPosition().lat() === locations[i].lat && 
      m.getPosition().lng() === locations[i].lng
    )) {
      return;
    }
  
    // 기존 마커 제거 후 새 마커 추가
    markers.forEach(marker => marker.setMap(null));
  
    const newMarkers = locations.map(location => {
      const marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(location.lat, location.lng),
      });
  
      // 마커 클릭 시 해당 장소 상세 정보 표시
      naver.maps.Event.addListener(marker, "click", () => {
        setSelectedItem(prevItem => (prevItem?.title === location.title ? null : location));
        map.setCenter(new naver.maps.LatLng(location.lat, location.lng));
        map.setZoom(13);
  
        // smooth 스크롤 적용
        setTimeout(() => {
          window.scrollTo({
            top: 180,
            behavior: "smooth",
          });
        }, 100);
      });
  
      return marker;
    });
  
    setMarkers(newMarkers); // 마커 상태 업데이트
  
  }, [map, locations, level]); // level 값이 변경될 때만 실행
  

  return (
    <div className="page-contatiner">
    <div className="main-container">
      {/* 왼쪽: 지도 + 검색 + 필터 */}
      <div className="left-container">
        <div className="top-controls">
        <div className="search-container">
        <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
        <div className="search-icon" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
            <path d="M16.625 15.8182L13.1812 12.5416M15.0417 8.28573C15.0417 11.6138 12.2061 14.3117 8.70833 14.3117C5.21053 14.3117 2.375 11.6138 2.375 8.28573C2.375 4.95768 5.21053 2.25977 8.70833 2.25977C12.2061 2.25977 15.0417 4.95768 15.0417 8.28573Z" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        </div>
        <div className="filters">
          {["자연", "도시", "바다", "산"].map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
          ))}
        </div>

        </div>
        {/* 지도 영역: 선택된 아이템이 있으면 높이를 줄임 */}
        <div className={`map-container `}>
          <div id="map" className="map-placeholder" ></div>
         
        </div>


        {/* 선택된 아이템의 상세 정보 */}
        {selectedItem && (
          <div className="detail-container">
          <div className="detail-header">
              <div className="detail-thumbnails">
                <div className="thumbnail"></div>
                <div className="thumbnail"></div>
                <div className="thumbnail"></div>
              </div>
              <div className="detail-sub">
                <div className="detail-title">
                <h3 
                  onClick={() => handleTitleClick(selectedItem.title)} 
                  style={{ cursor: "pointer", color: "#2e2e2e", textDecoration: "none" }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  {selectedItem.title}
                </h3>
           
                {/* 리뷰 아이콘 클릭 시 리뷰페이지로 이동 
                <svg className="review-icon" onClick={() => navigate("/Review")} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20H20M12.67 5.53996L14.49 3.71996C15.1576 3.05227 16.0942 2.68774 17.07 2.71996C17.5941 2.72012 18.1047 2.9172 18.5 3.27996C18.8995 3.64479 19.1449 4.13617 19.19 4.65996C19.2351 5.18375 19.0772 5.70484 18.74 6.12996L16.92 7.94996M12.67 5.53996L5.5 12.71V16.5H9.29L16.46 9.32996L12.67 5.53996Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                */}
                              
                </div>
                <div className="detail-info">
                  <p className="detail-desc">{selectedItem.description}</p>
                </div>
                
              </div>
            
            <svg className="close-icon" onClick={handleCloseDetail} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 30 30" fill="none">
            <path d="M22.5 7.5L7.5 22.5M7.5 7.5L22.5 22.5" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        


          <div className="detail-content">
            {/* 왼쪽: 카테고리, 하트, 북마크 아이콘 */}
            <div className="detail-left">
              <span className="category-tag">{selectedItem.category}</span>
        
              <div className="heart-container" onClick={(event) => handleDetailHeartClick(event)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" viewBox="0 0 30 32"
                  fill={selectedItemHeart ? "#Fe0031" : "none"} stroke="#1E1E1E">
                  <path d="M26.05 6.33745C..." />
                  <g clip-path="url(#clip0_52_235)">
                    <path d="M26.05 6.33745C25.4116 5.67741 24.6535 5.15383 23.8192 4.7966C22.9849 4.43937 22.0906 4.25551 21.1875 4.25551C20.2844 4.25551 19.3902 4.43937 18.5558 4.7966C17.7215 5.15383 16.9635 5.67741 16.325 6.33745L15 7.70662L13.675 6.33745C12.3854 5.00485 10.6363 4.2562 8.81253 4.2562C6.98874 4.2562 5.23964 5.00485 3.95003 6.33745C2.66041 7.67005 1.93591 9.47745 1.93591 11.362C1.93591 13.2466 2.66041 15.054 3.95003 16.3866L15 27.8049L26.05 16.3866C26.6888 15.7269 27.1955 14.9436 27.5412 14.0814C27.8869 13.2193 28.0648 12.2952 28.0648 11.362C28.0648 10.4288 27.8869 9.50475 27.5412 8.64262C27.1955 7.78048 26.6888 6.99718 26.05 6.33745Z" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_52_235">
                      <rect width="30" height="31" fill="white" transform="translate(0 0.382874)"/>
                    </clipPath>
                  </defs>
                  </svg>
                <span className="heart">231</span>
              </div>
        

        
              
              <div className="bookmark-container" onClick={(event) => handleDetailBookmarkClick(event)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 34 35"
                  fill={selectedItemBookmark ? "#fef399" : "none"} stroke="#1E1E1E">
                  <path
                      d="M26.9167 29.8284L17 22.7451L7.08334 29.8284V7.16176C7.08334 6.41032 7.38185 5.68965 7.91321 5.15829C8.44456 4.62694 9.16523 4.32843 9.91668 4.32843H24.0833C24.8348 4.32843 25.5555 4.62694 26.0868 5.15829C26.6182 5.68965 26.9167 6.41032 26.9167 7.16176V29.8284Z"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>   
                  <span className="bookmark">Bookmark</span>
                </div>
                </div>
        
            {/* 오른쪽: 리뷰 리스트 
            <div className="detail-right">
              <p>review ...</p>
              <p>review ...</p>
              <p>review ...</p>
            </div>
            */}
          </div>
        </div>

        )}
      </div>

      {/* 오른쪽: 리스트 */}
      <div className="list-container">
        <div className="semi-container">
        {filteredLocations.map((location, index) => (
              <div key={index} className="list-item" onClick={() => handleItemClick(index)}>
              {/* 북마크 아이콘, 썸네일, 텍스트 정보 묶음 */}
              <div className="list-content">
                {/* 썸네일 */}
                <div className="list-thumbnail"></div>

                {/* 텍스트 정보 */}
                <div className="list-info">
                  <h3>{location.title}</h3>
                  <p>{location.description}</p>        
                </div>

                {/* 북마크 아이콘 (오른쪽 상단) */}
                <div className="bookmark-icon" onClick={(event) => handleBookmarkClick(event, index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 34 35"
                    fill={bookmarkedStates[index] ? "#fef399" : "none"} 
                    stroke="#1E1E1E"
                  >
                    <path
                      d="M26.9167 29.8284L17 22.7451L7.08334 29.8284V7.16176C7.08334 6.41032 7.38185 5.68965 7.91321 5.15829C8.44456 4.62694 9.16523 4.32843 9.91668 4.32843H24.0833C24.8348 4.32843 25.5555 4.62694 26.0868 5.15829C26.6182 5.68965 26.9167 6.41032 26.9167 7.16176V29.8284Z"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 하단: 하트 아이콘과 카테고리 태그 */}
              <div className="list-footer">
                {/* 하트 아이콘 및 숫자 (왼쪽) */}
                <div className="heart-container" onClick={(event) => handleHeartClick(event, index)}>
                  <div className="heart-icon">

                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" viewBox="0 0 30 32" fill={heartStates[index] ? "#Fe0031" : "none"} // 빨간색 토글
                      stroke="#1E1E1E">
                  <g clip-path="url(#clip0_52_235)">
                    <path d="M26.05 6.33745C25.4116 5.67741 24.6535 5.15383 23.8192 4.7966C22.9849 4.43937 22.0906 4.25551 21.1875 4.25551C20.2844 4.25551 19.3902 4.43937 18.5558 4.7966C17.7215 5.15383 16.9635 5.67741 16.325 6.33745L15 7.70662L13.675 6.33745C12.3854 5.00485 10.6363 4.2562 8.81253 4.2562C6.98874 4.2562 5.23964 5.00485 3.95003 6.33745C2.66041 7.67005 1.93591 9.47745 1.93591 11.362C1.93591 13.2466 2.66041 15.054 3.95003 16.3866L15 27.8049L26.05 16.3866C26.6888 15.7269 27.1955 14.9436 27.5412 14.0814C27.8869 13.2193 28.0648 12.2952 28.0648 11.362C28.0648 10.4288 27.8869 9.50475 27.5412 8.64262C27.1955 7.78048 26.6888 6.99718 26.05 6.33745Z" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_52_235">
                      <rect width="30" height="31" fill="white" transform="translate(0 0.382874)"/>
                    </clipPath>
                  </defs>
                  </svg>
                  </div>
                  <span className="heart">123</span>
                </div>

                {/* 카테고리 태그 (오른쪽) */}
                <span className="category-tag">{location.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
      {/* 리스트 클릭 시, 하단에 표시될 영역 */}
            
      {selectedItem && (
        <div className="bottom-container">
          {/* 메인 컨테이너 아래 경계선 */}
          <div className="bottom-border"></div>

          <h2 className="bottom-title">유사 명소</h2>

          <div className="similar-gallery">
            <div className="similar-card">
              <div className="similar-thumbnail"></div>
                <h4 className="similar-card-title">Title</h4>
              <div className="similar-categories">
                <span className="similar-category">하늘</span>
              </div>
            </div>

            <div className="similar-card">
              <div className="similar-thumbnail"></div>
                <h4 className="similar-card-title">Title</h4>
              <div className="similar-categories">
                <span className="similar-category">하늘</span>
              </div>
            </div>

            <div className="similar-card">
              <div className="similar-thumbnail"></div>
                <h4 className="similar-card-title">Title</h4>
              <div className="similar-categories">
                <span className="similar-category">하늘</span>
              </div>
            </div>

            <div className="similar-card">
              <div className="similar-thumbnail"></div>
                <h4 className="similar-card-title">Title</h4>
              <div className="similar-categories">
                <span className="similar-category">하늘</span>
              </div>
            </div>

          </div>

        </div>
      )}

    {/* 로그인 필요 팝업 추가 */}
    <LoginPopup show={showLoginPopup} onClose={() => setShowLoginPopup(false)} position={popupPosition} />
      
    </div>
  );
};

export default Mainpage;
