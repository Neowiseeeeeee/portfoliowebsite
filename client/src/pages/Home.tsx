import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FolderGit2,
  Briefcase,
  Award,
  Mail,
  FileDown,
  Copy,
  Check,
  ExternalLink,
  Github,
  MapPin,
  Sparkles,
  Send,
  Calendar,
  Layers,
  Maximize2,
  GraduationCap,
  Clock,
  Compass,
} from "lucide-react";
import { ConstellationCanvas } from "@/components/ConstellationCanvas";
import { ProjectLightbox, ProjectData } from "@/components/ProjectLightbox";
import { CinematicPreloader } from "@/components/CinematicPreloader";
import { CertificateModal, CertificateData } from "@/components/CertificateModal";

// ── Profile Data ─────────────────────────────────────────────────────────────
const profile = {
  fullName: "Chaelvin B. Bolante",
  preferredName: "Chaelvin B. Bolante",
  handle: "@Neowise",
  title: "Full-Stack Developer & Software Engineer",
  tagline:
    "Computer Engineering graduate with experience in web development, system implementation, and research-based projects.",
  avatarUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/dp.jpg",
  location: "Pasong Kawayan I, General Trias, Cavite",
  email: "cbolante24@gmail.com",
  phone: "09360658121",
  status: "Available for Full-Time & Freelance",
  philosophy:
    "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. — Proverbs 3:5-6",
  githubUrl: "https://github.com/Neowiseeeeeee",
  drivePortfolioUrl:
    "https://drive.google.com/drive/folders/1lzI8W6XBBq4w9kLcKEtmnTajz3b8-NRv?usp=drive_link",
};

// ── Projects Data ────────────────────────────────────────────────────────────
const projects: ProjectData[] = [
  {
    id: 6,
    title: "Sanctuary",
    category: "WordPress & Client",
    description:
      "A modern, bespoke website and digital sanctuary built with WordPress, delivering a sleek aesthetic experience with responsive design and dynamic content management.",
    detailedDescription:
      "A high-fidelity café and lifestyle sanctuary website crafted for Kofi Sanctuary. Built with custom WordPress architecture, responsive layouts, curated typography, and optimized asset delivery for seamless mobile and desktop performance.",
    technologies: ["WordPress", "PHP", "MySQL", "Tailwind CSS", "JavaScript"],
    imageUrl: "/sanctuary.png",
    projectUrl: "https://sanctuary.xo.je/",
    featured: true,
  },
  {
    id: 5,
    title: "HanapCare",
    category: "Healthcare & Enterprise",
    description:
      "A cloud-based Hospital Management System designed for hospitals, clinics, and medical centers in the Philippines, digitizing operations from patient registration to billing.",
    detailedDescription:
      "An end-to-end healthcare enterprise platform featuring doctor appointment scheduling, digitized Electronic Medical Records (EMR), real-time bed & room availability tracking, role-based access control, and automated billing calculation.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    imageUrl: "/uploads/hanapcare-screenshot.png",
    projectUrl: "https://hanapcare.onrender.com/",
    repoUrl: "https://github.com/Neowiseeeeeee/HanapCare",
    featured: true,
  },
  {
    id: 4,
    title: "OJTask",
    category: "Full-Stack",
    description:
      "An internship management platform built for Filipino OJT students — tracks hours, daily scrum reports, MOA documents, and practicum records in one organized workspace.",
    detailedDescription:
      "Comprehensive practicum tracking system featuring automated daily time logging, student progress metrics, supervisor approval workflows, and centralized memorandum of agreement (MOA) document storage.",
    technologies: ["React", "TypeScript", "Express", "PostgreSQL", "MongoDB"],
    imageUrl: "/ojtask.png",
    projectUrl: "https://ojtask-wzzv.onrender.com/",
    repoUrl: "https://github.com/Neowiseeeeeee/OJTask",
    featured: true,
  },
];

// ── Skills by Domain ─────────────────────────────────────────────────────────
const skillsData = [
  {
    domain: "Technical Skills",
    skills: ["Web Development", "WordPress", "SEO Optimization", "Basic IT Support & Diagnostics", "Microcontrollers & Sensors", "IoT System Architecture"],
  },
  {
    domain: "Tools & Software",
    skills: ["WordPress", "Figma", "Canva", "AI Content Tools", "AutoCAD", "Microsoft Office (Excel, Word, PowerPoint)"],
  },
  {
    domain: "Professional & Core Skills",
    skills: ["Customer Communication", "Team Collaboration", "Problem Solving", "Critical Thinking", "Adaptability", "Time Management", "Attention to Detail", "Task Prioritization"],
  },
];

