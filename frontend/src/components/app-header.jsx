"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSessionUser } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { getPageInfo } from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";
import { BellIcon } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const user = getSessionUser();
  const page = getPageInfo(pathname, user?.nivel_acesso);
  const notificationCount = 0;

	return (
        <header
            className={cn("sticky top-0 z-20 border-b border-border/50 bg-background/72 px-3 py-3 backdrop-blur-xl md:px-4")}>
            <div className="flex w-full items-center justify-between gap-4">
            <div className="min-w-0 flex items-center gap-3">
				<div className="rounded-2xl border border-border/70 bg-card/70 p-1 shadow-sm">
                    <CustomSidebarTrigger />
                </div>
				<Separator
                    className="hidden h-10 data-[orientation=vertical]:self-center md:block"
                    orientation="vertical" />
                <div className="min-w-0">
				    <AppBreadcrumbs page={page} />
                    <p className="mt-1 hidden truncate text-sm text-muted-foreground md:block">
                        {page.description}
                    </p>
                </div>
			</div>
            <div className="flex items-center gap-3">
				<div className="relative">
					<Button aria-label="Notifications" size="icon" variant="ghost" className="rounded-2xl border border-border/70 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-md">
						<BellIcon />
					</Button>
					{notificationCount > 0 && (
						<span className="notification-badge">
							{notificationCount}
						</span>
					)}
				</div>
				<Separator
                    className="hidden h-10 data-[orientation=vertical]:self-center md:block"
                    orientation="vertical" />
				<NavUser />
			</div>
            </div>
        </header>
    );
}
