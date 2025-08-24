export interface ComponentEdit {
  path: string; // DOM path to element (e.g., "div[0].p[1]")
  op: 'setText' | 'setStyle';
  prop?: 'color' | 'fontSize' | 'fontWeight';
  value: string;
}

export interface ComponentData {
  id: string;
  sourceCode: string;
  name?: string;
  edits: ComponentEdit[];
}

export interface EditorState {
  componentId: string | null;
  sourceCode: string;
  edits: ComponentEdit[];
  selectedPath: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export interface PreviewFrameMessage {
  type: 'ready' | 'error' | 'elementSelected' | 'applyEdits';
  data?: any;
}
