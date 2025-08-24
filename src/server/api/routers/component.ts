import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { component } from '@/server/db/schema';

export const componentRouter = createTRPCRouter({
  // Get all components for listing
  list: publicProcedure.query(async () => {
    const components = await db
      .select({
        id: component.id,
        name: component.name,
        createdAt: component.createdAt,
        updatedAt: component.updatedAt,
      })
      .from(component)
      .orderBy(desc(component.updatedAt));

    return components;
  }),

  // Get component by ID for preview
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [foundComponent] = await db
        .select()
        .from(component)
        .where(eq(component.id, input.id))
        .limit(1);

      if (!foundComponent) {
        throw new Error('Component not found');
      }

      return {
        id: foundComponent.id,
        sourceCode: foundComponent.sourceCode,
        name: foundComponent.name,
        edits: JSON.parse(foundComponent.edits),
        createdAt: foundComponent.createdAt,
        updatedAt: foundComponent.updatedAt,
      };
    }),
});
