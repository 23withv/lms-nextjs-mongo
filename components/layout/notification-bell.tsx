"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { markAsRead, markAllAsRead } from "@/actions/common/notifications";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell({ initialNotifications }: { initialNotifications: NotificationItem[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [isOpen, setIsOpen] = useState(false);

  const handleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
  };

  const handleMarkAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsRead();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative shadow-sm">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto px-2 text-xs text-muted-foreground hover:text-primary"
                onClick={handleMarkAll}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-75">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-xs">No notifications yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex flex-col gap-1 border-b p-4 text-sm transition-colors hover:bg-muted/50",
                    !notif.isRead ? "bg-muted/30" : "opacity-80"
                  )}
                  onClick={() => !notif.isRead && handleRead(notif.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("font-semibold", 
                        notif.type === "SUCCESS" ? "text-green-600" :
                        notif.type === "ERROR" ? "text-red-600" : ""
                    )}>
                        {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{notif.message}</p>
                  <span className="text-[10px] text-muted-foreground/70 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}