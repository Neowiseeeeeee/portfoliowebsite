import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Portfolio</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Building digital experiences with passion and precision. Let's create something amazing together.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="/contact" className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved. Built with React & Tailwind.
        </div>
      </div>
    </footer>
  );
}
