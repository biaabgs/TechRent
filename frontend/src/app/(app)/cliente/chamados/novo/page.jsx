"use client";

import { useEffect, useState } from "react";
import { AlertCircleIcon, ClipboardPlusIcon, CpuIcon, ShieldCheckIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { equipamentosService } from "@/services/equipamentos.service";
import { formatEnumLabel } from "@/lib/presentation";
import { useAuth } from "@/hooks/useAuth";

const INITIAL_FORM = {
  titulo: "",
  descricao: "",
  equipamento_id: "",
  prioridade: "media",
};

export default function NovoChamadoPage() {
  // Proteção de rota
  const { pronto } = useAuth("cliente");

  const [equipamentos, setEquipamentos] = useState([]);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!pronto) return;

    setLoadingEquip(true);
    equipamentosService
      .listar()
      .then((data) => {
        setEquipamentos(data?.equipamentos || []);
        setError("");
      })
      .catch((err) => {
        console.error("Erro ao carregar equipamentos:", err);
        setError("Não foi possível carregar a lista de equipamentos.");
      })
      .finally(() => setLoadingEquip(false));
  }, [pronto]);

  // Bloqueia renderização até auth estar pronto
  if (!pronto) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFeedback("");

    // Validação básica de segurança
    if (!form.equipamento_id) {
      setError("Por favor, selecione um equipamento.");
      return;
    }

    setSubmitting(true);

    try {
      await chamadosService.create({
        ...form,
        equipamento_id: Number(form.equipamento_id),
      });
      
      setFeedback("Chamado aberto com sucesso! Nossa equipe técnica será notificada.");
      setForm(INITIAL_FORM); // Limpa o formulário após sucesso
      
      // Opcional: Redirecionar após alguns segundos
      // setTimeout(() => router.push('/cliente/chamados'), 2000);
      
    } catch (err) {
      setError(err.message || "Falha ao processar a abertura do chamado.");
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
        <form onSubmit={handleSubmit} className="surface-panel p-6 grid gap-6 shadow-sm">
          {/* Título */}
          <div className="grid gap-2">
            <label htmlFor="titulo" className="text-sm font-bold text-foreground">
              Título do problema
            </label>
            <input
              id="titulo"
              className="app-form-control"
              placeholder="Ex: Notebook do laboratório não liga"
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              required
            />
          </div>

          {/* Descrição */}
          <div className="grid gap-2">
            <label htmlFor="descricao" className="text-sm font-bold text-foreground">
              Descrição detalhada
            </label>
            <textarea
              id="descricao"
              className="app-form-control min-h-32 resize-none"
              placeholder="Conte o que aconteceu, quando começou e se houve tentativas de correção."
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              required
            />
          </div>

          {/* Equipamento e Prioridade */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="equipamento" className="text-sm font-bold text-foreground">
                Equipamento afetado
              </label>
              <select
                id="equipamento"
                className="app-form-control"
                value={form.equipamento_id}
                onChange={(e) => update("equipamento_id", e.target.value)}
                required
                disabled={loadingEquip || equipamentos.length === 0}
              >
                <option value="">
                  {loadingEquip ? "Carregando..." : "Selecione o item"}
                </option>
                {equipamentos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome} {eq.patrimonio ? `(${eq.patrimonio})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="prioridade" className="text-sm font-bold text-foreground">
                Prioridade
              </label>
              <select
                id="prioridade"
                className="app-form-control"
                value={form.prioridade}
                onChange={(e) => update("prioridade", e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {/* Mensagens de Erro/Sucesso */}
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircleIcon className="size-4" />
              {error}
            </div>
          )}

          {feedback && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
              <ShieldCheckIcon className="size-4" />
              {feedback}
            </div>
          )}

          {/* Botão de Envio */}
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            <Button 
              type="submit" 
              disabled={submitting || loadingEquip || equipamentos.length === 0} 
              size="lg"
              className="w-full md:w-fit"
            >
              <ClipboardPlusIcon className="mr-2 h-5 w-5" />
              {submitting ? "Processando..." : "Abrir chamado"}
            </Button>
            <p className="text-xs text-muted-foreground italic">
              * O equipamento ficará marcado como "Em Manutenção" no sistema até a resolução.
            </p>
          </div>
        </form>
      </PageSection>

      {/* Barra Lateral Informativa */}
      <aside className="grid gap-6 content-start">
        <section className="surface-panel p-6 border-l-4 border-l-primary shadow-sm">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            Dicas Úteis
          </div>
          <h2 className="mt-4 text-xl font-bold leading-tight text-foreground">
            Abertura eficiente
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Relatos detalhados reduzem o tempo de diagnóstico em até 40%.
          </p>

          <div className="mt-6 grid gap-4">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Equipamentos",
                desc: "Apenas itens ativos aparecem aqui.",
              },
              {
                icon: AlertCircleIcon,
                title: "Prioridade",
                desc: `Atualmente definida como ${formatEnumLabel(form.prioridade)}.`,
              },
              {
                icon: CpuIcon,
                title: "Diagnóstico",
                desc: "Informe se o problema é intermitente ou constante.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-1 rounded-md bg-muted p-2 text-primary">
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mini lista de equipamentos para referência rápida */}
        <section className="surface-panel p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Resumo de Itens
          </h3>
          <div className="grid gap-2">
            {loadingEquip ? (
              <div className="animate-pulse h-4 bg-muted rounded w-full"></div>
            ) : (
              equipamentos.slice(0, 3).map((eq) => (
                <div key={eq.id} className="text-xs p-2 bg-muted/50 rounded border border-border/30">
                  <span className="font-semibold block">{eq.nome}</span>
                  <span className="text-muted-foreground">{eq.patrimonio || "Sem patrimônio"}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}