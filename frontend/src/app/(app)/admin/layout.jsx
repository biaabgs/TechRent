import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ProtectedLayout({ children }) {
  return (
    <TooltipProvider delayDuration={0}>
      <AppShell>
        {children}
      </AppShell>
    </TooltipProvider>
  );
}