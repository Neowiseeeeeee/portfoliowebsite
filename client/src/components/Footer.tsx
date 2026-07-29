import { Github, Linkedin, Instagram, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github,    url: "https://github.com/Neowiseeeeeee",                              label: "GitHub"    },
  { icon: Linkedin,  url: "https://www.linkedin.com/in/chaelvin-bolante-66b159318/",        label: "LinkedIn"  },
  { icon: Instagram, url: "https://www.instagram.com/itz_vinnn/",                           label: "Instagram" },
  { icon: Mail,      url: "mailto:cbolante24@gmail.com",                                    label: "Email"     },
];

const navLinks = [
  { href: "#hero",       label: "Home"       },
  { href: "#about",      label: "About"      },
  { href: "#projects",   label: "Projects"   },
  { href: "#contact",    label: "Contact"    },
];

export function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border/50 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">CHAELVIN</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Building digital experiences with passion and precision. Let's create something amazing together.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Chaelvin B. Bolante. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
