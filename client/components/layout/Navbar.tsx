import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full border border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/10 shadow-lg">
      <div className="flex h-14 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
          <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium">Decomposr</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <Link to={user?.role === "pm" ? "/pm-dashboard" : "/employee-dashboard"} className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          <Link to="/docs" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border-2 border-white/10">
                      <AvatarFallback className="bg-gradient-to-br from-[#60ff50] to-[#a64dff] text-black font-bold text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-black/95 border-white/10 backdrop-blur-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                      <p className="text-xs text-primary capitalize">{user.role === "pm" ? "Product Manager" : "Team Member"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 hover:bg-white/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm" className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold">
              <Link to="/signup">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
