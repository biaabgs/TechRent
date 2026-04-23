import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumbs({
    page
}) {
	if (!page?.title) {
		return null;
	}

	return (
        <Breadcrumb>
            <BreadcrumbList className="gap-2">
				{page.section ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <span className="rounded-full border border-border/70 bg-card/65 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
                {page.section}
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        ) : null}
				<BreadcrumbItem>
					<BreadcrumbPage className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground [&>svg]:size-4 [&>svg]:text-primary">
						{page.icon}
						{page.title}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
        </Breadcrumb>
    );
}
