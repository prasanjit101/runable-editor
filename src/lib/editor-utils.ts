import { ComponentEdit } from '@/types/editor';

/**
 * Generates a stable DOM path for an element
 * Format: "tagName[index].childTagName[childIndex]"
 */
export function generateDOMPath(element: Element, root: Element): string {
  if (element === root) return '';
  
  const path: string[] = [];
  let current = element;
  
  while (current && current !== root && current.parentElement) {
    const parent = current.parentElement;
    const siblings = Array.from(parent.children).filter(
      child => child.tagName === current.tagName
    );
    const index = siblings.indexOf(current);
    path.unshift(`${current.tagName.toLowerCase()}[${index}]`);
    current = parent;
  }
  
  return path.join('.');
}

/**
 * Resolves a DOM path to find the target element
 */
export function resolveDOMPath(path: string, root: Element): Element | null {
  if (!path) return root;
  
  const segments = path.split('.');
  let current = root;
  
  for (const segment of segments) {
    const match = segment.match(/^(.+)\[(\d+)\]$/);
    if (!match) return null;
    
    const [, tagName, indexStr] = match;
    const index = parseInt(indexStr || '0', 10);
    
    const children = Array.from(current.children).filter(
      child => child.tagName.toLowerCase() === tagName
    );
    
    if (index >= children.length) return null;
    current = children[index] as Element;
  }
  
  return current;
}

/**
 * Applies an edit to a DOM element
 */
export function applyEdit(edit: ComponentEdit, rootElement: Element): boolean {
  const targetElement = resolveDOMPath(edit.path, rootElement);
  if (!targetElement) return false;
  
  try {
    if (edit.op === 'setText') {
      targetElement.textContent = edit.value;
    } else if (edit.op === 'setStyle' && edit.prop) {
      (targetElement as HTMLElement).style[edit.prop as any] = edit.value;
    }
    return true;
  } catch (error) {
    console.warn('Failed to apply edit:', edit, error);
    return false;
  }
}

/**
 * Applies multiple edits to DOM
 */
export function applyEdits(edits: ComponentEdit[], rootElement: Element): void {
  edits.forEach(edit => applyEdit(edit, rootElement));
}

/**
 * Creates or updates an edit in the edits array
 */
export function upsertEdit(
  edits: ComponentEdit[],
  newEdit: ComponentEdit
): ComponentEdit[] {
  const existing = edits.findIndex(
    edit => edit.path === newEdit.path && 
            edit.op === newEdit.op && 
            edit.prop === newEdit.prop
  );
  
  if (existing >= 0) {
    const updated = [...edits];
    updated[existing] = newEdit;
    return updated;
  }
  
  return [...edits, newEdit];
}

/**
 * Debounced function utility
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
