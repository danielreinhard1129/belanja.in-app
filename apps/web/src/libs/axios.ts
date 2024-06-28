import axios, { AxiosInstance, AxiosError } from "axios";
import { useAppDispatch } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response")
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const dispatch = useAppDispatch();
      const router = useRouter();
      router.push("/")
      dispatch(logoutAction());
      localStorage.removeItem("Authorization")
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
