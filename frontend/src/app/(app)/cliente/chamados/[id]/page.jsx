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
import { useAuth } from "@/hooks/useAuth";

export default function ChamadoDetalhePage() {
  // Chamada do hook com o nível de acesso exigido
  const { pronto } = useAuth("cliente");
  
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();

  useEffect(() => {
    // Só busca os dados se a autenticação estiver confirmada (pronto === true)
    if (!pronto || !params?.id) return;

    setLoading(true);
    chamadosService
      .findById(params.id)
      .then((data) => setChamado(data?.chamado || null))
      .catch((err) => setError(err.message || "Erro ao buscar chamado"))
      .finally(() => setLoading(false));
  }, [pronto, params?.id]);

  // Enquanto o hook verifica o token, não renderizamos nada para evitar "flicker"
  if (!pronto) return null;

  return (
    <div className="dashboard-grid">
      <PageSection
        title={`Chamado #${params?.id}`}
        description="Acompanhe os detalhes completos do atendimento e o status mais recente do seu chamado."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/cliente/chamados">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
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
          <PageSection title={chamado.titulo} description="Resumo técnico e operacional do chamado.">
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
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Técnico responsável</p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {chamado.tecnico_nome || "Não atribuído"}
                </p>
              </div>
            </div>

            <div className="mt-5 surface-muted p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Descrição</p>
              <p className="mt-3 text-sm leading-7 text-foreground/90">{chamado.descricao}</p>
            </div>
          </PageSection>

          <aside className="grid gap-6">
            <section className="surface-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <ClipboardListIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Status do atendimento</p>
                  <p className="text-sm text-muted-foreground">O fluxo muda conforme a equipe assume o reparo.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {["aberto", "em_atendimento", "resolvido"].map((step) => (
                  <div
                    key={step}
                    className={`surface-muted p-4 transition-colors ${
                      chamado.status === step ? "ring-2 ring-primary/50 bg-primary/5" : "opacity-60"
                    }`}
                  >
                    <p className="font-medium text-foreground">{formatEnumLabel(step)}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      ) : (
        <div className="surface-panel p-8 text-center">Chamado não encontrado.</div>
      )}
    </div>
  );
}