'use client';

import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SourceInput } from './source-input';
import { PreviewFrame } from './preview-frame';
import { Inspector } from './inspector';
import { ComponentList } from './component-list';
import { useEditorState } from '@/hooks/use-editor-state';

export function MainEditor() {
  const { state, selectedElement, actions } = useEditorState();
  const [showSourceInput, setShowSourceInput] = useState(true);

    const handleCreateComponent = async (sourceCode: string, name?: string) => {
        try {
            await actions.createComponent(sourceCode, name);
            setShowSourceInput(false);
            toast.success('Component created! Your component is ready for editing.');
        } catch (error) {
            toast.error('Failed to create component. Please check your code.');
        }
    };

    const handleNewComponent = () => {
        setShowSourceInput(true);
        actions.clearError();
    };

    const handleComponentSelect = async (componentId: string) => {
        try {
            await actions.loadComponent(componentId);
            setShowSourceInput(false);
            toast.success('Component loaded successfully');
        } catch (error) {
            toast.error('Failed to load component');
        }
    };

    const getSaveStatus = () => {
        if (state.isSaving) {
            return (
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                </Badge>
            );
        }

        if (state.edits.length > 0) {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Saved
                </Badge>
            );
        }

        return null;
    };

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
          
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-8rem)]">
                    {/* Source Input Section */}
                    <div className="lg:col-span-2">
                        <SourceInput
                            onCreateComponent={handleCreateComponent}
                            isLoading={state.isLoading}
                        />
                    </div>

                    {/* Component List Section */}
                    <div className="lg:col-span-1">
                        <ComponentList
                            onComponentSelect={handleComponentSelect}
                            className="h-full"
                        />
                    </div>
                </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
          <div className="border-b p-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <h1 className="text-xl font-semibold">Runable Editor</h1>
                      {getSaveStatus()}
                  </div>


                  <Button
                      variant="default"
                      size="sm"
                      onClick={handleNewComponent}
                  >
                      New Component
                  </Button>
              </div>

              {state.error && (
                  <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {state.error}
                  </div>
              )}
          </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Preview Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full p-4">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Preview</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Just click on the element you want to edit and configure it from the right panel.
                  </CardDescription>
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
