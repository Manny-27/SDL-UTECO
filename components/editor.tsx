"use client";

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView, useBlockNote} from "@blocknote/react";
import "@blocknote/core/style.css"
import { useTheme } from 'next-themes';
import { useState } from 'react';


interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;

}

export const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {
    const { resolvedTheme } = useTheme();

    // const editor = useCreateBlockNote();

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        initialContent: 
            initialContent 
            ? JSON.parse(initialContent) as PartialBlock[] 
            : undefined,
        onEditorContentChange: (editor) => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        },
    })



    
    return (
        <div>
            <BlockNoteView 
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
            />  
        </div>
    );
}   
