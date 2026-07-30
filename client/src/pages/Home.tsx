import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, ExternalLink, Github, Calendar, MapPin, Briefcase, GraduationCap, Award, Send } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useState, useRef } from "react";

// ── Static data ───────────────────────────────────────────────────────────────

const profile = {
  fullName: "Chaelvin B Bolante",
  title: "Freelancer",
  bio: "I'm looking for new clients who will appreciate my work and design. I aspire to be a full-time freelancer, creating visually stunning and functional projects that bring ideas to life.\n\nPray Hard, Work Hard, Be Humble.",
  avatarUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/dp.jpg",
  location: "General Trias, Cavite",
  email: "cbolante24@gmail.com",
};

const skillsByCategory: Record<string, string[]> = {
  Languages: ["HTML", "CSS", "JavaScript", "Python", "PHP", "C++", "Visual Basic"],
  Database:  ["MySQL"],
};

const education = [
  { id: 1, school: "Tanza National Comprehensive High School", degree: "High School",          startDate: "2017", endDate: "2020",    logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/tnchs.png"  },
  { id: 2, school: "Holy Nazarene Christian School",           degree: "STEM Strand",           startDate: "2020", endDate: "2022",    logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/hncs.jpeg"  },
  { id: 3, school: "Cavite State University – CCAT Campus",   degree: "BS Computer Engineering", startDate: "2022", endDate: "Present", logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/ccat.jpeg"  },
];

const certificates = [
  { id: 1, name: "Building AI Agents and Apps with Azure AI Foundry",                          issuer: "Microsoft",   date: "2024", imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/STYAVA.png"     },
  { id: 2, name: "How to Become a CCNA: All the Things You Need to Know",                      issuer: "Tech Academy", date: "2024", imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Techacademy.png" },
  { id: 3, name: "Secrets to Transition into Data Science from a Non-Coding Background",       issuer: "Xaltius",     date: "2024", imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Xaltius.png"    },
];

const projects = [
  { id: 4, title: "OJTask",                      description: "An internship management platform built for Filipino OJT students — tracks hours, daily scrum reports, MOA documents, and practicum records in one organized workspace.", technologies: ["React","TypeScript","Express","PostgreSQL","MongoDB"], imageUrl: "/ojtask.png", projectUrl: "https://ojtask-wzzv.onrender.com/", repoUrl: "https://github.com/Neowiseeeeeee/OJTask" },
  { id: 1, title: "Hospital Management System", description: "A web-based app to manage hospital staff, patients, and billing with real-time room tracking.", technologies: ["HTML","CSS"],                           imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Hospital.png",      projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Hospital%20Management/index.html",                               repoUrl: "https://github.com/neowiseeeeeee" },
  { id: 2, title: "Burger Management",          description: "A web-based app that lets you add foods instantly.",                                              technologies: ["HTML","CSS","JavaScript"],             imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/burger.png",       projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Restaurant%20Management/Burger%20Management.html",              repoUrl: "https://github.com/neowiseeeeeee" },
  { id: 3, title: "Stellar Trading",            description: "An online platform dedicated to providing comprehensive insights into various financial markets.", technologies: ["HTML","CSS","JavaScript","PHP","MySQL"], imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Stellartrading.png", projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Stellar_Crypto/Stellar%20Crypto%20Landing%20page.html", repoUrl: "https://github.com/neowiseeeeeee" },
];

// ── Shared animation variants ─────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const scaleSpring: Variants = {
  hidden:  { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1,   transition: { type: "spring", stiffness: 180, damping: 18 } },
};

const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

const letterVariant: Variants = {
  hidden:  { opacity: 0, y: 80, rotateX: -40 },
  visible: { opacity: 1, y: 0,  rotateX: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const cardBounce: Variants = {
  hidden:  { opacity: 0, y: 50, scale: 0.85 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 220, damping: 22 } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function AnimatedLetters({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      variants={staggerFast}
      initial="hidden"
      animate="visible"
      className={`inline-flex whitespace-nowrap ${className ?? ""}`}
      style={{ perspective: 800 }}
    >
      {text.split("").map((ch, i) => (
        <motion.span key={i} variants={letterVariant} style={{ display: "inline-block" }}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.h2>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body scroll-smooth overflow-x-hidden">
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} id="hero" className="px-4 pt-20 relative overflow-hidden min-h-screen flex items-center">
        {/* Animated background orbs */}
        <motion.div style={{ y: heroY }} className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-primary/20 rounded-full blur-[130px] -z-10 animate-orb" />
        <motion.div style={{ y: heroY }} className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[130px] -z-10 animate-orb-reverse" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10 animate-float-slow" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center gap-16">

            {/* Left text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex-1 space-y-10 text-center md:text-left"
            >
              {/* Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 backdrop-blur-md border border-primary/20 text-primary text-sm font-bold shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Available for genius collaborations
              </motion.div>

              {/* Name */}
              <div className="space-y-2">
                <h1 className="text-7xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter block">
                  <AnimatedLetters text="CHAELVIN" />
                  <br />
                  <AnimatedLetters text="BOLANTE" className="text-primary italic" />
                </h1>
                <motion.p
                  variants={fadeUp}
                  className="text-2xl md:text-3xl text-muted-foreground font-semibold tracking-tight mt-4"
                >
                  {profile.title}
                </motion.p>
              </div>

              {/* Bio */}
              <motion.div variants={fadeUp} className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-transparent rounded-full hidden md:block" />
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                  {profile.bio.split("\n\n")[0]}
                </p>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <motion.a
                  href="https://drive.google.com/drive/folders/1lzI8W6XBBq4w9kLcKEtmnTajz3b8-NRv?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm border border-primary/20 text-foreground font-bold hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  View Portfolio <ExternalLink className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 rounded-2xl bg-muted/60 backdrop-blur-sm border border-primary/10 text-foreground font-bold hover:bg-muted transition-colors"
                >
                  Connect Now
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right — profile photo, no grayscale, floating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="flex-1 flex justify-center md:justify-end"
            >
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] animate-float">
                <div className="absolute inset-[-20px] bg-gradient-to-tr from-primary via-accent to-primary rounded-full opacity-25 blur-[60px] animate-pulse" />
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_20s_linear_infinite] -z-10" />
                <div className="absolute inset-4 border border-accent/30 rounded-full animate-[spin_12s_linear_infinite_reverse] -z-10" />
                <motion.div
                  className="w-full h-full p-4 bg-background/20 backdrop-blur-sm rounded-full border border-border/40 shadow-2xl relative z-10 overflow-hidden"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                >
                  <img
                    src={profile.avatarUrl}
                    alt="Chaelvin Bolante"
                    className="w-full h-full object-cover rounded-full transition-transform duration-700 scale-110 hover:scale-100"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-0.5 h-8 bg-gradient-to-b from-primary/60 to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-32 relative bg-secondary/30 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="text-[20vw] font-display font-black text-foreground whitespace-nowrap">STORY</span>
        </motion.div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-12">THE STORY</SectionHeading>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-2 gap-12 items-start"
          >
            <div className="space-y-6 text-xl text-muted-foreground font-medium leading-relaxed">
              {[
                "I'm Chaelvin, a Computer Engineering student from General Trias, Cavite, and a self-driven freelancer who fell in love with the web early on. What started as tinkering with HTML and CSS has grown into building complete, full-stack systems — from hospital management platforms to internship tools used by real students. Every project I take on is a chance to turn a real problem into something people actually want to use.",
                "I believe great software lives at the intersection of discipline and creativity. Whether I'm crafting a clean interface or architecting a backend, I bring the same mindset to everything I do: Pray Hard, Work Hard, Be Humble. I'm currently open to freelance work and collaborations that push me to keep growing.",
              ].map((para, i) => (
                <motion.p key={i} variants={fadeLeft} className={i === 0 ? "border-l-4 border-primary/40 pl-8" : "pl-8 text-muted-foreground/70 italic"}>
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { label: "Location",  value: profile.location         },
                { label: "Email",     value: profile.email            },
                { label: "Status",    value: "Open to Work"           },
                { label: "Focus",     value: "Web & Software Dev"     },
              ].map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  variants={cardBounce}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="glass-card p-6 space-y-1 cursor-default"
                >
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
                  <p className="font-bold text-sm break-all">{value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <section id="skills" className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-float-delayed" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-24"
          >
            <SectionHeading className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6">EXPERTISE</SectionHeading>
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground font-medium uppercase tracking-[0.2em]">
              Mastering the Digital Realm
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {Object.entries(skillsByCategory).map(([category, categorySkills], idx) => (
              <motion.div
                key={category}
                variants={idx % 2 === 0 ? fadeLeft : fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-10"
              >
                <div className="flex items-center gap-6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-1 bg-primary rounded-full"
                  />
                  <h3 className="text-3xl font-display font-black tracking-tight">{category.toUpperCase()}</h3>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-4"
                >
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill}
                      variants={cardBounce}
                      whileHover={{ y: -10, scale: 1.04, boxShadow: "0 20px 40px -8px hsl(var(--primary)/0.25)" }}
                      whileTap={{ scale: 0.97 }}
                      className="glass-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer"
                    >
                      <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                        {skill}
                      </span>
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        className="h-0.5 bg-primary mt-2 rounded-full"
                        transition={{ duration: 0.4 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────────────── */}
      <section id="experience" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute left-[-150px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] -z-10 animate-float" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div variants={scaleSpring} className="inline-flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">Experience</h2>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-1 bg-primary mx-auto rounded-full"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-muted-foreground text-lg font-medium"
          >
            Building my first professional experiences — stay tuned.
          </motion.p>
        </div>
      </section>

      {/* ── Education ────────────────────────────────────────────────────── */}
      <section id="education" className="py-24 overflow-hidden relative">
        <div className="absolute right-[-100px] bottom-0 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] -z-10 animate-float-slow" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={scaleSpring} className="inline-flex items-center justify-center gap-4 mb-4">
              <GraduationCap className="w-10 h-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-display font-bold">Education</h2>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1.5 bg-primary mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 0.92 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 8, boxShadow: "0 25px 50px -10px hsl(var(--primary)/0.15)" }}
                className="bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {edu.logoUrl && (
                  <motion.div
                    whileHover={{ rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-border group-hover:border-primary/30 transition-colors bg-white"
                  >
                    <img src={edu.logoUrl} alt={edu.school} className="w-full h-full object-contain p-2" />
                  </motion.div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{edu.school}</h3>
                  <div className="text-primary font-semibold text-lg">{edu.degree}</div>
                  <div className="text-sm font-bold text-muted-foreground/60 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificates ─────────────────────────────────────────────────── */}
      <section id="certificates" className="py-24 bg-primary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={scaleSpring} className="inline-flex items-center justify-center gap-4 mb-4">
              <Award className="w-10 h-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-display font-bold">Certifications</h2>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1.5 bg-primary mx-auto rounded-full"
            />
          </motion.div>

          <div className="flex overflow-x-auto pb-12 gap-8 scrollbar-hide px-4 snap-x">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: 100, rotate: 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 80, damping: 16 }}
                whileHover={{ y: -12, scale: 1.03, rotate: -1 }}
                className="min-w-[300px] md:min-w-[400px] bg-card rounded-3xl border border-border overflow-hidden snap-center group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white font-bold">{cert.name}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cert.name}</h3>
                  <p className="text-primary font-semibold">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 font-bold">
                    <Calendar className="w-4 h-4" />{cert.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────────── */}
      <section id="projects" className="py-32 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10"
        />

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 px-4"
          >
            <div className="space-y-4">
              <SectionHeading className="text-6xl md:text-8xl font-display font-black tracking-tighter">PROJECTS</SectionHeading>
              <motion.p variants={fadeUp} className="text-xl text-muted-foreground font-medium uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-12 h-1 bg-primary rounded-full" />
                The Innovation Gallery
              </motion.p>
            </div>
          </motion.div>

          <div className="flex overflow-x-auto pb-20 gap-10 scrollbar-hide px-4 snap-x cursor-grab active:cursor-grabbing">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 120, rotate: 3 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 60, damping: 14 }}
                whileHover={{ y: -16, scale: 1.015 }}
                className="min-w-[350px] md:min-w-[600px] group relative snap-center"
              >
                <div className="glass-card overflow-hidden h-full flex flex-col group-hover:border-primary/40 transition-all duration-700">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <motion.img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <div className="flex gap-4">
                        {project.projectUrl && (
                          <motion.a
                            href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.15, rotate: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-4 bg-white rounded-2xl text-black hover:bg-primary hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-6 h-6" />
                          </motion.a>
                        )}
                        {project.repoUrl && (
                          <motion.a
                            href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.15, rotate: 4 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-colors border border-white/40"
                          >
                            <Github className="w-6 h-6" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-3xl font-display font-black tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: -6 }}
                        className="text-xs font-black px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        0{index + 1}
                      </motion.span>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tech) => (
                        <motion.span key={tech} whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }} className="text-xs font-black uppercase tracking-widest text-primary/60">
                          #{tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <SectionHeading className="text-6xl md:text-8xl font-display font-black tracking-tighter">
                  GET IN<br /><span className="text-primary italic">TOUCH</span>
                </SectionHeading>
                <motion.p variants={fadeUp} className="text-2xl text-muted-foreground font-medium leading-relaxed max-w-md">
                  Whether you're looking for a freelancer, a computer engineer, or a creative partner — let's build something genius.
                </motion.p>
              </div>

              <motion.div variants={staggerContainer} className="space-y-8">
                {[
                  { icon: MapPin,      label: "Location",  value: profile.location, link: null },
                  { icon: Send,        label: "Email",     value: profile.email,    link: `mailto:${profile.email}` },
                  { icon: ExternalLink, label: "Portfolio", value: "View Resume & Case Studies", link: "https://drive.google.com/drive/folders/1lzI8W6XBBq4w9kLcKEtmnTajz3b8-NRv?usp=drive_link" },
                ].map(({ icon: Icon, label, value, link }) => (
                  <motion.div key={label} variants={fadeLeft} className="flex items-center gap-6 group">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500"
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
                      {link
                        ? <a href={link} className="text-xl font-bold hover:text-primary transition-colors">{value}</a>
                        : <p className="text-xl font-bold">{value}</p>
                      }
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { key: "name" as const,  label: "Name",  type: "text",  placeholder: "YOUR NAME"     },
                    { key: "email" as const, label: "Email", type: "email", placeholder: "EMAIL ADDRESS" },
                  ].map(({ key, label, type, placeholder }) => (
                    <motion.div key={key} whileFocus={{ scale: 1.01 }} className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">{label}</label>
                      <input
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required
                        type={type}
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/20 focus:border-primary transition-all outline-none text-xl font-bold placeholder:text-muted-foreground/30"
                        placeholder={placeholder}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/20 focus:border-primary transition-all outline-none text-xl font-bold placeholder:text-muted-foreground/30 resize-none"
                    placeholder="YOUR VISION..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, y: -3, boxShadow: "0 20px 40px -8px hsl(var(--primary)/0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-black text-xl tracking-tighter flex items-center justify-center gap-4 transition-shadow"
                >
                  TRANSMIT MESSAGE <Send className="w-6 h-6" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
