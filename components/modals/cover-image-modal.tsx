"use client"

import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { update } from '../../convex/documents';
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
    const params = useParams();
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const coverImage = useCoverImage();
    const update = useMutation(api.documents.update);

    const { edgestore} = useEdgeStore();

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    };

    const onChange = async (file?: File) => {
        if(file) {
            setIsSubmitting(true);
            setFile(file);

                const res = await edgestore.publicFiles.upload({
                    file,
                    options: {
                        replaceTargetUrl: coverImage.url
                    }
                });
            
            
            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url
            });

            onClose();
        }
    }    

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3 flex items-center">
                    <h2 className="text-lg font-medium">
                        cover image
                    </h2>                    
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <SingleImageDropzone 
                        className="w-full outline-none"
                        onChange={onChange}
                        disabled={isSubmitting}
                        value={file}
                    />
                </div>
            </DialogContent>
        </Dialog>
        );
    };