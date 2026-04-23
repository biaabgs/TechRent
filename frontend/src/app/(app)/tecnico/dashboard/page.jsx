"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardCheckIcon, Layers3Icon, WrenchIcon } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import {
  formatEnumLabel,
  getPriorityBadgeClass,
  getTicketStatusBadgeClass,
} from "@/lib/presentation";

export default function TecnicoDashboardPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarFila() {
      try {
        const response = await dashboardService.tecnico();
        setChamados(response.painel || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarFila();
  }, []);

  const chamadosAbertos = chamados.filter((item) => item.status === "aberto").length;
  const chamadosEmAtendimento = chamados.filter((item) => item.status === "em_atendimento").length;

  return (
    <div className="grid gap-6">
      <PageSection
        title="Dashboard tecnico"
        description="Veja a carga atual de atendimento e siga direto para a fila ou para o historico de manutencao."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/tecnico/fila">
              <Layers3Icon />
              Ver fila tecnica
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/tecnico/manutencao">
              <ClipboardCheckIcon />
              Historico de manutencao
            </Link>
          </Button>
        </div>
      </PageSection>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Chamados abertos", value: chamadosAbertos, tone: "text-sky-600" },
          { label: "Em atendimento", value: chamadosEmAtendimento, tone: "text-amber-600" },
        ].map((item) => (
          <div key={item.label} className="app-stat-card">
            <p className="text-sm text-slate-600">{item.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <PageSection title="Proximos atendimentos" description="Os chamados mais urgentes sobem primeiro.">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando fila...</p>
        ) : error ? (
          <p className="text-sm text-destructive">Erro: {error}</p>
        ) : chamados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum chamado na fila.
          </div>
        ) : (
          <div className="grid gap-4">
            {chamados.slice(0, 5).map((chamado) => (
              <Link
                key={chamado.chamado_id}
                href={`/tecnico/chamados/${chamado.chamado_id}`}
                className="app-surface-card"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={getTicketStatusBadgeClass(chamado.status)}>
                        {formatEnumLabel(chamado.status)}
                      </span>
                      <span className={getPriorityBadgeClass(chamado.prioridade)}>
                        {formatEnumLabel(chamado.prioridade)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{chamado.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {chamado.solicitante} - {chamado.equipamento}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                    <WrenchIcon className="size-4" />
                    Atender
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
