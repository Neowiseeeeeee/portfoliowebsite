import { AdminLayout } from "@/components/AdminLayout";
import { useEducation, useCreateEducation, useDeleteEducation } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEducationSchema, type InsertEducation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageEducation() {
  const { data: education, isLoading } = useEducation();
  const { mutate: create, isPending: isCreating } = useCreateEducation();
  const { mutate: remove } = useDeleteEducation();
  const { toast } = useToast();

  const form = useForm<InsertEducation>({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  });

  function onSubmit(data: InsertEducation) {
    create(data, {
      onSuccess: () => {
        toast({ title: "Education added!" });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add education", variant: "destructive" });
      }
    });
  }

  function handleDelete(id: number) {
    remove(id, {
      onSuccess: () => toast({ title: "Education deleted" }),
      onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    });
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Education</h1>
          <p className="text-muted-foreground">Add and remove education entries</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Education</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("school")} placeholder="School / University" data-testid="input-edu-school" />
                <Input {...form.register("degree")} placeholder="Degree" data-testid="input-edu-degree" />
              </div>
              <Input {...form.register("fieldOfStudy")} placeholder="Field of Study (optional)" data-testid="input-edu-field" />
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("startDate")} placeholder="Start Date (e.g., 2016)" data-testid="input-edu-start" />
                <Input {...form.register("endDate")} placeholder="End Date (leave empty for Present)" data-testid="input-edu-end" />
              </div>
              <Textarea {...form.register("description")} placeholder="Description (optional)..." rows={3} data-testid="input-edu-description" />
              <Button type="submit" disabled={isCreating} data-testid="button-add-edu">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Education
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
            {education?.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg h-fit">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{edu.school}</h3>
                        <p className="text-primary">{edu.degree}</p>
                        {edu.fieldOfStudy && <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>}
                        <p className="text-sm text-muted-foreground">{edu.startDate} — {edu.endDate || "Present"}</p>
                        {edu.description && <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(edu.id)}
                      data-testid={`button-delete-edu-${edu.id}`}
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
