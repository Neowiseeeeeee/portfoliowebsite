import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  InsertProfile, InsertSkill, InsertEducation, 
  InsertExperience, InsertProject, InsertCertificate,
  InsertSocialLink, InsertMessage
} from "@shared/schema";

// --- Profile ---
export function useProfile() {
  return useQuery({
    queryKey: [api.profile.get.path],
    queryFn: async () => {
      const res = await fetch(api.profile.get.path);
      if (res.status === 404) return null; // Handle 404 gracefully for new profiles
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profile.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProfile) => {
      const validated = api.profile.update.input.parse(data);
      const res = await fetch(api.profile.update.path, {
        method: api.profile.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.profile.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.profile.get.path] }),
  });
}

// --- Skills ---
export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      const res = await fetch(api.skills.list.path);
      if (!res.ok) throw new Error("Failed to fetch skills");
      return api.skills.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSkill) => {
      const validated = api.skills.create.input.parse(data);
      const res = await fetch(api.skills.create.path, {
        method: api.skills.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create skill");
      return api.skills.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.skills.list.path] }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.skills.delete.path, { id });
      const res = await fetch(url, { method: api.skills.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete skill");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.skills.list.path] }),
  });
}

// --- Education ---
export function useEducation() {
  return useQuery({
    queryKey: [api.education.list.path],
    queryFn: async () => {
      const res = await fetch(api.education.list.path);
      if (!res.ok) throw new Error("Failed to fetch education");
      return api.education.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEducation) => {
      const validated = api.education.create.input.parse(data);
      const res = await fetch(api.education.create.path, {
        method: api.education.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create education");
      return api.education.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.education.list.path] }),
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.education.delete.path, { id });
      const res = await fetch(url, { method: api.education.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete education");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.education.list.path] }),
  });
}

// --- Experience ---
export function useExperience() {
  return useQuery({
    queryKey: [api.experience.list.path],
    queryFn: async () => {
      const res = await fetch(api.experience.list.path);
      if (!res.ok) throw new Error("Failed to fetch experience");
      return api.experience.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertExperience) => {
      const validated = api.experience.create.input.parse(data);
      const res = await fetch(api.experience.create.path, {
        method: api.experience.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create experience");
      return api.experience.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.experience.list.path] }),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.experience.delete.path, { id });
      const res = await fetch(url, { method: api.experience.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete experience");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.experience.list.path] }),
  });
}

// --- Projects ---
export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProject) => {
      const validated = api.projects.create.input.parse(data);
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create project");
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.projects.list.path] }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.projects.delete.path, { id });
      const res = await fetch(url, { method: api.projects.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.projects.list.path] }),
  });
}

// --- Certificates ---
export function useCertificates() {
  return useQuery({
    queryKey: [api.certificates.list.path],
    queryFn: async () => {
      const res = await fetch(api.certificates.list.path);
      if (!res.ok) throw new Error("Failed to fetch certificates");
      return api.certificates.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCertificate) => {
      const validated = api.certificates.create.input.parse(data);
      const res = await fetch(api.certificates.create.path, {
        method: api.certificates.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create certificate");
      return api.certificates.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] }),
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.certificates.delete.path, { id });
      const res = await fetch(url, { method: api.certificates.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete certificate");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] }),
  });
}

// --- Messages / Contact ---
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: InsertMessage) => {
      const validated = api.contact.submit.input.parse(data);
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to submit message");
      return api.contact.submit.responses[201].parse(await res.json());
    },
  });
}

export function useMessages() {
  return useQuery({
    queryKey: [api.contact.list.path],
    queryFn: async () => {
      const res = await fetch(api.contact.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.contact.list.responses[200].parse(await res.json());
    },
  });
}
