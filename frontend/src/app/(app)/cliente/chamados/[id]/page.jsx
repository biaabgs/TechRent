"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react";
import { useParams } from "next/navigation";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import {
  formatEnumLabel,
  getPriorityBadgeClass,
  getTicketStatusBadgeClass,
} from "@/lib/presentation";

export default function ChamadoDetalhePage() {
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();

  useEffect(() => {
    chamadosService
      .findById(params?.id)
      .then((data) => setChamado(data?.chamado || null))
      .catch((err) => setError(err.message || "Erro ao buscar chamado"))
      .finally(() => setLoading(false));
  }, [params?.id]);

  return (
    <div className="dashboard-grid">
      <PageSection
        title={`Chamado #${params?.id}`}
        description="Acompanhe os detalhes completos do atendimento e o status mais recente do seu chamado."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/cliente/chamados">
              <ArrowLeftIcon />
              Voltar para a lista
            </Link>
          </Button>
        </div>
      </PageSection>

      {loading ? (
        <div className="surface-panel p-8 text-sm text-muted-foreground">Carregando chamado...</div>
      ) : error ? (
        <div className="surface-panel border-destructive/20 bg-destructive/5 p-8 text-sm text-destructive">
          {error}
        </div>
      ) : chamado ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <PageSection title={chamado.titulo} description="Resumo tecnico e operacional do chamado.">
            <div className="flex flex-wrap gap-2">
              <span className={getTicketStatusBadgeClass(chamado.status)}>
                {formatEnumLabel(chamado.status)}
              </span>
              <span className={getPriorityBadgeClass(chamado.prioridade)}>
                {formatEnumLabel(chamado.prioridade)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="surface-muted p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Equipamento</p>
                <p className="mt-2 text-base font-semibold text-foreground">{chamado.equipamento_nome}</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tecnico responsavel</p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {chamado.tecnico_nome || "Nao atribuido"}
                </p>
              </div>
            </div>

            <div className="mt-5 surface-muted p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Descricao</p>
              <p className="mt-3 text-sm leading-7 text-foreground/90">{chamado.descricao}</p>
            </div>
          </PageSection>

          <div className="grid gap-6">
            <section className="surface-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <ClipboardListIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Status do atendimento</p>
                  <p className="text-sm text-muted-foreground">O fluxo muda conforme a equipe assume e conclui o reparo.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  "aberto",
                  "em_atendimento",
                  "resolvido",
                ].map((step) => (
                  <div
                    key={step}
                    className={`surface-muted p-4 ${chamado.status === step ? "ring-1 ring-primary/20" : ""}`}
                  >
                    <p className="font-medium text-foreground">{formatEnumLabel(step)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