// ── Education ────────────────────────────────────────────────────────────────
const education = [
  {
    id: 3,
    school: "Cavite State University – CCAT Campus",
    degree: "Bachelor of Science in Computer Engineering",
    period: "2022 — 2026",
    badge: "Graduated",
    logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/ccat.jpeg",
    details:
      "Specializing in hardware-software integration, system architecture, database management, and embedded systems.",
  },
  {
    id: 2,
    school: "Holy Nazarene Christian School",
    degree: "Science, Technology, Engineering, and Mathematics (STEM)",
    period: "2020 — 2022",
    badge: "Senior High",
    logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/hncs.jpeg",
    details:
      "Focused on advanced mathematics, computing principles, engineering sciences, and research methodologies.",
  },
  {
    id: 1,
    school: "Tanza National Comprehensive High School",
    degree: "Junior High School",
    period: "2017 — 2020",
    badge: "High School",
    logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/tnchs.png",
    details:
      "Foundational secondary education with early honors in science and technical computing.",
  },
];

// ── Certificates ─────────────────────────────────────────────────────────────
const certificates: CertificateData[] = [
  {
    id: 1,
    name: "National Certificate II in Computer Systems Servicing (NC II)",
    issuer: "TESDA - Republic of the Philippines",
    date: "January 2026",
    imageUrl: "/certificates/tesda_css_ncii.png",
    credentialId: "26131402001154",
  },
  {
    id: 2,
    name: "Certificate of Completion – Web Developer Internship (240 Hours)",
    issuer: "StartupLab Business Center",
    date: "August 2025",
    imageUrl: "/certificates/startuplab_internship.png",
  },
  {
    id: 3,
    name: "GEN AI TO Z: A Career Summit in an AI-Driven World",
    issuer: "Vibe Coders PH & EMC² Fraternity (UP Diliman)",
    date: "March 2026",
    imageUrl: "/certificates/gen_ai_career_summit.png",
    credentialId: "GAI2Z26-D98B",
  },
  {
    id: 4,
    name: "Amateur Radio Operator Examination Seminar (Elements II, III, IV)",
    issuer: "UP Engineering Radio Guild (DX1UP) – UP Diliman",
    date: "March 2026",
    imageUrl: "/certificates/up_radio_guild.png",
    credentialId: "NTC No. 259-19",
  },
  {
    id: 5,
    name: "Certificate of Participation – Arduino Day Philippines 2026",
    issuer: "Arduino Days 2026 Philippines",
    date: "2026",
    imageUrl: "/certificates/arduino_day_2026.png",
  },
  {
    id: 6,
    name: "Building AI Agents and Apps with Azure AI Foundry",
    issuer: "Microsoft",
    date: "2024",
    imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/STYAVA.png",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("about");
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [manilaTime, setManilaTime] = useState("");
  const [showPreloader, setShowPreloader] = useState(true);

  // Reference for the destination NEOWISE logo in navbar
  const logoTargetRef = useRef<HTMLDivElement>(null);

  // Contact Form
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Live Manila Time clock (for Contact location card)
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setManilaTime(new Intl.DateTimeFormat("en-US", options).format(now));
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  }

  async function handleSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "f8609864-575e-4dde-8596-13a454b8c867",
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New Transmission from ${form.name} — Portfolio Hub`,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Transmission failed");
      setFormStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 6000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 6000);
    }
  }

  const filteredProjects =
    projectFilter === "All"
      ? projects
      : projects.filter((p) => p.category?.toLowerCase().includes(projectFilter.toLowerCase()));

  const tabs = [
    { id: "about", label: "About", icon: User, count: null },
    { id: "experience", label: "Experience", icon: Briefcase, count: null },
    { id: "projects", label: "Projects", icon: FolderGit2, count: projects.length },
    { id: "certificates", label: "Certificates", icon: Award, count: certificates.length },
    { id: "contact", label: "Contact", icon: Mail, count: null },
  ];

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-[#04060c] text-slate-100 font-sans selection:bg-cyan-500/25 selection:text-cyan-300 overflow-x-hidden flex flex-col justify-between">
      {/* ── Cinematic Entrance Preloader (startuplab.ph style FLIP text animation) ── */}
      {showPreloader && (
        <CinematicPreloader
          targetRef={logoTargetRef}
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {/* ── Space Constellation Canvas (Twinkling stars, moving constellations, comet) ── */}
      <ConstellationCanvas />

      {/* ── Outer Margin Top Bar ── */}
      <header className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 flex items-center justify-between shrink-0">
        {/* Brandmark: Pure NEOWISE Typography in Times New Roman with Cosmic Glow and crowned 'i' dot */}
        <div
          ref={logoTargetRef}
          className="flex items-center group cursor-pointer select-none py-1"
          onClick={() => handleTabChange("about")}
          title="Return to About"
        >
          <span
            className="inline-flex items-baseline font-bold tracking-widest text-white text-2xl sm:text-3xl transition-all duration-300 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            <span>NEOW</span>
            <span className="relative inline-block">
              I
              {/* Glowing comet dot retained in navbar */}
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              </span>
            </span>
            <span>SE</span>
          </span>
        </div>

        {/* Quick Contact CTA */}
        <button
          onClick={() => handleTabChange("contact")}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          Get in Touch
        </button>
      </header>

      {/* ── Main Workstation Stage (Dual-Panel Floating Studio Hub) ── */}
      <main className="relative z-10 w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-8 py-1 sm:py-2.5 flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
        <div className="w-full h-full lg:max-h-[calc(100vh-115px)] rounded-2xl sm:rounded-3xl border border-white/15 bg-[#090e1a]/95 backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
          {/* ══════════════════════════════════════════════════════════════════════
              LEFT IDENTITY PANEL (Stationary Profile Studio)
             ══════════════════════════════════════════════════════════════════════ */}
          <aside className="w-full lg:w-[380px] xl:w-[410px] 2xl:w-[430px] shrink-0 bg-[#0c1322]/95 border-b lg:border-b-0 lg:border-r border-white/10 p-6 sm:p-7 2xl:p-8 flex flex-col justify-between relative overflow-y-auto scrollbar-thin">
            {/* Ambient radial accent inside left card */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 space-y-5">
              {/* Profile Avatar with Glowing Ring */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                <div className="relative group mx-auto lg:mx-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-3xl overflow-hidden p-1.5 bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 shadow-xl shadow-cyan-500/20">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#0c1322] flex items-center justify-center shadow-lg"
                    title={profile.status}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse" />
                  </span>
                </div>

                <div className="w-full">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
                    {profile.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-cyan-400 font-semibold tracking-wide mt-1">
                    {profile.handle} • {profile.title}
                  </p>
                </div>
              </div>

              {/* Core Philosophy Box */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal relative">
                <div className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Core Philosophy
                </div>
                <blockquote className="italic text-slate-200 text-xs sm:text-sm leading-relaxed border-l-2 border-cyan-400 pl-3 py-0.5">
                  "{profile.philosophy}"
                </blockquote>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-2.5 py-1">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                    {projects.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">
                    Projects
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                    {certificates.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">
                    Certificates
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <div className="text-base sm:text-lg font-black text-blue-300 font-mono">
                    BS CpE
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">
                    Graduate
                  </div>
                </div>
              </div>

              {/* Action Buttons: Download CV & Copy Email */}
              <div className="space-y-2.5 pt-1">
                <a
                  href="/resume.pdf"
                  download="Chaelvin_Bolante_Resume.pdf"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.99]"
                >
                  <FileDown className="w-4 h-4" />
                  Download Resume / CV
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all hover:border-cyan-500/30"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Email Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>{profile.email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Links / Location */}
            <div className="relative z-10 pt-5 mt-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {profile.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
                <a
                  href={profile.drivePortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Drive Docs
                </a>
              </div>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════════════
              RIGHT DYNAMIC CONTENT CANVAS (Modern Underline Tabs)
             ══════════════════════════════════════════════════════════════════════ */}
          <section className="flex-1 bg-[#070b16]/95 flex flex-col min-h-0 overflow-hidden">
            {/* ── Modern Underline Navigation Bar with Equal Length Items ── */}
            <div className="border-b border-white/10 bg-[#090f1e]/80 backdrop-blur-md px-2 sm:px-6 sticky top-0 z-20 overflow-x-auto scrollbar-none h-[48px] sm:h-[52px] flex items-stretch shrink-0">
              <nav className="grid grid-cols-5 w-full min-w-[540px] h-full" aria-label="Portfolio Sections">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative h-full px-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all group w-full text-center cursor-pointer select-none ${
                        isActive
                          ? "text-cyan-300"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors shrink-0 ${
                          isActive
                            ? "text-cyan-400"
                            : "text-slate-400 group-hover:text-slate-300"
                        }`}
                      />
                      <span className="leading-none">{tab.label}</span>

                      {/* Pill count badge with fixed height so it never affects button layout height */}
                      {tab.count !== null && (
                        <span
                          className={`text-[10px] leading-tight font-mono h-4 min-w-[18px] px-1.5 inline-flex items-center justify-center rounded-full transition-colors shrink-0 ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : "bg-white/5 text-slate-400 border border-transparent"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}

                      {/* Modern Sliding Underline Glider with Glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.9)] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── Tab Content Stage with Smooth Dedicated Scrollbar ── */}
            <div className="flex-1 p-5 sm:p-7 xl:p-9 overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="wait">
                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: ABOUT & EXPERTISE
                   ───────────────────────────────────────────────────────────── */}
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Header Banner */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Software Developer & Computer Engineer
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Practical Full-Stack Development
                      </h2>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                        Computer Engineering graduate with experience in web development, system implementation, and research-based projects. Skilled in problem-solving, collaboration, and adapting to new technologies. Committed to delivering quality work while continuously learning and contributing to organizational success.
                      </p>
                    </div>

                    {/* Bento Highlights Grid */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          Full-Stack Development
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Building responsive frontends with React and Tailwind, alongside structured backend services using Node.js, PHP, and SQL/NoSQL databases.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          AI-Augmented Workflow
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Actively utilizing modern AI-assisted workflows and intelligent scaffolding to accelerate development velocity, troubleshoot bugs, and deliver clean, well-tested code.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <FolderGit2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          Hands-On Project Delivery
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Proven experience delivering healthcare portals (HanapCare), practicum tracking systems (OJTask), and custom client WordPress sites (Sanctuary).
                        </p>
                      </div>
                    </div>

                    {/* Categorized Tech Stack Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-1 bg-cyan-400 rounded-full" />
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Technical Arsenal & Domains
                        </h3>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skillsData.map((category) => (
                          <div
                            key={category.domain}
                            className="p-5 rounded-2xl bg-[#091122]/70 border border-white/10 space-y-3"
                          >
                            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                              {category.domain}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {category.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: PROJECTS GALLERY (Filterable & Interactive Lightbox)
                   ───────────────────────────────────────────────────────────── */}
                {activeTab === "projects" && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Filter Pills Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                          Selected Works & Systems
                        </h2>
                        <p className="text-xs text-slate-400">
                          Click any card to inspect full landing page showcase & details.
                        </p>
                      </div>

                      {/* Category Filters */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {["All", "Full-Stack", "Healthcare & Enterprise", "WordPress & Client"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setProjectFilter(f)}
                            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                              projectFilter === f
                                ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2-Column Bento Project Grid */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="group rounded-2xl bg-[#091122]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-cyan-500/10"
                        >
                          {/* Image Thumbnail with Overlay */}
                          <div
                            onClick={() => setSelectedProject(project)}
                            className="aspect-[16/9] w-full bg-black/60 relative overflow-hidden cursor-pointer"
                          >
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                            {/* Inspect Badge on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                              <span className="px-3 py-1.5 rounded-full bg-cyan-500 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <Maximize2 className="w-3.5 h-3.5" />
                                Inspect Showcase
                              </span>
                            </div>

                            {/* Category Tag */}
                            {project.category && (
                              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-cyan-300 font-semibold">
                                {project.category}
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3
                                onClick={() => setSelectedProject(project)}
                                className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer flex items-center justify-between"
                              >
                                {project.title}
                                <Maximize2 className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                              </h3>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                {project.description}
                              </p>
                            </div>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.technologies.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-cyan-300/80 border border-white/5"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 4 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                                  +{project.technologies.length - 4}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Live Demo
                                </a>
                              )}
                              {project.repoUrl && (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  Code
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 3: EXPERIENCE & EDUCATION
                   ───────────────────────────────────────────────────────────── */}
                {activeTab === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        Academic Credentials & Career Milestones
                      </h2>
                      <p className="text-xs text-slate-400">
                        Formal engineering foundations and active software development.
                      </p>
                    </div>

                    {/* Academic Timeline */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        <GraduationCap className="w-4 h-4" />
                        Education Journey
                      </div>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500 before:to-slate-700">
                        {education.map((edu) => (
                          <div key={edu.id} className="relative group">
                            {/* Glowing timeline node */}
                            <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#0c1322] border-2 border-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.8)]" />

                            <div className="p-5 rounded-2xl bg-[#091122]/80 border border-white/10 hover:border-cyan-500/30 transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                    {edu.school}
                                  </h3>
                                  <p className="text-xs text-cyan-400 font-medium">
                                    {edu.degree}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                    {edu.badge}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {edu.period}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {edu.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical Experience Highlights */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        <Briefcase className="w-4 h-4" />
                        Professional & Engineering Experience
                      </div>

                      {/* Technical Support Representative (Incoming) */}
                      <div className="p-6 rounded-2xl bg-[#091122]/90 border border-cyan-500/30 space-y-3 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-white">
                                Technical Support Representative — Industry Automation
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-semibold border border-cyan-500/30">
                                Incoming
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Starting October 2026
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-medium self-start sm:self-auto">
                            Offer Accepted
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Selected to deliver technical diagnostics, systematic troubleshooting, customer issue resolution, and system ticket handling under enterprise SLA standards.
                        </p>
                      </div>

                      {/* Freelance Full-Stack Developer */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#091122] to-[#0d162d] border border-white/10 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-white">
                                Freelance Full-Stack Developer & Software Builder
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30">
                                Active / Current
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Remote / Cavite, Philippines
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 self-start sm:self-auto">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            2026 — Present
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
                          <li>
                            Built and deployed hospital management platform (HanapCare) integrating patient intake, EMR records, and room management.
                          </li>
                          <li>
                            Developed OJTask, centralizing student internship logging, attendance tracking, and MOA document storage.
                          </li>
                          <li>
                            Created bespoke client websites on WordPress with custom layouts and performance optimization (Sanctuary).
                          </li>
                          <li>
                            Utilized AI-assistive coding workflows to rapidly prototype, debug, and deliver client requirements.
                          </li>
                        </ul>
                      </div>

                      {/* Web Development OJT */}
                      <div className="p-6 rounded-2xl bg-[#091122]/90 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 relative overflow-hidden shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-white">
                                Web Development — On The Job Training
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-semibold border border-cyan-500/30">
                                OJT
                              </span>
                            </div>
                            <p className="text-xs text-cyan-400 font-medium mt-0.5">
                              Startuplab Business Center
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 self-start sm:self-auto">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            June 2025 — August 2025
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
                          <li>
                            Developed and maintained responsive WordPress webpages using Figma-based layouts, contributing to improved website usability and user experience.
                          </li>
                          <li>
                            Conducted SEO keyword research and on-page optimization, helping increase website visibility and improve search ranking performance.
                          </li>
                          <li>
                            Collaborated with team members to troubleshoot technical issues, implement website improvements, and create digital marketing content using AI and design tools.
                          </li>
                        </ul>
                      </div>

                      {/* Smart Helmet Locker System Thesis */}
                      <div className="p-6 rounded-2xl bg-[#091122]/90 border border-white/10 hover:border-blue-500/30 transition-all space-y-3 relative overflow-hidden shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-white">
                                Smart Helmet Locker System
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold border border-blue-500/30">
                                Design Project · Thesis
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Computer Engineering Capstone / Thesis
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 self-start sm:self-auto">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            September 2025 — June 2026
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
                          <li>
                            Designed and developed an IoT-based Smart Helmet Locker System integrating temperature, humidity, VOC, and moisture monitoring for helmet safety and storage management.
                          </li>
                          <li>
                            Implemented hardware and software components using microcontrollers, environmental sensors, and automated access mechanisms, including system calibration, testing, and troubleshooting.
                          </li>
                          <li>
                            Conducted research-based performance evaluation and data analysis to improve environmental monitoring accuracy, drying efficiency, and overall system reliability.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: CERTIFICATES & CREDENTIALS
                   ───────────────────────────────────────────────────────────── */}
                {activeTab === "certificates" && (
                  <motion.div
                    key="certificates"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        Verified Certifications & Accreditations
                      </h2>
                      <p className="text-xs text-slate-400">
                        Click on any certificate to preview full resolution credential.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {certificates.map((cert) => (
                        <div
                          key={cert.id}
                          onClick={() => setSelectedCert(cert)}
                          className="group rounded-2xl bg-[#091122]/80 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col shadow-lg"
                        >
                          <div className="aspect-[16/10] bg-black/60 relative overflow-hidden">
                            <img
                              src={cert.imageUrl}
                              alt={cert.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-transparent opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                              <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <Maximize2 className="w-3.5 h-3.5" />
                                Zoom Credential
                              </span>
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                                {cert.name}
                              </h3>
                              <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                                {cert.issuer}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono pt-2 border-t border-white/5">
                              <Calendar className="w-3 h-3" />
                              {cert.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 5: PROFESSIONAL CONTACT & INQUIRIES
                   ───────────────────────────────────────────────────────────── */}
                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        Get in Touch
                      </h2>
                      <p className="text-xs text-slate-400">
                        Interested in working together, discussing a role, or inquiring about a project? Let's connect.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                      {/* Left Contact Methods Column */}
                      <div className="lg:col-span-2 space-y-3">
                        {/* Direct Email Card */}
                        <div className="p-4 rounded-2xl bg-[#091122]/90 border border-white/10 hover:border-cyan-500/30 transition-all space-y-1">
                          <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                            Direct Email
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <a
                              href={`mailto:${profile.email}`}
                              className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors break-all"
                            >
                              {profile.email}
                            </a>
                            <button
                              onClick={handleCopyEmail}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors shrink-0"
                              title="Copy email address"
                            >
                              {copiedEmail ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Phone / Mobile Card */}
                        <div className="p-4 rounded-2xl bg-[#091122]/90 border border-white/10 hover:border-cyan-500/30 transition-all space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                            Phone / Mobile
                          </div>
                          <a
                            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                            className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors block font-mono"
                          >
                            {profile.phone}
                          </a>
                        </div>

                        {/* Location & Timezone Card */}
                        <div className="p-4 rounded-2xl bg-[#091122]/90 border border-white/10 space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                            Location & Local Time
                          </div>
                          <p className="text-xs text-slate-300 font-medium">{profile.location}</p>
                          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-cyan-300 font-mono">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{manilaTime ? `${manilaTime} PHT (UTC+8)` : "Manila Time (UTC+8)"}</span>
                          </div>
                        </div>

                        {/* Response SLA Indicator */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-[11px]">
                            <strong>Quick Turnaround:</strong> Inquiries typically answered within 24 hours.
                          </span>
                        </div>
                      </div>

                      {/* Right Form Column */}
                      <div className="lg:col-span-3">
                        <form
                          onSubmit={handleSubmitContact}
                          className="p-6 rounded-2xl bg-[#091122]/90 border border-white/10 space-y-4 shadow-xl"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-300">
                                Your Name
                              </label>
                              <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Alex Morgan"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-300">
                                Email Address
                              </label>
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="alex@company.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                              Message or Project Scope
                            </label>
                            <textarea
                              rows={4}
                              required
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              placeholder="Please describe your project, timeline, or position details..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none placeholder-slate-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={formStatus === "sending"}
                            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                              formStatus === "success"
                                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                : formStatus === "error"
                                ? "bg-rose-500 text-white"
                                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]"
                            } disabled:opacity-60 cursor-pointer`}
                          >
                            {formStatus === "sending" && (
                              <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Sending Message...
                              </>
                            )}
                            {formStatus === "success" && (
                              <>
                                <Check className="w-4 h-4" />
                                Message Sent Successfully!
                              </>
                            )}
                            {formStatus === "error" && <>Sending Failed — Please Try Again or Email Directly</>}
                            {formStatus === "idle" && (
                              <>
                                <Send className="w-4 h-4" />
                                Send Message
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* ── Outer Margin Bottom Footer ── */}
      <footer className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-center text-[11px] sm:text-xs text-slate-400 font-mono border-t border-white/5 shrink-0">
        <p className="text-center">
          © {new Date().getFullYear()} {profile.preferredName}. All rights reserved.
        </p>
      </footer>

      {/* ── Modals ── */}
      <ProjectLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
