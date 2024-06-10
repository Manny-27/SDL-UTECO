'use client'

import { Button } from "@/components/ui/button";

import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const Plantilla = () => {
    return (
        <div className="flex gap-4">
            <Button variant="outline">Convertir</Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost">Mis Plantillas</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <div>Hola</div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div>Mundo</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}