import { AdminLayout } from "@/components/AdminLayout";
import { useSkills, useCreateSkill, useDeleteSkill } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSkillSchema, type InsertSkill } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageSkills() {
  const { data: skills, isLoading } = useSkills();
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: deleteSkill } = useDeleteSkill();
  const { toast } = useToast();

  const form = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      category: "Other",
      proficiency: 100
    }
  });

  function onSubmit(data: InsertSkill) {
    createSkill(data, {
      onSuccess: () => {
        toast({ title: "Skill added!" });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
      }
    });
  }

  function handleDelete(id: number) {
    deleteSkill(id, {
      onSuccess: () => toast({ title: "Skill deleted" }),
      onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    });
  }

  const skillsByCategory = skills?.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>) || {};

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Skills</h1>
          <p className="text-muted-foreground">Add and remove your skills</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
              <Input
                {...form.register("name")}
                placeholder="Skill name (e.g., React)"
                className="flex-1 min-w-[200px]"
                data-testid="input-skill-name"
              />
              <Input
                {...form.register("category")}
                placeholder="Category (e.g., Frontend)"
                className="w-40"
                data-testid="input-skill-category"
              />
              <Button type="submit" disabled={isCreating} data-testid="button-add-skill">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills?.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-card border rounded-lg group"
                    >
                      <span className="text-sm font-medium">{skill.name}</span>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        data-testid={`button-delete-skill-${skill.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
