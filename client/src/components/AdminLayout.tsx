import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, User, Briefcase, GraduationCap, 
  Code2, MessageSquare, LogOut, Award, Home, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useLogout } from "@/hooks/use-user";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { mutate: logout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/profile", icon: User, label: "Profile" },
    { href: "/admin/skills", icon: Code2, label: "Skills" },
    { href: "/admin/experience", icon: Briefcase, label: "Experience" },
    { href: "/admin/education", icon: GraduationCap, label: "Education" },
    { href: "/admin/certificates", icon: Award, label: "Certificates" },
    { href: "/admin/projects", icon: Code2, label: "Projects" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  ];

  const displayName = user?.username || "Admin";

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50 px-4 py-3 flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-primary">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-card border-r border-border fixed h-full flex flex-col z-50 transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border">
          <h2 className="font-display font-bold text-xl text-primary">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your content</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-5 h-5" />
            Back to Site
          </Link>
          
          <div className="h-px bg-border my-2" />

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-foreground">{displayName}</p>
              <p className="text-xs">Administrator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="mt-2 flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full justify-start"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
