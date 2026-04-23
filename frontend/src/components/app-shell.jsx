import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/sidebar";

export function AppShell({
    children
}) {
	return (
        <SidebarProvider suppressHydrationWarning>
            <AppSidebar />
            <SidebarInset className="relative flex flex-col border-l border-border/70 bg-transparent">
				<AppHeader />
				<main className="relative flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
					    {children}
                    </div>
				</main>
			</SidebarInset>
        </SidebarProvider>
    );
}
