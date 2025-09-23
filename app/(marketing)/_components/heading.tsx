"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div id="fondo" className="flex flex-col items-center justify-center h-screen">
            <Image src="/uteco2.jpeg"
                height="500"
                width="500"
                alt="vacio"
                className="rounded-full"
            />
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white text-center mt-2 mb-2">
                SDL-UTECO
            </h2>
            <h1 className="text-3xl sm:text-2xl md:text-2xl from-accent-foreground text-white text-center mt-2 mb-2">
                UNIVERSIDAD TECNOLOGICA DEL CIBAO ORIENTAL
            </h1>
            
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button variant="uteco" asChild>
                    <Link href="/documents">
                        Entrar a SDL-UTECO
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button variant="uteco">
                        Entrar
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignInButton>
            )}
        </div>
    );
};
