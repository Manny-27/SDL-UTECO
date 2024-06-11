import { FC } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { useRouter } from "next/navigation";
import { FileIcon } from "lucide-react";

export const PlantillaList: FC = () => {
    const templates = useQuery(api.documents.getTemplates);
    const router = useRouter();

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (templates === undefined) {
        return <p>Cargando plantillas...</p>;
    }

    return (
        <div className="p-2">
            {templates.map((template) => (
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