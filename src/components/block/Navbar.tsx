'use client';
import { Logo } from "./Logo";
import { SignOutBtn } from "./SignOutBtn";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "auth";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { PanelRight } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar({session}: {session: Session}) {
  const pathname = usePathname();
  return (
    <nav className="w-full flex items-center justify-between py-4 px-4 md:px-12 mx-auto fixed top-0 left-0 right-0 z-50 bg-background">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center space-x-4 md:space-x-6">
        <Link href="/dashboard" className={cn("text-sm text-slate-300", pathname === "/dashboard" && "text-white")}>Chat</Link>
        <Link href="/bookmarks" className={cn("text-sm text-slate-300", pathname === "/bookmarks" && "text-white")}>Bookmarks</Link>
        <Link href="/dashboard/projects" className={cn("text-sm text-slate-300", pathname.includes("/dashboard") && "text-white")}>Dashboard</Link>
      </div>

      <div className="relative flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer transition-shadow hover:shadow-lg w-8 h-8">
              <AvatarImage src={session.user.image ?? '#'} alt="Profile" />
              <AvatarFallback>
                {getInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-xl bg-popover border border-border mt-3 p-3">
            <div className="flex flex-col gap-2 px-2 py-2">
              <p className="text-sm font-medium text-foreground">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-1">
              <SignOutBtn />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
