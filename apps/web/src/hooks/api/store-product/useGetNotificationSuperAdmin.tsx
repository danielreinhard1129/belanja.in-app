import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { NotifSuperAdmin } from "@/types/notification.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetNotificationSuperAdmin = () => {
  const [notifications, setNotifications] = useState<NotifSuperAdmin[] | []>(
    [],
  );
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getNotificationSuperAdmin = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/stock-journals/super-admin/notifications",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setNotifications(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotificationSuperAdmin();
  }, []);

  return {
    notifications,
    isLoading,
    refetch: getNotificationSuperAdmin,
  };
};

export default useGetNotificationSuperAdmin;
