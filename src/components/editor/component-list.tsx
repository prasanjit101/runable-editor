'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, AlertCircle } from 'lucide-react';
import { trpc } from '@/trpc/react';

interface ComponentListProps {
  onComponentSelect: (componentId: string) => void;
  className?: string;
}

export function ComponentList({ onComponentSelect, className }: ComponentListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: components, isLoading, error } = trpc.component.list.useQuery();

  const handleComponentClick = (componentId: string) => {
    setSelectedId(componentId);
    onComponentSelect(componentId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">Your Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div className="space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Failed to load components
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Your Components
          {components && (
            <Badge variant="secondary" className="ml-auto">
              {components.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : components && components.length > 0 ? (
            <div className="p-2">
              {components.map((component) => (
                <Button
                  key={component.id}
                  variant={selectedId === component.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3 mb-2"
                  onClick={() => handleComponentClick(component.id)}
                >
                  <div className="w-full text-left space-y-1">
                    <div className="font-medium text-sm truncate">
                      {component.name || 'Untitled Component'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {formatDate(component.updatedAt)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  No components yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Create your first component to get started
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
