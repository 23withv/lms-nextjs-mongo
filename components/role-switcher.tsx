"use client";

import * as React from "react";
import { ChevronsUpDown, Check, GraduationCap, Presentation, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { switchMode } from "@/actions/set-mode";

interface RoleSwitcherProps {
  actualRole: string; 
  currentMode: string; 
}

export function RoleSwitcher({ actualRole, currentMode }: RoleSwitcherProps) {
  if (actualRole === "STUDENT") return null;

  const handleSwitch = async (mode: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    await switchMode(mode);
  };

  const getModeLabel = (mode: string) => {
    if (mode === "ADMIN") return { label: "Administrator", icon: ShieldCheck };
    if (mode === "INSTRUCTOR") return { label: "Instructor Mode", icon: Presentation };
    return { label: "Student Mode", icon: GraduationCap };
  };

  const active = getModeLabel(currentMode);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <active.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{active.label}</span>
                <span className="truncate text-xs text-muted-foreground">Switch View</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Role View
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={() => handleSwitch("STUDENT")} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <GraduationCap className="size-4" />
              </div>
              Student Mode
              {currentMode === "STUDENT" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>

            {(actualRole === "INSTRUCTOR" || actualRole === "ADMIN") && (
                <DropdownMenuItem onClick={() => handleSwitch("INSTRUCTOR")} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Presentation className="size-4" />
                </div>
                Instructor Mode
                {currentMode === "INSTRUCTOR" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
            )}
            
            {actualRole === "ADMIN" && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSwitch("ADMIN")} className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                        <ShieldCheck className="size-4" />
                    </div>
                    Administrator
                    {currentMode === "ADMIN" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}