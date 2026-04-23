"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { 
  formatEnumLabel, 
  getPriorityBadgeClass, 
  getTicketStatusBadgeClass 
} from "@/lib/presentation";
import { useAuth } from "@/hooks/useAuth";

export default function ClienteChamadosPage() {
  // Protege a rota: redireciona se não for "cliente"
  const { pronto } = useAuth("cliente");
  
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Só executa a busca quando a autenticação estiver validada
    if (!pronto) return;

    setLoading(true);
    chamadosService
      .list()
      .then((data) => {
        // Garante que estamos pegando a lista corretamente da resposta
        setChamados(data?.chamados || []);
      })
      .catch((err) => {
        console.error("Erro ao listar chamados:", err);
        setError(err.message || "Não foi possível carregar seus chamados.");
      })
      .finally(() => setLoading(false));
  }, [pronto]);

  // Se ainda estiver validando o token, não renderiza nada
  if (!pronto) return null;

  return (
    <PageSection
      title="Meus chamados"
      description="Lista completa dos atendimentos vinculados ao seu usuário, com status, prioridade e acesso aos detalhes."
    >
      {/* Ações do Topo */}
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/cliente/chamados/novo">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo chamado
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {/* Estados de Feedback */}
        {loading ? (
          <div className="surface-panel p-12 text-center text-sm text-muted-foreground">
            Carregando sua lista de chamados...
          </div>
        ) : error ? (
          <div className="surface-panel border-destructive/20 bg-destructive/5 p-12 text-center text-sm text-destructive">
            {error}
          </div>
        ) : chamados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
            <p>Você ainda não possui nenhum chamado registrado.</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/cliente/chamados/novo">Clique aqui para abrir o primeiro.</Link>
            </Button>
          </div>
        ) : (
          /* Lista de Cards */
          <div className="grid gap-4">
            {chamados.map((chamado) => (
              <Link
                key={chamado.id}
                href={`/cliente/chamados/${chamado.id}`}
                className="surface-panel group block p-6 transition-all hover:border-primary/50 hover:bg-primary/5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className={getTicketStatusBadgeClass(chamado.status)}>
                        {formatEnumLabel(chamado.status)}
                      </span>
                      <span className={getPriorityBadgeClass(chamado.prioridade)}>
                        {formatEnumLabel(chamado.prioridade)}
                      </span>
                    </div>
                    
                    <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {chamado.titulo}
                    </h3>
                    
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                      <span className="font-medium text-foreground/70">Equipamento:</span>
                      {chamado.equipamento_nome || "Não informado"}
                    </p>
                  </div>

                  <div className="flex items-center self-end md:self-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Ver detalhes
                    <ArrowRightIcon className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageSection>
  );
}