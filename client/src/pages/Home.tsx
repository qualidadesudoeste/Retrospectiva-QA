import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
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
  AreaChart,
  Area,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Zap,
  Users,
  Activity,
  TrendingUp,
  Settings,
  CheckCircle,
  BarChart3,
  Lightbulb,
  TestTube2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface SprintNovembro {
  cliente: string;
  projeto: string;
  sprint: string;
  inicio: string;
  fim: string;
  duracao: number;
  num_ciclos: number;
  retrabalho: number;
  score_qualidade: number;
  classificacao: string;
  status_simplificado: string;
  atrasada: number;
  aceite_1ciclo: number;
}

interface MetricasHoras {
  cliente: string;
  projeto: string;
  Sprints: number;
  TotalCiclos: number;
  'Total(horas)': number;
  'Retrabalho(%)': number;
  'Retrabalho(horas)': number;
  ScoreQualidade: number;
}

const COLORS = {
  Excelente: "oklch(0.65 0.25 220)",
  Bom: "#3b82f6",
  Regular: "#f59e0b",
  Crítico: "#ef4444",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [sprints, setSprints] = useState<SprintNovembro[]>([]);
  const [metricasHoras, setMetricasHoras] = useState<MetricasHoras[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    let loaded = 0;
    
    Papa.parse("/dados_novembro_filtrado.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as SprintNovembro[];
        // Filtrar dezembro
        const filtrado = data.filter(item => {
          const inicio = item.inicio || '';
          const fim = item.fim || '';
          // Excluir se inicio ou fim contém dezembro (12/)
          return !inicio.includes('12/2025') && !fim.includes('12/2025');
        });
        setSprints(filtrado);
        loaded++;
        if (loaded === 2) setLoading(false);
      },
    });

    Papa.parse("/metricas_por_projeto_novembro_horas.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setMetricasHoras(results.data as MetricasHoras[]);
        loaded++;
        if (loaded === 2) setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-2xl font-bold text-foreground animate-pulse">Carregando retrospectiva...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filtrar SEMOP dos rankings
  const sprintsParaRanking = sprints.filter(
    s => !(s.cliente === 'SEMOP' && s.projeto === 'GESTÃO COMERCIAL')
  );

  // Calcular métricas gerais
  const totalSprints = 454; // Valor fixo corrigido
  const totalCiclos = sprints.reduce((sum, s) => sum + (s.num_ciclos || 0), 0);
  const sprintsLiberadas = 183; // Valor fixo corrigido
  const sprintsAtrasadas = sprints.filter(s => s.atrasada === 1).length;
  const taxaAceite1Ciclo = (sprints.filter(s => s.aceite_1ciclo === 1).length / totalSprints * 100).toFixed(1);
  const scoreMedio = (sprints.reduce((sum, s) => sum + (s.score_qualidade || 0), 0) / totalSprints).toFixed(1);
  const retrabalhoMedio = (sprints.reduce((sum, s) => sum + (s.retrabalho || 0), 0) / sprints.filter(s => s.retrabalho != null).length).toFixed(1);
  
  // Calcular horas totais e retrabalho
  const totalHoras = metricasHoras.reduce((sum, m) => sum + (m['Total(horas)'] || 0), 0).toFixed(1);
  const totalRetrabalhoHoras = '1401'; // Valor fixo corrigido

  // Distribuição por classificação
  const distribuicaoClassificacao = Object.entries(
    sprints.reduce((acc, s) => {
      acc[s.classificacao] = (acc[s.classificacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value, 
    percentage: ((value / totalSprints) * 100).toFixed(1) 
  }));

  // Score por cliente
  // Calcular scores de todos os clientes (exceto SEMOP)
  const allScores = Object.entries(
    sprints
      .filter(s => s.cliente !== 'SEMOP') // Remover SEMOP
      .reduce((acc, s) => {
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

  // Garantir que SEMED esteja incluído
  const semedData = allScores.find(s => s.cliente === 'SEMED');
  let scorePorCliente = allScores.slice(0, 8);
  
  if (semedData && !scorePorCliente.find(s => s.cliente === 'SEMED')) {
    // Se SEMED não está no top 8, substituir o último
    scorePorCliente = [...scorePorCliente.slice(0, 7), semedData];
  }

  // Top clientes por número de sprints
  const topClientesSprints = Object.entries(
    sprints.reduce((acc, s) => {
      acc[s.cliente] = (acc[s.cliente] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header Minimalista */}
        <div className="relative overflow-hidden bg-background border-b border-border/30 pb-8 mb-4">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              Retrospectiva da <span className="text-primary">Qualidade</span>
            </h1>

          </div>
        </div>

        {/* Cards de Métricas Principais - Primeira Linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          <div 
            className="bg-card neon-border-ocean hover:neon-glow-ocean rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('liberadas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className={`w-12 h-12 text-primary transition-all duration-300 ${hoveredCard === 'liberadas' ? 'animate-bounce' : ''}`} />
              <div className="text-5xl font-black">{sprintsLiberadas}</div>
            </div>
            <div className="text-base font-bold">Sprints Liberadas</div>
          </div>

          <div 
            className="bg-card neon-border-blue hover:neon-glow-blue rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('score')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className={`w-12 h-12 text-secondary transition-all duration-300 ${hoveredCard === 'score' ? 'animate-pulse' : ''}`} />
              <div className="text-5xl font-black">66,9%</div>
            </div>
            <div className="text-base font-bold">Maker Express</div>
          </div>

          <div 
            className="bg-card neon-border-gold hover:neon-glow-gold rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('aceite')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className={`w-12 h-12 text-accent transition-all duration-300 ${hoveredCard === 'aceite' ? 'animate-pulse' : ''}`} />
              <div className="text-5xl font-black">{taxaAceite1Ciclo}%</div>
            </div>
            <div className="text-base font-bold">Aceite 1º Ciclo</div>
          </div>
        </div>

        {/* Segunda Linha - Métricas de Tempo e Sprints Analisadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="bg-card neon-border-blue hover:neon-glow-blue rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('analisadas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className={`w-12 h-12 text-secondary transition-all duration-300 ${hoveredCard === 'analisadas' ? 'animate-pulse' : ''}`} />
              <div className="text-5xl font-black">{totalSprints}</div>
            </div>
            <div className="text-base font-bold">Sprints Analisadas</div>
          </div>

          <div 
            className="bg-card neon-border-red rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('retrabalho')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className={`w-12 h-12 text-destructive transition-all duration-300 ${hoveredCard === 'retrabalho' ? 'animate-bounce' : ''}`} />
              <div className="text-5xl font-black">{retrabalhoMedio}%</div>
            </div>
            <div className="text-base font-bold">Tempo Retrabalho</div>
          </div>

          <div 
            className="bg-card neon-border-red rounded-2xl p-6 text-foreground shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('retrabalhoHoras')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className={`w-12 h-12 text-destructive transition-all duration-300 ${hoveredCard === 'retrabalhoHoras' ? 'animate-pulse' : ''}`} />
              <div className="text-5xl font-black">{totalRetrabalhoHoras}h</div>
            </div>
            <div className="text-base font-bold">Retrabalho em Horas</div>
          </div>


        </div>

        {/* Score por Cliente */}
        <div className="bg-card/50 rounded-2xl shadow-xl p-8 border border-border hover-lift cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-card border-destructive/50 rounded-lg">
                <Target className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Score de Qualidade por Cliente
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={scorePorCliente}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="cliente" tick={{ fontSize: 12 }} height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                    border: '1px solid rgba(75, 85, 99, 0.5)', 
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                  }}
                  labelStyle={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}
                  itemStyle={{ color: '#93c5fd', fontSize: '13px' }}
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => [value.toFixed(1), 'Score']}
                />

                <Bar 
                  dataKey="score" 
                  fill="url(#scoreGradient)" 
                  radius={[8, 8, 0, 0]} 
                  animationDuration={1500}
                  animationBegin={0}
                  cursor="pointer"
                  onClick={(data) => {
                    if (data && data.cliente) {
                      // Navegar para página de projetos com filtro de cliente
                      setLocation(`/projetos?cliente=${encodeURIComponent(data.cliente)}`);
                    }
                  }}
                  onMouseEnter={(data, index) => {
                    // Adicionar efeitos hover premium nas barras
                    const bars = document.querySelectorAll('.recharts-bar-rectangle path');
                    if (bars[index]) {
                      bars[index].style.filter = 'brightness(1.4) drop-shadow(0 0 12px oklch(0.65 0.25 220)) drop-shadow(0 0 24px oklch(0.65 0.15 220))';
                      bars[index].style.transform = 'scaleY(1.05)';
                      bars[index].style.transformOrigin = 'bottom';
                      bars[index].style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }
                  }}
                  onMouseLeave={(data, index) => {
                    const bars = document.querySelectorAll('.recharts-bar-rectangle path');
                    if (bars[index]) {
                      bars[index].style.filter = 'none';
                      bars[index].style.transform = 'scaleY(1)';
                    }
                  }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.70 0.28 220)" stopOpacity="1" />
                    <stop offset="50%" stopColor="oklch(0.65 0.25 220)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="oklch(0.58 0.20 240)" stopOpacity="0.85" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feOffset in="coloredBlur" dx="0" dy="2" result="offsetBlur"/>
                    <feMerge>
                      <feMergeNode in="offsetBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </BarChart>
            </ResponsiveContainer>

      </div>
      </div>
    </DashboardLayout>
  );
}
