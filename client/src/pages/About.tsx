import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useProfile, useSkills, useExperience, useEducation, useCertificates } from "@/hooks/use-portfolio";
import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";

export default function About() {
  const { data: profile } = useProfile();
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();
  const { data: education } = useEducation();
  const { data: certificates } = useCertificates();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About Me</h1>
          <div className="flex justify-center gap-6 text-muted-foreground">
            {profile?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{profile.title}</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-16">
            
            {/* Bio */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Biography
              </h2>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed whitespace-pre-line">
                {profile?.bio}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                Work Experience
              </h2>
              <div className="border-l-2 border-border ml-3 space-y-12">
                {experience?.map((job) => (
                  <div key={job.id} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <h3 className="text-xl font-bold">{job.role}</h3>
                    <div className="text-primary font-medium mb-1">{job.company}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                      <Calendar className="w-3 h-3" />
                      {job.startDate} — {job.endDate || "Present"}
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </h2>
              <div className="space-y-6">
                {education?.map((edu) => (
                  <div key={edu.id} className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold">{edu.school}</h3>
                    <div className="text-primary font-medium">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground mt-1 mb-3">
                      {edu.startDate} — {edu.endDate || "Present"}
                    </div>
                    {edu.description && <p className="text-muted-foreground text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar Info */}
          <aside className="space-y-12">
            
            {/* Skills */}
            <section>
              <h2 className="text-xl font-display font-bold mb-6">Skills</h2>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-2"
              >
                {skills?.map((skill) => (
                  <motion.span 
                    key={skill.id}
                    variants={item}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </motion.div>
            </section>

            {/* Certificates */}
            <section>
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Certificates
              </h2>
              <div className="space-y-4">
                {certificates?.map((cert) => (
                  <div key={cert.id} className="pb-4 border-b border-border last:border-0">
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Resume CTA */}
            {profile?.resumeUrl && (
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                <h3 className="font-bold mb-2">Want my resume?</h3>
                <p className="text-sm text-muted-foreground mb-4">Download a copy of my resume for your records.</p>
                <a 
                  href={profile.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
                >
                  Download Resume
                </a>
              </div>
            )}

          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
