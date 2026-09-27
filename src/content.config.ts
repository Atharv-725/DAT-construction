import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.enum(['civil', 'water', 'landscaping', 'roads', 'amc']),
    workOrderNo: z.string().optional(),
    sanctionedValue: z.string().optional(),
    startDate: z.string().optional(),
    submissionDate: z.string().optional(),
    completionDate: z.string().optional(),
    status: z.enum(['ongoing', 'completed']).default('completed'),
    scope: z.string(),
    images: z.array(z.string()).default([]),
    completionCertificate: z.string().optional(),
    verified: z.boolean().default(false)
  })
});

export const collections = {
  projects: projectsCollection
};
