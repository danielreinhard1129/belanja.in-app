import { axiosInstance } from "@/libs/axios";
import { useAppDispatch } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import { useEffect } from "react";

const useAxios = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("Authorization");
  const parsedToken = token?.split(" ")[1];
  
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${parsedToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err?.response?.status === 401) {
          dispatch(logoutAction());
          localStorage.removeItem("Authorization");
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
