import { AdminLayout } from "@/components/AdminLayout";
import { useProfile, useUpdateProfile } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfileSchema, type InsertProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";

export default function EditProfile() {
  const { data: profile, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();
  const { toast } = useToast();

  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      fullName: "",
      title: "",
      bio: "",
      avatarUrl: "",
      location: "",
      resumeUrl: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        title: profile.title,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl || "",
        location: profile.location || "",
        resumeUrl: profile.resumeUrl || "",
      });
    }
  }, [profile, form]);

  function onSubmit(data: InsertProfile) {
    mutate(data, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
      },
      onError: () => {
        toast({ title: "Failed to update profile", variant: "destructive" });
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Edit Profile</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                {...form.register("fullName")}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              />
              {form.formState.errors.fullName && <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <input
                {...form.register("title")}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              />
              {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              {...form.register("bio")}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
             {form.formState.errors.bio && <p className="text-destructive text-sm">{form.formState.errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                {...form.register("location")}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                {...form.register("avatarUrl")}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Resume URL</label>
            <input
              {...form.register("resumeUrl")}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
