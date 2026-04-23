import { cn } from "@/lib/utils";

export default function PageSection({ title, description, children, className }) {
  return (
    <section className={cn("app-surface-panel page-enter", className)}>
      {(title || description) ? (
        <div className="mb-5 flex flex-col gap-2">
          {title ? (
            <h2 className="app-panel-title">{title}</h2>
          ) : null}
          {description ? (
            <p className="app-panel-description">{description}</p>
          ) : null}
          <div className="mt-1 h-px w-full bg-gradient-to-r from-primary/20 via-slate-200 to-transparent" />
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
