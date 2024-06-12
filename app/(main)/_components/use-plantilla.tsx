import { FC, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { useRouter, useParams } from "next/navigation";
import { FileIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export const UsePlantilla: FC = () => {
    const templates = useQuery(api.documents.getTemplates);
    const router = useRouter();
    const params = useParams();
    const currentDocumentId = params.documentId;  // Suponiendo que el ID del documento actual está en los parámetros de la URL
    const [search, setSearch] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    // Mutación para actualizar un documento
    const updateDocument = useMutation(api.documents.updateDocument);

    const filteredTemplates = templates?.filter((template) => {
        return template.title.toLowerCase().includes(search.toLowerCase());
    });

    const onUseTemplate = async (template: any) => {
        setSelectedTemplate(template);
    };

    const handleConfirmUseTemplate = async () => {
        if (selectedTemplate) {
            await updateDocument({
                id: currentDocumentId,
                title: selectedTemplate.title,
                coverImage: selectedTemplate.coverImage,
                content: selectedTemplate.content,
                icon: selectedTemplate.icon,
                isPublished: selectedTemplate.isPublished,
                parentDocument: selectedTemplate.parentDocument,
                // Aquí puedes agregar más campos según sea necesario
            });
            router.push(`/documents/${currentDocumentId}`);
        }
    };

    if (templates === undefined) {
        return <p>Cargando plantillas...</p>;
    }

    return (
        <div className="p-2">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="filtrar por título de página..."
                />
            </div>
            {filteredTemplates.map((template) => (
                <Item
                    key={template._id}
                    id={template._id}
                    label={template.title}
                    icon={FileIcon}
                    documentIcon={template.icon}
                    onClick={() => onUseTemplate(template)}
                />
            ))}

            {selectedTemplate && (
                <AlertDialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
                    <AlertDialogTrigger asChild>
                        <div />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Usar Plantilla</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Quieres usar esta plantilla: {selectedTemplate.title}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedTemplate(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmUseTemplate}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};