import { defineCollection, z } from 'astro:content';
import { CATEGORY_ORDER } from '../lib/categories';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    category: z.array(z.enum(CATEGORY_ORDER)).min(1),
    tags: z.string().optional(),
    image: z.string(),
    gallery: z.array(z.string()).optional().default([]),
    location: z.string().optional(),
    client: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional(),
    scope: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
