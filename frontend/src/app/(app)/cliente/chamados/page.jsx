"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { Button } from "@/components/ui/button";
import { chamadosService } from "@/services/chamados.service";
import { formatEnumLabel, getPriorityBadgeClass, getTicketStatusBadgeClass } from "@/lib/presentation";

export default function ClienteChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    chamadosService
      .list()
      .then((data) => setChamados(data?.chamados || []))
      .catch((err) => setError(err.message || "Erro ao carregar chamados."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageSection
      title="Meus chamados"
      description="Lista completa dos atendimentos vinculados ao seu usuario, com status, prioridade e acesso aos detalhes."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/cliente/chamados/novo">
            <PlusIcon />
            Novo chamado
          </Link>
        </Button>
      </div>

      {loading ? <p className="mt-5 text-sm text-muted-foreground">Carregando chamados...</p> : null}
      {error ? <p className="mt-5 text-sm text-destructive">{error}</p> : null}

      {!loading && !error && chamados.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nenhum chamado encontrado.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4">
        {chamados.map((chamado) => (
          <Link
            key={chamado.id}
            href={`/cliente/chamados/${chamado.id}`}
            className="app-surface-card"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className={getTicketStatusBadgeClass(chamado.status)}>
                    {formatEnumLabel(chamado.status)}
                  </span>
                  <span className={getPriorityBadgeClass(chamado.prioridade)}>
                    {formatEnumLabel(chamado.prioridade)}
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">{chamado.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {chamado.equipamento_nome || "Equipamento nao informado"}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Ver detalhes
                <ArrowRightIcon className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageSection>
  );
}
