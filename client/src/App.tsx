import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/admin/Dashboard";
import EditProfile from "@/pages/admin/EditProfile";
import ManageProjects from "@/pages/admin/ManageProjects";
import ManageSkills from "@/pages/admin/ManageSkills";
import ManageExperience from "@/pages/admin/ManageExperience";
import ManageEducation from "@/pages/admin/ManageEducation";
import ManageCertificates from "@/pages/admin/ManageCertificates";
import Messages from "@/pages/admin/Messages";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

import Login from "@/pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />

      <Route path="/admin">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/admin/profile">
        <ProtectedRoute component={EditProfile} />
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute component={ManageProjects} />
      </Route>
      <Route path="/admin/skills">
        <ProtectedRoute component={ManageSkills} />
      </Route>
      <Route path="/admin/experience">
        <ProtectedRoute component={ManageExperience} />
      </Route>
      <Route path="/admin/education">
        <ProtectedRoute component={ManageEducation} />
      </Route>
      <Route path="/admin/certificates">
        <ProtectedRoute component={ManageCertificates} />
      </Route>
      <Route path="/admin/messages">
        <ProtectedRoute component={Messages} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
