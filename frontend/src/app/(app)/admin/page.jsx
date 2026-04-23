"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchAdmin(token) {
    const res = await fetch(`${API}/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao carregar dashboard");
    return res.json();
}

// ── paleta ────────────────────────────────────────────────────────────────────
const COR = {
    aberto: "#378ADD",
    em_atendimento: "#EF9F27",
    resolvido: "#639922",
    cancelado: "#E24B4A",
    operacional: "#639922",
    em_manutencao: "#EF9F27",
    desativado: "#888780",
};

const BADGE_CLS = {
    aberto: "bg-blue-50 text-blue-800",
    em_atendimento: "bg-amber-50 text-amber-800",
    resolvido: "bg-green-50 text-green-800",
    cancelado: "bg-red-50 text-red-800",
    alta: "bg-red-50 text-red-800",
    media: "bg-amber-50 text-amber-800",
    baixa: "bg-green-50 text-green-800",
    operacional: "bg-green-50 text-green-800",
    em_manutencao: "bg-amber-50 text-amber-800",
    desativado: "bg-gray-100 text-gray-500",
};

const LABEL = {
    aberto: "Aberto", em_atendimento: "Em Atendimento",
    resolvido: "Resolvido", cancelado: "Cancelado",
    alta: "Alta", media: "Média", baixa: "Baixa",
    operacional: "Operacional", em_manutencao: "Em Manutenção", desativado: "Desativado",
};

function Badge({ value }) {
    return (
        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${BADGE_CLS[value] ?? "bg-gray-100 text-gray-500"}`}>
            {LABEL[value] ?? value}
        </span>
    );
}

function KpiCard({ label, value, sub }) {
    return (
        <div className="rounded-xl border bg-white p-5 flex flex-col gap-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 leading-snug">{sub}</p>}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {children}
        </h2>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border rounded-lg shadow-sm px-3 py-2 text-xs">
            {label && <p className="font-medium text-gray-600 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color ?? p.fill }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
}

const SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// ── Componente de Modal Simples ──────────────────────────────────────────────
function EditModal({ isOpen, onClose, item, onSave }) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4">Editar Equipamento</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Nome</label>
                        <input
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            defaultValue={item.nome}
                            id="edit-nome"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Patrimônio</label>
                        <input
                            className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50"
                            defaultValue={item.patrimonio}
                            disabled
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button
                        onClick={() => onSave({ ...item, nome: document.getElementById('edit-nome').value })}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}

