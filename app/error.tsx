"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const Error = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/404.png"
                height="600"
                width="600"
                alt="Error"
                className="dark:hidden"
            />
            {/* para imagen en modo noche */}
            {/* <Image 
                src="/404.png"
                height="300"
                width="300"
                alt="Error"
                className="hidden dark:block"
            /> */}
            <h2 className="text-xl font-medium">
                Algo salio Mal!
            </h2>
            <Button asChild>
                <Link href="/documents">
                    Volver
                </Link>
            </Button>
        </div>
    );
}

export default Error;