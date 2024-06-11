'use client'

// import { Button } from "@/components/ui/button";
import { Id } from '../../../convex/_generated/dataModel';

// import { 
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";
// import { Skeleton } from "@/components/ui/skeleton";

// export const Plantilla = () => {
//     return (
//         <div className="flex gap-4">
//             <Button variant="outline">Convertir</Button>
//             <DropdownMenu>
//                 <DropdownMenuTrigger>
//                     <Button variant="ghost">Mis Plantillas</Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuItem>
//                         <div>Hola</div>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                         <div>Mundo</div>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//     )
// }
import { FC } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    );
};