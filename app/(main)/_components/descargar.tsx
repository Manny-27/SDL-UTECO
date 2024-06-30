"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Descargar = ({ documentId }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = () => {
    const origin = window.location.origin;
    const url = `${origin}/descargar/${documentId}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      {isClient && (
        <Button variant="uteco" onClick={handleDownload}>
          Descargar
        </Button>
      )}
    </div>
  );
};