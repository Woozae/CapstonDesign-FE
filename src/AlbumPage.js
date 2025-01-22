import React, { useState, useEffect } from "react";
import "./AlbumPage.css";

const AlbumPage = () => {
  const [profileImage, setProfileImage] = useState(null);

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
                <h4>Title</h4>
                <p>
                  오늘은 맑은 하늘 아래 산책을 하며 상쾌한 공기를 마셨습니다.
                  따스한 햇살과 함께 걷는 길은 마음을 편안하게 해줍니다.
                </p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default AlbumPage;
