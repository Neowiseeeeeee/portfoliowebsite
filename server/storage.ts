import { db } from "./db";
import {
  adminUsers, profile, skills, education, experience, certificates, projects, messages, socialLinks,
  type AdminUser, type InsertAdminUser,
  type Profile, type InsertProfile,
  type Skill, type InsertSkill,
  type Education, type InsertEducation,
  type Experience, type InsertExperience,
  type Certificate, type InsertCertificate,
  type Project, type InsertProject,
  type Message, type InsertMessage,
  type SocialLink, type InsertSocialLink
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Profile
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(edu: InsertEducation): Promise<Education>;
  deleteEducation(id: number): Promise<void>;

  // Experience
  getExperience(): Promise<Experience[]>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  deleteExperience(id: number): Promise<void>;

  // Certificates
  getCertificates(): Promise<Certificate[]>;
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, cert: Partial<InsertCertificate>): Promise<Certificate>;
  deleteCertificate(id: number): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Socials
  getSocials(): Promise<SocialLink[]>;
  createSocial(social: InsertSocialLink): Promise<SocialLink>;
  deleteSocial(id: number): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values(user).returning();
    return created;
  }

  // Profile
  async getProfile(): Promise<Profile | undefined> {
    const [p] = await db.select().from(profile).limit(1);
    return p;
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      const [updated] = await db
        .update(profile)
        .set(profileData)
        .where(eq(profile.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(profile).values(profileData).returning();
      return created;
    }
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }

  async createEducation(edu: InsertEducation): Promise<Education> {
    const [created] = await db.insert(education).values(edu).returning();
    return created;
  }

  async deleteEducation(id: number): Promise<void> {
    await db.delete(education).where(eq(education.id, id));
  }

  // Experience
  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience);
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const [created] = await db.insert(experience).values(exp).returning();
    return created;
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    return await db.select().from(certificates);
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const [created] = await db.insert(certificates).values(cert).returning();
    return created;
  }

  async updateCertificate(id: number, cert: Partial<InsertCertificate>): Promise<Certificate> {
    const [updated] = await db.update(certificates).set(cert).where(eq(certificates.id, id)).returning();
    return updated;
  }

  async deleteCertificate(id: number): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Socials
  async getSocials(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks);
  }

  async createSocial(social: InsertSocialLink): Promise<SocialLink> {
    const [created] = await db.insert(socialLinks).values(social).returning();
    return created;
  }

  async deleteSocial(id: number): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }
}

export const storage = new DatabaseStorage();
