import React, { useState, useEffect } from "react";
import "./SignupPage.css";

const SignupPage = () => {
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
        if (!value) errorMsg = "비밀번호 확인을 입력해주세요.";
        else if (value !== formData.password)
          errorMsg = "비밀번호가 일치하지 않습니다.";
        break;
      case "name":
        if (!value) errorMsg = "이름을 입력해주세요.";
        break;
      case "birthYear":
      case "birthMonth":
      case "birthDay":
        if (!formData.birthYear || !formData.birthMonth || !formData.birthDay)
          errorMsg = "생년월일을 입력해주세요.";
        break;
      case "email":
        if (!value) errorMsg = "이메일을 입력해주세요.";
        break;
      case "phone":
        if (!value) errorMsg = "휴대폰 번호를 입력해주세요.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    validateField(id, value);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    if (Object.values(errors).every((error) => error === "")) {
      alert("회원가입 성공!");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input type="text" id="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} />
          <p className="info">문자, 숫자, 기호를 조합하여 10~15자로 입력해주세요.</p>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 재확인</label>
          <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* 생년월일 */}
        <div className="form-group birth-group">
          <label>생년월일</label>
          <div className="birth-date">
            <input type="text" placeholder="년(4자)" id="birthYear" value={formData.birthYear} onChange={handleChange} onBlur={handleBlur} />
            <select id="birthMonth" value={formData.birthMonth} onChange={handleChange} onBlur={handleBlur}>
              <option value="">월</option>
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>{m + 1}</option>
              ))}
            </select>
            <input type="text" placeholder="일" id="birthDay" value={formData.birthDay} onChange={handleChange} onBlur={handleBlur} />
          </div>
          {errors.birthYear && <p className="error">{errors.birthYear}</p>}
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* 휴대폰 번호 */}
        <div className="form-group">
          <label htmlFor="phone">휴대폰</label>
          <input type="text" id="phone" placeholder="'-' 없이 입력" value={formData.phone} onChange={handleChange} onBlur={handleBlur} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <button type="submit" className="signup-button">가입하기</button>
      </form>
    </div>
  );
};

export default SignupPage;
