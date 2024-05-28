import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Descargar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handlePrintShortcut = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        window.print();
      }
    };

    document.addEventListener("keydown", handlePrintShortcut);

    return () => {
      document.removeEventListener("keydown", handlePrintShortcut);
    };
  }, []);

  return (
    <div>
      {isClient && (
        <Button variant="uteco" onClick={() => window.print()}>
          Descargar
        </Button>
      )}
    </div>
  );
};