import { z } from 'zod';
import { 
  insertProfileSchema,
  insertSkillSchema,
  insertEducationSchema,
  insertExperienceSchema,
  insertCertificateSchema,
  insertProjectSchema,
  insertMessageSchema,
  insertSocialLinkSchema,
  loginSchema,
  profile,
  skills,
  education,
  experience,
  certificates,
  projects,
  messages,
  socialLinks
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/auth/user',
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
        }).nullable(),
      },
    },
  },
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/profile',
      input: insertProfileSchema,
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills',
      responses: {
        200: z.array(z.custom<typeof skills.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/skills',
      input: insertSkillSchema,
      responses: {
        201: z.custom<typeof skills.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/skills/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  education: {
    list: {
      method: 'GET' as const,
      path: '/api/education',
      responses: {
        200: z.array(z.custom<typeof education.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/education',
      input: insertEducationSchema,
      responses: {
        201: z.custom<typeof education.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/education/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience',
      responses: {
        200: z.array(z.custom<typeof experience.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/experience',
      input: insertExperienceSchema,
      responses: {
        201: z.custom<typeof experience.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/experience/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  certificates: {
    list: {
      method: 'GET' as const,
      path: '/api/certificates',
      responses: {
        200: z.array(z.custom<typeof certificates.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/certificates',
      input: insertCertificateSchema,
      responses: {
        201: z.custom<typeof certificates.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/certificates/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  socials: {
    list: {
      method: 'GET' as const,
      path: '/api/socials',
      responses: {
        200: z.array(z.custom<typeof socialLinks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/socials',
      input: insertSocialLinkSchema,
      responses: {
        201: z.custom<typeof socialLinks.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/socials/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/contact/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  upload: {
    file: {
      method: 'POST' as const,
      path: '/api/upload',
      responses: {
        200: z.object({ url: z.string(), fileType: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
