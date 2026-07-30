import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Resend } from "resend";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Auth middleware
const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session && (req.session as any).userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "sessions",
    }),
    secret: process.env.SESSION_SECRET || (() => { throw new Error("SESSION_SECRET environment variable is required"); })(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // --- Auth Routes ---
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getAdminByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      (req.session as any).username = user.username;
      
      res.json({ success: true, message: "Login successful" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get(api.auth.user.path, (req, res) => {
    if (req.session && (req.session as any).userId) {
      res.json({
        id: (req.session as any).userId,
        username: (req.session as any).username,
      });
    } else {
      res.json(null);
    }
  });

  // --- File Upload ---
  app.post(api.upload.file.path, isAuthenticated, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    const url = `/uploads/${req.file.filename}`;
    
    res.json({ url, fileType });
  });

  // --- Contact Form ---
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "cbolante24@gmail.com",
        replyTo: email,
        subject: `New message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        `,
      });
      console.log("[Resend] result:", JSON.stringify(result));
      if (result.error) {
        console.error("[Resend] error:", result.error);
        return res.status(500).json({ message: result.error.message });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Resend error:", err);
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
  });

  // --- Public Routes ---
  app.get(api.profile.get.path, async (req, res) => {
    const profile = await storage.getProfile();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get(api.education.list.path, async (req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });

  app.get(api.experience.list.path, async (req, res) => {
    const experience = await storage.getExperience();
    res.json(experience);
  });

  app.get(api.certificates.list.path, async (req, res) => {
    const certificates = await storage.getCertificates();
    res.json(certificates);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.socials.list.path, async (req, res) => {
    const socials = await storage.getSocials();
    res.json(socials);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Admin Routes (Protected) ---
  app.post(api.profile.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.profile.update.input.parse(req.body);
      const profile = await storage.updateProfile(input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.skills.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.skills.create.input.parse(req.body);
      const skill = await storage.createSkill(input);
      res.status(201).json(skill);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.skills.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteSkill(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.education.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.education.create.input.parse(req.body);
      const edu = await storage.createEducation(input);
      res.status(201).json(edu);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.education.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteEducation(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.experience.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.experience.create.input.parse(req.body);
      const exp = await storage.createExperience(input);
      res.status(201).json(exp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.experience.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteExperience(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.certificates.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.certificates.create.input.parse(req.body);
      const cert = await storage.createCertificate(input);
      res.status(201).json(cert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.certificates.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteCertificate(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.projects.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.socials.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.socials.create.input.parse(req.body);
      const social = await storage.createSocial(input);
      res.status(201).json(social);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.socials.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteSocial(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.contact.list.path, isAuthenticated, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // Seed initial data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // Admin account must be created manually via the ADMIN_USERNAME / ADMIN_PASSWORD
  // environment variables on first boot, or through a dedicated setup endpoint.
  // No default credentials are seeded to prevent predictable privileged logins.

  // Seed profile if not exists
  const existingProfile = await storage.getProfile();
  if (!existingProfile) {
    await storage.updateProfile({
      fullName: "Chaelvin B Bolante",
      title: "Freelancer",
      bio: "I'm looking for new clients who will appreciate my work and design. I aspire to be a full-time freelancer, creating visually stunning and functional projects that bring ideas to life.\n\nPray Hard, Work Hard, Be Humble.",
      location: "General Trias, Cavite",
      age: 21,
      email: "rc.chaelvin.bolante@cvsu.edu.ph",
      phone: "09360658121",
      avatarUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/dp.jpg",
    });

    // Skills
    const skillsData = [
      { name: "HTML", category: "Languages" },
      { name: "CSS", category: "Languages" },
      { name: "JavaScript", category: "Languages" },
      { name: "Python", category: "Languages" },
      { name: "MySQL", category: "Database" },
      { name: "PHP", category: "Languages" },
      { name: "C++", category: "Languages" },
      { name: "Visual Basic", category: "Languages" },
    ];
    for (const skill of skillsData) {
      await storage.createSkill(skill);
    }

    // Education
    const eduData = [
      {
        school: "Tanza National Comprehensive High School",
        degree: "High School",
        startDate: "2017",
        endDate: "2020",
        logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/tnchs.png",
      },
      {
        school: "Holy Nazarene Christian School",
        degree: "STEM Strand",
        startDate: "2020",
        endDate: "2022",
        logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/hncs.jpeg",
      },
      {
        school: "Cavite State University - CCAT Campus",
        degree: "BS Computer Engineering",
        startDate: "2022",
        endDate: "Present",
        logoUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/ccat.jpeg",
      },
    ];
    for (const edu of eduData) {
      await storage.createEducation(edu);
    }

    // Certificates
    const certData = [
      {
        name: "Building AI Agents and Apps with Azure AI Foundry",
        issuer: "Microsoft",
        date: "2024",
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/STYAVA.png",
        fileType: "image",
      },
      {
        name: "How to become a CCNA: All the things you need to know",
        issuer: "Tech Academy",
        date: "2024",
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Techacademy.png",
        fileType: "image",
      },
      {
        name: "Secrets to Transition into Data Science from a Non Coding Background",
        issuer: "Xaltius",
        date: "2024",
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Xaltius.png",
        fileType: "image",
      },
    ];
    for (const cert of certData) {
      await storage.createCertificate(cert);
    }

    // Projects
    const projectsData = [
      {
        title: "Hospital Management System",
        description: "A web-based app to manage hospital staff, patients, and billing with real-time room tracking",
        technologies: ["HTML", "CSS"],
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Hospital.png",
        projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Hospital%20Management/index.html",
        repoUrl: "https://github.com/neowiseeeeeee",
      },
      {
        title: "Burger Management",
        description: "A web-based app that lets you add foods instantly",
        technologies: ["HTML", "CSS", "JavaScript"],
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/burger.png",
        projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Restaurant%20Management/Burger%20Management.html",
        repoUrl: "https://github.com/neowiseeeeeee",
      },
      {
        title: "Stellar Trading",
        description: "An online platform dedicated to providing comprehensive insights into various financial markets",
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        imageUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/images/Stellartrading.png",
        projectUrl: "https://neowiseeeeeee.github.io/Portfolio-Website/Stellar_Crypto/Stellar%20Crypto%20Landing%20page.html",
        repoUrl: "https://github.com/neowiseeeeeee",
      },
    ];
    for (const project of projectsData) {
      await storage.createProject(project);
    }

    // Social Links
    const socialsData = [
      { platform: "GitHub", url: "https://github.com/Neowiseeeeeee", icon: "github" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/chaelvin-bolante-66b159318/", icon: "linkedin" },
      { platform: "Instagram", url: "https://www.instagram.com/itz_vinnn/", icon: "instagram" },
      { platform: "Email", url: "mailto:cbolante24@gmail.com", icon: "mail" },
    ];
    for (const social of socialsData) {
      await storage.createSocial(social);
    }
  }
}
