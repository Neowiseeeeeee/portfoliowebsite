# replit.md

## Overview

This is a personal portfolio website with an admin dashboard for content management. The application allows users to showcase their profile, skills, education, work experience, certificates, and projects. It includes a public-facing portfolio site and a protected admin panel for managing all content through CRUD operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight React router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and scroll animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints defined in shared routes configuration
- **Authentication**: Dual authentication system:
  - Simple username/password auth for admin users (bcrypt for password hashing)
  - Replit Auth integration (OpenID Connect) for optional SSO
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)
- **File Uploads**: Multer for handling image and PDF uploads

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: sessions, admin_users, profile, skills, education, experience, certificates, projects, messages, social_links

### Project Structure
- `/client` - React frontend application
- `/server` - Express backend server
- `/shared` - Shared types, schemas, and route definitions used by both client and server
- `/migrations` - Drizzle database migrations

### Key Design Patterns
- **Shared Types**: Schema definitions and route types are shared between client and server for type safety
- **Storage Pattern**: Database operations abstracted through IStorage interface in `server/storage.ts`
- **Protected Routes**: Admin routes use authentication middleware; frontend uses ProtectedRoute component
- **API Structure**: Routes defined declaratively in `shared/routes.ts` with Zod schemas for validation

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Drizzle ORM for database operations
- connect-pg-simple for session storage

### Authentication
- bcryptjs for password hashing
- express-session for session management
- Optional: Replit Auth (OpenID Connect) integration in `server/replit_integrations/auth/`

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `ISSUER_URL` (optional) - For Replit Auth integration

### File Storage
- Local file uploads stored in `client/public/uploads/`
- Supports images (JPEG, PNG, GIF, WebP) and PDFs up to 10MB

### UI Component Library
- shadcn/ui components (Radix UI primitives)
- Custom fonts: Outfit (display), Plus Jakarta Sans (body)