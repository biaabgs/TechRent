"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, WrenchIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { getSessionUser } from "@/lib/auth-storage";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import {
  formatEnumLabel,
  getPriorityBadgeClass,
  getTicketStatusBadgeClass,
} from "@/lib/presentation";

export default function TecnicoChamadoDetalhePage() {
  const [chamado, setChamado] = useState(null);
  const [status, setStatus] = useState("em_atendimento");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const params = useParams();
  const user = getSessionUser();

  async function fetchChamadoById() {
    setError("");
    try {
      setLoading(true);
      const data = await chamadosService.findById(params?.id);
      const chamadoData = data?.chamado || null;
      setChamado(chamadoData);
      setStatus(chamadoData?.status === "aberto" ? "em_atendimento" : chamadoData?.status || "em_atendimento");
    } catch (err) {
      setError(err.message || "Erro ao buscar chamado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChamadoById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  async function handleUpdateStatus(event) {
    event.preventDefault();
    setError("");
    setFeedback("");

    try {
      setSubmitting(true);
      await chamadosService.updateStatus(params?.id, { status, tecnico_id: user?.id });
      setFeedback("Status atualizado com sucesso.");
      await fetchChamadoById();
    } catch (err) {
      setError(err.message || "Erro ao atualizar status");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-grid">
      <PageSection
        title={`Atendimento do chamado #${params?.id}`}
        description="Atualize o andamento do chamado e avance para o registro do reparo quando o atendimento estiver concluido."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/tecnico/fila">
              <ArrowLeftIcon />
              Voltar para a fila
            </Link>
          </Button>
          {chamado?.status === "em_atendimento" ? (
            <Button asChild size="lg">
              <Link href={`/tecnico/manutencao/nova?chamadoId=${params?.id}&equipamentoId=${chamado?.equipamento_id}`}>
                <WrenchIcon />
                Registrar reparo
              </Link>
            </Button>
          ) : null}
        </div>
      </PageSection>

      {loading ? (
        <div className="surface-panel p-8 text-sm text-muted-foreground">Carregando chamado...</div>
      ) : error ? (
        <div className="surface-panel border-destructive/20 bg-destructive/5 p-8 text-sm text-destructive">
          {error}
        </div>
      ) : chamado ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <PageSection title={chamado.titulo} description="Contexto principal para conduzir o atendimento tecnico.">
            <div className="flex flex-wrap gap-2">
              <span className={getTicketStatusBadgeClass(chamado.status)}>
                {formatEnumLabel(chamado.status)}
              </span>
              <span className={getPriorityBadgeClass(chamado.prioridade)}>
                {formatEnumLabel(chamado.prioridade)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="surface-muted p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cliente</p>
                <p className="mt-2 font-semibold text-foreground">{chamado.cliente_nome}</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Equipamento</p>
                <p className="mt-2 font-semibold text-foreground">{chamado.equipamento_nome}</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Responsavel atual</p>
                <p className="mt-2 font-semibold text-foreground">
                  {chamado.tecnico_nome || "Nao atribuido"}
                </p>
              </div>
            </div>

            <div className="mt-5 surface-muted p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Descricao do chamado</p>
              <p className="mt-3 text-sm leading-7 text-foreground/90">{chamado.descricao}</p>
            </div>
          </PageSection>

          <PageSection title="Atualizar andamento" description="Mantenha o status alinhado com o momento real do atendimento.">
            <form onSubmit={handleUpdateStatus} className="app-form-panel grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="app-form-label">
                  Novo status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="app-form-control"
                >
                  <option value="em_atendimento">Em atendimento</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              {feedback ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {feedback}
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Atualizando..." : "Salvar andamento"}
                <ArrowRightIcon />
              </Button>
            </form>
          </PageSection>
        </div>
      ) : null}
    </div>
  );
}
