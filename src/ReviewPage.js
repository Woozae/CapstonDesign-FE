import React, { useState } from "react";
import "./ReviewPage.css";

function ReviewPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rating, setRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopyrighted, setIsCopyrighted] = useState(false);
  const [isWrited, setIsWrited] = useState(false);
  const categories = ["하늘", "바다", "산", "도시", "기타"];

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCopyrightClick = () => {
    setIsCopyrighted(!isCopyrighted);
  };
  
  const handleWriteClick = () => {
    setIsWrited(!isWrited);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 1) {
      alert("최대 1개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(newImages);
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      alert("최대 3개의 카테고리만 선택할 수 있습니다.");
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  return (
    <>

      <main className="main">
        <h2>Review</h2>
        <div className="layoutContainer">
          {/* 왼쪽 섹션 */}
          <div className="leftSection">
            {/* 이미지 업로드 */}
            <div className="imageContainer">
              {!selectedImages.length && (
                <div className="placeholder">사진을 업로드해주세요</div>
              )}
              <div className="imagePreview">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="previewImage"
                  />
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                multiple
                className="fileInput"
              />
            </div>

           {/* 카테고리 선택 */}
    <div className="categoryContainer">
      <h4 className="category-title">
        <label className="category-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="20"
            viewBox="0 0 44 37"
            fill="none"
          >
            <path
              d="M39.4512 16.9583V26.2083C39.4512 32.375 37.658 33.9166 30.485 33.9166H12.5526C5.37967 33.9166 3.58643 32.375 3.58643 26.2083V10.7916C3.58643 4.62498 5.37967 3.08331 12.5526 3.08331H15.2425C17.9324 3.08331 18.5241 3.76165 19.5463 4.93331L22.2361 8.01665C22.9176 8.78748 23.3121 9.24998 25.1053 9.24998H30.485C37.658 9.24998 39.4512 10.7916 39.4512 16.9583Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeMiterlimit="10"
            />
          </svg>
        </label>
        카테고리
      </h4>
      
      <div className="category-list">
            {categories.map((category) => (
              <div key={category} className="category-item">
                <label>
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
</div>


          {/* 오른쪽 섹션 */}
          <div className="rightSection">
              
              {/* 평가 */}
              <div className="ratingContainer">
                <label>평가</label>
                <div>
                  {Array(5)
                    .fill()
                    .map((_, index) => (
                      <span
                        key={index}
                        className={`star ${index < rating ? "selected" : ""}`}
                        onClick={() => handleStarClick(index)}
                      >
                        ★
                      </span>
                    ))}
                </div>
              </div>


            {/* 한 줄 코멘트 */}
            <div className="commentContainer">
              <label>  한 줄 코멘트</label>
              <textarea placeholder="내용을 입력하세요" className="textarea" />
            </div>
            <div className="BookmarkCopyrightCon">


            {/* Copyright */}
            <div className="CopyrightCon">
              <a
                href="#"
                className="Copyright-icon"
                onClick={(event) => {
                  event.preventDefault();
                  handleCopyrightClick();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 36 36"
                  fill="none" /* 내부는 비워 둠 */
                  stroke={isCopyrighted ? "#03c75b" : "#1E1E1E"} /* 체크 표시 색상 변경 */
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M30 9L13.5 25.5L6 18" />
                </svg>
              </a>
              <span>저작권 허용</span>
            </div>

           
              {/* Bookmark */}
              <div className="BookmarkCon" onClick={handleBookmarkClick}>
                  <a
                    href="#"
                    className="Bookmark-icon"
                    onClick={(event) => {
                      event.preventDefault();
                      handleBookmarkClick();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32" /* 크기 키움 */
                      height="32" /* 크기 키움 */
                      viewBox="0 0 62 62"
                      fill={isBookmarked ? "#000000" : "none"}
                      stroke="#1E1E1E"
                    >
                      <path
                        d="M49.0834 54.25L31.0001 41.3333L12.9167 54.25V12.9167C12.9167 11.5464 13.4611 10.2322 14.43 9.26328C15.399 8.29434 16.7131 7.75 18.0834 7.75H43.9167C45.287 7.75 46.6012 8.29434 47.5701 9.26328C48.5391 10.2322 49.0834 11.5464 49.0834 12.9167V54.25Z"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <span>Bookmark</span>
                </div>

               
              </div>
              
               
                {/* Write */}
                <div className="WriteCon" onClick={handleWriteClick}>
                  <a
                    href="#"
                    className="Write-icon"
                    onClick={(event) => {
                      event.preventDefault();
                      handleWriteClick();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22.2H21.6M15 4.80002L19.2 8.40003M4.20002 15.6L16.0314 3.35545C17.3053 2.08155 19.3707 2.08155 20.6446 3.35545C21.9185 4.62935 21.9185 6.69475 20.6446 7.96865L8.40002 19.8L2.40002 21.6L4.20002 15.6Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                  <span className="writelabel">작성</span>
                </div>
          </div>

</div>
      </main>
    </>
  );
}

export default ReviewPage;