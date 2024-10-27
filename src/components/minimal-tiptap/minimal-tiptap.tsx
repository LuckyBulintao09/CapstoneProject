import * as React from 'react'
import './styles/index.css'

import type { Content, Editor } from '@tiptap/react'
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap'
import { EditorContent } from '@tiptap/react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SectionOne } from './components/section/one'
import { SectionTwo } from './components/section/two'
import { SectionThree } from './components/section/three'
import { SectionFour } from './components/section/four'
import { SectionFive } from './components/section/five'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  previewContent?: PreviewContent
}

export interface PreviewContent {
  html: string; 
  title: string; 
  description: string; 
}

const Toolbar = ({ editor, previewContent }: { editor: Editor, previewContent?: PreviewContent }) => (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
        <div className="flex w-max items-center gap-px">
            <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionTwo editor={editor} activeActions={["bold", "italic", "strikethrough", "code", "clearFormatting"]} mainActionCount={2} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionThree editor={editor} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionFour editor={editor} activeActions={["orderedList", "bulletList"]} mainActionCount={0} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <SectionFive editor={editor} activeActions={["codeBlock", "blockquote", "horizontalRule"]} mainActionCount={0} />

            <Separator orientation="vertical" className="mx-2 h-7" />

            <div>
                <Dialog modal={true}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className='px-1 py-1'>
                            <Eye className="size-5 mr-2" />
                            Preview
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[80vw]">
                        <DialogHeader>
                            <DialogTitle>{previewContent?.title || 'Preview'}</DialogTitle>
                            <DialogDescription>{previewContent?.description || ''}</DialogDescription>
                        </DialogHeader>
                        <div className="rich-text-content bg-accent">
                            <ScrollArea className="h-96 p-5">
                                <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </div>
);

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, previewContent, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
      >
        <Toolbar editor={editor} previewContent={previewContent} />
        <EditorContent editor={editor} className={cn('minimal-tiptap-editor', editorContentClassName)} />
        <LinkBubbleMenu editor={editor} />
      </div>
    )
  }
)

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

export default MinimalTiptapEditor
