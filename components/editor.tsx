// "use client";
// import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
// import { BlockNoteView, Theme, darkDefaultTheme } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// import { useTheme } from "next-themes";
// import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
// import { useCallback } from "react";
// import { useEdgeStore } from "@/lib/edgestore";
// interface Editor {
//   onChange: (content: string) => void;
//   initialContent?: string;
//   editable?: boolean;
// }
// export default function Editor({ onChange, initialContent, editable }: Editor) {
//   const { resolvedTheme } = useTheme();
//   const { edgestore } = useEdgeStore()
//   const handleUpload = async (file: File) => {
//     const response = await edgestore.publicFiles.upload({
//       file
//     })
//     return response.url
//   }
//   const editor: BlockNoteEditor | null = useCreateBlockNote({
//     initialContent: initialContent
//       ? (JSON.parse(initialContent) as PartialBlock[])
//       : undefined,
//       uploadFile: handleUpload
//   });
//   const uploadToDatabase = useCallback(() => {
//     if (onChange) {
//       setTimeout(() => {
//         onChange(JSON.stringify(editor.document));
//       }, 1000);
//     }
//   }, [editor, onChange]);
//   const dark = {
//     ...darkDefaultTheme,
//     colors: {
//       editor: {
//         text: "#cfcfcf",
//         background: "#0a0a0a"
//       },
//       menu: darkDefaultTheme.colors.menu,
//       hovered: darkDefaultTheme.colors.hovered,
//       tooltip: darkDefaultTheme.colors.tooltip,
//       border: darkDefaultTheme.colors.border,
//       shadow: darkDefaultTheme.colors!.shadow,
//       highlights: darkDefaultTheme.colors!.highlights,
//     }
//   } satisfies Theme
//   return (
//     <>
//       <div>
//         <BlockNoteView
//           onChange={uploadToDatabase}
//           editable={editable}
//           editor={editor}
//           theme={resolvedTheme === "dark" ? dark : "light"}
//         />
//       </div>
//     </>
//   );
// }

