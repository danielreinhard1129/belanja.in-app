import { axiosInstance } from "@/libs/axios";
import { useAppSelector } from "@/redux/hooks";
import { NotifSuperAdmin } from "@/types/notification.type";
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
      );
      setNotifications(data);
    } catch (error) {
      setNotifications([]);
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
