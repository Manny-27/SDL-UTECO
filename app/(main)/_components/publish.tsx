import { Doc } from "@/convex/_generated/dataModel";
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
import { useOrigin } from "@/hooks/use-origin";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";


interface PublishProps {
    initialData: Doc<"documents">
};

export const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);
    const shareDocument = useMutation(api.documents.shareDocument); // Nueva mutación
    const userNames = useQuery(api.documents.getAllNames); // Obtener la lista de usuarios

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPublished, setIsPublished] = useState(initialData.isPublished);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: true,
        })
        .then(() => setIsPublished(true))
        .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Compartiendo...",
            success: "Documento compartido",
            error: "Error al compartir documento"
        });
    };

    const onUnpublish = () => {
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
        .then(() => setIsPublished(false))
        .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "dejar de compartir...",
            success: "Documento dejado de compartir",
            error: "Error al compartir documento"
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Compartir
                    {isPublished && (
                        <Globe className="text-sky-500 w-4 h-4 ml-2" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
                {isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-sky-500">
                                Este documento está ahora público.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            No Compartir
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-2">
                            Publicar este documento
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Comparte este documento con otros
                        </span>
                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Compartir
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
