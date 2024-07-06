import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUpdateIsReadStockJournalSuperAdmin from "@/hooks/api/stock-journal/useUpdateIsReadStockJournalSuperAdmin";
import useGetNotificationSuperAdmin from "@/hooks/api/store-product/useGetNotificationSuperAdmin";
import { Bell, Loader2 } from "lucide-react";
import React from "react";
const NotificationIcon: React.FC = () => {
  const { notifications, refetch } = useGetNotificationSuperAdmin();
  const { updateIsReadStockJournalSuperAdmin, isLoading } =
    useUpdateIsReadStockJournalSuperAdmin();
  const handleIsRead = async () => {
    await updateIsReadStockJournalSuperAdmin();
    refetch();
  };
  if (!notifications) {
    return <div>No notifications found.</div>;
  }
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Popover>
        <PopoverTrigger>
          <div style={{ position: "relative" }}>
            <Bell size={20} />
            {notifications[0]?.count > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "0.1em 0.6em",
                  fontSize: "0.8em",
                  fontWeight: "bold",
                }}
              >
                {notifications[0]?.count}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-4">
          <ScrollArea className="h-[250px]">
            <div className="text-xs">
              <div className="mb-2 text-center font-bold">
                A list of recent form store admin
              </div>
              <Table className="w-full text-[10px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>From Store</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>To Store</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Doesnt have any message
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifications.map((notification, i) => (
                      <TableRow key={i}>
                        <TableCell>{notification.store.name}</TableCell>
                        <TableCell>{notification.type}</TableCell>
                        {notification.JournalDetail.map(
                          (detail, detailIndex) => (
                            <React.Fragment key={detailIndex}>
                              <TableCell>
                                {detail.toStore?.name ?? "Not Found"}
                              </TableCell>
                            </React.Fragment>
                          ),
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {notifications && notifications.length > 0 && (
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full px-4 py-2 text-xs"
                variant="ghost"
                onClick={() => handleIsRead()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Mark as read"
                )}
              </Button>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default NotificationIcon;
