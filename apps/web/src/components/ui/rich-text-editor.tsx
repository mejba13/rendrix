'use client';

import * as React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  RemoveFormatting,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Input } from './input';
import { Label } from './label';

// ============================================================================
// Types
// ============================================================================

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readonly?: boolean;
  minHeight?: number;
  error?: boolean;
  className?: string;
  editorClassName?: string;
}

// ============================================================================
// Toolbar Button Component
// ============================================================================

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  shortcut?: string;
  children: React.ReactNode;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  shortcut,
  children,
  className,
}: ToolbarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150',
              'text-white/60 hover:text-white hover:bg-white/[0.08]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              'disabled:opacity-40 disabled:pointer-events-none',
              isActive && 'bg-white/[0.12] text-white',
              className
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-[#1a1a1a] border-white/[0.08] text-white text-xs"
        >
          <p>
            {tooltip}
            {shortcut && (
              <span className="ml-2 text-white/50 font-mono">{shortcut}</span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Toolbar Separator
// ============================================================================

function ToolbarSeparator() {
  return <div className="w-px h-6 bg-white/[0.08] mx-1.5" />;
}

// ============================================================================
// Link Popover
// ============================================================================

interface LinkPopoverProps {
  editor: Editor;
}

function LinkPopover({ editor }: LinkPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setUrl('');
    setOpen(false);
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href || '';
      setUrl(previousUrl);
    }
    setOpen(isOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150',
            'text-white/60 hover:text-white hover:bg-white/[0.08]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            editor.isActive('link') && 'bg-white/[0.12] text-white'
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-80 bg-[#1a1a1a] border-white/[0.08] p-4"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-white/[0.04] border-white/[0.08] text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
            >
              Apply
            </Button>
            {editor.isActive('link') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setOpen(false);
                }}
                className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                Remove
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Image Popover
// ============================================================================

interface ImagePopoverProps {
  editor: Editor;
}

function ImagePopover({ editor }: ImagePopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [alt, setAlt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
    setUrl('');
    setAlt('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150',
            'text-white/60 hover:text-white hover:bg-white/[0.08]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
          )}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-80 bg-[#1a1a1a] border-white/[0.08] p-4"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">Image URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-white/[0.04] border-white/[0.08] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">Alt Text</Label>
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Image description"
              className="bg-white/[0.04] border-white/[0.08] text-white"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
          >
            Insert Image
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Heading Dropdown
// ============================================================================

interface HeadingDropdownProps {
  editor: Editor;
}

function HeadingDropdown({ editor }: HeadingDropdownProps) {
  const getCurrentLevel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
    return 'Paragraph';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2.5 h-8 rounded-md transition-all duration-150',
            'text-white/60 hover:text-white hover:bg-white/[0.08] text-sm font-medium',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            'min-w-[100px]'
          )}
        >
          <span className="truncate">{getCurrentLevel()}</span>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-[#1a1a1a] border-white/[0.08] min-w-[140px]"
      >
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('paragraph') && 'bg-white/[0.08] text-white'
          )}
        >
          <Pilcrow className="w-4 h-4 mr-2" />
          Paragraph
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('heading', { level: 1 }) && 'bg-white/[0.08] text-white'
          )}
        >
          <Heading1 className="w-4 h-4 mr-2" />
          Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('heading', { level: 2 }) && 'bg-white/[0.08] text-white'
          )}
        >
          <Heading2 className="w-4 h-4 mr-2" />
          Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('heading', { level: 3 }) && 'bg-white/[0.08] text-white'
          )}
        >
          <Heading3 className="w-4 h-4 mr-2" />
          Heading 3
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('heading', { level: 4 }) && 'bg-white/[0.08] text-white'
          )}
        >
          <Heading4 className="w-4 h-4 mr-2" />
          Heading 4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Mobile Overflow Menu
// ============================================================================

interface OverflowMenuProps {
  editor: Editor;
}

function OverflowMenu({ editor }: OverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150',
            'text-white/60 hover:text-white hover:bg-white/[0.08]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            'lg:hidden'
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#1a1a1a] border-white/[0.08] min-w-[180px]"
      >
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('blockquote') && 'bg-white/[0.08] text-white'
          )}
        >
          <Quote className="w-4 h-4 mr-2" />
          Blockquote
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('code') && 'bg-white/[0.08] text-white'
          )}
        >
          <Code className="w-4 h-4 mr-2" />
          Inline Code
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive('codeBlock') && 'bg-white/[0.08] text-white'
          )}
        >
          <Code2 className="w-4 h-4 mr-2" />
          Code Block
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive({ textAlign: 'left' }) && 'bg-white/[0.08] text-white'
          )}
        >
          <AlignLeft className="w-4 h-4 mr-2" />
          Align Left
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive({ textAlign: 'center' }) && 'bg-white/[0.08] text-white'
          )}
        >
          <AlignCenter className="w-4 h-4 mr-2" />
          Align Center
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive({ textAlign: 'right' }) && 'bg-white/[0.08] text-white'
          )}
        >
          <AlignRight className="w-4 h-4 mr-2" />
          Align Right
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(
            'text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]',
            editor.isActive({ textAlign: 'justify' }) && 'bg-white/[0.08] text-white'
          )}
        >
          <AlignJustify className="w-4 h-4 mr-2" />
          Justify
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
        >
          <RemoveFormatting className="w-4 h-4 mr-2" />
          Clear Formatting
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Editor Toolbar
// ============================================================================

