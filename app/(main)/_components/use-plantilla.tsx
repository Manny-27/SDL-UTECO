import { FC, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { useParams } from "next/navigation";
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

// Aquí no estamos importando Id como un valor, solo como tipo
import { Id } from "@/convex/_generated/dataModel"; // Asegúrate de que esto sea correcto

export const UsePlantilla: FC = () => {
    const templates = useQuery(api.documents.getTemplates);
    const params = useParams();
    const currentDocumentId = Array.isArray(params.documentId) ? params.documentId[0] : params.documentId;
    const [search, setSearch] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [previewTemplate, setPreviewTemplate] = useState<any>(null);

    // Mutación para actualizar un documento
    const updateDocument = useMutation(api.documents.updateDocument);

    const filteredTemplates = templates?.filter((template) => {
        return template.title.toLowerCase().includes(search.toLowerCase());
    });

    const onUseTemplate = async (template: any) => {
        setSelectedTemplate(template);
    };

    const handleConfirmUseTemplate = async () => {
        if (selectedTemplate && currentDocumentId) {
            await updateDocument({
                id: currentDocumentId as Id<"documents">, // Hacer un type cast en lugar de conversión
                title: selectedTemplate.title,
                coverImage: selectedTemplate.coverImage,
                content: selectedTemplate.content,
                icon: selectedTemplate.icon,
                isPublished: selectedTemplate.isPublished,
                // parentDocument: selectedTemplate.parentDocument, // Eliminar esta línea por ahora
            });
            // Recargar la página completamente después de la mutación
            window.location.reload();
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
            <div>
                <div className="w-full">
                    {filteredTemplates?.map((template) => (
                        <Item
                            key={template._id}
                            id={template._id}
                            label={template.title}
                            icon={FileIcon}
                            documentIcon={template.icon}
                            onClick={() => onUseTemplate(template)}
                            onMouseEnter={() => setPreviewTemplate(template)}
                            onMouseLeave={() => setPreviewTemplate(null)}
                        />
                    ))}
                </div>
                <div className="w-full p-4 border-t mt-4">
                    {previewTemplate ? (
                        <div>
                            <h3 className="text-xl font-bold">{previewTemplate.title}</h3>
                            <p>{previewTemplate.content}</p>
                        </div>
                    ) : (
                        <span className="text-gray-500 text-sm mt-4 flex flex-col">Aqui tienes un listado de tus plantillas</span>
                    )}
                </div>
            </div>

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
