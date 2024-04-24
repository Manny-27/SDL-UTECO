"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Crea, edita y almacena todo tipo de contratos. Bienvenido a <span className="underline">SDL-UTECO</span>
            </h1>
            <Button>
                Entrar a SDL-UTECO
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}