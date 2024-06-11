'use client'

import { FC } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UsePlantilla } from "./use-plantilla";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Item } from "./item";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash, NotepadText } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { PlantillaList } from "./list-plantillas";

interface PlantillaProps {
    documentId: string;
}

export const Plantilla: FC<PlantillaProps> = ({ documentId }) => {
    const convertToTemplate = useMutation(api.documents.convertToTemplate);

    const confirmConvert = () => {
        const promise = convertToTemplate({ id: documentId });
        toast.promise(promise, {
            loading: "Convirtiendo a plantilla...",
            success: "Documento convertido a plantilla!",
            error: "Error al convertir el documento",
        });
    };

    return (
        <>
            {/* plantilla */}
            <Popover>
                        <PopoverTrigger className="w-full">
                            <Item label="Usar Plantilla" icon={NotepadText} />
                        </PopoverTrigger>
                        <PopoverContent
                        className="p-0 w-72"
                        >
                            <PlantillaList />
                        </PopoverContent>
                    </Popover>
                {/* plantilla */}
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Convertir a Plantilla</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Conversión</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que quieres convertir este documento en una plantilla?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmConvert}>Sí, Convertir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
};