"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ClipboardListIcon, PlusIcon } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { formatEnumLabel, getTicketStatusBadgeClass } from "@/lib/presentation";

export default function ClienteDashboardPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await dashboardService.cliente();
        setChamados(response.chamados || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter((item) => item.status === "aberto").length;
  const chamadosResolvidos = chamados.filter((item) => item.status === "resolvido").length;

  return (
    <div className="grid gap-6">
      <PageSection
        title="Dashboard do cliente"
        description="Acompanhe seus chamados abertos, veja o andamento mais recente e abra novas solicitacoes com rapidez."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cliente/chamados/novo">
              <PlusIcon />
              Abrir novo chamado
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/cliente/chamados">
              <ClipboardListIcon />
              Ver todos os chamados
            </Link>
          </Button>
        </div>
      </PageSection>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total de chamados", value: totalChamados, tone: "text-foreground" },
          { label: "Abertos", value: chamadosAbertos, tone: "text-sky-600" },
          { label: "Resolvidos", value: chamadosResolvidos, tone: "text-emerald-600" },
        ].map((item) => (
          <div key={item.label} className="app-stat-card">
            <p className="text-sm text-slate-600">{item.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <PageSection title="Ultimos chamados" description="Resumo rapido para saber o que ainda precisa de retorno.">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando chamados...</p>
        ) : error ? (
          <p className="text-sm text-destructive">Erro: {error}</p>
        ) : chamados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Voce ainda nao possui chamados no momento.
          </div>
        ) : (
          <div className="grid gap-4">
            {chamados.slice(0, 5).map((chamado) => (
              <Link
                key={chamado.id}
                href={`/cliente/chamados/${chamado.id}`}
                className="app-surface-card"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">{chamado.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {chamado.equipamento_nome || "Equipamento nao informado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={getTicketStatusBadgeClass(chamado.status)}>
                      {formatEnumLabel(chamado.status)}
                    </span>
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
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
