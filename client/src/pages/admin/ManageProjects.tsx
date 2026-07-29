import { AdminLayout } from "@/components/AdminLayout";
import { useProjects, useCreateProject, useDeleteProject } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

export default function ManageProjects() {
  const { data: projects } = useProjects();
  const { mutate: create, isPending: isCreating } = useCreateProject();
  const { mutate: remove } = useDeleteProject();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      imageUrl: "",
      projectUrl: "",
      repoUrl: "",
    }
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedImage(data.url);
      form.setValue("imageUrl", data.url);
      toast({ title: "Screenshot uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(data: InsertProject) {
    create(data, {
      onSuccess: () => {
        toast({ title: "Project created" });
        setIsOpen(false);
        form.reset();
        setUploadedImage(null);
      },
      onError: () => toast({ title: "Error creating project", variant: "destructive" })
    });
  }

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue("technologies", val.split(",").map(s => s.trim()).filter(Boolean));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Projects</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            form.reset();
            setUploadedImage(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-project">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <Input
                {...form.register("title")}
                placeholder="Project Title"
                data-testid="input-project-title"
              />
              <textarea
                {...form.register("description")}
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background min-h-[80px]"
                data-testid="input-project-description"
              />
              <Input
                onChange={handleTechChange}
                placeholder="Technologies (comma separated: HTML, CSS, JavaScript)"
                data-testid="input-project-tech"
              />
              
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-project-file"
                />
                
                {uploadedImage ? (
                  <div className="flex items-center gap-4">
                    <img src={uploadedImage} alt="Preview" className="w-32 h-20 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium">Screenshot uploaded</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setUploadedImage(null);
                          form.setValue("imageUrl", "");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-center cursor-pointer py-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm">Upload Project Screenshot</p>
                        <p className="text-xs text-muted-foreground">or paste URL below</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <Input
                {...form.register("imageUrl")}
                placeholder="Or paste Image URL"
                data-testid="input-project-image-url"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...form.register("projectUrl")}
                  placeholder="Live Demo URL"
                  data-testid="input-project-live-url"
                />
                <Input
                  {...form.register("repoUrl")}
                  placeholder="GitHub URL"
                  data-testid="input-project-repo-url"
                />
              </div>
              
              <Button type="submit" disabled={isCreating} className="w-full" data-testid="button-create-project">
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <div key={project.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-secondary rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => remove(project.id)}
              data-testid={`button-delete-project-${project.id}`}
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </Button>
          </div>
        ))}
        {projects?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No projects found. Add one to get started.</p>
        )}
      </div>
    </AdminLayout>
  );
}
