"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { markAsRead, markAllAsRead } from "@/actions/common/notifications";
import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface NotificationBellProps {
  initialNotifications: any[];
}

export function NotificationBell({ initialNotifications = [] }: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsRead();
  };

  if (!isMounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-background" />
        )}
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline flex items-center"
            >
              <Check className="w-3 h-3 mr-1" /> Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="h-75">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="grid">
              {notifications.map((notif) => (
                <button
                  key={notif.id} 
                  className={cn(
                    "flex flex-col items-start text-left gap-1 p-4 text-sm hover:bg-muted/50 transition-colors border-b last:border-0 w-full",
                    !notif.isRead && "bg-muted/20 border-l-2 border-l-primary"
                  )}
                  onClick={() => handleMarkAsRead(notif.id)} 
                >
                  <div className="font-semibold text-foreground w-full flex justify-between">
                    <span>{notif.title}</span>
                    {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                  </div>
                  <div className="text-muted-foreground line-clamp-2 w-full">
                    {notif.message}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}