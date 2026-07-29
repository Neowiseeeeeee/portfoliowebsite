import { AdminLayout } from "@/components/AdminLayout";
import { useMessages, useProjects, useProfile } from "@/hooks/use-portfolio";
import { MessageSquare, Eye, Code2, User } from "lucide-react";

export default function Dashboard() {
  const { data: messages } = useMessages();
  const { data: projects } = useProjects();
  const { data: profile } = useProfile();

  const stats = [
    { label: "Total Projects", value: projects?.length || 0, icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Messages", value: messages?.length || 0, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Profile Status", value: profile ? "Complete" : "Incomplete", icon: User, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Views", value: "1.2k", icon: Eye, color: "text-orange-500", bg: "bg-orange-500/10" }, // Mock data
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Recent Messages</h2>
          <div className="space-y-4">
            {messages?.slice(0, 5).map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm">{msg.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
              </div>
            ))}
            {!messages?.length && (
              <p className="text-muted-foreground text-sm text-center py-8">No messages yet.</p>
            )}
          </div>
        </div>

        {/* Quick Actions or Other Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
             <a href="/admin/projects" className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-center">
               <Code2 className="w-6 h-6 mx-auto mb-2 text-primary" />
               <span className="text-sm font-medium">Add Project</span>
             </a>
             <a href="/admin/profile" className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-center">
               <User className="w-6 h-6 mx-auto mb-2 text-primary" />
               <span className="text-sm font-medium">Update Profile</span>
             </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
