"use client";

import { useEffect, useState } from "react";
import { ClipboardCheckIcon } from "lucide-react";
import PageSection from "@/components/ui/page-section";
import { manutencaoService } from "@/services/manutencao.service";

export default function ManutencaoListPage() {
  const [manutencoes, setManutencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    manutencaoService
      .listar()
      .then((data) => setManutencoes(data?.manutencoes || data || []))
      .catch((err) => setError(err.message || "Erro ao carregar manutencoes"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageSection
      title="Historico de manutencoes"
      description="Registros tecnicos concluídos, com contexto de equipamento, responsavel e descricao do reparo."
    >
      {loading ? <p className="text-sm text-muted-foreground">Carregando manutencoes...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error && manutencoes.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Nenhum registro de manutencao encontrado.
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {manutencoes.map((item) => (
          <article key={item.id} className="surface-muted p-5 card-hover-lift">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ClipboardCheckIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground">{item.equipamento_nome}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tecnico: {item.tecnico_nome || item.nome_tecnico}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-foreground/90">{item.descricao}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
