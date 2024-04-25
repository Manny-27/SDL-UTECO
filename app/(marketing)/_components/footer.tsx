import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
            <Logo />
            <div className="md:ml-auto w-[90%] justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant="ghost" size="sm">
                    Politicas de Privacidad
                </Button>
                <Button variant="ghost" size="sm">
                    Terminos y condiciones
                </Button>
            </div>
        </div>
    )
}