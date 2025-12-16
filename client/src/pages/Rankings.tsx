import { useEffect, useState } from "react";
import Papa from "papaparse";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Clock, Bug, Award, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface RankingEficiencia {
  cliente: string;
  projeto: string;
  sprint: string;
  duracao: number;
  retrabalho: number;
  score_eficiencia: number;
}

export default function Rankings() {
  const [rankings, setRankings] = useState<RankingEficiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/ranking_eficiencia_melhores.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setRankings(results.data as RankingEficiencia[]);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-2xl font-bold text-foreground animate-pulse">Carregando rankings...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderPodiumCard = (item: RankingEficiencia, position: number) => {
    const getHoverColor = (pos: number) => {
      switch(pos) {
        case 1: return 'hover:bg-yellow-500/10 hover:border-yellow-500/40';
        case 2: return 'hover:bg-slate-400/10 hover:border-slate-400/40';
        case 3: return 'hover:bg-orange-600/10 hover:border-orange-600/40';
        case 4: return 'hover:bg-blue-500/10 hover:border-blue-500/40';
        case 5: return 'hover:bg-purple-500/10 hover:border-purple-500/40';
        default: return 'hover:bg-primary/5 hover:border-primary/30';
      }
    };
    
    return (
      <div className={`relative bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${getHoverColor(position)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Badge de posição mais suave */}
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 border-2 border-primary/30 rounded-xl">
              <span className="text-2xl font-bold text-primary">{position}</span>
            </div>
            
            <div>
              {/* Cliente e Projeto */}
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary/60" />
                <span className="text-xl font-bold text-foreground">{item.cliente}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium mb-3">{item.projeto}</div>
              
              {/* Badges de informação */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-primary/5 text-primary/80 rounded-md text-xs font-semibold border border-primary/20 cursor-help hover:bg-primary/10 transition-colors">
                      Sprint {item.sprint}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Versão da Sprint</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-blue-500/5 text-blue-600/80 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 cursor-help hover:bg-blue-500/10 transition-colors">
                      <Clock className="w-3 h-3" />
                      {item.duracao}d
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duração da Sprint</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-red-500/5 text-red-600/80 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-red-500/20 cursor-help hover:bg-red-500/10 transition-colors">
                      <Bug className="w-3 h-3" />
                      {item.retrabalho?.toFixed(1) || 0}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Taxa de Retrabalho</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dados para Ranking por Conformidade - Maker Express
  const conformidadeExcelentes = [
    { projeto: "SEMPRE - SIGSUAS", percentual: 82.35 },
    { projeto: "CODECON - Fiscalização", percentual: 82.35 },
    { projeto: "SEDUR - Fiscalização", percentual: 82.35 },
    { projeto: "SEDUR - Contratos", percentual: 82.35 },
    { projeto: "SEMOB - SYSMOBI", percentual: 82.35 },
    { projeto: "SEFAZ - Contratos", percentual: 82.35 },
    { projeto: "SEFAZ - Gestão Projetos", percentual: 82.35 },
  ];

  const conformidadeAtencao = [
    { projeto: "LIVE - SIGSUAS", percentual: 70.59 },
    { projeto: "SEDUR - Licenciamento", percentual: 70.59 },
    { projeto: "SEMOP - SGCI", percentual: 70.59 },
    { projeto: "TRANSALVADOR", percentual: 70.59 },
    { projeto: "SMED - Conselho Escolar", percentual: 58.82 },
  ];

  const conformidadeCriticos = [
    { projeto: "SMED - SIE Salvador", percentual: 41.18 },
    { projeto: "SEMED - SIE Corupipe", percentual: 41.18 },
    { projeto: "LIVE - Educação", percentual: 29.41 },
    { projeto: "SMED - Gestão Pessoas", percentual: 29.41 },
  ];

  const conformidadeChartData = [
    { name: 'Excelentes', value: 43.75, color: '#22c55e' },
    { name: 'Atenção', value: 31.25, color: '#f59e0b' },
    { name: 'Críticos', value: 25.00, color: '#ef4444' },
  ];

  // Dados para Ranking por Retrabalho - Análise Detalhada
  const retrabalhoExcelentes = [
    { projeto: "CODECON Fiscalização", percentual: 0 },
    { projeto: "LIVE Educação", percentual: 0 },
    { projeto: "SEMOB SYSMOBI", percentual: 0.23 },
    { projeto: "TRANSALVADOR", percentual: 8.27 },
    { projeto: "LIVE SIGSUAS", percentual: 11 },
    { projeto: "SEDUR Contratos", percentual: 0 },
    { projeto: "SEMED SIE Corupipe", percentual: 0 },
    { projeto: "SEDUR Fiscalização", percentual: 1.02 },
    { projeto: "SEFAZ Gestão Proj.", percentual: 8.48 },
    { projeto: "SMED Gestão Pessoas", percentual: 15 },
  ];

  const retrabalhoAtencao = [
    { projeto: "SEDUR Licenciamento", percentual: 16.06 },
    { projeto: "SEMPRE SIGSUAS", percentual: 22.31 },
    { projeto: "SMED SIE Salvador", percentual: 18.82 },
    { projeto: "SEMOP SGCI", percentual: 0 },
  ];

  const retrabalhoCriticos = [
    { projeto: "SMED Conselho Escolar", percentual: 39.20 },
    { projeto: "SEFAZ Contratos", percentual: 31.21 },
  ];

  const retrabalhoChartData = [
    { name: 'Excelente', value: 62.5, color: '#22c55e' },
    { name: 'Atenção', value: 25.0, color: '#f59e0b' },
    { name: 'Crítico', value: 12.5, color: '#ef4444' },
  ];

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Ranking Completo Original */}
          <div className="space-y-3">
            {rankings.slice(0, 5).map((item, idx) => (
              <div key={idx}>
                {renderPodiumCard(item, idx + 1)}
              </div>
            ))}
          </div>

          {/* Ranking por Conformidade - Maker Express */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-b border-border/50 pb-3">
              Ranking por Conformidade – Maker Express
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Excelentes */}
              <div className="bg-card/30 border border-green-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-500">Excelentes (≥80%)</h3>
                </div>
                {conformidadeExcelentes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-foreground">{item.projeto}</span>
                    <span className="text-sm font-bold text-green-500">{item.percentual}%</span>
                  </div>
                ))}
              </div>

              {/* Coluna Atenção */}
              <div className="bg-card/30 border border-orange-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-500">Atenção (50-79%)</h3>
                </div>
                {conformidadeAtencao.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-foreground">{item.projeto}</span>
                    <span className="text-sm font-bold text-orange-500">{item.percentual}%</span>
                  </div>
                ))}
              </div>

              {/* Coluna Críticos */}
              <div className="bg-card/30 border border-red-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-500">Críticos (&lt;50%)</h3>
                </div>
                {conformidadeCriticos.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-foreground">{item.projeto}</span>
                    <span className="text-sm font-bold text-red-500">{item.percentual}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Rosca - Conformidade */}
            <div className="bg-card/30 border border-border/50 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={conformidadeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {conformidadeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                        16
                      </text>
                      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                        Projetos
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Excelentes</span>
                    <span className="text-2xl font-bold text-green-500">43,75%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Atenção</span>
                    <span className="text-2xl font-bold text-orange-500">31,25%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Críticos</span>
                    <span className="text-2xl font-bold text-red-500">25,00%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking por Retrabalho - Análise Detalhada */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-b border-border/50 pb-3">
              Ranking por Retrabalho - Análise Detalhada
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Excelente */}
              <div className="bg-card/30 border border-green-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-500">Excelente (≤15%) - 10 projetos</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {retrabalhoExcelentes.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                      <span className="text-xs text-foreground">{item.projeto}</span>
                      <span className="text-xs font-bold text-green-500">{item.percentual}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna Atenção */}
              <div className="bg-card/30 border border-orange-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-500">Atenção (15-30%) - 4 projetos</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {retrabalhoAtencao.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                      <span className="text-xs text-foreground">{item.projeto}</span>
                      <span className="text-xs font-bold text-orange-500">{item.percentual}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna Crítico */}
              <div className="bg-card/30 border border-red-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-500">Crítico (&gt;30%) - 2 projetos</h3>
                </div>
                {retrabalhoCriticos.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-foreground">{item.projeto}</span>
                    <span className="text-sm font-bold text-red-500">{item.percentual}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Rosca - Retrabalho */}
            <div className="bg-card/30 border border-border/50 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={retrabalhoChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {retrabalhoChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                        Média
                      </text>
                      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                        12,5%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Excelente</span>
                    <span className="text-2xl font-bold text-green-500">62,5%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Atenção</span>
                    <span className="text-2xl font-bold text-orange-500">25,0%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-foreground font-medium">Crítico</span>
                    <span className="text-2xl font-bold text-red-500">12,5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
