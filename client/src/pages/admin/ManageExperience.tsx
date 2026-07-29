import { AdminLayout } from "@/components/AdminLayout";
import { useExperience, useCreateExperience, useDeleteExperience } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExperienceSchema, type InsertExperience } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageExperience() {
  const { data: experience, isLoading } = useExperience();
  const { mutate: create, isPending: isCreating } = useCreateExperience();
  const { mutate: remove } = useDeleteExperience();
  const { toast } = useToast();

  const form = useForm<InsertExperience>({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  });

  function onSubmit(data: InsertExperience) {
    create(data, {
      onSuccess: () => {
        toast({ title: "Experience added!" });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add experience", variant: "destructive" });
      }
    });
  }

  function handleDelete(id: number) {
    remove(id, {
      onSuccess: () => toast({ title: "Experience deleted" }),
      onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    });
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Experience</h1>
          <p className="text-muted-foreground">Add and remove work experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("company")} placeholder="Company" data-testid="input-exp-company" />
                <Input {...form.register("role")} placeholder="Role / Position" data-testid="input-exp-role" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("startDate")} placeholder="Start Date (e.g., Jan 2020)" data-testid="input-exp-start" />
                <Input {...form.register("endDate")} placeholder="End Date (leave empty for Present)" data-testid="input-exp-end" />
              </div>
              <Textarea {...form.register("description")} placeholder="Description..." rows={3} data-testid="input-exp-description" />
              <Button type="submit" disabled={isCreating} data-testid="button-add-exp">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Experience
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {experience?.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg h-fit">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{exp.role}</h3>
                        <p className="text-primary">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.startDate} — {exp.endDate || "Present"}</p>
                        {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(exp.id)}
                      data-testid={`button-delete-exp-${exp.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
