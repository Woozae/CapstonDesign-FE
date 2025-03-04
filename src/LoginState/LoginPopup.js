import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";

const LoginPopup = ({ show, onClose, position }) => {
  const navigate = useNavigate();

  if (!show) return null; // 팝업을 표시할 필요가 없으면 렌더링하지 않음

  return (
    <>
    {/* 팝업 배경 오버레이 */}
    <div className="popup-overlay" onClick={onClose}></div>
    
    <div className="login-popup-overlay" 
    onClick={(e) => e.stopPropagation()}>
        <div className="login-popup" style={{ top: position.top, left: position.left }}>
            <p> 로그인이 필요합니다. </p>
            <button onClick={() => navigate("/Login")}>로그인</button>
            <span className="close-btn" onClick={onClose}>×</span>
        </div>
    </div>
    </>
  );
};

export default LoginPopup;

