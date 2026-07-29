import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useProjects } from "@/hooks/use-portfolio";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navigation />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
             A collection of my recent work, side projects, and experiments.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors shadow-lg shadow-black/5"
              >
                <div className="aspect-video bg-muted relative overflow-hidden group">
                  <img 
                    src={project.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Descriptive comment: Laptop workspace or code screen placeholder. */}
                </div>
                
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <div className="flex gap-2">
                      {project.repoUrl && (
                        <a 
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                          title="View Code"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.projectUrl && (
                        <a 
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                          title="View Live Site"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
