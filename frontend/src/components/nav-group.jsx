import Link from "next/link";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({
    label,
    items
}) {
	return (
        <SidebarGroup>
            {label && <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/55">{label}</SidebarGroupLabel>}
            <SidebarMenu>
				{items.map((item) => (
					<Collapsible
                        asChild
                        className="group/collapsible"
                        defaultOpen={
							!!item.isActive ||
							item.subItems?.some((i) => !!i.isActive)
						}
                        key={item.title}>
						<SidebarMenuItem>
							{item.subItems?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
                                            isActive={item.isActive}
                                            className={cn(
                                                "rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5",
                                                item.isActive
                                                  ? "bg-gradient-to-r from-primary/12 to-accent/10 text-foreground shadow-sm ring-1 ring-primary/10"
                                                  : "hover:bg-sidebar-accent/70 hover:shadow-sm"
                                            )}>
											{item.icon}
											<span>{item.title}</span>
											<ChevronRightIcon
                                                className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub className="ml-5 mt-1 border-l-sidebar-border/70">
											{item.subItems?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
                                                        asChild
                                                        isActive={subItem.isActive}
                                                        className={cn(
                                                            "rounded-xl transition-all duration-300",
                                                            subItem.isActive
                                                              ? "bg-primary/8 text-foreground shadow-sm"
                                                              : "hover:bg-sidebar-accent/60"
                                                        )}>
														<Link href={subItem.path}>
															{subItem.icon}
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton
                                    asChild
                                    isActive={item.isActive}
                                    className={cn(
                                        "rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5",
                                        item.isActive
                                          ? "bg-gradient-to-r from-primary/12 to-accent/10 text-foreground shadow-sm ring-1 ring-primary/10"
                                          : "hover:bg-sidebar-accent/70 hover:shadow-sm"
                                    )}>
									<Link href={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
        </SidebarGroup>
    );
}
