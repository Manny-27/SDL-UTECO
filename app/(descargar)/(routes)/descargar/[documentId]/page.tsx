"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect, useMemo, useState } from "react";
import { WidthContext } from "@/contexts/WidthContext";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function DescargarPage() {
  const params = useParams();
  const { width } = useContext(WidthContext);
  const Editor = useMemo(() => dynamic(() => import("./_components/editor"), { ssr: false }), []);
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  const update = useMutation(api.documents.update);
  const [showCover, setShowCover] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  useEffect(() => {
    if (document && !document.isPublished) {
      update({
        id: params.documentId as Id<"documents">,
        isPublished: true,
      });
    }
  }, [document, params.documentId, update]);

  const onChange = (content: string) => {
    update({
      id: params.documentId as Id<"documents">,
      content,
    });
  };

  const handlePrint = () => {
    setHideButtons(true);
    setTimeout(() => {
      window.print();
      setHideButtons(false);
    }, 300);
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
      <div className="flex-grow flex flex-col gap-2">
        {showCover && <Cover preview url={document.coverImage} />}
        <div className={`${width ? "w-full" : "w-[800px] mx-auto"} transition-all duration-500 ease-in-out pb-16`}>
          {showToolbar && <Toolbar preview initialData={document} />}
          <Editor editable={false} onChange={onChange} initialContent={document.content} />
        </div>
      </div>
      {!hideButtons && (
        <div className="fixed bottom-4 left-4 flex flex-col gap-2">
          {showOptions && (
            <div className="bg-white p-4 rounded shadow-md mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCover"
                  checked={showCover}
                  onChange={(e) => setShowCover(e.target.checked)}
                />
                <label htmlFor="showCover">Mostrar Cover</label>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="showToolbar"
                  checked={showToolbar}
                  onChange={(e) => setShowToolbar(e.target.checked)}
                />
                <label htmlFor="showToolbar">Mostrar Toolbar</label>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handlePrint}
            >
              Imprimir
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setShowOptions(!showOptions)}
            >
              Opciones
            </button>
            </div>
          </div>
      )}
    </>
  );
}