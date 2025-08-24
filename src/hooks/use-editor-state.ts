'use client';

import { useState, useCallback, useRef } from 'react';
import { EditorState, ComponentEdit, ComponentData } from '@/types/editor';
import { upsertEdit, debounce } from '@/lib/editor-utils';

const AUTOSAVE_DELAY = 800; // ms

export function useEditorState() {
  const [state, setState] = useState<EditorState>({
    componentId: null,
    sourceCode: '',
    edits: [],
    selectedPath: null,
    isLoading: false,
    isSaving: false,
    error: null,
  });

  const selectedElementRef = useRef<Element | null>(null);

  const debouncedSave = useCallback(
    debounce(async (componentId: string, edits: ComponentEdit[]) => {
      if (!componentId) return;
      
      setState(prev => ({ ...prev, isSaving: true }));
      
      try {
        const response = await fetch(`/api/component/${componentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ edits }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
        
        setState(prev => ({ ...prev, isSaving: false, error: null }));
      } catch (error) {
        console.error('Save error:', error);
        setState(prev => ({ 
          ...prev, 
          isSaving: false, 
          error: error instanceof Error ? error.message : 'Save failed'
        }));
      }
    }, AUTOSAVE_DELAY),
    []
  );

  const createComponent = useCallback(async (sourceCode: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const normalizedSourceCode = sourceCode.replace(
        /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
        'export default function MyComponent'
      );
      const response = await fetch('/api/component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode: normalizedSourceCode, name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create component');
      }
      
      const { id } = await response.json();
      
      setState(prev => ({
        ...prev,
        componentId: id,
        sourceCode: normalizedSourceCode,
        edits: [],
        selectedPath: null,
        isLoading: false,
        error: null,
      }));
      
      selectedElementRef.current = null;
      
      return id;
    } catch (error) {
      console.error('Create error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create component'
      }));
      throw error;
    }
  }, []);

  const loadComponent = useCallback(async (componentId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/preview/${componentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load component');
      }
      
      const data: ComponentData = await response.json();
      
      setState(prev => ({
        ...prev,
        componentId: data.id,
        sourceCode: data.sourceCode,
        edits: data.edits,
        selectedPath: null,
        isLoading: false,
        error: null,
      }));
      
      selectedElementRef.current = null;
    } catch (error) {
      console.error('Load error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load component'
      }));
    }
  }, []);

  const selectElement = useCallback((path: string, element: Element) => {
    setState(prev => ({ ...prev, selectedPath: path }));
    selectedElementRef.current = element;
  }, []);

  const applyEdit = useCallback((edit: ComponentEdit) => {
    setState(prev => {
      const newEdits = upsertEdit(prev.edits, edit);
      
      // Auto-save if we have a component ID
      if (prev.componentId) {
        debouncedSave(prev.componentId, newEdits);
      }
      
      return {
        ...prev,
        edits: newEdits,
      };
    });
  }, [debouncedSave]);

  const resetEdits = useCallback(() => {
    setState(prev => ({ ...prev, edits: [], selectedPath: null }));
    selectedElementRef.current = null;
    
    if (state.componentId) {
      debouncedSave(state.componentId, []);
    }
  }, [state.componentId, debouncedSave]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    selectedElement: selectedElementRef.current,
    actions: {
      createComponent,
      loadComponent,
      selectElement,
      applyEdit,
      resetEdits,
      clearError,
    },
  };
}
