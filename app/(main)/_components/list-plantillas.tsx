import { FC, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { useRouter } from "next/navigation";
import { FileIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const PlantillaList: FC = () => {
    const templates = useQuery(api.documents.getTemplates);
    const router = useRouter();
    const documents = useQuery(api.documents.getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const [search, setSearch] = useState("");

    const filteredTemplates = templates?.filter((template) => {
        return template.title.toLowerCase().includes(search.toLowerCase());
    });


    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onUseTemplate = async (template: any) => {
        setSelectedTemplate(template);
    };


    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
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
                    onClick={() => onRedirect(template._id)}
                />
            ))}
        </div>
    );
};