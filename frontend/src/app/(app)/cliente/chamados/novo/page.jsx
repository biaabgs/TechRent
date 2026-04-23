"use client";

import { useEffect, useState } from "react";
import { AlertCircleIcon, ClipboardPlusIcon, CpuIcon, ShieldCheckIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { equipamentosService } from "@/services/equipamentos.service";
import { formatEnumLabel } from "@/lib/presentation";

const INITIAL_FORM = {
  titulo: "",
  descricao: "",
  equipamento_id: "",
  prioridade: "media",
};

export default function NovoChamadoPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    equipamentosService
      .listar()
      .then((data) => {
        setEquipamentos(data?.equipamentos || []);
        setError("");
      })
      .catch((err) => setError(err.message || "Erro ao carregar equipamentos"))
      .finally(() => setLoadingEquip(false));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFeedback("");
    setSubmitting(true);

    try {
      await chamadosService.create({
        ...form,
        equipamento_id: Number(form.equipamento_id),
      });
      setFeedback("Chamado aberto com sucesso. A equipe tecnica ja pode assumir o atendimento.");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err.message || "Nao foi possivel abrir o chamado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <PageSection
        title="Abrir novo chamado"
        description="Descreva o problema, selecione o equipamento operacional e defina a prioridade do atendimento."
      >
        <form onSubmit={handleSubmit} className="app-form-panel grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="titulo" className="app-form-label">
              Titulo do problema
            </label>
            <input
              id="titulo"
              className="app-form-control"
              placeholder="Ex: Notebook do laboratorio nao liga"
              value={form.titulo}
              onChange={(event) => update("titulo", event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="descricao" className="app-form-label">
              Descricao detalhada
            </label>
            <textarea
              id="descricao"
              className="app-form-control min-h-36"
              placeholder="Conte o que aconteceu, quando comecou e se ja houve alguma tentativa de correcao."
              value={form.descricao}
              onChange={(event) => update("descricao", event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="equipamento" className="app-form-label">
                Equipamento afetado
              </label>
              <select
                id="equipamento"
                className="app-form-control"
                value={form.equipamento_id}
                onChange={(event) => update("equipamento_id", event.target.value)}
                required
                disabled={loadingEquip || equipamentos.length === 0}
              >
                <option value="">
                  {loadingEquip ? "Carregando equipamentos..." : "Selecione um equipamento"}
                </option>
                {equipamentos.map((equipamento) => (
                  <option key={equipamento.id} value={equipamento.id}>
                    {equipamento.nome} {equipamento.patrimonio ? `- ${equipamento.patrimonio}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="prioridade" className="app-form-label">
                Prioridade
              </label>
              <select
                id="prioridade"
                className="app-form-control"
                value={form.prioridade}
                onChange={(event) => update("prioridade", event.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
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

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={submitting || loadingEquip || equipamentos.length === 0} size="lg">
              <ClipboardPlusIcon />
              {submitting ? "Abrindo chamado..." : "Abrir chamado"}
            </Button>
            <p className="text-sm text-muted-foreground">
              O equipamento selecionado passa a ficar indisponivel durante o atendimento.
            </p>
          </div>
        </form>
      </PageSection>

      <div className="grid gap-6">
        <section className="app-surface-panel">
          <div className="hero-chip">
            Atendimento guiado
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">
            Abertura de chamado mais rapida e com menos retrabalho.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Preencha bem os detalhes para a equipe tecnica assumir mais rapido e registrar a manutencao sem depender de informacoes soltas.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Equipamentos validos",
                description: "A lista mostra apenas itens operacionais e liberados para abertura de chamado.",
              },
              {
                icon: AlertCircleIcon,
                title: "Prioridade clara",
                description: `Prioridade atual: ${formatEnumLabel(form.prioridade)}.`,
              },
              {
                icon: CpuIcon,
                title: "Contexto tecnico",
                description: "Descreva sintomas, horario e impacto para acelerar a triagem.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-muted p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-950/6 p-2 text-slate-700">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="app-form-panel">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Equipamentos disponiveis
          </h3>
          <div className="mt-4 grid gap-3">
            {loadingEquip ? (
              <p className="text-sm text-muted-foreground">Carregando equipamentos...</p>
            ) : equipamentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum equipamento operacional disponivel para abertura de chamado.
              </p>
            ) : (
              equipamentos.slice(0, 4).map((equipamento) => (
                <div key={equipamento.id} className="rounded-xl border border-border/70 bg-muted/35 p-4">
                  <p className="font-medium text-foreground">{equipamento.nome}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {equipamento.categoria || "Sem categoria"}
                    {equipamento.patrimonio ? ` - ${equipamento.patrimonio}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
