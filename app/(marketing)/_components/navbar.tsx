"use client"

import { useScrollTop } from "@/hooks/use-scroll-top"
import { cn } from "@/lib/utils"
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Navbar = () => {
    const {isAuthenticated, isLoading} = useConvexAuth();
    const scrolled = useScrollTop();

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top=0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-[90%] flex items-center gap-x-2">
                {isLoading && (
                    <Spinner />
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                    <SignInButton mode="modal">
                        <Button variant="outline" size="sm">
                            Registrarte
                        </Button>
                    </SignInButton>
                    
                    </>
                )}
                    {isAuthenticated && !isLoading && (
                        <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Entrar a SDL-UTECO
                            </Link>
                        </Button>
                        <UserButton afterSignOutUrl="/" />
                        </>
                    )}
                <ModeToggle />
            </div>
        </div>
    )
}