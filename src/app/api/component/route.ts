import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { desc } from 'drizzle-orm';
import { db } from '@/server/db';
import { component } from '@/server/db/schema';

const createComponentSchema = z.object({
    sourceCode: z.string().min(1).max(50000), // 50KB limit
    name: z.string().optional(),
});

export async function GET() {
    try {
        const components = await db
            .select({
                id: component.id,
                name: component.name,
                createdAt: component.createdAt,
                updatedAt: component.updatedAt,
            })
            .from(component)
            .orderBy(desc(component.updatedAt));

        return NextResponse.json(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sourceCode, name } = createComponentSchema.parse(body);

        const [newComponent] = await db.insert(component).values({
            sourceCode,
            name: name || 'Untitled Component',
            edits: '[]',
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json({
            id: newComponent?.id,
            message: 'Component created successfully'
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating component:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
