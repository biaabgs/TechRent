import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden">
            <div
                className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-12 px-6 py-12 lg:grid-cols-2 lg:py-0">
                <div className="my-auto">
                    <Badge asChild className="rounded-full border-border py-1" variant="secondary">
                        <Link href="#">
                            Nossa versão <ArrowUpRight className="ml-1 size-4" />
                        </Link>
                    </Badge>
                    <h1
                        className="mt-6 max-w-[17ch] font-satoshi font-semibold text-4xl leading-[1.2]! tracking-tight md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                        Nossa empresa adaklfjkgfjksldak
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-foreground/80 text-lg">
                        Este MVP tem foco em centralizar o relato de problemas de TI,
                        permitir que administradores gerenciem o fluxo e que tecnicos resolvam os chamados,
                        com base no modelo de banco de dados presente em
                    </p>
                    <div className="mt-12 flex items-center gap-4">
                        <a href="/login">
                            <Button className="rounded-full text-base" size="lg">
                                Começar <ArrowUpRight className="h-5! w-5!" />
                            </Button>
                        </a>
                    </div>
                </div>
                {/* <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10"> */}
                <div
                    className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10" />
            </div>
        </div>
    );
}
