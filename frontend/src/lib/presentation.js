import { cn } from "@/lib/utils";

const LABELS = {
  aberto: "Aberto",
  em_atendimento: "Em atendimento",
  resolvido: "Resolvido",
  cancelado: "Cancelado",
  operacional: "Operacional",
  em_manutencao: "Em manutencao",
  desativado: "Desativado",
  alta: "Alta",
  media: "Media",
  baixa: "Baixa",
  cliente: "Cliente",
  tecnico: "Tecnico",
  admin: "Administrador",
};

function makeBadgeClass(colorClass) {
  return cn(
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
    colorClass
  );
}

export function formatEnumLabel(value) {
  if (!value) return "-";
  return LABELS[value] || value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getTicketStatusBadgeClass(status) {
  const styles = {
    aberto: "border-sky-200 bg-sky-100 text-sky-800",
    em_atendimento: "border-amber-200 bg-amber-100 text-amber-800",
    resolvido: "border-emerald-200 bg-emerald-100 text-emerald-800",
    cancelado: "border-zinc-200 bg-zinc-100 text-zinc-700",
  };

  return makeBadgeClass(styles[status] || "border-border bg-muted text-muted-foreground");
}

export function getEquipmentStatusBadgeClass(status) {
  const styles = {
    operacional: "border-emerald-200 bg-emerald-100 text-emerald-800",
    em_manutencao: "border-amber-200 bg-amber-100 text-amber-800",
    desativado: "border-rose-200 bg-rose-100 text-rose-800",
  };

  return makeBadgeClass(styles[status] || "border-border bg-muted text-muted-foreground");
}

export function getPriorityBadgeClass(priority) {
  const styles = {
    alta: "border-rose-200 bg-rose-100 text-rose-800",
    media: "border-amber-200 bg-amber-100 text-amber-800",
    baixa: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return makeBadgeClass(styles[priority] || "border-border bg-muted text-muted-foreground");
}
