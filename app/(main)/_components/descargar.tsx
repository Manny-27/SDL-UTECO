"use client";

import { useState, useEffect } from "react";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DescargarProps {
  documentId: string;
}

export const Descargar = ({ documentId }: DescargarProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = () => {
    setIsSubmitting(true);

    const promise = update({
      id: documentId,
      isPublished: true,
    })
      .then(() => {
        const url = `${origin}/descargar/${documentId}`;
        window.open(url, '_blank');
      })
      .finally(() => {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000); // Mantener isSubmitting en true durante 2 segundos
      });

    toast.promise(promise, {
      loading: "Publicando...",
      success: "Documento publicado y descargando",
      error: "Error al publicar documento",
    });
  };

  return (
    <div>
      {isClient && (
        <Button variant="uteco" onClick={handleDownload} disabled={isSubmitting}>
          {isSubmitting ? "Descargando..." : "Descargar"}
        </Button>
      )}
    </div>
  );
};