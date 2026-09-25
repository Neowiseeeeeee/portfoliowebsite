import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Calendar, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export interface CertificateData {
  id: number;
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialId?: string;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  useEffect(() => {
    if (certificate) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [certificate, onClose]);

  return (
    <AnimatePresence>
      {certificate && (
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
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a1120] border border-emerald-500/30 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.15)] flex flex-col z-10 text-white"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080d19]/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
                  Verified Credential
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

            {/* Certificate Image View */}
            <div className="p-4 sm:p-6 bg-black/40 flex items-center justify-center border-b border-white/10">
              <img
                src={certificate.imageUrl}
                alt={certificate.name}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {certificate.name}
                </h3>
                <div className="flex items-center gap-3 sm:gap-4 mt-2 text-slate-400 text-sm flex-wrap">
                  <span className="text-emerald-400 font-semibold">{certificate.issuer}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {certificate.date}
                  </span>
                  {certificate.credentialId && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                        ID: {certificate.credentialId}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <a
                href={certificate.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-xs flex items-center gap-2 self-start sm:self-auto transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Full Size
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
