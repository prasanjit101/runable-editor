'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ComponentEdit } from '@/types/editor';

interface InspectorProps {
  selectedPath: string | null;
  selectedElement: Element | null;
  edits: ComponentEdit[];
  onEditChange: (edit: ComponentEdit) => void;
}

export function Inspector({ 
  selectedPath, 
  selectedElement, 
  edits,
  onEditChange 
}: InspectorProps) {
  const [textValue, setTextValue] = useState('');
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('16');
  const [fontWeight, setFontWeight] = useState('normal');

  const getCurrentValue = (prop: string) => {
    if (!selectedPath) return '';
    
    const edit = edits.find(e => 
      e.path === selectedPath && 
      e.op === 'setStyle' && 
      e.prop === prop
    );
    
    return edit?.value || '';
  };

  const getCurrentTextValue = () => {
    if (!selectedPath) return '';
    
    const edit = edits.find(e => 
      e.path === selectedPath && 
      e.op === 'setText'
    );
    
    return edit?.value || selectedElement?.textContent || '';
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    if (selectedPath) {
      onEditChange({
        path: selectedPath,
        op: 'setText',
        value,
      });
    }
  };

  const handleStyleChange = (prop: 'color' | 'fontSize' | 'fontWeight', value: string) => {
    if (selectedPath) {
      onEditChange({
        path: selectedPath,
        op: 'setStyle',
        prop,
        value,
      });
    }
  };

  if (!selectedPath || !selectedElement) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-sm">Inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select an element to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-sm">Inspector</CardTitle>
        <p className="text-xs text-muted-foreground">
          {selectedElement.tagName.toLowerCase()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Input
                id="text-content"
                value={getCurrentTextValue()}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text content..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={getCurrentValue('color') || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-16 h-8 p-1"
                />
                <Input
                  value={getCurrentValue('color') || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex space-x-2">
                <Input
                  id="font-size"
                  type="number"
                  value={getCurrentValue('fontSize')?.replace('px', '') || '16'}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  min="8"
                  max="72"
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">px</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="font-weight">Font Weight</Label>
              <Select
                value={getCurrentValue('fontWeight') || 'normal'}
                onValueChange={(value) => handleStyleChange('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Lighter</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="600">600</SelectItem>
                  <SelectItem value="700">700</SelectItem>
                  <SelectItem value="800">800</SelectItem>
                  <SelectItem value="900">900</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
