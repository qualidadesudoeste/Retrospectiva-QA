import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { TrendingUp, TrendingDown, Target, CheckCircle2, AlertCircle, Clock, Award, Zap } from "lucide-react";

interface SprintNovembro {
  cliente: string;
  projeto: string;
  sprint: string;
  inicio: string;
  fim: string;
  duracao: number;
  ciclo1: string;
  ciclo2: string;
  ciclo3: string;
  ciclo4: string;
  ciclo5: string;
  status: string;
  correcoes: number;
  total: number;
  retrabalho: number;
  num_ciclos: number;
  aceite_1ciclo: number;
  status_simplificado: string;
  atrasada: number;
  eficiencia: number;
  taxa_corretivas: number;
  score_qualidade: number;
  classificacao: string;
}

const COLORS = {
  Excelente: "oklch(0.65 0.25 220)",
  Bom: "#3b82f6",
  Regular: "#f59e0b",
  Crítico: "#ef4444",
};

const GRADIENT_COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "oklch(0.60 0.22 240)",
  "oklch(0.65 0.25 220)",
];

export default function Novembro() {
  const [sprints, setSprints] = useState<SprintNovembro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/dados_novembro_consolidado.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setSprints(results.data as SprintNovembro[]);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl font-semibold text-foreground">Carregando dados...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filtrar SEMOP - Gestão Comercial dos rankings
  const sprintsParaRanking = sprints.filter(
    s => !(s.cliente === 'SEMOP' && s.projeto === 'GESTÃO COMERCIAL')
  );

  // Calcular métricas gerais
  const totalSprints = sprints.length;
  const totalCiclos = sprints.reduce((sum, s) => sum + (s.num_ciclos || 0), 0);
  const sprintsLiberadas = sprints.filter(s => s.status_simplificado === 'Liberada').length;
  const sprintsAtrasadas = sprints.filter(s => s.atrasada === 1).length;
  const taxaAceite1Ciclo = (sprints.filter(s => s.aceite_1ciclo === 1).length / totalSprints * 100).toFixed(1);
  const scoreMedio = (sprints.reduce((sum, s) => sum + (s.score_qualidade || 0), 0) / totalSprints).toFixed(1);
  const retrabalhoMedio = (sprints.reduce((sum, s) => sum + (s.retrabalho || 0), 0) / sprints.filter(s => s.retrabalho != null).length).toFixed(1);

  // Distribuição por classificação
  const distribuicaoClassificacao = Object.entries(
    sprints.reduce((acc, s) => {
      acc[s.classificacao] = (acc[s.classificacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, percentage: ((value / totalSprints) * 100).toFixed(1) }));

  // Status das sprints
  const distribuicaoStatus = Object.entries(
    sprints.reduce((acc, s) => {
      const status = s.status_simplificado || 'Outro';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, percentage: ((value / totalSprints) * 100).toFixed(1) }));

  // Sprints por cliente
  const sprintsPorCliente = Object.entries(
    sprints.reduce((acc, s) => {
      acc[s.cliente] = (acc[s.cliente] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total);

  // Score médio por cliente
  const scorePorCliente = Object.entries(
    sprints.reduce((acc, s) => {
      if (!acc[s.cliente]) {
        acc[s.cliente] = { total: 0, count: 0 };
      }
      acc[s.cliente].total += s.score_qualidade || 0;
      acc[s.cliente].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([cliente, data]) => ({
    cliente,
    score: parseFloat((data.total / data.count).toFixed(1)),
  }))
    .sort((a, b) => b.score - a.score);

  // Top 5 melhores e piores (sem SEMOP)
  const top5Melhores = [...sprintsParaRanking]
    .sort((a, b) => (b.score_qualidade || 0) - (a.score_qualidade || 0))
    .slice(0, 5);

  const top5Piores = [...sprintsParaRanking]
    .filter(s => s.score_qualidade != null && s.score_qualidade > 0)
    .sort((a, b) => (a.score_qualidade || 0) - (b.score_qualidade || 0))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header com Gradiente Premium */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-card0/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-4">
                  <Award className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-semibold text-blue-200">Retrospectiva 2025</span>
                </div>
                <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">
                  Dashboard Novembro 2025
                </h1>
                <p className="text-xl text-blue-200 font-light">
                  Análise completa com métricas do procedimento Maker Express
                </p>
              </div>
              <div className="text-right">
                <div className="text-7xl font-bold text-foreground mb-2">{totalSprints}</div>
                <div className="text-lg text-blue-200">Sprints Analisadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Métricas Principais - Grid Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-10 h-10 opacity-80" />
              <div className="text-4xl font-bold">{sprintsLiberadas}</div>
            </div>
            <div className="text-sm font-medium opacity-90">Sprints Liberadas</div>
            <div className="text-xs opacity-75 mt-1">{((sprintsLiberadas / totalSprints) * 100).toFixed(1)}% do total</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 opacity-80" />
              <div className="text-4xl font-bold">{scoreMedio}</div>
            </div>
            <div className="text-sm font-medium opacity-90">Score Médio</div>
            <div className="text-xs opacity-75 mt-1">Qualidade geral</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-10 h-10 opacity-80" />
              <div className="text-4xl font-bold">{taxaAceite1Ciclo}%</div>
            </div>
            <div className="text-sm font-medium opacity-90">Aceite 1º Ciclo</div>
            <div className="text-xs opacity-75 mt-1">Aprovadas sem retrabalho</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-10 h-10 opacity-80" />
              <div className="text-4xl font-bold">{retrabalhoMedio}%</div>
            </div>
            <div className="text-sm font-medium opacity-90">Retrabalho Médio</div>
            <div className="text-xs opacity-75 mt-1">Taxa média de retrabalho</div>
          </div>
        </div>

        {/* Métricas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/50 rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{totalCiclos}</div>
                <div className="text-sm text-muted-foreground">Total de Ciclos</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">Média de {(totalCiclos / totalSprints).toFixed(1)} ciclos por sprint</div>
          </div>

          <div className="bg-card/50 rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{sprintsAtrasadas}</div>
                <div className="text-sm text-muted-foreground">Sprints Atrasadas</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">{((sprintsAtrasadas / totalSprints) * 100).toFixed(1)}% do total</div>
          </div>

          <div className="bg-card/50 rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{totalSprints - sprintsLiberadas}</div>
                <div className="text-sm text-muted-foreground">Em Correção</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">Aguardando aprovação</div>
          </div>
        </div>

        {/* Gráficos Principais - Layout Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Classificação */}
          <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Distribuição por Classificação
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={distribuicaoClassificacao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value} (${entry.percentage}%)`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {distribuicaoClassificacao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status das Sprints */}
          <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Status das Sprints
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={distribuicaoStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value} (${entry.percentage}%)`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {distribuicaoStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === 'Liberada' ? 'oklch(0.65 0.25 220)' : entry.name === 'Em Correção' ? '#f59e0b' : '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sprints por Cliente */}
          <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Volume por Cliente
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sprintsPorCliente}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="cliente" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="total" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score por Cliente */}
          <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Score de Qualidade por Cliente
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={scorePorCliente} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="cliente" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="score" fill="url(#scoreGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.65 0.25 220)" />
                    <stop offset="100%" stopColor="oklch(0.60 0.22 240)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rankings Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Melhores */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">Top 5 Melhores Sprints</h3>
                <p className="text-sm text-primary">Excelência em qualidade</p>
              </div>
            </div>
            <div className="space-y-4">
              {top5Melhores.map((sprint, idx) => (
                <div key={idx} className="bg-card/50 border-l-2 border-primary/30 rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary text-white rounded-full font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-lg">{sprint.cliente}</div>
                        <div className="text-sm text-muted-foreground">{sprint.projeto}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{sprint.score_qualidade?.toFixed(1)}</div>
                      <div className="text-xs text-slate-500">score</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Sprint {sprint.sprint}</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Retrabalho: {sprint.retrabalho?.toFixed(1)}%</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{sprint.num_ciclos} ciclos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Piores */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-800">Top 5 Sprints Críticas</h3>
                <p className="text-sm text-red-600">Requerem atenção especial</p>
              </div>
            </div>
            <div className="space-y-4">
              {top5Piores.map((sprint, idx) => (
                <div key={idx} className="bg-card/50 border-l-2 border-destructive/30 rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-full font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-lg">{sprint.cliente}</div>
                        <div className="text-sm text-muted-foreground">{sprint.projeto}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{sprint.score_qualidade?.toFixed(1)}</div>
                      <div className="text-xs text-slate-500">score</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Sprint {sprint.sprint}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Retrabalho: {sprint.retrabalho?.toFixed(1)}%</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{sprint.num_ciclos} ciclos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela Detalhada Premium */}
        <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Detalhamento Completo de Sprints
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-border">
                  <th className="text-left py-4 px-4 font-bold text-foreground">Cliente</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Projeto</th>
                  <th className="text-left py-4 px-4 font-bold text-foreground">Sprint</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Ciclos</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Duração</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Retrabalho</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Score</th>
                  <th className="text-center py-4 px-4 font-bold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sprints.map((sprint, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-card/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{sprint.cliente}</td>
                    <td className="py-4 px-4 text-muted-foreground">{sprint.projeto}</td>
                    <td className="py-4 px-4 text-muted-foreground">{sprint.sprint}</td>
                    <td className="text-center py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">
                        {sprint.num_ciclos}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground font-medium">{sprint.duracao}d</td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (sprint.retrabalho || 0) < 10 ? 'bg-primary/10 text-primary' :
                        (sprint.retrabalho || 0) < 30 ? 'bg-yellow-100 text-yellow-700' :
                        (sprint.retrabalho || 0) < 50 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sprint.retrabalho?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold shadow-md ${
                          sprint.score_qualidade >= 80
                            ? 'bg-gradient-to-r from-primary to-secondary'
                            : sprint.score_qualidade >= 60
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : sprint.score_qualidade >= 40
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                            : 'bg-gradient-to-r from-red-500 to-rose-600'
                        }`}
                      >
                        {sprint.score_qualidade?.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          sprint.status_simplificado === 'Liberada'
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {sprint.status_simplificado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