interface EditorToolbarProps {
  editor: Editor;
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-2 border-b border-white/[0.06]',
        'bg-white/[0.02] rounded-t-xl flex-wrap'
      )}
    >
      {/* Text Type Dropdown */}
      <HeadingDropdown editor={editor} />

      <ToolbarSeparator />

      {/* Basic Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        tooltip="Bold"
        shortcut="Ctrl+B"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        tooltip="Italic"
        shortcut="Ctrl+I"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        tooltip="Underline"
        shortcut="Ctrl+U"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        tooltip="Strikethrough"
        shortcut="Ctrl+Shift+X"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        tooltip="Task List"
      >
        <ListTodo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Block Elements - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          tooltip="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          tooltip="Inline Code"
          shortcut="Ctrl+E"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />
      </div>

      {/* Links and Images */}
      <LinkPopover editor={editor} />
      <ImagePopover editor={editor} />

      {/* Alignment - Hidden on Tablet/Mobile */}
      <div className="hidden lg:flex items-center gap-0.5">
        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          tooltip="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          tooltip="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          tooltip="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          tooltip="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Overflow Menu for Mobile/Tablet */}
      <OverflowMenu editor={editor} />

      <ToolbarSeparator />

      {/* History */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        tooltip="Undo"
        shortcut="Ctrl+Z"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        tooltip="Redo"
        shortcut="Ctrl+Y"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>

      {/* Clear Formatting - Hidden on Mobile */}
      <div className="hidden md:block">
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          tooltip="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}

// ============================================================================
// Main Editor Component
// ============================================================================

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  readonly = false,
  minHeight = 200,
  error = false,
  className,
  editorClassName,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Typography,
    ],
    content: value || '',
    editable: !readonly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none',
          'prose-headings:text-white prose-headings:font-semibold',
          'prose-p:text-white prose-p:leading-relaxed',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-white prose-strong:font-semibold',
          'prose-em:text-white',
          'prose-code:text-amber-400 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm',
          'prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-lg',
          'prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-white/70',
          'prose-ul:text-white prose-ol:text-white',
          'prose-li:marker:text-white/60',
          'prose-hr:border-white/[0.08]',
          'prose-img:rounded-lg prose-img:border prose-img:border-white/[0.08]',
          'focus:outline-none',
          'p-4',
          '[&>*]:text-white'
        ),
      },
    },
  });

  // Sync external value changes
  React.useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className={cn(
          'rounded-xl border border-white/[0.08] bg-white/[0.02]',
          'animate-pulse',
          className
        )}
        style={{ minHeight }}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        'bg-white/[0.02]',
        error
          ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
          : 'border-white/[0.08] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20',
        readonly && 'opacity-70',
        className
      )}
    >
      {!readonly && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn(
          'overflow-y-auto',
          editorClassName
        )}
        style={{ minHeight }}
      />

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: ${minHeight}px;
          color: #ffffff !important;
        }

        .ProseMirror > * {
          color: #ffffff;
        }

        .ProseMirror p {
          color: #ffffff;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4 {
          color: #ffffff;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          color: #ffffff;
        }

        .ProseMirror li {
          color: #ffffff;
        }

        .ProseMirror blockquote {
          color: rgba(255, 255, 255, 0.8);
        }

        .ProseMirror a {
          color: #f59e0b;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: rgba(255, 255, 255, 0.35);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror ul[data-type='taskList'] {
          list-style: none;
          padding-left: 0;
        }

        .ProseMirror ul[data-type='taskList'] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .ProseMirror ul[data-type='taskList'] li > label {
          flex-shrink: 0;
          user-select: none;
        }

        .ProseMirror ul[data-type='taskList'] li > label input[type='checkbox'] {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.25rem;
          background: transparent;
          cursor: pointer;
          margin-top: 0.25rem;
          transition: all 0.15s ease;
        }

        .ProseMirror ul[data-type='taskList'] li > label input[type='checkbox']:checked {
          background: linear-gradient(to right, #f59e0b, #f97316);
          border-color: #f59e0b;
        }

        .ProseMirror ul[data-type='taskList'] li > label input[type='checkbox']:checked::after {
          content: '\\2713';
          color: black;
          font-size: 0.75rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .ProseMirror ul[data-type='taskList'] li[data-checked='true'] > div {
          text-decoration: line-through;
          opacity: 0.6;
        }

        .ProseMirror img {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }

        .ProseMirror code {
          color: #fbbf24;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .ProseMirror pre {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.5rem;
          padding: 1rem;
          color: #ffffff;
        }

        .ProseMirror pre code {
          background: transparent;
          padding: 0;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
