import React, { useState, useEffect } from "react";
import { authApi } from "../services/api.ts";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    document.body.id = "signup-page";

    return () => {
      document.body.id = "";
    };
  }, []);

  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "username":
        if (!value) errorMsg = "아이디를 입력해주세요.";
        break;
      case "password":
        if (!value) errorMsg = "비밀번호를 입력해주세요.";
        else if (value.length < 10 || value.length > 15)
          errorMsg = "10~15자로 입력해주세요.";
        break;
      case "confirmPassword":
        if (!value) errorMsg = "비밀번호 재확인을 입력해주세요.";
        else if (value !== formData.password)
          errorMsg = "비밀번호가 일치하지 않습니다.";
        break;
      case "name":
        if (!value) errorMsg = "이름을 입력해주세요.";
        break;

      case "email":
        if (!value) errorMsg = "이메일을 입력해주세요.";
        break;

      case "nickname":
        if (!value) errorMsg = "닉네임을 입력해주세요.";
        break;

      default:
        break;
    }

    return errorMsg;
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    validateField(id, value);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 로딩 상태 시작

    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]); //  즉시 검증 결과를 반환받아 저장
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.values(errors).some((error) => error !== "")) {
      setLoading(false);
      return;
    }

    try {
      await authApi.signUp(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.nickname
      );
      alert("회원가입 성공!");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    } finally {
      setLoading(false); //  로딩 상태 종료
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p className="info">
            문자, 숫자, 기호를 조합하여 10~15자로 입력해주세요.
          </p>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 재확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* 닉네임 */}
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={formData.nickname}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.nickname && <p className="error">{errors.nickname}</p>}
        </div>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
