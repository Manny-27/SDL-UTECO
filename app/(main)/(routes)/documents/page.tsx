"use client"
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "Untitle" });

        toast.promise(promise, {
            loading: "Creando un documento nuevo...",
            success: "Nuevo documento Creado!",
            error: "Fallo al crear un documento Nuevo."
        });
    };

    return ( 
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image src="/notas_vacias.png"
            height="300"
            width="300"
            alt="vacio"
            className="dark:hidden"
            />
            <Image src="/notas_vacias.png"
            height="300"
            width="300"
            alt="vacio"
            className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Bienvenido {user?.firstName}
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Crear un documento
            </Button>
        </div>
    );
}

export default DocumentsPage;