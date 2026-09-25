import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Sparkles, Layers } from "lucide-react";
import { useEffect } from "react";
import { playOpenModalSound } from "@/lib/audio";

export interface ProjectData {
  id: number;
  title: string;
  category?: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  imageUrl: string;
  projectUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

interface ProjectLightboxProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  useEffect(() => {
    if (project) {
      playOpenModalSound();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a1120] border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.15)] flex flex-col z-10 text-white scrollbar-thin"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080d19]/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
                  Project Deep Dive
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:rotate-90 duration-200"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Image Showcase */}
            <div className="relative w-full aspect-[16/9] max-h-[460px] bg-black/60 overflow-hidden border-b border-white/10 group">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] via-transparent to-transparent opacity-80" />
              
              {/* Category pill */}
              {project.category && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {project.category}
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    {project.title}
                  </h2>
                  <p className="text-slate-400 text-base md:text-lg mt-2 leading-relaxed max-w-2xl font-normal">
                    {project.detailedDescription || project.description}
                  </p>
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Github className="w-4 h-4" />
                      Codebase
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 mb-3">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Tech Stack & Frameworks
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-[#0e1a2f] border border-cyan-500/20 text-cyan-300 font-mono text-xs font-medium"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
