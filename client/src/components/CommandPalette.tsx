import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  FolderGit2,
  Briefcase,
  Award,
  Mail,
  FileDown,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from "lucide-react";
import { toggleSound, isSoundEnabled } from "@/lib/audio";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onCopyEmail: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onCopyEmail,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "tab-about",
      title: "Go to About & Bio",
      category: "Navigation",
      icon: User,
      action: () => {
        onSelectTab("about");
        onClose();
      },
    },
    {
      id: "tab-projects",
      title: "Go to Projects (3 featured)",
      category: "Navigation",
      icon: FolderGit2,
      action: () => {
        onSelectTab("projects");
        onClose();
      },
    },
    {
      id: "tab-experience",
      title: "Go to Experience & Education",
      category: "Navigation",
      icon: Briefcase,
      action: () => {
        onSelectTab("experience");
        onClose();
      },
    },
    {
      id: "tab-certificates",
      title: "Go to Certifications",
      category: "Navigation",
      icon: Award,
      action: () => {
        onSelectTab("certificates");
        onClose();
      },
    },
    {
      id: "tab-contact",
      title: "Transmit Message / Contact",
      category: "Navigation",
      icon: Mail,
      action: () => {
        onSelectTab("contact");
        onClose();
      },
    },
    {
      id: "action-copy-email",
      title: "Copy Email (cbolante24@gmail.com)",
      category: "Quick Actions",
      icon: Copy,
      action: () => {
        onCopyEmail();
        onClose();
      },
    },
    {
      id: "action-resume",
      title: "Download Resume / CV (PDF)",
      category: "Quick Actions",
      icon: FileDown,
      action: () => {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Chaelvin_Bolante_Resume.pdf";
        link.click();
        onClose();
      },
    },
    {
      id: "action-github",
      title: "Open GitHub Profile (@Neowiseeeeeee)",
      category: "External Links",
      icon: ExternalLink,
      action: () => {
        window.open("https://github.com/Neowiseeeeeee", "_blank");
        onClose();
      },
    },
    {
      id: "action-sound",
      title: soundOn ? "Mute Mechanical Audio SFX" : "Enable Mechanical Audio SFX",
      category: "Preferences",
      icon: soundOn ? VolumeX : Volume2,
      action: () => {
        const updated = toggleSound();
        setSoundOn(updated);
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          className="relative w-full max-w-xl bg-[#0b1220] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden z-10 text-white"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#080d19]/80">
            <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections, projects, actions... (Esc to close)"
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded text-slate-400 hover:text-white mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white/10 text-slate-400 rounded border border-white/15">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No matching actions found for "{query}".
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/15 group text-left transition-all border border-transparent hover:border-cyan-500/25"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-400/80">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-[#070b16] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Neowise Command Interface
            </span>
            <div className="flex items-center gap-2">
              <span>Navigate: Enter</span>
              <span>•</span>
              <span>Close: Esc</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
