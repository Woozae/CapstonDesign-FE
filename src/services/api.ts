import axios, { AxiosInstance } from "axios";

// 백엔드 URL 가져오기
//const API_URL = process.env.REACT_APP_BACKEND_API_URL;

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: "https://api.peopletophoto.site", // 배포된 백엔드 URL 사용
  timeout: 5000, // 요청 제한 시간 (5초)
  withCredentials: true,
});

// API 요청 함수 (테스트용)
export const fetchData = async () => {
  try {
    const response = await api.get("/"); // 예제 엔드포인트
    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};
// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 토큰 만료 시 리프레시 토큰으로 갱신
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem("refreshToken");
//       try {
//         const res = await axios.post(`${API_URL}/auth/refresh`, {
//           refreshToken,
//         });
//         if (res.status === 200) {
//           localStorage.setItem("accessToken", res.data.accessToken);
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Unable to refresh token", refreshError);
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );
// 공통 에러 처리 함수
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    // 여기에 사용자에게 에러 메시지를 표시하는 로직 추가
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};

// Auth API
export const authApi = {
  signIn: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }).catch(handleApiError),
  signUp: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    nickname: string
  ) =>
    api
      .post("/api/auth/sign-up", {
        name,
        email,
        password,
        passwordConfirm,
        nickname,
      })
      .catch(handleApiError),
};

// City API
export const cityApi = {
  signIn: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }).catch(handleApiError),
  signUp: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) =>
    api
      .post("/auth/sign-up", { name, email, password, passwordConfirm })
      .catch(handleApiError),
};
