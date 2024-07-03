import { axiosInstance } from "@/lib/axios";
import { useAppDispatch } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAxios = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("Authorization");
  const parsedToken = token?.split(" ")[1];
  const router = useRouter();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${parsedToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      (err: AxiosError) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("Authorization");
          localStorage.removeItem("token");
          router.push("/");
          dispatch(logoutAction());
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.request.eject(responseIntercept);
    };
  }, [dispatch, token]);

  return { axiosInstance };
};

export default useAxios;
