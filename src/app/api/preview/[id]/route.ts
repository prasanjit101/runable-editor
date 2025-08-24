import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { component } from '@/server/db/schema';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const [foundComponent] = await db
      .select()
      .from(component)
      .where(eq(component.id, params.id))
      .limit(1);
    
    if (!foundComponent) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: foundComponent.id,
      sourceCode: foundComponent.sourceCode,
      name: foundComponent.name,
      edits: JSON.parse(foundComponent.edits),
      createdAt: foundComponent.createdAt,
      updatedAt: foundComponent.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching component:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