function Badge({ value }) {
    return (
        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${BADGE_CLS[value] ?? "bg-gray-100 text-gray-500"}`}>
            {LABEL[value] ?? value}
        </span>
    );
}

function KpiCard({ label, value, sub }) {
    return (
        <div className="rounded-xl border bg-white p-5 flex flex-col gap-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 leading-snug">{sub}</p>}
        </div>
    );
}

function SectionTitle({ children }) {
    return <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">{children}</h2>;
}

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEq, setSelectedEq] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetchAdmin(token)
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const handleEditClick = (eq) => {
        setSelectedEq(eq);
        setIsModalOpen(true);
    };

    const handleSave = (updatedItem) => {
        console.log("Salvar no backend:", updatedItem);
        // Aqui você faria o fetch(PUT) para sua API
        setIsModalOpen(false);
    };

    if (loading) return <p className="p-8 text-sm text-gray-400">Carregando painel...</p>;
    if (error) return <p className="p-8 text-sm text-red-500">{error}</p>;

    const {
        kpis = {},
        atividades_recentes = [],
        estatisticas_chamados = [],
        estatisticas_equipamentos = [],
        equipamentos_lista = kpis.equipamentos_criticos || [] // Usando os dados existentes para a tabela
    } = data;

    export default function AdminDashboard() {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // tendência mock — troque por endpoint real quando disponível
        const [tendencia] = useState(() =>
            SEMANA.map((dia) => ({
                dia,
                abertos: Math.floor(Math.random() * 7) + 2,
                resolvidos: Math.floor(Math.random() * 7) + 1,
            }))
        );

        useEffect(() => {
            const token = localStorage.getItem("token");
            fetchAdmin(token)
                .then(setData)
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
        }, []);

        if (loading) return <p className="p-8 text-sm text-gray-400">Carregando painel...</p>;
        if (error) return <p className="p-8 text-sm text-red-500">{error}</p>;

        const {
            kpis = {},
            estatisticas_chamados = [],
            estatisticas_equipamentos = [],
        } = data;

        const pieData = estatisticas_chamados.map((s) => ({
            name: LABEL[s.status] ?? s.status,
            value: Number(s.total),
            cor: COR[s.status] ?? "#888",
        }));

        const barEqData = estatisticas_equipamentos.map((e) => ({
            name: LABEL[e.status] ?? e.status,
            total: Number(e.total),
            fill: COR[e.status] ?? "#888",
        }));

        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Painel administrativo</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Visão geral do sistema de chamados</p>
                    </div>

                    {/* KPIs Atualizados */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard label="Chamados abertos" value={kpis.chamados_abertos ?? 0} />
                        <KpiCard label="Em atendimento" value={kpis.em_progresso ?? 0} />
                        <KpiCard label="Taxa de resolução (30d)" value={`${Math.round(kpis.taxa_resolucao ?? 0)}%`} />
                        {/* Substituição: Equipamentos Críticos -> Número de Usuários */}
                        <KpiCard label="Total de Usuários" value={kpis.total_usuarios ?? 0} sub="Usuários ativos no sistema" />
                    </div>

                    {/* Tabela de Equipamentos (Nova Seção) */}
                    <div className="rounded-xl border bg-white p-5">
                        <SectionTitle>Gestão de Equipamentos</SectionTitle>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-3 text-[11px] font-semibold uppercase text-gray-400">Equipamento</th>
                                        <th className="text-left pb-3 text-[11px] font-semibold uppercase text-gray-400">Patrimônio</th>
                                        <th className="text-left pb-3 text-[11px] font-semibold uppercase text-gray-400">Status</th>
                                        <th className="text-right pb-3 text-[11px] font-semibold uppercase text-gray-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {equipamentos_lista.map((eq) => (
                                        <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 font-medium text-gray-800">{eq.nome}</td>
                                            <td className="py-3 text-gray-500">{eq.patrimonio}</td>
                                            <td className="py-3"><Badge value={eq.status} /></td>
                                            <td className="py-3 text-right">
                                                <button
                                                    onClick={() => handleEditClick(eq)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 bg-blue-50 rounded-md transition-colors"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gráficos linha 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Donut — chamados por status */}
                        <div className="rounded-xl border bg-white p-5">
                            <SectionTitle>Chamados por status</SectionTitle>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={pieData} cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={82}
                                        paddingAngle={3} dataKey="value"
                                    >
                                        {pieData.map((d, i) => <Cell key={i} fill={d.cor} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                {pieData.map((d) => (
                                    <span key={d.name} className="flex items-center gap-1 text-xs text-gray-500">
                                        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.cor }} />
                                        {d.name} ({d.value})
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Linha — tendência semanal */}
                        <div className="rounded-xl border bg-white p-5 md:col-span-2">
                            <SectionTitle>Tendência semanal — abertos vs resolvidos</SectionTitle>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={tendencia} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="abertos" name="Abertos" stroke={COR.aberto} strokeWidth={2} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="resolvidos" name="Resolvidos" stroke={COR.resolvido} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex gap-4 mt-2">
                                {[["Abertos", COR.aberto, false], ["Resolvidos", COR.resolvido, true]].map(([label, cor, dashed]) => (
                                    <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span className={`inline-block w-6 h-0.5 ${dashed ? "border-t-2 border-dashed" : ""}`}
                                            style={{ background: dashed ? "transparent" : cor, borderColor: cor }} />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gráficos linha 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Barras — equipamentos por status */}
                        <div className="rounded-xl border bg-white p-5">
                            <SectionTitle>Equipamentos por status</SectionTitle>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={barEqData} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                                        {barEqData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Equipamentos críticos */}
                        <div className="rounded-xl border bg-white p-5">
                            <SectionTitle>Equipamentos críticos</SectionTitle>
                            {/* Equipamentos críticos */}
                            <div className="rounded-xl border bg-white p-5">
                                <SectionTitle>Equipamentos críticos</SectionTitle>
                                {/* Verificamos se é um array antes de usar o .map */}
                                {Array.isArray(kpis.equipamentos_criticos) && kpis.equipamentos_criticos.length > 0 ? (
                                    <div className="divide-y">
                                        {kpis.equipamentos_criticos.map((eq) => (
                                            <div key={eq.id} className="flex items-center justify-between py-2.5">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{eq.nome}</p>
                                                    <p className="text-xs text-gray-400">Patrimônio: {eq.patrimonio}</p>
                                                </div>
                                                <Badge value={eq.status} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 mt-2">Nenhum equipamento detalhado disponível.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        );
    };
    }