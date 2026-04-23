"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, FilterIcon, WrenchIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { dashboardService } from "@/services/dashboard.service";
import {
  formatEnumLabel,
  getPriorityBadgeClass,
  getTicketStatusBadgeClass,
} from "@/lib/presentation";
import { getSessionUser } from "@/lib/auth-storage";
import { cn } from "@/lib/utils";

const FILTERS = ["todos", "aberto", "em_atendimento"];

export default function TecnicoFilaPage() {
  const user = getSessionUser();
  const [painel, setPainel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    carregarFila();
  }, []);

  async function carregarFila() {
    try {
      setLoading(true);
      const data = await dashboardService.tecnico();
      setPainel(data?.painel || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar fila tecnica.");
    } finally {
      setLoading(false);
    }
  }

  async function assumirChamado(chamadoId) {
    try {
      setActionId(chamadoId);
      await chamadosService.updateStatus(chamadoId, {
        status: "em_atendimento",
        tecnico_id: user?.id,
      });
      await carregarFila();
    } catch (err) {
      setError(`Erro ao assumir chamado: ${err.message}`);
    } finally {
      setActionId(null);
    }
  }

  const chamadosFiltrados = painel.filter((item) => {
    if (filtro === "todos") return true;
    return item.status === filtro;
  });

  const counters = {
    todos: painel.length,
    aberto: painel.filter((item) => item.status === "aberto").length,
    em_atendimento: painel.filter((item) => item.status === "em_atendimento").length,
  };

  return (
    <div className="grid gap-6">
      <PageSection
        title="Fila tecnica"
        description="Priorize chamados abertos, assuma atendimentos e siga direto para o registro de manutencao."
      >
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFiltro(item)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                filtro === item
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-white/20 bg-white/82 text-slate-800 shadow-sm backdrop-blur hover:bg-white"
              )}
            >
              <FilterIcon className="size-3.5" />
              {formatEnumLabel(item)} ({counters[item]})
            </button>
          ))}
        </div>
      </PageSection>

      {loading ? (
        <p className="app-surface-panel text-center text-sm text-slate-600">
          Carregando fila tecnica...
        </p>
      ) : error ? (
        <p className="app-surface-panel border-destructive/20 bg-destructive/5 text-center text-sm text-destructive">
          {error}
        </p>
      ) : chamadosFiltrados.length === 0 ? (
        <div className="app-surface-panel border-dashed border-slate-200 text-center text-sm text-slate-600">
          Nenhum chamado encontrado para o filtro atual.
        </div>
      ) : (
        <div className="grid gap-4">
          {chamadosFiltrados.map((item) => (
            <article
              key={item.chamado_id}
              className="app-surface-card"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={getTicketStatusBadgeClass(item.status)}>
                      {formatEnumLabel(item.status)}
                    </span>
                    <span className={getPriorityBadgeClass(item.prioridade)}>
                      Prioridade {formatEnumLabel(item.prioridade)}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-foreground">{item.titulo}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {item.descricao || "Sem descricao detalhada informada pelo solicitante."}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <div className="surface-muted p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Solicitante
                      </p>
                      <p className="mt-1 font-medium text-slate-950">{item.solicitante}</p>
                    </div>
                    <div className="surface-muted p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Equipamento
                      </p>
                      <p className="mt-1 font-medium text-slate-950">{item.equipamento}</p>
                      <p className="text-xs text-slate-500">{item.categoria || "Sem categoria"}</p>
                    </div>
                    <div className="surface-muted p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Responsavel
                      </p>
                      <p className="mt-1 font-medium text-slate-950">
                        {item.tecnico_responsavel || "Nao atribuido"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 lg:w-56">
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/tecnico/chamados/${item.chamado_id}`}>
                      Ver detalhes
                      <ArrowRightIcon />
                    </Link>
                  </Button>

                  {item.status === "aberto" ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => assumirChamado(item.chamado_id)}
                      disabled={actionId === item.chamado_id}
                    >
                      <WrenchIcon />
                      {actionId === item.chamado_id ? "Assumindo..." : "Assumir atendimento"}
                    </Button>
                  ) : (
                    <Button asChild size="lg">
                      <Link
                        href={`/tecnico/manutencao/nova?chamadoId=${item.chamado_id}&equipamentoId=${item.equipamento_id}`}
                      >
                        Registrar reparo
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
