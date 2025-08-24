'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SourceInputProps {
  onCreateComponent: (sourceCode: string, name?: string) => Promise<void>;
  isLoading?: boolean;
}

const defaultCode = `export default function MyComponent() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '16px' }}>Hello, World!</h1>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Click me
      </button>
      <p style={{ marginTop: '16px', color: '#666' }}>
        Count: {count}
      </p>
    </div>
  );
}`;

export function SourceInput({ onCreateComponent, isLoading }: SourceInputProps) {
  const [sourceCode, setSourceCode] = useState(defaultCode);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCode.trim()) return;
    
    await onCreateComponent(sourceCode, name || undefined);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-sm">Component Source</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="component-name">Component Name (optional)</Label>
            <Input
              id="component-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Component"
            />
          </div>
          
          <div className="space-y-2 flex-1 flex flex-col">
            <Label htmlFor="source-code">React Component Code</Label>
            <Textarea
              id="source-code"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste your React component here..."
              className="flex-1 font-mono text-sm bg-black text-white/80"
              style={{ minHeight: '300px' }}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !sourceCode.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Preview'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
