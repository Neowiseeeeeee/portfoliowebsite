import { AdminLayout } from "@/components/AdminLayout";
import { useCertificates, useCreateCertificate, useDeleteCertificate } from "@/hooks/use-portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCertificateSchema, type InsertCertificate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Award, Upload, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";

export default function ManageCertificates() {
  const { data: certificates, isLoading } = useCertificates();
  const { mutate: create, isPending: isCreating } = useCreateCertificate();
  const { mutate: remove } = useDeleteCertificate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileType: string } | null>(null);

  const form = useForm<InsertCertificate>({
    resolver: zodResolver(insertCertificateSchema),
    defaultValues: {
      name: "",
      issuer: "",
      date: "",
      url: "",
      imageUrl: "",
      fileType: ""
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
      setUploadedFile(data);
      form.setValue("imageUrl", data.url);
      form.setValue("fileType", data.fileType);
      toast({ title: "File uploaded successfully" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(data: InsertCertificate) {
    create(data, {
      onSuccess: () => {
        toast({ title: "Certificate added!" });
        form.reset();
        setUploadedFile(null);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add certificate", variant: "destructive" });
      }
    });
  }

  function handleDelete(id: number) {
    remove(id, {
      onSuccess: () => toast({ title: "Certificate deleted" }),
      onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    });
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Certificates</h1>
          <p className="text-muted-foreground">Add and remove certificates with image/PDF uploads</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("name")} placeholder="Certificate Name" data-testid="input-cert-name" />
                <Input {...form.register("issuer")} placeholder="Issuer (e.g., Google)" data-testid="input-cert-issuer" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input {...form.register("date")} placeholder="Date (e.g., Dec 2023)" data-testid="input-cert-date" />
                <Input {...form.register("url")} placeholder="Certificate URL (optional)" data-testid="input-cert-url" />
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-cert-file"
                />
                
                {uploadedFile ? (
                  <div className="flex items-center gap-4">
                    {uploadedFile.fileType === 'image' ? (
                      <img src={uploadedFile.url} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
                    ) : (
                      <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">File uploaded</p>
                      <p className="text-xs text-muted-foreground">{uploadedFile.fileType === 'pdf' ? 'PDF Document' : 'Image'}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setUploadedFile(null);
                          form.setValue("imageUrl", "");
                          form.setValue("fileType", "");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Upload Certificate Image or PDF</p>
                        <p className="text-xs text-muted-foreground">Click to browse (JPEG, PNG, PDF - max 10MB)</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isCreating} data-testid="button-add-cert">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Certificate
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates?.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                {cert.imageUrl && cert.fileType === 'image' ? (
                  <div className="aspect-[4/3] bg-muted">
                    <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                  </div>
                ) : cert.imageUrl && cert.fileType === 'pdf' ? (
                  <a 
                    href={cert.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="aspect-[4/3] bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-12 h-12 text-primary" />
                  </a>
                ) : (
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <Award className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold line-clamp-2">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">{cert.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cert.id)}
                      data-testid={`button-delete-cert-${cert.id}`}
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
