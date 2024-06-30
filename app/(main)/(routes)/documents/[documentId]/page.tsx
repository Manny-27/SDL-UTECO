// "use client";

// import { useMutation, useQuery } from "convex/react";

// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { Toolbar } from "@/components/toolbar";
// import { Cover } from "@/components/cover";
// import { Skeleton } from "@/components/ui/skeleton";
// // import { Editor } from "./_components/editor";
// import { useContext, useMemo } from "react";
// import { WidthContext } from "@/contexts/WidthContext";
// import { useParams } from "next/navigation";
// import dynamic from "next/dynamic";

// export default function DocumentIdPage() {
//     const params = useParams()
//     const { width } = useContext(WidthContext)
//     const Editor = useMemo(
//       () => dynamic(() => import("./_components/editor"), { ssr: false }),
//       []
//     );
//     const document = useQuery(api.documents.getById, {
//       documentId: params.documentId as Id<"documents">,
//     });
//     const update = useMutation(api.documents.update);
//     const onChange = (content: string) => {
//       update({
//         id: params.documentId as Id<"documents">,
//         content,
//       });
//     };
//         if (document === undefined) {
//         return (
//             <div>
//                 <Cover.Skeleton />
//                 <div className="md:amx-w-3xl lg:max-w-4xl mx-auto mt-10">
//                     <div className="space-y-4 pl-8 pt-4">
//                         <Skeleton className="h-14 w-[50%]"/>
//                         <Skeleton className="h-4 w-[80%]"/>
//                         <Skeleton className="h-4 w-[40%]"/>
//                         <Skeleton className="h-4 w-[60%]"/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (document === null) {
//         return <div>No encontrado</div>
//     }
//     return (
//       <>
//         <div className="flex-grow flex flex-col gap-2">
//           <Cover url={document.coverImage} />
//           <div className={`${width ? "w-full" : "w-[800px] mx-auto"} transition-all duration-500 ease-in-out pb-16`}>
//             <Toolbar initialData={document} />
//             <Editor onChange={onChange} initialContent={document.content} />
//           </div>
//         </div>
//       </>
//     );
//   }

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useMemo } from "react";
import { WidthContext } from "@/contexts/WidthContext";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function DocumentIdPage() {
  const params = useParams();
  const { width } = useContext(WidthContext);
  const Editor = useMemo(
    () => dynamic(() => import("./_components/editor"), { ssr: false }),
    []
  );
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  const update = useMutation(api.documents.update);
  const onChange = (content: string) => {
    update({
      id: params.documentId as Id<"documents">,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>No encontrado</div>;
  }

  return (
    <>
      <div className="flex-grow flex flex-col gap-2 print-container">
        <Cover url={document.coverImage} />
        <div className={`${width ? "w-full" : "w-[800px] mx-auto"} transition-all duration-500 ease-in-out pb-16 print-page long-text`}>
          <Toolbar initialData={document} />
          <Editor onChange={onChange} initialContent={document.content} />
        </div>
      </div>
    </>
  );
}