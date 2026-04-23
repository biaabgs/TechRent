"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ClipboardCheckIcon, WrenchIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { manutencaoService } from "@/services/manutencao.service";
import {
  formatEnumLabel,
  getEquipmentStatusBadgeClass,
  getPriorityBadgeClass,
  getTicketStatusBadgeClass,
} from "@/lib/presentation";

export default function NovaManutencaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chamadoIdParam = searchParams.get("chamadoId");
  const equipamentoIdParam = searchParams.get("equipamentoId");

  const [form, setForm] = useState({
    chamado_id: chamadoIdParam || "",
    equipamento_id: equipamentoIdParam || "",
    descricao: "",
    status_equipamento: "operacional",
  });
  const [chamado, setChamado] = useState(null);
  const [loadingChamado, setLoadingChamado] = useState(Boolean(chamadoIdParam));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const carregarChamado = useCallback(async () => {
    if (!chamadoIdParam) return;

    try {
      setLoadingChamado(true);
      const data = await chamadosService.findById(Number(chamadoIdParam));
      const chamadoData = data?.chamado || null;

      setChamado(chamadoData);

      if (chamadoData) {
        setForm((prev) => ({
          ...prev,
          chamado_id: String(chamadoData.id),
          equipamento_id: String(chamadoData.equipamento_id || equipamentoIdParam || ""),
        }));
      }

      setError("");
    } catch (err) {
      setError(`Erro ao carregar chamado: ${err.message}`);
    } finally {
      setLoadingChamado(false);
    }
  }, [chamadoIdParam, equipamentoIdParam]);

  useEffect(() => {
    carregarChamado();
  }, [carregarChamado]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updatePositiveNumberField(field, value) {
    if (value === "") {
      update(field, "");
      return;
    }

    const numericValue = Number(value);
    update(field, numericValue > 0 ? String(numericValue) : "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFeedback("");

    if (!form.chamado_id || !form.equipamento_id || !form.descricao.trim()) {
      setError("Preencha os dados obrigatorios antes de registrar a manutencao.");
      return;
    }

    try {
      setLoading(true);
      await manutencaoService.registrar({
        chamado_id: Number(form.chamado_id),
        equipamento_id: Number(form.equipamento_id),
        descricao: form.descricao.trim(),
        status_equipamento: form.status_equipamento,
      });
      setFeedback("Manutencao registrada com sucesso. Redirecionando para a fila tecnica...");
      router.replace("/tecnico/fila");
    } catch (err) {
      setError(err.message || "Erro ao registrar manutencao.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
      <div className="grid gap-6">
        <PageSection
          title="Registrar manutencao"
          description="Conclua o atendimento, descreva o reparo e defina o status final do equipamento."
        >
          {loadingChamado ? (
            <p className="text-sm text-muted-foreground">Carregando dados do chamado...</p>
          ) : chamado ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <span className={getTicketStatusBadgeClass(chamado.status)}>
                  {formatEnumLabel(chamado.status)}
                </span>
                <span className={getPriorityBadgeClass(chamado.prioridade)}>
                  Prioridade {formatEnumLabel(chamado.prioridade)}
                </span>
              </div>

              <div className="rounded-[24px] border border-border/80 bg-muted/30 p-5">
                <h2 className="text-xl font-semibold text-foreground">{chamado.titulo}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{chamado.descricao}</p>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                  <div className="rounded-2xl bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Chamado</p>
                    <p className="mt-1 font-semibold text-foreground">#{chamado.id}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Equipamento</p>
                    <p className="mt-1 font-semibold text-foreground">{chamado.equipamento_nome}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cliente</p>
                    <p className="mt-1 font-semibold text-foreground">{chamado.cliente_nome}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Informe manualmente o ID do chamado e do equipamento para registrar a manutencao.
            </p>
          )}
        </PageSection>

        <PageSection title="Detalhes do reparo">
          <form onSubmit={handleSubmit} className="app-form-panel grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="chamado_id" className="app-form-label">
                  ID do chamado
                </label>
                <input
                  id="chamado_id"
                  type="number"
                  min="1"
                  className="app-form-control"
                  value={form.chamado_id}
                  onChange={(event) => updatePositiveNumberField("chamado_id", event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="equipamento_id" className="app-form-label">
                  ID do equipamento
                </label>
                <input
                  id="equipamento_id"
                  type="number"
                  min="1"
                  className="app-form-control"
                  value={form.equipamento_id}
                  onChange={(event) => updatePositiveNumberField("equipamento_id", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="descricao" className="app-form-label">
                Descricao do reparo
              </label>
              <textarea
                id="descricao"
                rows={6}
                className="app-form-control"
                placeholder="Explique o que foi diagnosticado, quais acoes foram feitas e se houve troca de componente."
                value={form.descricao}
                onChange={(event) => update("descricao", event.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="status_equipamento" className="app-form-label">
                Status final do equipamento
              </label>
              <select
                id="status_equipamento"
                className="app-form-control"
                value={form.status_equipamento}
                onChange={(event) => update("status_equipamento", event.target.value)}
              >
                <option value="operacional">Operacional</option>
                <option value="em_manutencao">Em manutencao</option>
                <option value="desativado">Desativado</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {feedback ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" disabled={loading}>
                <ClipboardCheckIcon />
                {loading ? "Registrando..." : "Registrar manutencao"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                <ArrowLeftIcon />
                Voltar
              </Button>
            </div>
          </form>
        </PageSection>
      </div>

      <div className="grid gap-6">
        <section className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <WrenchIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Resumo final</p>
              <p className="text-sm text-muted-foreground">Como o item deve voltar para operacao.</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-muted/35 p-4">
            <span className={getEquipmentStatusBadgeClass(form.status_equipamento)}>
              {formatEnumLabel(form.status_equipamento)}
            </span>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Use <strong className="text-foreground">Operacional</strong> quando o equipamento estiver pronto para retorno.
              Se ainda depender de nova intervencao, mantenha em <strong className="text-foreground">Em manutencao</strong>.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-border/80 bg-card/95 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Checklist tecnico</p>
          <div className="mt-4 grid gap-3 text-sm text-foreground/90">
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              Confirmar diagnostico e validar o equipamento correto antes de registrar o reparo.
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              Descrever a acao executada com detalhe suficiente para auditoria e historico.
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              Atualizar o status final de forma consistente com a condicao real do equipamento.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
