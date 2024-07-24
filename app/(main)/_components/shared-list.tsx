import { FC, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { useRouter } from "next/navigation";
import { FileIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SharedList: FC = () => {
    const sharedDocuments = useQuery(api.documents.getSharedDocuments);
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filteredSharedDocuments = sharedDocuments?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (sharedDocuments === undefined) {
        return <p>Cargando documentos compartidos...</p>;
    }

    return (
        <div className="p-2">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="filtrar por título de documento..."
                />
            </div>
            {filteredSharedDocuments && filteredSharedDocuments.map((document) => (
                <Item
                    key={document._id}
                    id={document._id}
                    label={document.title}
                    icon={FileIcon}
                    documentIcon={document.icon}
                    onClick={() => onRedirect(document._id)}
                />
            ))}
        </div>
    );
};
