"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ClipboardListIcon, PlusIcon } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { formatEnumLabel, getTicketStatusBadgeClass } from "@/lib/presentation";
import { useAuth } from "@/hooks/useAuth";

export default function ClienteDashboardPage() {
  // Protege a rota: apenas usuários com nível "cliente" acessam
  const { pronto } = useAuth("cliente");
  
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Só dispara a busca se a autenticação estiver confirmada
    if (!pronto) return;

    async function carregarDados() {
      try {
        setLoading(true);
        const response = await dashboardService.cliente();
        // Garante que chamados seja um array mesmo se a API falhar silenciosamente
        setChamados(response?.chamados || []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError(err.message || "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [pronto]);

  // Enquanto valida o token, não renderiza nada (evita flash de conteúdo restrito)
  if (!pronto) return null;

  // Cálculos de indicadores baseados no estado
  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter((item) => item.status === "aberto" || item.status === "em_atendimento").length;
  const chamadosResolvidos = chamados.filter((item) => item.status === "resolvido").length;

  return (
    <div className="grid gap-6">
      <PageSection
        title="Dashboard do Cliente"
        description="Acompanhe seus chamados abertos, veja o andamento mais recente e abra novas solicitações com rapidez."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cliente/chamados/novo">
              <PlusIcon className="mr-2 h-4 w-4" />
              Abrir novo chamado
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/cliente/chamados">
              <ClipboardListIcon className="mr-2 h-4 w-4" />
              Ver todos os chamados
            </Link>
          </Button>
        </div>
      </PageSection>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total de chamados", value: totalChamados, tone: "text-foreground" },
          { label: "Em andamento", value: chamadosAbertos, tone: "text-sky-600" },
          { label: "Resolvidos", value: chamadosResolvidos, tone: "text-emerald-600" },
        ].map((item) => (
          <div key={item.label} className="surface-panel p-6 border border-border/50 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className={`mt-3 text-4xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <PageSection title="Últimos chamados" description="Resumo rápido para saber o que ainda precisa de retorno.">
        {loading ? (
          <div className="surface-panel p-10 text-center text-sm text-muted-foreground">
            Carregando chamados...
          </div>
        ) : error ? (
          <div className="surface-panel border-destructive/20 bg-destructive/5 p-10 text-center text-sm text-destructive">
            {error}
          </div>
        ) : chamados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Você ainda não possui chamados no momento.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Exibe apenas os 5 mais recentes */}
            {chamados.slice(0, 5).map((chamado) => (
              <Link
                key={chamado.id}
                href={`/cliente/chamados/${chamado.id}`}
                className="surface-panel group block p-5 transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {chamado.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {chamado.equipamento_nome || "Equipamento não informado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={getTicketStatusBadgeClass(chamado.status)}>
                      {formatEnumLabel(chamado.status)}
                    </span>
                    <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
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