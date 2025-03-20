import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PlaceDetailPage.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";


const PlaceDetailPage = () => {
  const location = useLocation();

  // URL에서 `title` 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const selectedTitle = queryParams.get("title") || "명소 상세 정보"; // 기본값 설정

  // 샘플 이미지 리스트 (현재는 단색 배경 이미지 사용)
  const images = [
    "/images/커튼콜.jpg",
    "/images/backlit.png",
    "/images/sample3.jpg",
    "/images/sample4.jpg",
  ];

  // 현재 보이는 이미지 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이전 이미지로 이동 (첫 번째 이미지에서 클릭하면 마지막 이미지로 이동)
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // 다음 이미지로 이동 (마지막 이미지에서 클릭하면 첫 번째 이미지로 이동)
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="place-detail-container">
      {/* 대표 이미지 슬라이더 */}
      
        <div className="place-detail-image-container">
          <button className="place-arrow left" onClick={prevImage}>
            <AiOutlineLeft />
          </button>
          <img src={images[currentIndex]} />
          <button className="place-arrow right" onClick={nextImage}>
            <AiOutlineRight />
          </button>
        </div>
    

      {/* 제목 */}
      <div className="place-detail-block">
        <h2 className="place-detail-title">{selectedTitle}</h2>
      </div>

      {/* 정보 블록 */}
      <div className="place-detail-block">
        <div className="place-detail-info">
          <p> 주소: 인천광역시 송도동</p>
          <p> 전화번호: 032-123-4567</p>
          <p> 홈페이지: <a href="https://example.com">example.com</a></p>
        </div>
      </div>

      {/* 설명 */}
      <div className="place-detail-block">
        <div className="place-detail-description">
          <p>
            {selectedTitle}는 아름다운 풍경과 다양한 액티비티를 즐길 수 있는 명소입니다.
            가족, 연인, 친구와 함께 방문하기 좋은 장소로 추천드립니다.
          </p>
        </div>
      </div>

      {/* 특이사항 리스트 */}
      <div className="place-detail-block">
        <div className="place-detail-features">
          <h3>특징</h3>
          <ul>
            <li>넓은 공원과 휴식 공간</li>
            <li>다양한 맛집과 카페</li>
            <li>야경이 아름다운 장소</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
