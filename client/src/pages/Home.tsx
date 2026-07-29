import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useProfile, useProjects, useSkills, useExperience, useEducation, useCertificates, useSubmitContact } from "@/hooks/use-portfolio";
import { ArrowRight, Code2, ExternalLink, Github, Calendar, MapPin, Briefcase, GraduationCap, Award, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();
  const { data: certificates } = useCertificates();

  const { toast } = useToast();
  const { mutate, isPending } = useSubmitContact();
  
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  function onSubmit(data: InsertMessage) {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  }

  const skillsByCategory = skills?.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>) || {};

  return (
    <div className="min-h-screen bg-background text-foreground font-body scroll-smooth">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-10 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-primary/20 text-primary text-sm font-bold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Available for genius collaborations
                </div>
                <h1 className="text-7xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter">
                  CHAELVIN<br />
                  <span className="text-primary italic">BOLANTE</span>
                </h1>
                <p className="text-2xl md:text-3xl text-muted-foreground font-semibold tracking-tight">
                  {profile?.title || "Freelancer & Computer Engineer"}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="relative"
              >
                <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-transparent rounded-full hidden md:block" />
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                  {profile?.bio || "Architecting digital solutions with precision and creative genius."}
                </p>
              </motion.div>
              {profile?.location && (
                <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <a href="#projects" className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 flex items-center gap-2 active:scale-95">
                  View Projects <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#contact" className="px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 text-foreground font-bold hover:bg-white transition-all hover:-translate-y-1 active:scale-95">
                  Connect Now
                </a>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] group">
                <div className="absolute inset-[-20px] bg-gradient-to-tr from-primary via-accent to-primary rounded-full opacity-20 blur-[60px] animate-pulse group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_20s_linear_infinite] -z-10" />
                <div className="absolute inset-4 border border-accent/20 rounded-full animate-[spin_15s_linear_infinite_reverse] -z-10" />
                <div className="w-full h-full p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/40 shadow-2xl relative z-10 overflow-hidden">
                  <img 
                    src={profile?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-6 -z-10" />
              <div className="absolute inset-0 bg-accent/20 rounded-[3rem] -rotate-3 -z-10" />
              <div className="w-full h-full glass-card p-4 overflow-hidden rounded-[3rem]">
                <img 
                   src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop" 
                   alt="Genius Workspace" 
                   className="w-full h-full object-cover rounded-[2.5rem] grayscale"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter">THE STORY</h2>
              <div className="space-y-6 text-xl text-muted-foreground font-medium leading-relaxed">
                <p className="whitespace-pre-line border-l-4 border-primary/40 pl-8">
                  {profile?.bio}
                </p>
              </div>
              
              {profile?.resumeUrl && profile.resumeUrl !== "#" && (
                <div className="pt-6">
                  <a 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    ACQUIRE CV <ArrowRight className="w-6 h-6" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-background relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6">EXPERTISE</h2>
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-[0.2em]">Mastering the Digital Realm</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {Object.entries(skillsByCategory).map(([category, categorySkills], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-1 bg-primary rounded-full" />
                  <h3 className="text-3xl font-display font-black tracking-tight">{category.toUpperCase()}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {categorySkills?.map((skill) => (
                    <motion.div 
                      key={skill.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="glass-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer"
                    >
                      <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">
                        {skill.name}
                      </span>
                      <div className="w-0 h-0.5 bg-primary mt-2 group-hover:w-full transition-all duration-500 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center justify-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              Experience
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>
          
          <div className="relative border-l-2 border-border ml-4 md:ml-0 md:mx-auto md:max-w-2xl space-y-12">
            {experience?.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="text-xl font-bold">{job.role}</h3>
                  <div className="text-primary font-medium mb-1">{job.company}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <Calendar className="w-3 h-3" />
                    {job.startDate} — {job.endDate || "Present"}
                  </div>
                  {job.description && <p className="text-muted-foreground">{job.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 flex items-center justify-center gap-4">
              <GraduationCap className="w-10 h-10 text-primary" />
              Education
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid gap-8 max-w-4xl mx-auto">
            {education?.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card p-8 rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {edu.logoUrl && (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-border group-hover:border-primary/30 transition-colors bg-white">
                    <img src={edu.logoUrl} alt={edu.school} className="w-full h-full object-contain p-2" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{edu.school}</h3>
                  <div className="text-primary font-semibold text-lg">{edu.degree}</div>
                  {edu.fieldOfStudy && <div className="text-muted-foreground font-medium">{edu.fieldOfStudy}</div>}
                  <div className="text-sm font-bold text-muted-foreground/60 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {edu.startDate} — {edu.endDate || "Present"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      {certificates && certificates.length > 0 && (
        <section id="certificates" className="py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 flex items-center justify-center gap-4">
                <Award className="w-10 h-10 text-primary" />
                Certifications
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
            </motion.div>
            
            <div className="flex overflow-x-auto pb-12 gap-8 scrollbar-hide px-4 snap-x">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all snap-center group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {cert.imageUrl ? (
                      <img 
                        src={cert.imageUrl} 
                        alt={cert.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Award className="w-20 h-20 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <span className="text-white font-bold">{cert.name}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cert.name}</h3>
                    <p className="text-primary font-semibold">{cert.issuer}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 font-bold">
                      <Calendar className="w-4 h-4" />
                      {cert.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section id="projects" className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 px-4"
          >
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter">PROJECTS</h2>
              <p className="text-xl text-muted-foreground font-medium uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-12 h-1 bg-primary rounded-full" />
                The Innovation Gallery
              </p>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary animate-bounce-x cursor-pointer hover:bg-primary/5 transition-colors">
                  <ArrowRight className="w-6 h-6 rotate-180" />
               </div>
               <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary animate-bounce-x cursor-pointer hover:bg-primary/5 transition-colors">
                  <ArrowRight className="w-6 h-6" />
               </div>
            </div>
          </motion.div>

          <div className="flex overflow-x-auto pb-20 gap-10 scrollbar-hide px-4 snap-x cursor-grab active:cursor-grabbing">
            {projects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
                className="min-w-[350px] md:min-w-[600px] group relative snap-center"
              >
                <div className="glass-card overflow-hidden h-full flex flex-col group-hover:border-primary/40 transition-all duration-700">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img 
                      src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                       <div className="flex gap-4">
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-2xl text-black hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <ExternalLink className="w-6 h-6" />
                          </a>
                        )}
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all hover:scale-110 border border-white/40">
                            <Github className="w-6 h-6" />
                          </a>
                        )}
                       </div>
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-3xl font-display font-black tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                      <span className="text-xs font-black px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">0{index + 1}</span>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies?.map((tech) => (
                        <span key={tech} className="text-xs font-black uppercase tracking-widest text-primary/60">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter">GET IN<br /><span className="text-primary italic">TOUCH</span></h2>
                <p className="text-2xl text-muted-foreground font-medium leading-relaxed max-w-md">
                  Whether you're looking for a freelancer, a computer engineer, or a creative partner—let's build something genius.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <MapPin className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Location</p>
                      <p className="text-xl font-bold">General Trias, Cavite</p>
                   </div>
                </div>
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Send className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Email</p>
                      <p className="text-xl font-bold">cbolante24@gmail.com</p>
                   </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Name</label>
                    <input
                      {...form.register("name")}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/20 focus:border-primary transition-all outline-none text-xl font-bold placeholder:text-muted-foreground/30"
                      placeholder="GENIUS NAME"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Email</label>
                    <input
                      {...form.register("email")}
                      type="email"
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/20 focus:border-primary transition-all outline-none text-xl font-bold placeholder:text-muted-foreground/30"
                      placeholder="EMAIL ADDRESS"
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Message</label>
                  <textarea
                    {...form.register("message")}
                    rows={4}
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/20 focus:border-primary transition-all outline-none text-xl font-bold placeholder:text-muted-foreground/30 resize-none"
                    placeholder="YOUR VISION..."
                    data-testid="input-contact-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-6 rounded-2xl bg-primary text-white font-black text-xl tracking-tighter flex items-center justify-center gap-4 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  data-testid="button-contact-submit"
                >
                  {isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : "TRANSMIT MESSAGE"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
