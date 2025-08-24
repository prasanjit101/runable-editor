'use client';

import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Copy, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SourceInput } from './source-input';
import { PreviewFrame } from './preview-frame';
import { Inspector } from './inspector';
import { ComponentList } from './component-list';
import { useEditorState } from '@/hooks/use-editor-state';

export function MainEditor() {
  const { state, selectedElement, actions } = useEditorState();
  const [showSourceInput, setShowSourceInput] = useState(true);

  

  if (showSourceInput || !state.componentId) {
    return (
      <div className="h-screen p-4">
        <div className="max-w-6xl mx-auto h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Runable Editor</h1>
          </div>
          
          {state.error && (
            <Card className="mb-4 border-destructive">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{state.error}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Preview Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full p-4">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Preview</CardTitle>
                  {state.selectedPath && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {state.selectedPath}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-4rem)]">
                  <PreviewFrame
                    sourceCode={state.sourceCode}
                    edits={state.edits}
                    onElementSelect={actions.selectElement}
                    onError={(error) => {
                      toast.error(`Preview Error: ${error}`);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Inspector Panel */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div className="h-full p-4 pl-0">
              <Inspector
                selectedPath={state.selectedPath}
                selectedElement={selectedElement}
                edits={state.edits}
                onEditChange={actions.applyEdit}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
