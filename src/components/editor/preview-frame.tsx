'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ComponentEdit, PreviewFrameMessage } from '@/types/editor';

interface PreviewFrameProps {
  sourceCode: string;
  edits: ComponentEdit[];
  onElementSelect?: (path: string, element: Element) => void;
  onError?: (error: string) => void;
}

export function PreviewFrame({ 
  sourceCode, 
  edits, 
  onElementSelect,
  onError 
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const createFrameContent = useCallback((code: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
    }
    .preview-root {
      position: relative;
    }
    .hover-highlight {
      position: absolute;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      z-index: 1000;
    }
    .selected-highlight {
      position: absolute;
      pointer-events: none;
      border: 2px solid #ef4444;
      background: rgba(239, 68, 68, 0.1);
      z-index: 1001;
    }
  </style>
</head>
<body>
  <div id="root" class="preview-root"></div>
  
  <script type="text/babel" data-type="module">
    const { useState, useEffect, useCallback } = React;
    
    // User component code
    ${code}
    
    // Preview functionality
    let selectedElement = null;
    let hoverHighlight = null;
    let selectedHighlight = null;
    
    function createHighlight(className) {
      const highlight = document.createElement('div');
      highlight.className = className;
      document.body.appendChild(highlight);
      return highlight;
    }
    
    function updateHighlight(highlight, element) {
      if (!highlight || !element) return;
      const rect = element.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      highlight.style.left = (rect.left + scrollX) + 'px';
      highlight.style.top = (rect.top + scrollY) + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
    }
    
    function generateDOMPath(element, root) {
      if (element === root) return '';
      
      const path = [];
      let current = element;
      
      while (current && current !== root && current.parentElement) {
        const parent = current.parentElement;
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === current.tagName
        );
        const index = siblings.indexOf(current);
        path.unshift(current.tagName.toLowerCase() + '[' + index + ']');
        current = parent;
      }
      
      return path.join('.');
    }
    
    function handleMouseOver(event) {
      if (event.target === document.body || event.target === document.documentElement) return;
      
      if (!hoverHighlight) {
        hoverHighlight = createHighlight('hover-highlight');
      }
      
      updateHighlight(hoverHighlight, event.target);
    }
    
    function handleMouseOut() {
      if (hoverHighlight) {
        hoverHighlight.style.display = 'none';
      }
    }
    
    function handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (event.target === document.body || event.target === document.documentElement) return;
      
      selectedElement = event.target;
      
      if (!selectedHighlight) {
        selectedHighlight = createHighlight('selected-highlight');
      }
      
      updateHighlight(selectedHighlight, selectedElement);
      
      if (hoverHighlight) {
        hoverHighlight.style.display = 'none';
      }
      
      const path = generateDOMPath(selectedElement, document.getElementById('root'));
      
      // Send selection to parent
      window.parent.postMessage({
        type: 'elementSelected',
        data: { path, tagName: selectedElement.tagName.toLowerCase() }
      }, '*');
    }
    
    // Setup event listeners
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
    
    // Apply edits function
    window.applyEdits = function(edits) {
      const root = document.getElementById('root');
      edits.forEach(edit => {
        const element = resolveDOMPath(edit.path, root);
        if (element) {
          if (edit.op === 'setText') {
            element.textContent = edit.value;
          } else if (edit.op === 'setStyle' && edit.prop) {
            element.style[edit.prop] = edit.value;
          }
        }
      });
    };
    
    // Listen for messages from parent
    window.addEventListener('message', function(event) {
      if (event.data.type === 'applyEdits') {
        const edits = event.data.data.edits;
        if (window.applyEdits) {
          window.applyEdits(edits);
        }
      }
    });
    
    function resolveDOMPath(path, root) {
      if (!path) return root;
      
      const segments = path.split('.');
      let current = root;
      
      for (const segment of segments) {
        const match = segment.match(/^(.+)\\[(\\d+)\\]$/);
        if (!match) return null;
        
        const [, tagName, indexStr] = match;
        const index = parseInt(indexStr, 10);
        
        const children = Array.from(current.children).filter(
          child => child.tagName.toLowerCase() === tagName
        );
        
        if (index >= children.length) return null;
        current = children[index];
      }
      
      return current;
    }
    
    // Render the component
    try {
      const container = document.getElementById('root');
      const root = ReactDOM.createRoot(container);
      
      // Try to find default export or named component
      let ComponentToRender;
      if (typeof MyComponent !== 'undefined') {
        ComponentToRender = MyComponent;
      } else if (typeof App !== 'undefined') {
        ComponentToRender = App;
      } else {
        throw new Error('No component found. Please export a component as default or name it MyComponent/App.');
      }
      
      root.render(React.createElement(ComponentToRender));
      
      // Apply initial edits after render
      setTimeout(() => {
        window.parent.postMessage({ type: 'ready' }, '*');
      }, 100);
      
    } catch (error) {
      console.error('Render error:', error);
      window.parent.postMessage({
        type: 'error',
        data: { message: error.message, stack: error.stack }
      }, '*');
    }
  </script>
</body>
</html>`;
  }, []);

  const handleMessage = useCallback((event: MessageEvent<PreviewFrameMessage>) => {
    if (event.source !== frameRef.current?.contentWindow) return;
    
    const { type, data } = event.data;
    
    switch (type) {
      case 'ready':
        // Apply edits when frame is ready using postMessage
        if (frameRef.current?.contentWindow && edits.length > 0) {
          frameRef.current.contentWindow.postMessage({
            type: 'applyEdits',
            data: { edits }
          }, '*');
        }
        break;
        
      case 'error':
        onError?.(data.message);
        break;
        
      case 'elementSelected':
        if (onElementSelect && data.path) {
          // Create a mock element for the callback
          const mockElement = { 
            tagName: data.tagName,
            textContent: '',
            getBoundingClientRect: () => ({ width: 0, height: 0, top: 0, left: 0 })
          } as Element;
          onElementSelect(data.path, mockElement);
        }
        break;
    }
  }, [edits, onElementSelect, onError]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (!frameRef.current || !sourceCode) return;
    
    const frameContent = createFrameContent(sourceCode);
    const blob = new Blob([frameContent], { type: 'text/html' });
    frameRef.current.src = URL.createObjectURL(blob);
    
    return () => {
      if (frameRef.current?.src.startsWith('blob:')) {
        URL.revokeObjectURL(frameRef.current.src);
      }
    };
  }, [sourceCode, createFrameContent]);

  useEffect(() => {
    // Apply edits when they change using postMessage
    if (frameRef.current?.contentWindow && edits.length > 0) {
      frameRef.current.contentWindow.postMessage({
        type: 'applyEdits',
        data: { edits }
      }, '*');
    }
  }, [edits]);

  return (
    <div className="relative w-full h-full bg-white border rounded-lg overflow-hidden">
      <iframe
        ref={frameRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts"
        title="Component Preview"
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
