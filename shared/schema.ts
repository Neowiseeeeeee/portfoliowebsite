import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Session storage table for express-session
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Admin user table (simple username/password auth)
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Profile information
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  age: integer("age"),
  email: text("email"),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").default("Other"),
  proficiency: integer("proficiency").default(100),
  iconUrl: text("icon_url"),
});

// Education
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("field_of_study"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description"),
  logoUrl: text("logo_url"),
});

// Experience
export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description"),
});

// Certificates - with file upload
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  url: text("url"),
  imageUrl: text("image_url"), // uploaded certificate image
  fileType: text("file_type"), // 'image' or 'pdf'
});

// Projects - with file upload
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array(),
  imageUrl: text("image_url"), // screenshot
  projectUrl: text("project_url"),
  repoUrl: text("repo_url"),
});

// Contact Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social Links
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
});

// Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experience).omit({ id: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({ id: true });

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Experience = typeof experience.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
