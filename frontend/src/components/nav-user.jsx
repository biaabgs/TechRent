"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearSession, getSessionUser } from "@/lib/auth-storage";
import { getHomeByRole } from "@/lib/route-guard";
import { getRoleMeta } from "@/components/app-shared";
import { HomeIcon, LogOutIcon, ShieldIcon } from "lucide-react";

export function NavUser() {
  const router = useRouter();
  const user = getSessionUser();
  const role = user?.nivel_acesso || "cliente";
  const roleMeta = getRoleMeta(role);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

	return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
				<button className="rounded-full border border-border/70 bg-card/70 p-1 shadow-sm outline-hidden ring-sidebar-ring transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2">
          <Avatar className="size-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-slate-950 text-white">{(user?.nome || "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
			</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-[22px] border border-border/70 bg-card/90 p-2 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
				<div className="rounded-2xl bg-muted/35 px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-950 text-white">{(user?.nome || "U").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{user?.nome || "Usuario"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || "Sem email"}</p>
              <p className="mt-1 inline-flex rounded-full border border-border/60 bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {roleMeta.label}
              </p>
            </div>
          </div>
        </div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
          <DropdownMenuLabel>Atalhos</DropdownMenuLabel>
					<DropdownMenuItem asChild className="cursor-pointer rounded-xl transition-all duration-200 hover:bg-primary/10">
            <Link href={getHomeByRole(role)}>
              <HomeIcon />
              Ir para meu painel
            </Link>
          </DropdownMenuItem>
					<DropdownMenuItem asChild className="cursor-pointer rounded-xl transition-all duration-200 hover:bg-primary/10">
            <Link href="/unauthorized">
              <ShieldIcon />
              Ver pagina de acesso
            </Link>
          </DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="w-full cursor-pointer rounded-xl text-destructive transition-all duration-200 hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
						<LogOutIcon />
						Sair
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
        </DropdownMenu>
    );
}
