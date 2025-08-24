import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { component } from '@/server/db/schema';

const updateComponentSchema = z.object({
  edits: z.array(z.object({
    path: z.string(),
    op: z.enum(['setText', 'setStyle']),
    prop: z.enum(['color', 'fontSize', 'fontWeight']).optional(),
    value: z.string(),
  })).optional(),
  sourceCode: z.string().optional(),
  name: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: componentId } = await params;
  try {
    const body = await request.json();
    const updates = updateComponentSchema.parse(body);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.edits) {
      updateData.edits = JSON.stringify(updates.edits);
    }
    if (updates.sourceCode) {
      updateData.sourceCode = updates.sourceCode;
    }
    if (updates.name) {
      updateData.name = updates.name;
    }

    const [updatedComponent] = await db
      .update(component)
      .set(updateData)
      .where(eq(component.id, componentId))
      .returning();

    if (!updatedComponent) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedComponent.id,
      sourceCode: updatedComponent.sourceCode,
      name: updatedComponent.name,
      edits: JSON.parse(updatedComponent.edits),
      updatedAt: updatedComponent.updatedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating component:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
